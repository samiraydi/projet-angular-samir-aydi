import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Member, MembersTypes, Student, Teacher } from "src/models/member.model";
import { MemberService } from "src/services/member/member.service";

@Component({
  templateUrl: "./member-form.component.html"
})
export class MemberFormComponent implements OnInit {

  private memberType: MembersTypes = MembersTypes.STUDENT;

  teachers: Teacher[] = [];

  form: FormGroup = new FormGroup({});

  isReady = false;

  firstFormGroup: FormGroup = new FormGroup({});
  isEditable = false;


  constructor(
    private _formBuilder: FormBuilder,
    private memberservice: MemberService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<MemberFormComponent>,
    @Inject(MAT_DIALOG_DATA) public editId?: string
  ) { }

  getMemberType(): "STUDENT" | "TEACHER" | "VISITOR" {
    return MembersTypes[this.memberType];
  }

  setMemberType(memberType: "STUDENT" | "TEACHER") {
    this.memberType = MembersTypes[memberType];
    this.refreshForm();
  }

  ngOnInit(): void {
    this.initForm();
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      (this.editId
        ? this.memberservice.edit(
          this.editId,
          this.form.value
        )
        : this.memberType === MembersTypes.STUDENT
          ? this.memberservice.addStudent(this.form.value)
          : this.memberservice.addTeacher(this.form.value)
      ).then(
        (result) => this.dialogRef.close(result === null ? "ERROR" : "SUCCESS")
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close("CANCEL");
  }

  private initForm(): void {
    this.memberservice.getAll(MembersTypes.TEACHER)
      .then((teachers: Member[]) => this.teachers = teachers as Teacher[]);
    (this.editId ? this.memberservice.getById(this.editId) : Promise.resolve(null))
      .then((member: Member | null) => {
        this.form = this.formBuilder.group({
          cin: [member?.cin, [Validators.required, Validators.pattern(/^[0-9]{8}$/g)]],
          email: [member?.email, [Validators.required, Validators.email]],
          name: [member?.name, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
          surname: [member?.surname, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
          birthdate: [member?.birthdate, [Validators.required]],
          cv: [member?.cv, [Validators.required, Validators.pattern("^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&'\\(\\)\\*\\+,;=.]+$")]],
          password: ["", !member ? [Validators.required] : []],
        });
        if (!!this.editId) {
          if (!!member) {
            this.memberType = member.type;
          } else {
            this.dialogRef.close("ERROR");
          }
        }
        this.refreshForm(member);
        this.isReady = true;
      });
  }

  private refreshForm(member?: Member | null): void {
    if (this.memberType === MembersTypes.STUDENT) {
      this.form.removeControl("grade");
      this.form.removeControl("establishment");
      this.form.addControl(
        "inscriptionDate",
        new FormControl((member as Student)?.inscriptionDate, [Validators.required])
      );
      this.form.addControl(
        "diploma",
        new FormControl((member as Student)?.diploma, [Validators.required])
      );
      this.form.addControl(
        "_supervisorId",
        new FormControl((member as Student)?._supervisorId, [Validators.required])
      );
    } else {
      this.form.removeControl("inscriptionDate");
      this.form.removeControl("diploma");
      this.form.removeControl("_supervisorId");
      this.form.addControl(
        "grade",
        new FormControl((member as Teacher)?.grade, [Validators.required])
      );
      this.form.addControl(
        "establishment",
        new FormControl((member as Teacher)?.establishment, [Validators.required])
      );
    }
  }
}
