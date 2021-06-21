import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/@root/confirm-dialog/confirm-dialog.component';
import { Member, MembersTypes } from 'src/models/member.model';
import { AuthService } from 'src/services/AuthService';
import { MemberService } from 'src/services/member/member.service';
import { MemberFormComponent } from '../member-form/member-form.component';

@Component({
  templateUrl: './member-list.component.html'
})
export class MemberListComponent implements OnInit {

  source: MatTableDataSource<Member> = new MatTableDataSource();

  isReady = false;

  currentUser = this.authService.currentUserState;

  displayedColumns: string[] = ['ID', 'Type', 'CIN', 'nom' , 'prenom', 'birthdate','establishment' , 'grade', 'diploma' , 'CV', 'Actions'];

  constructor(
    private memberService: MemberService,
    private authService: AuthService,
    private dialog: MatDialog,
    private location: Location,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.fetchData();
    const paths = window.location.pathname.split("/");
    if (paths.length === 3 && paths[1] === "member") {
      this.openDialog("EDIT", paths[2]);
    }
  }

  getType(type: "STUDENT" | "TEACHER") {
    return MembersTypes[type];
  }

  openDialog(action: 'VIEW' | 'ADD' | 'EDIT' | 'DELETE', id?: string) {
    if (action === 'DELETE') {
      this.dialog.open(ConfirmDialogComponent, {
      }).afterClosed().pipe().subscribe(isDeleteConfirmed => {
        if (isDeleteConfirmed && id) {
          this.memberService.delete(id).then(() => this.fetchData());
        }
      });
    } else {
      this.dialog.open(MemberFormComponent, {
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
    this.memberService.getAll().then(members => {
      this.source.data = members;
      this.isReady = true;
    });
  }

}