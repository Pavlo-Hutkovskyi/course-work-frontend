import { Component } from '@angular/core';
import {ContactsService} from "../../services/contacts.service";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {

  searchProperty: string = "";
  sortKey: any;

  constructor(private contactsService: ContactsService) {
  }

  async onInputChange() {
    await this.searchContacts();
  }

  async searchContacts() {
    await this.contactsService.searchContacts(this.searchProperty);
  }

  async sortContact() {
    await this.contactsService.sortContactList(this.sortKey);
  }
}
