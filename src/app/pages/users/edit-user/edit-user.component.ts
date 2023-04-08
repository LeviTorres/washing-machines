import { Component, OnInit } from '@angular/core';
import { User } from '../../../interfaces/user.interface';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirestoreService } from '../../../services/firestore.service';
import { GeneralService } from '../../../services/general.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ConvertImgService } from '../../../services/convert-img.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit {
  public users: User[] = [];

  public image: any;

  public objectUrl: any;

  public hide: boolean = false;

  public hide2: boolean = false;

  public samePassword: boolean = true;

  public sameEmail: boolean = true;

  public sameName: boolean = true;

  public password: string = '';

  public repeatPassword: string = '';

  public form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    rol: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/
      ),
    ]),
    password2: new FormControl('', [Validators.required]),
    image_employee: new FormControl('', []),
  });

  constructor(
    private _firestore: FirestoreService,
    private _general: GeneralService,
    private _dialogRef: MatDialogRef<EditUserComponent>,
    private _convert: ConvertImgService,
    private _toast: ToastrService,
    private _auth: AuthService
  ) {}

  ngOnInit() {
    this._general._spinner.show();
    this.getUsers();
    this.form.controls['password2'].valueChanges.subscribe((inputPassword2) => {
      this.repeatPassword = inputPassword2.trim();
      this.comparePassword();
    });
    this.form.controls['password'].valueChanges.subscribe((inputPassword) => {
      this.password = inputPassword.trim();
      this.comparePassword();
    });
    this.form.controls['email'].valueChanges.subscribe((inputEmail) => {
      this.validateEmail(inputEmail);
    });
    this.form.controls['name'].valueChanges.subscribe((inputEmail) => {
      this.validateName();
    });
    this._general._spinner.hide();
  }

  public async getUsers() {
    this._firestore.getCollection<User>('users').subscribe((res: any) => {
      if (res.length > 0) {
        this.users = res;
      }
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

      if (
        !this.samePassword ||
        !this.sameEmail ||
        !this.sameName ||
        this.form.invalid
      ) {
        this._general._spinner.hide();
        return;
      }

      const element: User = {
        id: new Date().getTime().toString(),
        name: this.form.controls['name'].value.trim(),
        rol: this.form.controls['rol'].value.trim(),
        email: this.form.controls['email'].value.trim(),
        password: this.form.controls['password'].value.trim(),
      };

      const res = await this._auth.registerUser(element).catch((error) => {
        this._general._spinner.hide();
        this._toast.error(
          'Inténtelo de nuevo, si el error persiste, reinicie la página.',
          'Error al crear un usuario'
        );
      });

      if (res) {
        const id = res.user?.uid;
        element.id = id;
        element.password = '';
        this._firestore.preAddAndUpdateUser(element, this.image);

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
    const validateEmail = this.users.some((user: User) => {
      return user.email.trim() === inputEmail.trim();
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
    const validatefullName = this.users.some((user: User) => {
      return (
        `${user.name.toLocaleLowerCase().trim()}` ===
        fullName.toLocaleLowerCase().trim()
      );
    });
    if (validatefullName) {
      this.sameName = false;
    } else {
      this.sameName = true;
    }
  }

  public comparePassword(): void {
    if (this.password === this.repeatPassword) {
      this.samePassword = true;
    } else {
      this.samePassword = false;
    }
  }
}
