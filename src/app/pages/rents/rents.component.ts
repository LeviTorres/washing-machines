import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddRentComponent } from './add-rent/add-rent.component';
import { Rent } from '../../interfaces/rent.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { FirestoreService } from '../../services/firestore.service';
import { Client } from '../../interfaces/client.interface';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-rents',
  templateUrl: './rents.component.html',
  styleUrls: ['./rents.component.scss'],
})
export class RentsComponent implements OnInit {
  public rents_data: Rent[] = [];
  public rents_data_temp: Rent[] = [];
  public data: Rent[] = [];
  public search: FormControl = new FormControl('');
  public selectedFilter: string = '';
  public dateToday: any = new Date().setHours(0, 0, 0, 0);
  public clients_data: Client[] = [];
  constructor(
    private _dialog: MatDialog,
    private _firestore: FirestoreService,
    private _spinner: NgxSpinnerService,
    private firestore: AngularFirestore
  ) {
    this._spinner.show();
    this.getRents();
    this.getClients();
  }

  ngOnInit(): void {}

  public getClients() {
    this._firestore
      .getCollection<Client>('clients')
      .subscribe((res: Client[]) => {
        this.clients_data = res;
        this._spinner.hide();
      });
  }

  public getRents() {
    this._firestore.getCollection<Rent>('rents').subscribe((res: Rent[]) => {
      res.map((rent: Rent) => {
        const fechaCaducidad = new Date(rent.finish_date).setHours(0, 0, 0, 0);
        if (
          fechaCaducidad < this.dateToday &&
          rent.status !== 'VENCIDA' &&
          rent.status !== 'CERRADA'
        ) {
          rent.status = 'VENCIDA';
          this._firestore.updateDoc('rents', rent.id!, rent).then(() => {});
        } else if (
          fechaCaducidad === this.dateToday &&
          rent.status !== 'VENCIDA' &&
          rent.status !== 'CERRADA'
        ) {
          rent.status = 'VENCIDA';
          this._firestore.updateDoc('rents', rent.id!, rent).then(() => {});
        } else if (
          (fechaCaducidad - this.dateToday) / (1000 * 60 * 60 * 24) <= 3 &&
          rent.status !== 'CERRADA' &&
          rent.status !== 'VENCIDA' &&
          rent.status !== 'PROXIMO A VENCER'
        ) {
          rent.status = 'PROXIMO A VENCER';
          this._firestore.updateDoc('rents', rent.id!, rent).then(() => {});
        }
        return rent;
      });
      this.rents_data = res.sort((a: Rent, b: Rent) => {
        var fechaCreacionA = new Date(b.finish_date).getTime();
        var fechaCreacionB = new Date(a.finish_date).getTime();
        return fechaCreacionA - fechaCreacionB;
      });
      this.rents_data_temp = this.rents_data;
      this.data = res;
      this._spinner.hide();
    });
  }

  calcularDiasRestantes(obj: Rent): number {
    const currentDate = new Date().getTime();
    const creationDate = obj.finish_date; // Reemplaza 'fechaCreacion' con el nombre real de la propiedad en tus objetos
    const expirationTime = creationDate - currentDate;
    const millisecondsInDay = 24 * 60 * 60 * 1000; // Cantidad de milisegundos en un día
    const days = Math.floor(expirationTime / millisecondsInDay);
    let day;
    if (days !== 0) {
      day = days * -1;
    } else {
      day = 0;
    }
    return day;
  }

  formatDate(date: number): String {
    return `${new Date(date).getDate()}${
      new Date(date).getMonth() + 1
    }${new Date(date).getFullYear()}`;
  }

  generatePDF() {
    const doc = new jsPDF.default({ orientation: 'landscape' });
    const data = [
      ['Nombre', 'Apellido', 'Edad'],
      ['John', 'Doe', '30'],
      ['Jane', 'Doe', '28'],
      ['Bob', 'Smith', '35'],
    ];

    const tableData = this.rents_data.map((obj: Rent) => [
      obj.status,
      this.getClient(obj.client).name,
      this.getClient(obj.client).phone_number,
      this.getClient(obj.client).street +
        ' #' +
        this.getClient(obj.client).number_house +
        ' ' +
        this.getClient(obj.client).suburb +
        ' ' +
        this.getClient(obj.client).postal_code,
    ]);

    const tableConfig = {
      head: [['Estatus', 'Cliente', 'Telefono numerico', 'Direccion']],
      body: tableData,
      startY: 20,
    };

    (doc as any).autoTable(tableConfig);

    //doc.text('Rentas', 10, 10);
    doc.save('Rentas.pdf');
  }

  public getClient(id?: string) {
    const findClient = this.clients_data.find(
      (client: Client) => client.id === id
    );
    return {
      name: findClient?.name,
      number_house: findClient?.number_house,
      phone_number: findClient?.phone_number,
      postal_code: findClient?.postal_code,
      street: findClient?.street,
      suburb: findClient?.suburb,
    };
  }

  openDialogCreateRent() {
    const dialog = this._dialog.open(AddRentComponent, {
      disableClose: true,
      autoFocus: false,
      width: '550px',
      maxHeight: '95vh',
    });

    dialog.afterClosed().subscribe(() => {
      this.getRents();
    });
  }

  selectMenu(name: string) {
    if (name === 'All') {
      this.rents_data = this.rents_data_temp;
    } else {
      this.rents_data = this.rents_data_temp.filter(
        (e: any) => e.status === name
      );
    }
  }
}
