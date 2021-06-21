import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/@root/confirm-dialog/confirm-dialog.component';
import { Article, ArticleTypes } from 'src/models/article.model';
import { ArticleService } from 'src/services/article/article.service';
import { AuthService } from 'src/services/AuthService';
import { MemberService } from 'src/services/member/member.service';
import { ArticleFormComponent } from '../article-form/article-form.component';

@Component({
  templateUrl: './article-list.component.html'
})
export class ArticleListComponent implements OnInit {

  source: MatTableDataSource<Article> = new MatTableDataSource();

  isReady = false;

  currentUser = this.authService.currentUserState;

  displayedColumns: string[] = ['ID', 'Title', 'Type', 'Author Name', 'Appearance Date', 'Link', 'Actions'];

  constructor(
    private memberService: MemberService,
    private articleService: ArticleService,
    private authService: AuthService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.fetchData();
  }

  getType(type: "NEWSPAPER_ARTICLE" | "BOOK" | "BOOK_CHAPTER" | "POST") {
    return ArticleTypes[type];
  }

  openDialog(action: 'VIEW' | 'ADD' | 'EDIT' | 'DELETE', id?: string) {
    if (action === 'DELETE') {
      this.dialog.open(ConfirmDialogComponent, {
      }).afterClosed().pipe().subscribe(isDeleteConfirmed => {
        if (isDeleteConfirmed && id) {
          this.articleService.delete(id).then(() => this.fetchData());
        }
      });
    } else {
      this.dialog.open(ArticleFormComponent, {
        width: '80%',
        ...{ data: id }
      }).afterClosed().subscribe((results: "CANCEL" | "ERROR" | "SUCCESS") => {
        this.fetchData();
      });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.source.filter = filterValue.trim().toLowerCase();
  }

  private fetchData(): void {
    this.articleService.getAll().then(articles => {
      this.memberService.getAll().then(members => {
        this.source.data = articles
          .map(article => ({
            ...article,
            author: members.find(member => member.id === article.author_id)
          }));
        this.isReady = true;
      })
    });
  }

}
