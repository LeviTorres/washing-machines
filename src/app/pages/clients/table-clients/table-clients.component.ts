import { Component, Input, OnInit } from '@angular/core';
import { Client } from '../../../interfaces/client.interface';
import { FirestoreService } from '../../../services/firestore.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GeneralService } from '../../../services/general.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { EditClientComponent } from '../edit-client/edit-client.component';

@Component({
  selector: 'app-table-clients',
  templateUrl: './table-clients.component.html',
  styleUrls: ['./table-clients.component.scss']
})
export class TableClientsComponent implements OnInit {

  public selectedValue: number = 10;

  public page!: number;

  @Input() clients_data: Client[] = [];

  public changeColumnStatus: boolean = true;

  public changeColumnName: boolean = true;

  public changeColumnLastName: boolean = true;

  public changeColumnEmail: boolean = true;

  constructor(
    private _firestore:FirestoreService,
    private _spinner:NgxSpinnerService,
    private _general:GeneralService,
    private _toastr:ToastrService,
    private _dialog: MatDialog
  ) {

  }

  ngOnInit(): void {}

  public getClients() {
    this._firestore.getCollection<Client>('clients').subscribe((res: any) => {
      if (res.length > 0) {
        this.clients_data = res;
        this._spinner.hide();
      }
    })
  }

  public getClient(id: string){
    const client = this.clients_data.find((client: Client) => client.id === id);

    if(client?.status === 'available'){
      return 'Disponible'
    }
    return;
  }

  public editUserDialog(client:Client){
      this._dialog.open(EditClientComponent,{
        disableClose: true,
        autoFocus: false,
        width: '650px',
        maxHeight: '95vh',
        data: client
      })
  }

  public async delete(client:Client){
    const result = await this._general.alertQuestion(
      '¿Está seguro de eliminarlo?',
      'Esta acción no se puede deshacer.'
    );

    if (result.isConfirmed) {
      this._general._spinner.show();
      try {
        this._firestore.deleteDocument('clients', client.id)
        this._general._spinner.hide();
        this._toastr.success('Cliente eliminado con exito');
      } catch (error) {
        console.log(error);
        this._general._spinner.hide();
        this._toastr.error('Inténtelo de nuevo, si el error persiste, reinicie la página.', 'Error al eliminar un cliente');
      }
    }
  }

  public changeName(){
    let list = this.clients_data;
    this.changeColumnName = !this.changeColumnName;
    if (!this.changeColumnName) {
      function sortArray(x: Client, y: Client) {
        if (x.name < y.name) {
          return -1;
        }
        if (x.name > y.name) {
          return 1;
        }
        return 0;
      }
      const s = list.sort(sortArray);
      this.clients_data = s;
    } else {
      function sortArray(x: Client, y: Client) {
        if (x.name < y.name) {
          return 1;
        }
        if (x.name > y.name) {
          return -1;
        }
        return 0;
      }
      const s = list.sort(sortArray);
      this.clients_data = s;
    }
  }


  public changeLastName(){
    let list = this.clients_data;
    this.changeColumnLastName = !this.changeColumnLastName;
    if (!this.changeColumnLastName) {
      function sortArray(x: Client, y: Client) {
        if (x.last_name < y.last_name) {
          return -1;
        }
        if (x.last_name > y.last_name) {
          return 1;
        }
        return 0;
      }
      const s = list.sort(sortArray);
      this.clients_data = s;
    } else {
      function sortArray(x: Client, y: Client) {
        if (x.last_name < y.last_name) {
          return 1;
        }
        if (x.last_name > y.last_name) {
          return -1;
        }
        return 0;
      }
      const s = list.sort(sortArray);
      this.clients_data = s;
    }
  }

  public changeStatus(){
    let list = this.clients_data;
    this.changeColumnStatus = !this.changeColumnStatus;
    if (!this.changeColumnStatus) {
      function sortArray(x: Client, y: Client) {
        if (x.status < y.status) {
          return -1;
        }
        if (x.status > y.status) {
          return 1;
        }
        return 0;
      }
      const s = list.sort(sortArray);
      this.clients_data = s;
    } else {
      function sortArray(x: Client, y: Client) {
        if (x.status < y.status) {
          return 1;
        }
        if (x.status > y.status) {
          return -1;
        }
        return 0;
      }
      const s = list.sort(sortArray);
      this.clients_data = s;
    }
  }

  public changeEmail(){
    let list = this.clients_data;
    this.changeColumnEmail = !this.changeColumnEmail;
    if (!this.changeColumnEmail) {
      function sortArray(x: Client, y: Client) {
        if (x.email < y.email) {
          return -1;
        }
        if (x.email > y.email) {
          return 1;
        }
        return 0;
      }
      const s = list.sort(sortArray);
      this.clients_data = s;
    } else {
      function sortArray(x: Client, y: Client) {
        if (x.email < y.email) {
          return 1;
        }
        if (x.email > y.email) {
          return -1;
        }
        return 0;
      }
      const s = list.sort(sortArray);
      this.clients_data = s;
    }
  }



}
