import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  showLoading = false;

  constructor() { }

  toggle() {
    this.showLoading = !this.showLoading;
  }
}
