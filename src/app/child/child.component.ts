import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.css']
})
export class ChildComponent implements OnInit {
  @Input()
  set subject(numbers: Subject<number[]>) {
    this.subject2 = this.subject;
  }
  get subject() {
    return this.subject2;
  }

  subject2 = new Subject<number[]>();

  constructor() {}

  ngOnInit() {}

  addOne() {
    const a = [1, 2, 3];
    this.subject.next(a);
  }
}
