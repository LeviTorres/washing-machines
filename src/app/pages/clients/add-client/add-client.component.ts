import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Client } from '../../../interfaces/client.interface';
import { FirestoreService } from '../../../services/firestore.service';
import { GeneralService } from '../../../services/general.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';
import { ConvertImgService } from '../../../services/convert-img.service';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss'],
})
export class AddClientComponent implements OnInit {
  public clients: Client[] = [];

  public sameEmail: boolean = true;

  public sameName: boolean = true;

  public image: any;

  public objectUrl: any;

  public form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl(''),
    phone_number: new FormControl('', []),
    street: new FormControl('', []),
    suburb: new FormControl('', []),
    postal_code: new FormControl(''),
    number_house: new FormControl('', []),
    observations: new FormControl(''),
    image_credential: new FormControl(''),
  });

  constructor(
    private _firestore: FirestoreService,
    private _general: GeneralService,
    private _dialogRef: MatDialogRef<AddClientComponent>,
    private _toast: ToastrService,
    private _convert: ConvertImgService
  ) {}

  ngOnInit() {
    this._general._spinner.show();
    this.getClients();
    this.form.controls['email'].valueChanges.subscribe((inputEmail) => {
      this.validateEmail(inputEmail);
    });
    this.form.controls['name'].valueChanges.subscribe((inputEmail) => {
      this.validateName();
    });
    this._general._spinner.hide();
  }

  public async getClients() {
    this._firestore.getCollection<Client>('clients').subscribe((res: any) => {
      this.clients = res;
    });
  }

  public async handleImage(event: any) {
    this.image = event.target.files[0];
    if (this.image) {
      this.objectUrl = await this._convert.encodeFileAsBase64URL(this.image);
    }
  }

  public async createElement() {
    try {
      this._general._spinner.show();

      if (!this.sameEmail || !this.sameName || this.form.invalid) {
        this._general._spinner.hide();
        return;
      }

      const element: Client = {
        id: new Date().getTime().toString(),
        name: this.form.controls['name'].value.trim(),
        email: this.form.controls['email'].value.trim(),
        phone_number: this.form.controls['phone_number'].value.trim(),
        street: this.form.controls['street'].value.trim(),
        suburb: this.form.controls['suburb'].value.trim(),
        postal_code: this.form.controls['postal_code'].value.trim(),
        number_house: this.form.controls['number_house'].value.trim(),
        observations: this.form.controls['observations'].value.trim(),
        status: 'available',
      };

      if (element) {
        if (this.image) {
          this._firestore.preAddAndUpdateClient(element, this.image);
        } else {
          this._firestore.createDoc(element, 'clients', element.id);
        }
        this._dialogRef.close();
        this._general._spinner.hide();
        this._toast.success('Usuario registrado con Exito');
      }
    } catch (error) {
      console.log(error);
      this._general._spinner.hide();
      this._toast.error(
        'Inténtelo de nuevo, si el error persiste, reinicie la página.',
        'Error al crear un usuario'
      );
    }
  }

  public validateEmail(inputEmail: string): void {
    const validateEmail = this.clients.some((client: Client) => {
      return client.email?.trim() === inputEmail.trim();
    });
    9;
    if (validateEmail) {
      this.sameEmail = false;
    } else {
      this.sameEmail = true;
    }
  }

  public validateName(): void {
    const fullName = `${this.form.controls['name'].value
      .toLocaleLowerCase()
      .trim()}`;
    const validatefullName = this.clients.some((client: Client) => {
      return (
        `${client.name.toLocaleLowerCase().trim()}` ===
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
