import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddRentComponent } from './add-rent/add-rent.component';
import { Rent } from '../../interfaces/rent.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-rents',
  templateUrl: './rents.component.html',
  styleUrls: ['./rents.component.scss']
})
export class RentsComponent implements OnInit {

  public rents_data: Rent[] = [];
  public rents_data_temp: Rent[] = []
  public data: Rent[] = [];
  public search: FormControl = new FormControl('');
  public selectedFilter: string = ''

  constructor(
    private _dialog: MatDialog,
    private _firestore: FirestoreService,
    private _spinner: NgxSpinnerService
  ) {
    this._spinner.show()
    this.getRents()
  }

  ngOnInit(): void {
  }

  public getRents() {
    this._firestore.getCollection<Rent>('rents').subscribe((res: Rent[]) => {
      if (res.length > 0) {
        this.rents_data = res;
        this.rents_data_temp = this.rents_data
        this.data = res;
        this._spinner.hide();
      }
    })
  }

  openDialogCreateRent(){
    this._dialog.open(AddRentComponent,{
      disableClose: true,
      autoFocus: false,
      width: '550px',
      maxHeight: '95vh'
    })
  }

  selectMenu(name: string){
    if(name === 'All'){
      this.rents_data = this.rents_data_temp
    }else {
      this.rents_data = this.rents_data_temp.filter((e:any) => e.status === name)
    }
  }
}
