import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Dryer } from 'src/app/interfaces/dryer.interface';
import { FirestoreService } from 'src/app/services/firestore.service';
import { GeneralService } from 'src/app/services/general.service';
import { EditDryerComponent } from '../edit-dryer/edit-dryer.component';

@Component({
  selector: 'app-table-dryers',
  templateUrl: './table-dryers.component.html',
  styleUrls: ['./table-dryers.component.scss'],
})
export class TableDryersComponent implements OnInit {
  public selectedValue: number = 10;

  public page!: number;

  @Input() dryers_data: Dryer[] = [];

  public changeColumnKeyDryer: boolean = true;
  public changeColumnDescription: boolean = true;

  constructor(
    private _firestore: FirestoreService,
    private _spinner: NgxSpinnerService,
    private _general: GeneralService,
    private _toastr: ToastrService,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  public getDryer(id: string) {
    const machine = this.dryers_data.find(
      (machine: Dryer) => machine.id === id
    );

    if (machine?.status === 'available') {
      return 'Disponible';
    }

    if (machine?.status === 'busy') {
      return 'Rentada';
    }
    return;
  }

  public editDryerDialog(machine: Dryer) {
    this._dialog.open(EditDryerComponent, {
      disableClose: true,
      autoFocus: false,
      width: '650px',
      maxHeight: '95vh',
      data: machine,
    });
  }

  public async delete(machine: Dryer) {
    if (machine.status === 'busy') {
      this._general.alertWarning(
        '',
        'No se puede eliminar secadora porque actualmente se encuentra rentada'
      );
      return;
    }
    const result = await this._general.alertQuestion(
      '¿Está seguro de eliminarlo?',
      'Esta acción no se puede deshacer.'
    );

    if (result.isConfirmed) {
      this._general._spinner.show();
      try {
        this._firestore.deleteDocument('dryers', machine.id);
        this._general._spinner.hide();
        this._toastr.success('Secadora eliminada con exito');
      } catch (error) {
        console.log(error);
        this._general._spinner.hide();
        this._toastr.error(
          'Inténtelo de nuevo, si el error persiste, reinicie la página.',
          'Error al eliminar una secadora'
        );
      }
    }
  }

  public changeKeyDryer() {
    let list = this.dryers_data;
    this.changeColumnKeyDryer = !this.changeColumnKeyDryer;
    if (!this.changeColumnKeyDryer) {
      function sortArray(x: Dryer, y: Dryer) {
        if (x.key_dryer < y.key_dryer) {
          return -1;
        }
        if (x.key_dryer > y.key_dryer) {
          return 1;
        }
        return 0;
      }
      const s = list.sort(sortArray);
      this.dryers_data = s;
    } else {
      function sortArray(x: Dryer, y: Dryer) {
        if (x.key_dryer < y.key_dryer) {
          return 1;
        }
        if (x.key_dryer > y.key_dryer) {
          return -1;
        }
        return 0;
      }
      const s = list.sort(sortArray);
      this.dryers_data = s;
    }
  }

  public changeDescription() {
    let list = this.dryers_data;
    this.changeColumnDescription = !this.changeColumnDescription;
    if (!this.changeColumnDescription) {
      function sortArray(x: Dryer, y: Dryer) {
        if (x.description < y.description) {
          return -1;
        }
        if (x.description > y.description) {
          return 1;
        }
        return 0;
      }
      const s = list.sort(sortArray);
      this.dryers_data = s;
    } else {
      function sortArray(x: Dryer, y: Dryer) {
        if (x.description < y.description) {
          return 1;
        }
        if (x.description > y.description) {
          return -1;
        }
        return 0;
      }
      const s = list.sort(sortArray);
      this.dryers_data = s;
    }
  }
}
