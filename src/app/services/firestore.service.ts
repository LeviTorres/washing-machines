import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { Machine } from '../interfaces/machines.interface';
import { Client } from '../interfaces/client.interface';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Dryer } from '../interfaces/dryer.interface';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  public filePath: any;
  public downloadUrl: any;
  public user: any;
  public userAuth: any;
  public collectionUser: string = 'users';
  constructor(
    private _firestore: AngularFirestore,
    public storage: AngularFireStorage,
    private _auth: AngularFireAuth
  ) {}

  login(email: string, password: string): Promise<any> {
    return this._auth.signInWithEmailAndPassword(email, password);
  }
  getUser(): Promise<any> {
    if (this.user) {
      return Promise.resolve(this.user);
    } else {
      return new Promise((resolve) => {
        this._auth.user.subscribe((userAuth) => {
          if (userAuth) {
            this.userAuth = userAuth;
            this.getDocument(this.collectionUser, this.userAuth.uid).then(
              (document) => {
                const user = document.data();
                user.id = document.id;
                this.user = user;
                resolve(this.user);
              }
            );
          } else {
            resolve('');
          }
        });
      });
    }
  }

  getDocument(collection: any, id: any): Promise<any> {
    return this._firestore.collection(collection).doc(id).ref.get();
  }

  signOut(): Promise<any> {
    return this._auth.signOut();
  }

  recovery(email: string): Promise<any> {
    return this._auth.sendPasswordResetEmail(email);
  }

  createDoc(data: any, path: string, id?: string) {
    const collection = this._firestore.collection(path);
    return collection.doc(id).set(data);
  }

  getDoc<tipo>(path: string, id: string) {
    return this._firestore.collection(path).doc<tipo>(id).valueChanges();
  }

  deleteDocument(path: string, id: any) {
    return this._firestore.collection(path).doc(id).delete();
  }

  getCollection<tipo>(path: string) {
    const collection = this._firestore.collection<tipo>(path);
    return collection.valueChanges();
  }

  updateDoc(path: string, id: string, data: any) {
    return this._firestore.collection(path).doc(id).update(data);
  }

  public preAddAndUpdateUser(user: User, image: any) {
    this.uploadImage(user, image);
  }

  public preAddAndUpdateMachine(machine: Machine, image: any) {
    this.uploadImageMachine(machine, image);
  }

  public preAddAndUpdateDryer(machine: Dryer, image: any) {
    this.uploadImageDryer(machine, image);
  }

  public preAddAndUpdateClient(client: Client, image: any) {
    this.uploadImageClient(client, image);
  }

  public uploadImage(user: User, image: any) {
    this.filePath = `images/${user.id}`;
    const fileRef = this.storage.ref(this.filePath);
    const task = this.storage.upload(this.filePath, image);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((urlImage) => {
            this.downloadUrl = urlImage;
            user.image_employee = urlImage;
            this.createDoc(user, 'users', user.id);
          });
        })
      )
      .subscribe();
  }

  public uploadImageMachine(machine: Machine, image: any) {
    this.filePath = `images/${machine.id}`;
    const fileRef = this.storage.ref(this.filePath);
    const task = this.storage.upload(this.filePath, image);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((urlImage) => {
            this.downloadUrl = urlImage;
            machine.image_machine = urlImage;
            this.createDoc(machine, 'machines', machine.id);
          });
        })
      )
      .subscribe();
  }

  public uploadImageDryer(machine: Dryer, image: any) {
    this.filePath = `images/${machine.id}`;
    const fileRef = this.storage.ref(this.filePath);
    const task = this.storage.upload(this.filePath, image);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((urlImage) => {
            this.downloadUrl = urlImage;
            machine.image_dryer = urlImage;
            this.createDoc(machine, 'dryers', machine.id);
          });
        })
      )
      .subscribe();
  }

  public uploadImageClient(client: Client, image: any) {
    this.filePath = `images/${client.id}`;
    const fileRef = this.storage.ref(this.filePath);
    const task = this.storage.upload(this.filePath, image);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((urlImage) => {
            this.downloadUrl = urlImage;
            client.image_credential = urlImage;
            this.createDoc(client, 'clients', client.id);
          });
        })
      )
      .subscribe();
  }
}
