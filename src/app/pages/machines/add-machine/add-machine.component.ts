import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirestoreService } from '../../../services/firestore.service';
import { GeneralService } from '../../../services/general.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Client } from '../../../interfaces/client.interface';
import { Machine } from '../../../interfaces/machines.interface';
import { ConvertImgService } from '../../../services/convert-img.service';

@Component({
  selector: 'app-add-machine',
  templateUrl: './add-machine.component.html',
  styleUrls: ['./add-machine.component.scss']
})
export class AddMachineComponent implements OnInit {
  public machines: Machine[] = [];

  public sameKeyMachine: boolean = true;

  public image: any ;

  public objectUrl:any;

  public hide: boolean = false;

  public hide2: boolean = false;

  public form: FormGroup = new FormGroup({
    key_machine: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    image_machine: new FormControl(''),
  });

  constructor(
    private _firestore: FirestoreService,
    private _general: GeneralService,
    private _dialogRef: MatDialogRef<AddMachineComponent>,
    private _toast:ToastrService,
    private _convert: ConvertImgService
  ) {

  }

  ngOnInit() {
    this._general._spinner.show();
    this.getMachines();
    this.form.controls['key_machine'].valueChanges.subscribe((inputKeyMachine) => {
      this.validateKeyMachine(inputKeyMachine);
    })
    this._general._spinner.hide();
  }


  public getMachines() {
    this._firestore.getCollection<Machine>('machines').subscribe((res: any) => {
      if(res.length > 0){
        this.machines = res;
      }
    })
  }

  public async handleImage(event: any){
    this.image = event.target.files[0];
    if(this.image){
      this.objectUrl = await this._convert.encodeFileAsBase64URL(this.image);
    }
  }

  public async createElement() {
    try {
      this._general._spinner.show();

      if(!this.sameKeyMachine || this.form.invalid) {
        this._general._spinner.hide();
        return;
      }

      if(!this.image){
        this._toast.error('Selecciona un imagen');
        this._general._spinner.hide();
        return;
      }

      const element: Machine = {
        id: new Date().getTime().toString(),
        key_machine: this.form.controls['key_machine'].value.trim(),
        description: this.form.controls['description'].value.trim(),
        status: 'available'
      }

      if(element){
        this._firestore.preAddAndUpdateMachine(element, this.image)
        this._dialogRef.close();
        this._general._spinner.hide();
        this._toast.success('Lavadora registrada con Exito');
      }

    } catch (error) {
      console.log(error);
      this._general._spinner.hide();
      this._toast.error('Inténtelo de nuevo, si el error persiste, reinicie la página.','Error al crear una lavadora');
    }
  }

  public validateKeyMachine(inputKeyMachine: string): void {
    const validateKeyMachine = this.machines.some((machine: Machine) => {
      return machine.key_machine.trim().toLowerCase() === inputKeyMachine.trim().toLowerCase()
    });9
    if (validateKeyMachine) {
      this.sameKeyMachine= false;
    } else {
      this.sameKeyMachine = true;
    }
  }
}
