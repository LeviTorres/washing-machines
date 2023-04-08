import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../../services/general.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Router } from '@angular/router';
import { User } from 'firebase/auth';
import { Client } from 'src/app/interfaces/client.interface';
import { Machine } from 'src/app/interfaces/machines.interface';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public users: User[] = [];
  public clients: Client[] = [];
  public machines: Machine[] = [];

  constructor(
    public _firebase: FirestoreService,
    public _router: Router,
    public _general: GeneralService,
    private _spinner: NgxSpinnerService
  ) {
    this._spinner.show();
    this.getUsers();
    this.getClients();
    this.getMachines();
  }

  ngOnInit(): void {}

  public getUsers() {
    this._firebase.getCollection<User>('users').subscribe((users: User[]) => {
      this.users = users;
      this._spinner.hide();
    });
  }

  public getClients() {
    this._firebase
      .getCollection<Client>('clients')
      .subscribe((clients: Client[]) => {
        this.clients = clients;
        this._spinner.hide();
      });
  }

  public getMachines() {
    this._firebase
      .getCollection<Machine>('machines')
      .subscribe((machines: Machine[]) => {
        this.machines = machines;
        this._spinner.hide();
      });
  }
}
