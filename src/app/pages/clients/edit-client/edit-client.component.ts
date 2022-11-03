import { Component, OnInit, Inject } from '@angular/core';
import { Client } from '../../../interfaces/client.interface';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirestoreService } from '../../../services/firestore.service';
import { GeneralService } from '../../../services/general.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.scss']
})
export class EditClientComponent implements OnInit {
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
    private _dialogRef: MatDialogRef<EditClientComponent>,
    private _toast:ToastrService,
    @Inject(MAT_DIALOG_DATA) public clientData: Client
  ) {}

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
    this.initValuesForm()
    this._general._spinner.hide();
  }


  public async getClients() {
    this._firestore.getCollection<Client>('clients').subscribe((res: any) => {
      if(res.length > 0){
        this.clients = res;
      }
    })
  }

  public initValuesForm(){
    this.form.patchValue({
      name: this.clientData.name,
      last_name: this.clientData.last_name,
      email: this.clientData.email,
      phone_number: this.clientData.phone_number,
      street: this.clientData.street,
      suburb: this.clientData.suburb,
      postal_code: this.clientData.postal_code,
      number_house: this.clientData.number_house,
      observations: this.clientData.observations
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
        name: this.form.controls['name'].value.trim(),
        last_name: this.form.controls['last_name'].value.trim(),
        email: this.form.controls['email'].value.trim(),
        phone_number: this.form.controls['phone_number'].value.trim(),
        street: this.form.controls['street'].value.trim(),
        suburb: this.form.controls['suburb'].value.trim(),
        postal_code: this.form.controls['postal_code'].value.trim(),
        number_house: this.form.controls['number_house'].value.trim(),
        observations: this.form.controls['observations'].value.trim(),
        status: this.clientData.status
      }
        this._firestore.updateDoc('clients', this.clientData.id!, element)
        this._dialogRef.close();
        this._general._spinner.hide();
        this._toast.success('Usuario actualizado con Exito');

    } catch (error) {
      console.log(error);
      this._general._spinner.hide();
      this._toast.error('Inténtelo de nuevo, si el error persiste, reinicie la página.','Error al actualizar un usuario');
    }
  }


  public validateEmail(inputEmail: string): void {
    const validateEmail = this.clients.some((client: Client) => {
      return (client.email.trim().toLowerCase() === inputEmail.trim().toLowerCase()) && (this.clientData.email.trim().toLowerCase() !== inputEmail.trim().toLowerCase());
    });9
    if (validateEmail) {
      this.sameEmail= false;
    } else {
      this.sameEmail = true;
    }
  }

  public validateName(): void {
    const fullName = `${this.form.controls['name'].value
      .toLowerCase()
      .trim()}${this.form.controls['last_name'].value
      .toLowerCase()
      .trim()}`;
    const fullNameExist = `${this.clientData.name.toLowerCase().trim()}${this.clientData.last_name.toLowerCase().trim()}`
    const validatefullName = this.clients.some((client: Client) => {
      return (
        `${client.name.toLowerCase().trim()}${client.last_name
          .toLowerCase()
          .trim()}` ===
        fullName.toLowerCase().trim()
      )
      &&
      (fullNameExist !== fullName.toLowerCase().trim())
    });
    if (validatefullName) {
      this.sameName = false;
    } else {
      this.sameName = true;
    }
  }

}
