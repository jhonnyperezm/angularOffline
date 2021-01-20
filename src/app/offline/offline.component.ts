import {Component, OnInit} from '@angular/core';
import {OnlineOfflineService} from '../service/online-offline.service';

@Component({
  selector: 'app-offline',
  templateUrl: './offline.component.html',
  styleUrls: ['./offline.component.css']
})
export class OfflineComponent implements OnInit {

  onlineStatusMessage: string;
  onlineStatus = true;

  constructor(private onlineOffline: OnlineOfflineService) {
  }

  ngOnInit(): void {
    this.onlineOffline.connectionChanged.subscribe(async online => {
      if (navigator.onLine) {
        this.onlineStatusMessage = 'Back to online';
        this.onlineStatus = true;
      } else {
        this.onlineStatusMessage = 'Connection lost! You are not connected to internet';
        this.onlineStatus = false;
      }
    });
  }

}
