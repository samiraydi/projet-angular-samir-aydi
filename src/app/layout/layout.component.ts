import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/AuthService';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  IsLoggedIn : any;
  user : any;
  userState = this.authService.currentUserState;

  constructor(private authService : AuthService, private router : Router) { }

  ngOnInit(): void {
    this.authService.userClaims$.subscribe(user =>{
      this.user = !!user ? user : null;
      this.IsLoggedIn= !!user;
    });
  }

  logout() : void {
    this.authService.doLogout().finally(()=>this.router.navigate(['/login']));
  }
}
