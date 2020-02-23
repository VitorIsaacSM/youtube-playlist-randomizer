import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private _showLoading = false;

  constructor() { }

  toggle() {
    requestAnimationFrame(() => this.showLoading = !this.showLoading);
  }

  get showLoading(): boolean {
    return this._showLoading;
  }

  set showLoading(val: boolean) {
    requestAnimationFrame(() => this._showLoading = val);
  }
}
