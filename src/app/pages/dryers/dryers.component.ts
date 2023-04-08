import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Dryer } from 'src/app/interfaces/dryer.interface';
import { FirestoreService } from 'src/app/services/firestore.service';
import { AddDryerComponent } from './add-dryer/add-dryer.component';

@Component({
  selector: 'app-dryers',
  templateUrl: './dryers.component.html',
  styleUrls: ['./dryers.component.scss']
})
export class DryersComponent implements OnInit {
  public dryers_data: Dryer[] = [];

  public data: Dryer[] = [];

  public search: FormControl = new FormControl('');

  constructor(
    private _dialog: MatDialog,
    private _firestore: FirestoreService,
    private _spinner: NgxSpinnerService
  ) {
    this._spinner.show();
  }

  ngOnInit(): void {
    this.getDryers();
    this.search.valueChanges.subscribe(() => {
      this.filterValue();
    });
  }

  public openDialogCreateDryers() {
    this._dialog.open(AddDryerComponent, {
      disableClose: true,
      autoFocus: false,
      width: '550px',
      maxHeight: '95vh',
    });
  }

  public async filterValue() {
    let list = this.data;
    const filter = this.search.value?.toLowerCase();

    if (filter) {
      let data = list.filter(
        (machine: Dryer) =>
          machine.key_dryer.toLowerCase().includes(filter) ||
          machine.description.toLowerCase().includes(filter)
      );
      this.dryers_data = data;
    } else {
      this.dryers_data = list;
    }
  }

  public getDryers() {
    this._firestore.getCollection<Dryer>('dryers').subscribe((res: any) => {
      this.dryers_data = res;
      this.data = res;
      this._spinner.hide();
    });
  }

}
