import {Component, OnDestroy} from '@angular/core';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

  title = 'ngx-rx-state-lib';

  subscription = new Subscription();

  constructor() {

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
