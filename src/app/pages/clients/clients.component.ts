import { Component, OnInit } from '@angular/core';
import { Client } from '../../interfaces/client.interface';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FirestoreService } from '../../services/firestore.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AddClientComponent } from './add-client/add-client.component';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
})
export class ClientsComponent implements OnInit {
  public clients_data: Client[] = [];

  public data: Client[] = [];

  public search: FormControl = new FormControl('');

  constructor(
    private _dialog: MatDialog,
    private _firestore: FirestoreService,
    private _spinner: NgxSpinnerService
  ) {
    this._spinner.show();
  }

  ngOnInit(): void {
    this.getClients();
    this.search.valueChanges.subscribe(() => {
      this.filterValue();
    });
  }

  public openDialogCreateClient() {
    this._dialog.open(AddClientComponent, {
      disableClose: true,
      autoFocus: false,
      width: '650px',
      maxHeight: '95vh',
    });
  }

  public async filterValue() {
    let list = this.data;
    const filter = this.search.value?.toLowerCase();
    if (filter) {
      let data = list.filter(
        (client: Client) =>
          client.name.toLowerCase().trim().includes(filter) ||
          client.email?.toLowerCase().trim().includes(filter) ||
          client.phone_number.toLowerCase().trim().includes(filter) ||
          client.street.toLowerCase().trim().includes(filter) ||
          client.observations.toLowerCase().trim().includes(filter) ||
          client.postal_code?.toLowerCase().trim().includes(filter) ||
          client.suburb.toLowerCase().trim().includes(filter) ||
          client.number_house.toLowerCase().trim().includes(filter)
      );
      this.clients_data = data;
    } else {
      this.clients_data = list;
    }
  }

  public getClients() {
    this._firestore.getCollection<Client>('clients').subscribe((res: any) => {
      this.clients_data = res;
      this.data = res;
      this._spinner.hide();
    });
  }
}
