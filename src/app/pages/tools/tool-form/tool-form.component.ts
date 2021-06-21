import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Member } from 'src/models/member.model';
import { Tool } from 'src/models/tool.model';
import { MemberService } from 'src/services/member/member.service';
import { ToolService } from 'src/services/tool/tool.service';

@Component({
  templateUrl: './tool-form.component.html',
  styles: [
  ]
})
export class ToolFormComponent implements OnInit {

  members: Member[] = [];

  form: FormGroup = new FormGroup({});

  isReady = false;

  constructor(
    private memberService: MemberService,
    private toolService: ToolService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ToolFormComponent>,
    @Inject(MAT_DIALOG_DATA) public editId?: string
  ) { }

  addMember($tool: any): void {
    this.form.controls["contributers_ids"].value.push($tool.option.value);
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
        ? this.toolService.edit(
          this.editId,
          this.form.value
        )
        : this.toolService.addTool(this.form.value)
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
    (this.editId ? this.toolService.getById(this.editId) : Promise.resolve(null))
      .then((tool: Tool | null) => {
        this.form = this.formBuilder.group({
          source: [tool?.source, [Validators.required, Validators.pattern("^(?:http(s)?:\\/\\/)[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&'\\(\\)\\*\\+,;=.]+$")]]
        });
        if (!!this.editId && !tool) {
          this.dialogRef.close("ERROR");
        }
        this.isReady = true;
      });
  }
}
