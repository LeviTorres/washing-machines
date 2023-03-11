import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GeneralService } from './services/general.service';
import { FirestoreService } from './services/firestore.service';
import { User } from './interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  public user!: User

  get user_name():any {
    return this.user
  }

  constructor(
    private _general: GeneralService,
    private _firebase: FirestoreService,
    private _router:Router
  ) {}
  async canActivate( route: ActivatedRouteSnapshot) {
    this._general._spinner.show();
    const url: string = route.url[0].path;
    this.user = await this._firebase.getUser();

    this._general._spinner.hide();
    if (this.user) {
        if (url == 'login') {
          this._router.navigateByUrl('/home')
          return false;
        } else {
          return true;
        }
    } else {
      if (url == 'login') {
        return true;
      } else {
        this._router.navigateByUrl('/login');
        return false;
      }
    }
  }

}
