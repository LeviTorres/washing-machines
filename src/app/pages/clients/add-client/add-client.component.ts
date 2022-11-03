import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Client } from '../../../interfaces/client.interface';
import { FirestoreService } from '../../../services/firestore.service';
import { GeneralService } from '../../../services/general.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss']
})
export class AddClientComponent implements OnInit {
  public clients: Client[] = [];

  public sameEmail: boolean = true;

  public sameName: boolean = true;

  public form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone_number: new FormControl('', [Validators.required]),
    street: new FormControl('', [Validators.required]),
    suburb: new FormControl('', [Validators.required]),
    postal_code: new FormControl('', [Validators.required]),
    number_house: new FormControl('', [Validators.required]),
    observations: new FormControl(''),
  });

  constructor(
    private _firestore: FirestoreService,
    private _general: GeneralService,
    private _dialogRef: MatDialogRef<AddClientComponent>,
    private _toast:ToastrService,
  ) {

  }

  ngOnInit() {
    this._general._spinner.show();
    this.getClients();
    this.form.controls['email'].valueChanges.subscribe((inputEmail) => {
      this.validateEmail(inputEmail);
    })
    this.form.controls['name'].valueChanges.subscribe((inputEmail) => {
      this.validateName();
    })
    this.form.controls['last_name'].valueChanges.subscribe((inputEmail) => {
      this.validateName();
    })
    this._general._spinner.hide();
  }


  public async getClients() {
    this._firestore.getCollection<Client>('clients').subscribe((res: any) => {
      if(res.length > 0){
        this.clients = res;
      }
    })
  }

  public async createElement() {
    try {
      this._general._spinner.show();

      if(!this.sameEmail || !this.sameName || this.form.invalid) {
        this._general._spinner.hide();
        return;
      }

      const element: Client = {
        id: new Date().getTime().toString(),
        name: this.form.controls['name'].value.trim(),
        last_name: this.form.controls['last_name'].value.trim(),
        email: this.form.controls['email'].value.trim(),
        phone_number: this.form.controls['phone_number'].value.trim(),
        street: this.form.controls['street'].value.trim(),
        suburb: this.form.controls['suburb'].value.trim(),
        postal_code: this.form.controls['postal_code'].value.trim(),
        number_house: this.form.controls['number_house'].value.trim(),
        observations: this.form.controls['observations'].value.trim(),
        status: 'available'
      }
        this._firestore.createDoc(element,'clients',element.id);
        this._dialogRef.close();
        this._general._spinner.hide();
        this._toast.success('Usuario registrado con Exito');

    } catch (error) {
      console.log(error);
      this._general._spinner.hide();
      this._toast.error('Inténtelo de nuevo, si el error persiste, reinicie la página.','Error al crear un usuario');
    }
  }


  public validateEmail(inputEmail: string): void {
    const validateEmail = this.clients.some((client: Client) => {
      return client.email.trim() === inputEmail.trim();
    });9
    if (validateEmail) {
      this.sameEmail= false;
    } else {
      this.sameEmail = true;
    }
  }

  public validateName(): void {
    const fullName = `${this.form.controls['name'].value
      .toLocaleLowerCase()
      .trim()}${this.form.controls['last_name'].value
      .toLocaleLowerCase()
      .trim()}`;
    const validatefullName = this.clients.some((client: Client) => {
      return (
        `${client.name.toLocaleLowerCase().trim()}${client.last_name
          .toLocaleLowerCase()
          .trim()}` ===
        fullName.toLocaleLowerCase().trim()
      );
    });
    if (validatefullName) {
      this.sameName = false;
    } else {
      this.sameName = true;
    }
  }

}
