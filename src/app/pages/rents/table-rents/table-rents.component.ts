import { Component, OnInit, Input } from '@angular/core';
import { Rent } from '../../../interfaces/rent.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { FirestoreService } from '../../../services/firestore.service';
import { MatDialog } from '@angular/material/dialog';
import { Client } from '../../../interfaces/client.interface';
import { Machine } from '../../../interfaces/machines.interface';
import { GeneralService } from '../../../services/general.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-table-rents',
  templateUrl: './table-rents.component.html',
  styleUrls: ['./table-rents.component.scss'],
})
export class TableRentsComponent implements OnInit {
  public dateToday: any = new Date();
  @Input() rents_data: Rent[] = [];
  public clients_data: Client[] = [];
  public machines_data: Machine[] = [];

  constructor(
    private _dialog: MatDialog,
    private _firestore: FirestoreService,
    private _spinner: NgxSpinnerService,
    private _general:GeneralService,
    private _toastr: ToastrService
  ) {
    this._spinner.show();
    this.getClients();
    this.getMachines();
  }

  ngOnInit(): void {
    console.log(this.dateToday);

  }

  public getClients() {
    this._firestore
      .getCollection<Client>('clients')
      .subscribe((res: Client[]) => {
        if (res.length > 0) {
          this.clients_data = res;
          this._spinner.hide();
        }
      });
  }

  public getMachines() {
    this._firestore
      .getCollection<Machine>('machines')
      .subscribe((res: Machine[]) => {
        if (res.length > 0) {
          this.machines_data = res;
          this._spinner.hide();
        }
      });
  }

  public getRents() {
    this._firestore.getCollection<Rent>('rents').subscribe((res: Rent[]) => {
      if (res.length > 0) {
        this.rents_data = res;
        this._spinner.hide();
      }
    });
  }

  public getClient(id?: string) {
    const findClient = this.clients_data.find(
      (client: Client) => client.id === id
    );
    return {
      name: findClient?.name,
      last_name: findClient?.last_name,
    };
  }

  public getMachine(id?: string) {
    const findMachine = this.machines_data.find(
      (machine: Machine) => machine.id === id
    );
    return findMachine?.key_machine;
  }

  public getStatus(status: string) {
    if (status === 'rented') {
      return 'A tiempo';
    }
    return;
  }

  getExpirationDay(date: number) {
    let milisegundosDia = 24 * 60 * 60 * 1000;
    let milisegundosTranscurridos = Math.abs(this.dateToday.getTime() - new Date(date).getTime());
    const resta = Math.round(milisegundosTranscurridos / milisegundosDia);
    if (resta >= 0) {
      return resta;
    }
    return;
  }

  async checkRent(){
    const result = await this._general.alertQuestion(
      '¿Está seguro que deseas continuar?',
      'Esta acción no se puede deshacer.'
    );

    if (result.isConfirmed) {
      this._general._spinner.show();
      try {

        this._general._spinner.hide();
        this._toastr.success('Lavadora eliminada con exito');
      } catch (error) {
        console.log(error);
        this._general._spinner.hide();
        this._toastr.error('Inténtelo de nuevo, si el error persiste, reinicie la página.', 'Error al eliminar una lavadora');
      }
    }
  }
}
