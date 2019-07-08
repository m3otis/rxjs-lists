import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  startdate = '26/04/1988';
  enddate = '26/04/2019';

  constructor() { }

  ngOnInit() {
  }

}
