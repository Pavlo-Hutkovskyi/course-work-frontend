import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ContactsService } from 'src/app/services/contacts.service';
import {IContact} from "../../../assets/models/IContact";

@Component({
  selector: 'app-create-edit',
  templateUrl: './create-edit.component.html',
  styleUrls: ['./create-edit.component.scss']
})
export class CreateEditComponent implements OnInit {
  subscription: Subscription | undefined = undefined;
  contact: IContact = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    dateOfBirthday: '1999-01-01',
    placeOfWork: '',
    homeAddress: '',
    email: ''
  };
  isCreateComponent = true;

  constructor(private route: ActivatedRoute, private contactService: ContactsService, private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    this.isCreateComponent = await this.route.snapshot.data['isCreateComponent'];
    if (!this.isCreateComponent) {
      const phoneNumber = this.route.snapshot.params['phoneNumber'];
      this.subscription = this.contactService.stateContacts$.subscribe(
        (contacts: IContact[]) => {
          const contact = contacts.find(c => c.phoneNumber === phoneNumber);
          if (contact !== undefined) {
            this.contact = contact;
          }
        });
      this.contactService.pushContactsToStream().then();
    }
  }

  isPhoneNumberString() {
    if (this.contact.phoneNumber.startsWith("+") && !isNaN(Number(this.contact.phoneNumber.slice(1)))) {
      return true;
    } else
      return !isNaN(Number(this.contact.phoneNumber));
  }

  validInput(fieldName: string): boolean {
    // Перевірка, чи вже завантажений контакт
    if (!this.contact.firstName && fieldName === 'firstName') {
      return false;
    }

    // Зараз використовується ваша перевірка 'inputPhoneNumber()', якщо поле 'phoneNumber' недійсне
    if (fieldName === 'phoneNumber') {
      return this.inputPhoneNumber();
    }

    // Зараз використовується ваша перевірка 'inputDateOfBirthday()', якщо поле 'dateOfBirthday' недійсне
    if (!this.contact.lastName && fieldName === 'lastName') {
      return false;
    }

    return true
  }


  validInputDate() {
    return this.contact.firstName != '' &&
      this.contact.lastName != '' &&
      this.inputPhoneNumber()
  }

  async submitContact() {
    if(this.isCreateComponent)
      await this.contactService.addContact(this.contact);
    else
      await this.contactService.updateContact(this.contact);
    await this.router.navigate(['/main']);
  }

  inputPhoneNumber() {
    if (this.contact.phoneNumber === '')
      return false;
    return this.isPhoneNumberString()
  }

  inputDateOfBirthday() {
    const parts = this.contact.dateOfBirthday?.split("-");
    if (parts?.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);
      if (
        !isNaN(year) &&
        !isNaN(month) &&
        !isNaN(day) &&
        month >= 1 &&
        month <= 12 &&
        day >= 1 &&
        day <= 31
      ) {
        const date = new Date(year, month - 1, day);
        if (
          date.getFullYear() === year &&
          date.getMonth() === month - 1 &&
          date.getDate() === day
        ) {
          return true;
        }
      }
    }
    return false;
  }

  async goBack() {
    await this.router.navigate(['/main']);
  }

}
