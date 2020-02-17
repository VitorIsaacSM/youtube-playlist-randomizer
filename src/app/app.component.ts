import { Component } from '@angular/core';
import { LoadingService } from './loading/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent { 

  constructor(private loadingService: LoadingService) {}

  get loading() {
    return this.loadingService.showLoading;
  }
}
