import {Injectable} from '@angular/core';
import {CanActivate, CanActivateChild, Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import { AuthService } from './AuthService';


@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

    constructor(
        private afAuth: AngularFireAuth,
        private authService: AuthService,
        private router: Router
    ) {
    }

    canActivate(): Promise<boolean> {
        console.log('under canActivate');
        return this.handleAccess();
    }

    canActivateChild(): Promise<boolean> {
        console.log('under canActivateChild');
        return this.handleAccess();
    }

    handleAccess(): Promise<boolean> {
        return new Promise((resolve) => {
            this.authService.getUserClaims()
                .then(user => {
                    console.log('user', user);
                    const canActivate = !!user;
                    console.log('canActivate', canActivate);
                    if (!canActivate) {
                        this.router.navigate(['/login']);
                    }
                    return resolve(canActivate);
                }, err => {
                    console.log('Error: ', err);
                    this.router.navigate(['/login']);
                    return resolve(false);
                });
        });
    }

}