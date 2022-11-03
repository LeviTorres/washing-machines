import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal, { SweetAlertIcon, SweetAlertPosition } from'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  constructor(public _spinner: NgxSpinnerService) { }

  public swalTimer(
    position: SweetAlertPosition,
    icon: SweetAlertIcon,
    title: string,
    text: string,
    timer: number,
    showConfirmButton: boolean,
    showCancelButton: boolean
  ) {
    return Swal.fire({
      position: position,
      icon: icon,
      title: title,
      text: text,
      showConfirmButton: showConfirmButton,
      showCancelButton: showCancelButton,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      timer: timer,
    });
  }

  public alertSuccess(title: string, text: string) {
    return this.swalTimer('center', 'success', title, text, 0, true, false);
  }

  public alertQuestion(title: string, text: string) {
    return this.swalTimer('center', 'question', title, text, 0, true, true);
  }

  public alertError(title: string, text: string) {
    return this.swalTimer('center', 'error', title, text, 0, true, false);
  }

  public alertWarning(title: string, text: string) {
    return this.swalTimer('center', 'warning', title, text, 0, true, false);
  }
}
