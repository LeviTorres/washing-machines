import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddUserComponent } from './add-user/add-user.component';
import { User } from '../../interfaces/user.interface';
import { FirestoreService } from '../../services/firestore.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  public users_data: User[] = [];

  public data: User[] = [];

  public search: FormControl= new FormControl('');

  constructor(
    private _dialog: MatDialog,
    private _firestore:FirestoreService,
    private _spinner:NgxSpinnerService
  ) { this._spinner.show();}

  ngOnInit(): void {
    this.getUsers();
    this.search.valueChanges.subscribe(() => {
      this.filterValue();
    });
  }

  public openDialogCreateUser(){
    this._dialog.open(AddUserComponent,{
      disableClose: true,
      autoFocus: false,
      width: '650px',
    })
  }

  public async filterValue() {
    let list = this.data;
    const filter = this.search.value?.toLowerCase();
    if (filter) {
      let data = list.filter((user:User) =>
        user.name.toLowerCase().includes(filter) ||
        user.last_name.toLowerCase().includes(filter) ||
        user.email.toLowerCase().includes(filter)
      );
      this.users_data = data;
    } else {
      this.users_data = list;
    }
  }

  public getUsers() {
    this._firestore.getCollection<User>('users').subscribe((res: any) => {
      if (res.length > 0) {
        this.users_data = res;
        this.data = res;
        this._spinner.hide();
      }
    })
  }

}
