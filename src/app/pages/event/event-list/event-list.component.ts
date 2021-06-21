import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/@root/confirm-dialog/confirm-dialog.component';
import { Event as LabEvent } from "src/models/event.model";
import { AuthService } from 'src/services/AuthService';
import { EventService } from 'src/services/event/event.service';
import { MemberService } from 'src/services/member/member.service';
import { EventFormComponent } from '../event-form/event-form.component';

@Component({
  templateUrl: './event-list.component.html',
  styles: [
  ]
})
export class EventListComponent implements OnInit {

  source: MatTableDataSource<LabEvent> = new MatTableDataSource();

  isReady = false;

  currentUser = this.authService.currentUserState;

  displayedColumns: string[] = ['ID', 'Title', 'Publisher Name', 'Start Date', 'End Date', 'Actions'];

  constructor(
    private memberService: MemberService,
    private eventService: EventService,
    private authService: AuthService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.fetchData();
  }

  openDialog(action: 'VIEW' | 'ADD' | 'EDIT' | 'DELETE', id?: string) {
    if (action === 'DELETE') {
      this.dialog.open(ConfirmDialogComponent, {
      }).afterClosed().pipe().subscribe(isDeleteConfirmed => {
        if (isDeleteConfirmed && id) {
          this.eventService.delete(id).then(() => this.fetchData());
        }
      });
    } else {
      this.dialog.open(EventFormComponent, {
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
    this.eventService.getAll().then(events => {
      this.memberService.getAll().then(members => {
        this.source.data = events
          .map(event => ({
            ...event,
            publisher: members.find(member => member.id === event.publisher_id)
          }));
        this.isReady = true;
      })
    });
  }
}
