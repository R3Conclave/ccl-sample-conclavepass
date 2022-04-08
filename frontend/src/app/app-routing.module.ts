import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddPasswordComponent } from './add-password/add-password.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { PasswordListComponent } from './password-list/password-list.component';

const routes: Routes = [
  {
    path: '',
    component: PasswordListComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'add',
    component: AddPasswordComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'login',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
