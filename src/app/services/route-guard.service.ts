import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import {ContactsService} from "./contacts.service";

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate {

  constructor(private contactsService: ContactsService, private route: Router) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.contactsService.isAuthenticateUser()) {
      return true;
    } else {
      await this.route.navigate(['logIn']);
      return false;
    }
  }
}
