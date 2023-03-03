import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { Machine } from '../interfaces/machines.interface';
import { Client } from '../interfaces/client.interface';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  public filePath: any;
  public downloadUrl: any;

  constructor(
    private _firestore: AngularFirestore,
    public storage: AngularFireStorage
    ) { }

  createDoc(data:any, path: string, id?: string){
    const collection = this._firestore.collection(path);
    return collection.doc(id).set(data);
  }

  getDoc<tipo>(path: string, id:string){
    return this._firestore.collection(path).doc<tipo>(id).valueChanges();
  }

  deleteDocument(path: string, id: any) {
    return this._firestore.collection(path).doc(id).delete();
  }

  getCollection<tipo>(path: string){
    const collection = this._firestore.collection<tipo>(path);
    return collection.valueChanges();
  }

  updateDoc(path:string, id: string, data:any){
     return this._firestore.collection(path).doc(id).update(data);
  }

  public preAddAndUpdateUser(user: User, image: any){
    this.uploadImage(user, image);
  }

  public preAddAndUpdateMachine(machine: Machine, image: any){
    this.uploadImageMachine(machine, image);
  }

  public preAddAndUpdateClient(client:Client, image:any){
    this.uploadImageClient(client, image)
  }

  public uploadImage(user: User, image:any){
    this.filePath = `images/${user.id}`;
    const fileRef = this.storage.ref(this.filePath);
    const task = this.storage.upload(this.filePath, image);
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(urlImage => {
          this.downloadUrl = urlImage;
          user.image_employee = urlImage;
          this.createDoc(user, 'users', user.id);
        })
      })
    ).subscribe()
  }

  public uploadImageMachine(machine: Machine, image:any){
    this.filePath = `images/${machine.id}`;
    const fileRef = this.storage.ref(this.filePath);
    const task = this.storage.upload(this.filePath, image);
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(urlImage => {
          this.downloadUrl = urlImage;
          machine.image_machine = urlImage;
          this.createDoc(machine, 'machines', machine.id);
        })
      })
    ).subscribe()
  }

  public uploadImageClient(client: Client, image:any){
    this.filePath = `images/${client.id}`;
    const fileRef = this.storage.ref(this.filePath);
    const task = this.storage.upload(this.filePath, image);
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(urlImage => {
          this.downloadUrl = urlImage;
          client.image_credential = urlImage;
          this.createDoc(client, 'clients', client.id);
        })
      })
    ).subscribe()
  }

}
