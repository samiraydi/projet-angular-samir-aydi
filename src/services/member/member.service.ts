import { Injectable } from '@angular/core';
import { getGlobal, setGlobal } from 'src/app/app-config';
import { Member, MembersTypes, Student, Teacher } from 'src/models/member.model';
import { sha256 } from "js-sha256";

const SEARCH_FILEDS = ["email", "cin", "name", "surname"];

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  private getMembers(): Member[] {
    return getGlobal()['members']
      .map((member: Member) => ({
        ...member,
        birthdate: new Date(member.birthdate),
        createDate: new Date(member.createDate),
        modificationDate: new Date(member.modificationDate),
      }));
  }

  private setMembers(members: Member[]) {
    setGlobal({
      ...getGlobal(),
      members: members.map(member => ({
        ...member,
        birthdate: member.birthdate.getTime(),
        createDate: member.createDate.getTime(),
        modificationDate: member.modificationDate.getTime()
      }))
    });
  }

  getById(id: string): Promise<Member | null> {
    return Promise.resolve(this.getMembers().find(item => item.id === id) || null);
  }

  getByEmail(email: string): Promise<Member | null> {
    return Promise.resolve(this.getMembers().find(item => item.email === email) || null);
  }


  find(searchString: string): Promise<Member[]> {
    return Promise.resolve(this.getMembers()
      .filter(member => SEARCH_FILEDS
        .filter(
          searchFiled => (member as any)[searchFiled]
            .toLowerCase()
            .includes(searchString.toLowerCase())
        ).length !== 0
      )
    );
  }

  getAll(type?: MembersTypes): Promise<Member[]> {
    const members = this.getMembers();
    return Promise.resolve(type ? members.filter(item => item.type === type) : members);
  }

  addTeacher(teacher: Teacher): Promise<Teacher> {
    teacher = this.prepareMemberToSave(teacher, MembersTypes.TEACHER) as Teacher;
    this.saveMember(teacher);
    return Promise.resolve(teacher);
  }

  addStudent(student: Student): Promise<Student> {
    student = this.prepareMemberToSave(student, MembersTypes.STUDENT) as Student;
    this.saveMember(student);
    return Promise.resolve(student);
  }

  edit(id: string, member: Member): Promise<Member | null> {
    const members = this.getMembers();
    const memberIndex = members.findIndex(item => item.id === id);

    if (memberIndex === -1) {
      return Promise.resolve(null);
    }

    members[memberIndex] = this.prepareMemberToEdit(members[memberIndex], member);
    this.setMembers(members);

    return Promise.resolve(members[memberIndex]);
  }

  delete(id: string): Promise<void> {
    this.setMembers(this.getMembers().filter(item => item.id !== id));
    return Promise.resolve();
  }

  private prepareMemberToSave(member: Member, memberType: MembersTypes): Member {
    const creationDate = new Date();
    return {
      ...member,
      id: creationDate.getTime().toString(),
      type: memberType,
      createDate: creationDate,
      modificationDate: creationDate,
      password: sha256(member.password)
    };
  }

  private prepareMemberToEdit(memberOldData: Member, memberNewData: Member): Member {
    return {
      ...memberNewData,
      id: memberOldData.id,
      type: memberOldData.type,
      createDate: memberOldData.createDate,
      modificationDate: new Date(),
      password: memberNewData.password.length
        ? sha256(memberNewData.password)
        : memberOldData.password
    };
  }

  private saveMember(member: Member) {
    const members = this.getMembers();
    members.push(member);
    this.setMembers(members);
  }
}
