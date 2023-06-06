import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {IContact} from "../../assets/models/IContact";

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  private stateContacts = new Subject<IContact[]>();
  private password = '1234';
  private contacts: IContact[] = [];
  private baseUrl = 'https://course-work-backend-api.herokuapp.com'

  stateContacts$ = this.stateContacts.asObservable();

  constructor(private http: HttpClient) {
    this.getContacts().then();
  }

  async getContacts() {
    this.http.get<IContact[]>(this.baseUrl + "/users/contacts")
      .subscribe(async (data: IContact[]) => {
        console.log(data)
        this.contacts = data;
        await this.pushContactsToStream();
      });
  }

  async pushContactsToStream(contactList ?: IContact[]) {
    if (contactList == undefined)
      this.stateContacts.next(this.contacts);
    else
      this.stateContacts.next(contactList);
  }

  async searchContacts(searchProperty: string) {
    let contactList: IContact[] = [...this.contacts];
    contactList = contactList.filter((contact) => {
      return (`${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchProperty.toLowerCase()) ||
        contact.dateOfBirthday?.toLowerCase().includes(searchProperty.toLowerCase()) ||
        contact.phoneNumber.toLowerCase().includes(searchProperty.toLowerCase()) ||
        contact.homeAddress?.toLowerCase().includes(searchProperty.toLowerCase()) ||
        contact.placeOfWork?.toLowerCase().includes(searchProperty.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchProperty.toLowerCase())
      );
    });
    await this.pushContactsToStream(contactList);
  }

  async sortContactList(sortProperty: string) {
    let contactList: IContact[] = [...this.contacts];
    console.log(sortProperty)
    contactList.sort(function(a, b) {
      if (sortProperty === 'firstName') {
        if (a.firstName && b.firstName) {
          return a.firstName.localeCompare(b.firstName);
        }
      } else if (sortProperty === 'lastName') {
        if (a.lastName && b.lastName) {
          return a.lastName.localeCompare(b.lastName);
        }
      }else if (sortProperty === 'dateOfBirthday') {
        if (a.dateOfBirthday && b.dateOfBirthday) {
          return a.dateOfBirthday.localeCompare(b.dateOfBirthday);
        }
      }else if (sortProperty === 'phoneNumber') {
        if (a.phoneNumber && b.phoneNumber) {
          return a.phoneNumber.localeCompare(b.phoneNumber);
        }
      }else if (sortProperty === 'homeAddress') {
        if (a.homeAddress && b.homeAddress) {
          return a.homeAddress.localeCompare(b.homeAddress);
        }
      }else if (sortProperty === 'placeOfWork') {
        if (a.placeOfWork && b.placeOfWork) {
          return a.placeOfWork.localeCompare(b.placeOfWork);
        }
      }else {
        if (a.email && b.email) {
          return a.email.localeCompare(b.email);
        }
      }
      return 0;
    });
    await this.pushContactsToStream(contactList);
  }

  async addContact(contact?: IContact) {
    if (contact !== undefined) {
      this.http.post<IContact>(this.baseUrl + '/users/contacts/add', contact)
        .subscribe((contact: IContact) => {
          this.contacts.push(contact);
        })
    }
    await this.pushContactsToStream();
  }

  async updateContact(contact?: IContact) {
    if (contact !== undefined) {
      this.http.put<IContact>(this.baseUrl + `/users/contacts/update/${contact.phoneNumber}`, contact)
        .subscribe((contact: IContact) => {
          this.getContacts();
        })
    }
  }

  async removeContact(phoneNumber ?: string) {
    if (phoneNumber !== undefined) {
      this.http.delete<{ phoneNumber: string }>(this.baseUrl + `/users/username/contacts/${phoneNumber}`)
        .subscribe(el => console.log(el))
      this.contacts.filter(contact => contact.phoneNumber !== phoneNumber);
    }
    await this.pushContactsToStream();
  }

  checkPassword(password: string) {
    if(this.isAuthenticateUser())
      return true;
    if (this.password === password)
      sessionStorage.setItem('authenticateUser', 'user');
    return this.password === password;
  }

  isAuthenticateUser() {
    const user = sessionStorage.getItem('authenticateUser');
    console.log(user)
    return !(user === null)
  }
}
