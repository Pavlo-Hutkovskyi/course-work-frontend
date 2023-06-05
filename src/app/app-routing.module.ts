import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainComponent} from "./components/main/main.component";
import {LogInComponent} from "./components/log-in/log-in.component";
import {CreateEditComponent} from "./components/create-edit/create-edit.component";
import {RouteGuardService} from "./services/route-guard.service";

const routes: Routes = [
  {path: '', component: MainComponent, canActivate: [RouteGuardService]},
  {path: 'logIn', component: LogInComponent},
  {path: 'main', component: MainComponent, canActivate: [RouteGuardService]},
  {path: 'edit/:phoneNumber', component: CreateEditComponent, canActivate: [RouteGuardService], data: {isCreateComponent: false}},
  {path: 'create', component: CreateEditComponent, canActivate: [RouteGuardService], data: {isCreateComponent: true}},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
