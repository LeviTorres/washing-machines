import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GeneralService } from './services/general.service';
import { FirestoreService } from './services/firestore.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private _general: GeneralService,
    private _firebase: FirestoreService,
    private _router:Router
  ) {}
  async canActivate( route: ActivatedRouteSnapshot) {
    this._general._spinner.show();
    const url: string = route.url[0].path;
    console.log('url',url);

    const user = await this._firebase.getUser();
    console.log('user',user);

    this._general._spinner.hide();
    if (user) {
        if (url == 'auth') {
          this._router.navigateByUrl('/home')
          return false;
        } else {
          return true;
        }
    } else {
      if (url == 'auth') {
        return true;
      } else {
        this._router.navigateByUrl('/login');
        return false;
      }
    }
  }

}
