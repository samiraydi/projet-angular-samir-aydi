import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/services/auth.guard';
import { DashbordComponent } from './dashbord/dashbord.component';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { ArticleListComponent } from './pages/articles/article-list/article-list.component';
import { EventListComponent } from './pages/event/event-list/event-list.component';
import { MemberListComponent } from './pages/members/member-list/member-list.component';
import { ToolListComponent } from './pages/tools/tool-list/tool-list.component';
import {MemberFormComponent} from './pages/members/member-form/member-form.component';
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: 'members',
    canActivate: [AuthGuard],
    component: MemberListComponent
  },
  {
    path: 'member',
    canActivate: [AuthGuard],
    component: MemberFormComponent
  },
  {
    path: 'articles',
    canActivate: [AuthGuard],
    component: ArticleListComponent
  },
  {
    path: 'tools',
    pathMatch: 'full',
    canActivate: [AuthGuard],
    component: ToolListComponent
  },
  {
    path: 'events',
    pathMatch: 'full',
    canActivate: [AuthGuard],
    component: EventListComponent
  },
  {
    path: 'dashboard',
    pathMatch: 'full',
    canActivate: [AuthGuard],
    component: DashbordComponent
  },
  {
    path: 'member/:id',
    pathMatch: 'full',
    canActivate: [AuthGuard],
    component: MemberListComponent
  },
  {
    path: 'login',
    pathMatch: 'full',
    component: LoginComponent
  },
  {
    path: 'logout',
    pathMatch: 'full',
    component: LayoutComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}

