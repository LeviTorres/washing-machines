import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../../services/general.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Router } from '@angular/router';
import { User } from 'firebase/auth';
import { Client } from 'src/app/interfaces/client.interface';
import { Machine } from 'src/app/interfaces/machines.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { Dryer } from 'src/app/interfaces/dryer.interface';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public users: User[] = [];
  public clients: Client[] = [];
  public machines: Machine[] = [];
  public machinesBusy: Machine[] = [];
  public machinesAvailable: Machine[] = [];
  public dryers: Dryer[] = [];
  public dryersBusy: Dryer[] = [];
  public dryersAvailable: Dryer[] = [];

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
    this.getDryers();
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
        this.machinesBusy = this.machines.filter(
          (machine: Machine) => machine.status === 'busy'
        );
        this.machinesAvailable = this.machines.filter(
          (machine: Machine) => machine.status === 'available'
        );
        this._spinner.hide();
      });
  }

  public getDryers() {
    this._firebase
      .getCollection<Dryer>('dryers')
      .subscribe((dryers: Dryer[]) => {
        this.dryers = dryers;
        this.dryersBusy = this.dryers.filter(
          (machine: Dryer) => machine.status === 'busy'
        );
        this.dryersAvailable = this.dryers.filter(
          (machine: Dryer) => machine.status === 'available'
        );
        this._spinner.hide();
      });
  }
}
