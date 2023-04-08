import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../../services/firestore.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GeneralService } from '../../../services/general.service';
import { ToastrService } from 'ngx-toastr';
import { Client } from '../../../interfaces/client.interface';
import { Machine } from '../../../interfaces/machines.interface';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Rent } from '../../../interfaces/rent.interface';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../interfaces/user.interface';
import { AuthGuard } from '../../../auth.guard';

@Component({
  selector: 'app-add-rent',
  templateUrl: './add-rent.component.html',
  styleUrls: ['./add-rent.component.scss'],
})
export class AddRentComponent implements OnInit {
  public clients_data: Client[] = [];
  public machines_data: Machine[] = [];
  public user!: User;

  public form: FormGroup = new FormGroup({
    client: new FormControl('', [Validators.required]),
    machine: new FormControl('', [Validators.required]),
    start_date: new FormControl('', [Validators.required]),
    finish_date: new FormControl('', [Validators.required]),
  });

  constructor(
    private _firestore: FirestoreService,
    private _spinner: NgxSpinnerService,
    private _general: GeneralService,
    private _toast: ToastrService,
    private _dialogRef: MatDialogRef<AddRentComponent>,
    private _auth: AuthGuard
  ) {
    this._spinner.show();
    this.getClients();
    this.getMachines();
    this.user = this._auth.user_name;
  }

  ngOnInit(): void {}

  public getMachines() {
    this._firestore
      .getCollection<Machine>('machines')
      .subscribe((res: Machine[]) => {
          const data = res.filter(
            (machine: Machine) => machine.status === 'available'
          );
          this.machines_data = data;
          this._spinner.hide();
      });
  }

  public getClients() {
    this._firestore
      .getCollection<Client>('clients')
      .subscribe((res: Client[]) => {
          const data = res.filter(
            (client: Client) => client.status === 'available'
          );
          this.clients_data = data;
          this._spinner.hide();
      });
  }

  public async createElement() {
    this._spinner.show();
    if (this.form.invalid) {
      this._general._spinner.hide();
      return;
    }

    const element: Rent = {
      id: new Date().getTime().toString(),
      client: this.form.controls['client'].value,
      machine: this.form.controls['machine'].value,
      start_date: new Date(this.form.controls['start_date'].value).getTime(),
      finish_date: new Date(this.form.controls['finish_date'].value).getTime(),
      status: 'waiting_to_deliver',
      requested_user: `${this.user.name} ${this.user.last_name}`,
      requested_date: new Date().getTime(),
    };

    this._firestore.createDoc(element, 'rents', element.id).then(() => {
      const element: any = {
        status: 'busy',
      };
      this._firestore.updateDoc(
        'clients',
        this.form.controls['client'].value,
        element
      );
      this._firestore.updateDoc(
        'machines',
        this.form.controls['machine'].value,
        element
      );
    });

    this._dialogRef.close();
    this._general._spinner.hide();
    this._toast.success('Renta registrada con Exito');
  }
}
