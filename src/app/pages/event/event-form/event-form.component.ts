import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Event } from 'src/models/event.model';
import { Member } from 'src/models/member.model';
import { EventService } from 'src/services/event/event.service';
import { MemberService } from 'src/services/member/member.service';

@Component({
  templateUrl: './event-form.component.html',
  styles: [
  ]
})
export class EventFormComponent implements OnInit {

  members: Member[] = [];

  form: FormGroup = new FormGroup({});

  isReady = false;

  constructor(
    private memberService: MemberService,
    private eventService: EventService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EventFormComponent>,
    @Inject(MAT_DIALOG_DATA) public editId?: string
  ) { }

  addMember($event: any): void {
    this.form.controls["contributers_ids"].value.push($event.option.value);
  }

  getMemberFullName(memberId: string): string {
    const member = this.members.find(item => item.id === memberId);
    return (member?.surname || '') + ' ' + (member?.name || '')
  }

  removeMember(memberId: string): void {
    this.form.controls["contributers_ids"].setValue(
      this.form.controls["contributers_ids"].value
        .filter((id: string) => id !== memberId)
    );
  }

  getfiltredMembers(keyword: string) {
    keyword = keyword.toLowerCase();
    return this.members.filter(item =>
      item.name.toLowerCase().includes(keyword)
      || item.surname.toLowerCase().includes(keyword)
    );
  }

  ngOnInit(): void {
    this.initForm();
  }

  onSubmit(): void {
    if (this.form.valid) {
      (this.editId
        ? this.eventService.edit(
          this.editId,
          this.form.value
        )
        : this.eventService.addEvent(this.form.value)
      ).then(
        (result) => this.dialogRef.close(result === null ? "ERROR" : "SUCCESS")
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close("CANCEL");
  }

  private initForm(): void {
    this.memberService.getAll()
      .then((members: Member[]) => this.members = members);
    (this.editId ? this.eventService.getById(this.editId) : Promise.resolve(null))
      .then((event: Event | null) => {
        this.form = this.formBuilder.group({
          title: [event?.title, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
          startDate: [event?.startDate, [Validators.required]],
          endDate: [event?.endDate, [Validators.required]]
        });
        if (!!this.editId && !event) {
          this.dialogRef.close("ERROR");
        }
        this.isReady = true;
      });
  }
}
