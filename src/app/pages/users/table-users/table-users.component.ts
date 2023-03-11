import { Component, Input, OnInit } from '@angular/core';
import { FirestoreService } from '../../../services/firestore.service';
import { User } from '../../../interfaces/user.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { GeneralService } from '../../../services/general.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { AuthGuard } from '../../../auth.guard';

@Component({
  selector: 'app-table-users',
  templateUrl: './table-users.component.html',
  styleUrls: ['./table-users.component.scss']
})
export class TableUsersComponent implements OnInit {

  public selectedValue: number = 10;

  public page!: number;

  public user!: User

  @Input() users_data: User[] = [];

  public changeColumnName: boolean = true;

  public changeColumnLastName: boolean = true;

  public changeColumnEmail: boolean = true;

  public changeColumnRole: boolean = true;

  constructor(
    private _firestore:FirestoreService,
    private _spinner:NgxSpinnerService,
    private _general:GeneralService,
    private _toastr:ToastrService,
    private _dialog:MatDialog,
    private _auth: AuthGuard
  ) {
    this.user = this._auth.user_name
  }

  ngOnInit(): void {}

  public editUserDialog(user:User){
    this._dialog.open(EditUserComponent,{
      disableClose: true,
      autoFocus: false,
      width: '650px',
      maxHeight: '95vh',
      data: user
    })
  }

  public async delete(user:User){
    if(this.user.id === user.id){
      this._general.alertWarning('','No se puede eliminar este usuario')
      return
    }
    const result = await this._general.alertQuestion(
      '¿Está seguro de eliminarlo?',
      'Esta acción no se puede deshacer.'
    );

    if (result.isConfirmed) {
      this._general._spinner.show();
      try {
        this._firestore.deleteDocument('users', user.id)
        this._general._spinner.hide();
        this._toastr.success('Usuario eliminado con exito');
      } catch (error) {
        console.log(error);
        this._general._spinner.hide();
        this._toastr.error('Inténtelo de nuevo, si el error persiste, reinicie la página.', 'Error al eliminar una empresa');
      }
    }
  }

  public changeName(){
    let list = this.users_data;
    this.changeColumnName = !this.changeColumnName;
    if (!this.changeColumnName) {
      function sortArray(x: User, y: User) {
        if (x.name < y.name) {
          return -1;
        }
        if (x.name > y.name) {
          return 1;
        }
        return 0;
      }
      const s = list.sort(sortArray);
      this.users_data = s;
    } else {
      function sortArray(x: User, y: User) {
        if (x.name < y.name) {
          return 1;
        }
        if (x.name > y.name) {
          return -1;
        }
        return 0;
      }
      const s = list.sort(sortArray);
      this.users_data = s;
    }
  }


  public changeLastName(){
    let list = this.users_data;
    this.changeColumnLastName = !this.changeColumnLastName;
    if (!this.changeColumnLastName) {
      function sortArray(x: User, y: User) {
        if (x.last_name < y.last_name) {
          return -1;
        }
        if (x.last_name > y.last_name) {
          return 1;
        }
        return 0;
      }
      const s = list.sort(sortArray);
      this.users_data = s;
    } else {
      function sortArray(x: User, y: User) {
        if (x.last_name < y.last_name) {
          return 1;
        }
        if (x.last_name > y.last_name) {
          return -1;
        }
        return 0;
      }
      const s = list.sort(sortArray);
      this.users_data = s;
    }
  }

  public changeEmail(){
    let list = this.users_data;
    this.changeColumnEmail = !this.changeColumnEmail;
    if (!this.changeColumnEmail) {
      function sortArray(x: User, y: User) {
        if (x.email < y.email) {
          return -1;
        }
        if (x.email > y.email) {
          return 1;
        }
        return 0;
      }
      const s = list.sort(sortArray);
      this.users_data = s;
    } else {
      function sortArray(x: User, y: User) {
        if (x.email < y.email) {
          return 1;
        }
        if (x.email > y.email) {
          return -1;
        }
        return 0;
      }
      const s = list.sort(sortArray);
      this.users_data = s;
    }
  }

  public changeRole(){
    let list = this.users_data;
    this.changeColumnRole = !this.changeColumnRole;
    if (!this.changeColumnRole) {
      function sortArray(x: User, y: User) {
        if (x.rol < y.rol) {
          return -1;
        }
        if (x.rol > y.rol) {
          return 1;
        }
        return 0;
      }
      const s = list.sort(sortArray);
      this.users_data = s;
    } else {
      function sortArray(x: User, y: User) {
        if (x.rol < y.rol) {
          return 1;
        }
        if (x.rol > y.rol) {
          return -1;
        }
        return 0;
      }
      const s = list.sort(sortArray);
      this.users_data = s;
    }
  }

}
