import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConvertImgService {
  async encodeFileAsBase64URL(file:any) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener('loadend', () => {
            resolve(reader.result);
        });
        reader.readAsDataURL(file);
    });
  };
}
