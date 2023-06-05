import { Component } from '@angular/core';
import {ContactsService} from "../../services/contacts.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent {
  password: string = '';

  constructor(public contactsService: ContactsService, private router: Router) { }

  async logIn() {
    if(this.contactsService.checkPassword(this.password))
      await this.router.navigate(['main'])
  }
}
