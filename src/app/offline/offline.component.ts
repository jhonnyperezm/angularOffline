import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-offline',
  templateUrl: './offline.component.html',
  styleUrls: ['./offline.component.css']
})
export class OfflineComponent implements OnInit {

  @Input() onlineStatusMessage: string;
  @Input() onlineStatus: string;

  constructor() { }

  ngOnInit(): void {
  }

}
