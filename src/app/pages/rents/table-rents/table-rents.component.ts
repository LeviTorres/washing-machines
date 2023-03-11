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
  public machines_available: Machine[] = [];

  constructor(
    private _dialog: MatDialog,
    private _firestore: FirestoreService,
    private _spinner: NgxSpinnerService,
    private _general: GeneralService,
    private _toastr: ToastrService
  ) {
    this._spinner.show();
    this.getClients();
    this.getMachines();
  }

  ngOnInit(): void {}

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
          this.machines_available = res.filter(
            (e: Machine) => e.status === 'available'
          );
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
    if (status === 'waiting_to_deliver') {
      return 'Esperando a entregar';
    }
    if (status === 'delivered') {
      return 'Entregada';
    }
    if (status === 'canceled') {
      return 'Cancelada';
    }
    if (status === 'collect') {
      return 'Recogida';
    }
    return;
  }

  getExpirationDay(date: number) {
    let milisegundosDia = 24 * 60 * 60 * 1000;
    let milisegundosTranscurridos = Math.abs(
      this.dateToday.getTime() - new Date(date).getTime()
    );
    const resta = Math.round(milisegundosTranscurridos / milisegundosDia);
    if (resta >= 0) {
      return resta;
    }
    return;
  }

  async checkRent(rent: Rent) {
    const result = await this._general.alertQuestion(
      '¿Está seguro que deseas continuar?',
      'Esta acción no se puede deshacer.'
    );

    if (result.isConfirmed) {
      this._general._spinner.show();
      try {
        const elementRent: any = {
          status: 'delivered',
          delivered_date: new Date().getTime(),
        };

        this._firestore.updateDoc('rents', rent.id!, elementRent);
        this._toastr.success('Renta actualizada con exito');
        this._general._spinner.hide();
      } catch (error) {
        console.log(error);
        this._general._spinner.hide();
        this._toastr.error(
          'Inténtelo de nuevo, si el error persiste, reinicie la página.',
          'Error al actualizar la renta'
        );
      }
    }
  }

  async cancelRent(rent: Rent) {
    const result = await this._general.alertQuestion(
      '¿Está seguro que deseas continuar?',
      'Esta acción no se puede deshacer.'
    );

    if (result.isConfirmed) {
      this._general._spinner.show();
      try {
        const elementRent: any = {
          status: 'canceled',
          canceled_date: new Date().getTime(),
        };

        this._firestore.updateDoc('rents', rent.id!, elementRent).then(() => {
          const element: any = {
            status: 'available',
          };
          this._firestore.updateDoc('clients', rent.client, element);
          this._firestore.updateDoc('machines', rent.machine, element);
          this._toastr.success('Renta actualizada con exito');
          this._general._spinner.hide();
        });
      } catch (error) {
        console.log(error);
        this._general._spinner.hide();
        this._toastr.error(
          'Inténtelo de nuevo, si el error persiste, reinicie la página.',
          'Error al actualizar la renta'
        );
      }
    }
  }

  async checkCollect(rent: Rent) {
    const result = await this._general.alertQuestion(
      '¿Está seguro que deseas continuar?',
      'Esta acción no se puede deshacer.'
    );

    if (result.isConfirmed) {
      this._general._spinner.show();
      try {
        const elementRent: any = {
          status: 'collect',
          collect_date: new Date().getTime(),
        };

        this._firestore.updateDoc('rents', rent.id!, elementRent).then(() => {
          const element: any = {
            status: 'available',
          };
          this._firestore.updateDoc('clients', rent.client, element);
          this._firestore.updateDoc('machines', rent.machine, element);
          this._toastr.success('Renta actualizada con exito');
          this._general._spinner.hide();
        });
      } catch (error) {
        console.log(error);
        this._general._spinner.hide();
        this._toastr.error(
          'Inténtelo de nuevo, si el error persiste, reinicie la página.',
          'Error al actualizar la renta'
        );
      }
    }
  }
}
