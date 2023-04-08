import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Dryer } from 'src/app/interfaces/dryer.interface';
import { ConvertImgService } from 'src/app/services/convert-img.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-add-dryer',
  templateUrl: './add-dryer.component.html',
  styleUrls: ['./add-dryer.component.scss'],
})
export class AddDryerComponent implements OnInit {
  public dryers: Dryer[] = [];

  public sameKeyDryer: boolean = true;

  public image: any;

  public objectUrl: any;

  public hide: boolean = false;

  public hide2: boolean = false;

  public form: FormGroup = new FormGroup({
    key_dryer: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    image_dryer: new FormControl(''),
  });

  constructor(
    private _firestore: FirestoreService,
    private _general: GeneralService,
    private _dialogRef: MatDialogRef<AddDryerComponent>,
    private _toast: ToastrService,
    private _convert: ConvertImgService,
    private _spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.getDryers();
    this.form.controls['key_dryer'].valueChanges.subscribe((inputKeyDryer) => {
      this.validateKeyDryer(inputKeyDryer);
    });
  }

  public getDryers() {
    this._firestore.getCollection<Dryer>('dryers').subscribe((res: any) => {
      this.dryers = res;
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
      this._spinner.show();

      if (!this.sameKeyDryer || this.form.invalid) {
        this._general._spinner.hide();
        return;
      }

      const element: Dryer = {
        id: new Date().getTime().toString(),
        key_dryer: this.form.controls['key_dryer'].value.trim(),
        description: this.form.controls['description'].value.trim(),
        status: 'available',
      };

      if (element) {
        if (this.image) {
          this._firestore.preAddAndUpdateDryer(element, this.image);
          this._spinner.hide();
        } else {
          this._firestore.createDoc(element, 'dryers', element.id);
          this._spinner.hide();
        }
        this._dialogRef.close();
        this._toast.success('Secadora registrada con Exito');
      }
    } catch (error) {
      console.log(error);
      this._general._spinner.hide();
      this._toast.error(
        'Inténtelo de nuevo, si el error persiste, reinicie la página.',
        'Error al crear una secadora'
      );
    }
  }

  public validateKeyDryer(inputKeyDryer: string): void {
    const validateKeyDryer = this.dryers.some((machine: Dryer) => {
      return (
        machine.key_dryer.trim().toLowerCase() ===
        inputKeyDryer.trim().toLowerCase()
      );
    });
    9;
    if (validateKeyDryer) {
      this.sameKeyDryer = false;
    } else {
      this.sameKeyDryer = true;
    }
  }
}
