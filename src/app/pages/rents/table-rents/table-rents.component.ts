import { Component, OnInit, Input } from '@angular/core';
import { Rent } from '../../../interfaces/rent.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { FirestoreService } from '../../../services/firestore.service';
import { MatDialog } from '@angular/material/dialog';
import { Client } from '../../../interfaces/client.interface';
import { Machine } from '../../../interfaces/machines.interface';
import { GeneralService } from '../../../services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';
import { AuthGuard } from '../../../auth.guard';
import { User } from '../../../interfaces/user.interface';

@Component({
  selector: 'app-table-rents',
  templateUrl: './table-rents.component.html',
  styleUrls: ['./table-rents.component.scss'],
})
export class TableRentsComponent implements OnInit {
  public dateToday: any = new Date();
  public user!: User;
  @Input() rents_data: Rent[] = [];
  public clients_data: Client[] = [];
  public machines_data: Machine[] = [];
  public machines_available: Machine[] = [];

  public changeColumnStatus: boolean = true;
  public changeColumnClient: boolean = true;

  public selectedValue: number = 10;

  public page!: number;

  constructor(
    private _dialog: MatDialog,
    private _firestore: FirestoreService,
    private _spinner: NgxSpinnerService,
    private _general: GeneralService,
    private _toastr: ToastrService,
    private _auth: AuthGuard
  ) {
    this._spinner.show();
    this.getClients();
    this.getMachines();
    
    
    this.user = this._auth.user_name;
  }

  ngOnInit(): void {
    
  }

  public getClients() {
    this._firestore
      .getCollection<Client>('clients')
      .subscribe((res: Client[]) => {
        this.clients_data = res;
        this._spinner.hide();
      });
  }

  public getMachines() {
    this._firestore
      .getCollection<Machine>('machines')
      .subscribe((res: Machine[]) => {
        this.machines_data = res;
        this.machines_available = res.filter(
          (e: Machine) => e.status === 'available'
        );
        this._spinner.hide();
      });
  }

  public getRents() {
    this._firestore.getCollection<Rent>('rents').subscribe((res: Rent[]) => {
      this.rents_data = res;
      this._spinner.hide();
    });
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
      suburb: findClient?.suburb
    };
  }

  public getMachine(id?: string) {
    const findMachine = this.machines_data.find(
      (machine: Machine) => machine.id === id
    );
    return findMachine?.key_machine;
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
          delivered_user: `${this.user.name}`,
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
          canceled_user: `${this.user.name}`,
        };

        this._firestore.updateDoc('rents', rent.id!, elementRent).then(() => {
          const element: any = {
            status: 'available',
          };
          this._firestore.updateDoc('clients', rent.client, element);
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

  closeRent(rent: Rent){
    const element: Rent = {
      ...rent,
      status: 'CERRADA'
    }
    this._firestore.updateDoc('rents', rent.id!, element).then(() => {
          const elementClient: any = {
            status: 'available',
          };
          this._firestore.updateDoc('clients', rent.client, elementClient);
          
        });
  }

  public changeStatus() {
    let list = this.rents_data;
    this.changeColumnStatus = !this.changeColumnStatus;
    if (!this.changeColumnStatus) {
      function sortArray(x: Rent, y: Rent) {
        if (x.status < y.status) {
          return -1;
        }
        if (x.status > y.status) {
          return 1;
        }
        return 0;
      }
      const s = list.sort(sortArray);
      this.rents_data = s;
    } else {
      function sortArray(x: Rent, y: Rent) {
        if (x.status < y.status) {
          return 1;
        }
        if (x.status > y.status) {
          return -1;
        }
        return 0;
      }
      const s = list.sort(sortArray);
      this.rents_data = s;
    }
  }

  public changeClient() {
    let list = this.rents_data;
    this.changeColumnStatus = !this.changeColumnStatus;
    if (!this.changeColumnStatus) {
      function sortArray(x: Rent, y: Rent) {
        if (x.client < y.client) {
          return -1;
        }
        if (x.client > y.client) {
          return 1;
        }
        return 0;
      }
      const s = list.sort(sortArray);
      this.rents_data = s;
    } else {
      function sortArray(x: Rent, y: Rent) {
        if (x.client < y.client) {
          return 1;
        }
        if (x.client > y.client) {
          return -1;
        }
        return 0;
      }
      const s = list.sort(sortArray);
      this.rents_data = s;
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
          collect_user: `${this.user.name}`,
        };

        this._firestore.updateDoc('rents', rent.id!, elementRent).then(() => {
          const element: any = {
            status: 'available',
          };
          this._firestore.updateDoc('clients', rent.client, element);
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
