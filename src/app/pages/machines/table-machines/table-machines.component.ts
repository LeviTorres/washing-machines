import { Component, OnInit, Input } from '@angular/core';
import { Machine } from '../../../interfaces/machines.interface';
import { FirestoreService } from '../../../services/firestore.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GeneralService } from '../../../services/general.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { EditMachineComponent } from '../edit-machine/edit-machine.component';

@Component({
  selector: 'app-table-machines',
  templateUrl: './table-machines.component.html',
  styleUrls: ['./table-machines.component.scss']
})
export class TableMachinesComponent implements OnInit {

  public selectedValue: number = 10;

  public page!: number;

  @Input() machines_data: Machine[] = [];

  public changeColumnKeyMachine: boolean = true;
  public changeColumnDescription: boolean = true;

  constructor(
    private _firestore:FirestoreService,
    private _spinner:NgxSpinnerService,
    private _general:GeneralService,
    private _toastr:ToastrService,
    private _dialog:MatDialog
  ) {

  }

  ngOnInit(): void {}

  public getMachines() {
    this._firestore.getCollection<Machine>('machines').subscribe((res: any) => {
      if (res.length > 0) {
        this.machines_data = res;
        this._spinner.hide();
      }
    })
  }

  public getMachine(id: string){
    const machine = this.machines_data.find((machine: Machine) => machine.id === id);

    if(machine?.status === 'available'){
      return 'Disponible'
    }

    if(machine?.status === 'busy'){
      return 'Rentada'
    }
    return;
  }

  public editMachineDialog(machine:Machine){
    this._dialog.open(EditMachineComponent,{
      disableClose: true,
      autoFocus: false,
      width: '650px',
      maxHeight: '95vh',
      data: machine
    })
  }

  public async delete(machine:Machine){
    const result = await this._general.alertQuestion(
      '¿Está seguro de eliminarlo?',
      'Esta acción no se puede deshacer.'
    );

    if (result.isConfirmed) {
      this._general._spinner.show();
      try {
        this._firestore.deleteDocument('machines', machine.id)
        this._general._spinner.hide();
        this._toastr.success('Lavadora eliminada con exito');
      } catch (error) {
        console.log(error);
        this._general._spinner.hide();
        this._toastr.error('Inténtelo de nuevo, si el error persiste, reinicie la página.', 'Error al eliminar una lavadora');
      }
    }
  }

  public changeKeyMachine(){
    let list = this.machines_data;
    this.changeColumnKeyMachine = !this.changeColumnKeyMachine;
    if (!this.changeColumnKeyMachine) {
      function sortArray(x: Machine, y: Machine) {
        if (x.key_machine < y.key_machine) {
          return -1;
        }
        if (x.key_machine > y.key_machine) {
          return 1;
        }
        return 0;
      }
      const s = list.sort(sortArray);
      this.machines_data = s;
    } else {
      function sortArray(x: Machine, y: Machine) {
        if (x.key_machine < y.key_machine) {
          return 1;
        }
        if (x.key_machine > y.key_machine) {
          return -1;
        }
        return 0;
      }
      const s = list.sort(sortArray);
      this.machines_data = s;
    }
  }

  public changeDescription(){
    let list = this.machines_data;
    this.changeColumnDescription = !this.changeColumnDescription;
    if (!this.changeColumnKeyMachine) {
      function sortArray(x: Machine, y: Machine) {
        if (x.description < y.description) {
          return -1;
        }
        if (x.description > y.description) {
          return 1;
        }
        return 0;
      }
      const s = list.sort(sortArray);
      this.machines_data = s;
    } else {
      function sortArray(x: Machine, y: Machine) {
        if (x.description < y.description) {
          return 1;
        }
        if (x.description > y.description) {
          return -1;
        }
        return 0;
      }
      const s = list.sort(sortArray);
      this.machines_data = s;
    }
  }
}
