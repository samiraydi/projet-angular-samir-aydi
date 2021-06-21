import {NgModule} from '@angular/core';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../environments/environment';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireAnalyticsModule, APP_NAME, APP_VERSION, ScreenTrackingService, UserTrackingService} from '@angular/fire/analytics';



@NgModule({
    imports: [
        // firebase
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFireAnalyticsModule,
    ],
    exports: [
        AngularFireAuthModule,
        AngularFireAnalyticsModule,
    ],
  providers: [
    ScreenTrackingService,
    UserTrackingService,
    {provide: APP_NAME, useValue: 'Projet_Angular'},
    {provide: APP_VERSION, useValue: '0.1.0'}
  ],

})
export class FirebaseModule {
}

 