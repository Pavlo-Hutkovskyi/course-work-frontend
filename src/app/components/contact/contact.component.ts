import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {ContactsService} from "../../services/contacts.service";
import {Router} from "@angular/router";
import {IContact} from "../../../assets/models/IContact";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit{
  @Input() contact!: IContact;

  settingsIcon!: HTMLElement;
  settingsWindow!: HTMLElement;
  extended: boolean = false;

  constructor(private elRef: ElementRef, private contactService: ContactsService, private router: Router) {}

  ngOnInit() {
    // For modal window
    this.settingsIcon = this.elRef.nativeElement.querySelector('.settings-icon');
    this.settingsWindow = this.elRef.nativeElement.querySelector('.settings-window');

    this.settingsIcon.addEventListener('click', () => {
      this.settingsWindow.style.display = 'block';
      this.checkWindowPosition();
    });

    document.addEventListener('click', (event) => {
      if (!this.elRef.nativeElement.contains(event.target)) {
        this.settingsWindow.style.display = 'none';
      }
    });
  }

  checkWindowPosition() {
    const rect = this.settingsWindow.getBoundingClientRect();
    const isWindowOutOfScreen = rect.right > window.innerWidth;

    if (isWindowOutOfScreen) {
      this.settingsWindow.style.left = `${window.innerWidth - rect.width}px`;
    }
  }

  async removeContact() {
    await this.contactService.removeContact(this.contact.phoneNumber);
  }

  extendedDiv() {
    this.extended = !this.extended;
  }

}
