import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public hide:boolean = true;

  public form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor() { }

  ngOnInit(): void {
  }

}
