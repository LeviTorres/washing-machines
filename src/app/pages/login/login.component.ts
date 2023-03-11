import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service';
import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public hide: boolean = true;

  public form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    public _firebase: FirestoreService,
    public _router: Router,
    public _general: GeneralService
  ) {}

  ngOnInit(): void {}

  login() {
    if (this.form.invalid) {
      return;
    }
    let { email, password } = this.form.value;
    this._firebase
      .login(email, password)
      .then((user: any) => {
        this._router.navigateByUrl('/home');
      })
      .catch(() => {
        this._general.swalTimer(
          'center',
          'error',
          'Correo electrónico y/o contraseña incorrecta',
          '',
          2000,
          false,
          false
        );
      });
  }
}
