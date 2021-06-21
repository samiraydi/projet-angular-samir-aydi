import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { Subject } from 'rxjs';
import { getGlobal } from 'src/app/app-config';
import { MembersTypes } from 'src/models/member.model';
import { MemberService } from './member/member.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userClaims: any;
  public userClaims$ = new Subject<any>();

  public currentUserState: any = {};

  constructor(
    public afAuth: AngularFireAuth,
    private memberService: MemberService
  ) {
  }

  getUserClaims(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.onAuthStateChanged(user => {
        if (!!user) {
          this.setUserClaims(user);
          if (user.email) {
            this.memberService.getByEmail(user.email).then((member) => {
              if (!!member) {
                this.currentUserState.isMember = true;
                this.currentUserState.isTeacher = member.type === MembersTypes.TEACHER;
                this.currentUserState.isAdmin = member.id === getGlobal()["ADMIN_ID"];
                this.currentUserState.id = member.id;
              } else {
                this.currentUserState.isMember = false;
              }
            });
          } else {
            this.currentUserState.isMember = false;
          }
          resolve(user);
        } else {
          reject('No user logged in');
        }
      });
    });
  }

  getUserToken(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.afAuth.onAuthStateChanged(user => {
        if (!!user) {
          user.getIdToken().then(token => resolve(token)).catch(() => reject('No token Available.'));
        } else {
          reject('No user logged in');
        }
      });
    });
  }

  setUserClaims(user: any): void {
    this.userClaims = user;
    this.userClaims$.next(user);
  }

  doGoogleLogin(): Promise<any> {
    return this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  doLogout(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!!this.afAuth.currentUser) {
        this.afAuth.signOut().then(() => {
          this.setUserClaims(null);
          resolve();
        }, err => reject(err));
      } else {
        reject();
      }
    });
  }
}
