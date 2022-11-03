import { Component, OnInit } from '@angular/core';
import { Machine } from '../../interfaces/machines.interface';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FirestoreService } from '../../services/firestore.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AddMachineComponent } from './add-machine/add-machine.component';

@Component({
  selector: 'app-machines',
  templateUrl: './machines.component.html',
  styleUrls: ['./machines.component.scss']
})
export class MachinesComponent implements OnInit {

  public machines_data: Machine[] = [];

  public data: Machine[] = [];

  public search: FormControl = new FormControl('');

  constructor(
    private _dialog: MatDialog,
    private _firestore: FirestoreService,
    private _spinner: NgxSpinnerService
  ) {this._spinner.show();
  }

  ngOnInit(): void {
    this.getMachines();
    this.search.valueChanges.subscribe(() => {
      this.filterValue();
    });
  }

  public openDialogCreateMachine(){
    this._dialog.open(AddMachineComponent,{
      disableClose: true,
      autoFocus: false,
      width: '550px',
      maxHeight: '95vh'
    })
  }

  public async filterValue() {
    let list = this.data;
    const filter = this.search.value?.toLowerCase();

    if (filter) {
      let data = list.filter((machine:Machine) =>
        machine.key_machine.toLowerCase().includes(filter) ||
        machine.description.toLowerCase().includes(filter)
      );
      this.machines_data = data;
    } else {
      this.machines_data = list;
    }
  }

  public getMachines() {
    this._firestore.getCollection<Machine>('machines').subscribe((res: any) => {
      if (res.length > 0) {
        this.machines_data = res;
        this.data = res;
        this._spinner.hide();
      }
    })
  }


}
