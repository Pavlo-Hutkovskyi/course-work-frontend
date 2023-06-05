import {Component, OnInit} from '@angular/core';
import {IContact} from "../../../assets/models/IContact";
import {Subscription} from "rxjs";
import {ContactsService} from "../../services/contacts.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit{
  subscription: Subscription | undefined = undefined;

  contactList: IContact[] = []

  constructor(private contactsService: ContactsService, private router: Router) {}

  ngOnInit(): void {
    this.subscription = this.contactsService.stateContacts$
      .subscribe(data => this.contactList = data);
    this.contactsService.pushContactsToStream().then();
  }

  async addContact() {
    await this.router.navigate(['/create']);
  }
}
