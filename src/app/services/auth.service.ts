import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _auth:AngularFireAuth) { }

  public registerUser(user: User) {
    return this._auth.createUserWithEmailAndPassword(user.email, user.password);
  }

  public async login(email: string, password: string): Promise<any> {
    return this._auth.signInWithEmailAndPassword(email, password);
  }

  public logout(): void {
    this._auth.signOut();
  }

  public stateUser(){
    return this._auth.authState;
  }

  public async getId(){
    const user = await this._auth.currentUser;
    return user?.uid;
  }

  public async resetPassword(email: string){
    try {
      return this._auth.sendPasswordResetEmail(email);
    } catch (error) {
      console.log(error);
    }
  }
}
