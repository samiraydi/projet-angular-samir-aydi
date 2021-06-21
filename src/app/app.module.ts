import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmDialogModule } from 'src/@root/confirm-dialog.module';
import { FirebaseModule } from 'src/@root/Firebase/Firebase.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashbordComponent } from './dashbord/dashbord.component';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from './material.module';
import { ArticleFormComponent } from './pages/articles/article-form/article-form.component';
import { ArticleListComponent } from './pages/articles/article-list/article-list.component';
import { MemberFormComponent } from './pages/members/member-form/member-form.component';
import { MemberListComponent } from './pages/members/member-list/member-list.component';
import { EventFormComponent } from './pages/event/event-form/event-form.component';
import { EventListComponent } from './pages/event/event-list/event-list.component';
import { ToolListComponent } from './pages/tools/tool-list/tool-list.component';
import { ToolFormComponent } from './pages/tools/tool-form/tool-form.component';


@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    DashbordComponent,
    LoginComponent,
    MemberListComponent,
    MemberFormComponent,
    ArticleListComponent,
    ArticleFormComponent,
    EventFormComponent,
    EventListComponent,
    ToolListComponent,
    ToolFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatNativeDateModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    HttpClientModule,
    ConfirmDialogModule,
    FirebaseModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
