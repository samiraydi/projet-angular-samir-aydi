import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Article } from 'src/models/article.model';
import { Member } from 'src/models/member.model';
import { ArticleService } from 'src/services/article/article.service';
import { MemberService } from 'src/services/member/member.service';

@Component({
  templateUrl: './article-form.component.html',
  styles: [
  ]
})
export class ArticleFormComponent implements OnInit {

  members: Member[] = [];

  form: FormGroup = new FormGroup({});

  isReady = false;

  constructor(
    private memberService: MemberService,
    private articleService: ArticleService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ArticleFormComponent>,
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
        ? this.articleService.edit(
          this.editId,
          this.form.value
        )
        : this.articleService.addArticle(this.form.value)
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
    (this.editId ? this.articleService.getById(this.editId) : Promise.resolve(null))
      .then((article: Article | null) => {
        this.form = this.formBuilder.group({
          title: [article?.title, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
          type: [article?.type, [Validators.required]],
          link: [article?.link, [Validators.required, Validators.pattern("^(?:http(s)?:\\/\\/)[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&'\\(\\)\\*\\+,;=.]+$")]],
          pdfSource: [article?.pdfSource, [Validators.required, Validators.pattern("^(?:http(s)?:\\/\\/)[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&'\\(\\)\\*\\+,;=.]+$")]],
          contributers_ids: [article?.contributers_ids || []]
        });
        if (!!this.editId && !article) {
          this.dialogRef.close("ERROR");
        }
        this.isReady = true;
      });
  }
}
