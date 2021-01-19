import { Injectable } from '@angular/core';
import {BehaviorSubject, fromEvent, merge, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OnlineOfflineService {

  onlineEvent: Observable<Event>;
  offlineEvent: Observable<Event>;

  private internalConnectionChanged = new BehaviorSubject<boolean>(true);

  get connectionChanged() {
    return this.internalConnectionChanged.asObservable();
  }

  get isOnline() {
    return !!window.navigator.onLine;
  }

  constructor() {
    this.onlineEvent = fromEvent(window, 'online');
    this.offlineEvent = fromEvent(window, 'offline');

    merge(this.onlineEvent, this.offlineEvent).subscribe((res: any) => {
      const online = res?.type === 'online';
      this.internalConnectionChanged.next(online);
    });
  }
}
