export enum MembersTypes { STUDENT = "STUDENT", TEACHER = "TEACHER", VISITOR = "VISITOR" }

export enum StudentDiploma { MASTER = "Master", THESIS = "Thesis" }

export interface Member {
  id: string;
  type: MembersTypes;
  email: string;
  cin: string;
  name: string;
  surname: string;
  birthdate: Date;
  createDate: Date;
  modificationDate: Date;
  cv: string;
  password: string;
}

export interface Student extends Member {
  inscriptionDate: Date;
  diploma: StudentDiploma;
  _supervisorId: string;
}

export interface Teacher extends Member {
  grade: string;
  establishment: string;
}
