import { Component, OnInit, EventEmitter } from '@angular/core';
import {
  Observable,
  of,
  Subject,
  combineLatest,
  interval,
  forkJoin,
  merge,
  zip
} from 'rxjs';
import {
  map,
  delay,
  tap,
  publish,
  refCount,
  share,
  filter,
  mergeMap,
  take,
  expand,
  startWith,
  first
} from 'rxjs/operators';
import { createOfflineCompileUrlResolver } from '@angular/compiler';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.css']
})
export class ParentComponent implements OnInit {
  defaultNames$ = of(['Mitchell', 'Hugo']);
  freeNames$ = of(['Hanneke', 'Emiel', 'Dennis']);
  allNames$: Observable<string[]>;
  selectedNames$: Observable<string[]> = new Observable<string[]>();
  addNameEvent$: EventEmitter<string> = new EventEmitter<string>();
  removeNameEvent$: EventEmitter<string> = new EventEmitter<string>();
  sn$: Observable<string[]>;

  constructor() {}

  ngOnInit() {
    this.allNames$ = this.createAllNames();
    this.sn$ = this.createSelectedNames(this.defaultNames$, this.addNameEvent$, this.removeNameEvent$);
  }

  createAllNames() {
    const allNames = zip(this.defaultNames$, this.freeNames$).pipe(map(([a, b]) => {
      return [...a, ...b];
    }));

    return allNames;
  }

  createSelectedNames(defaultNames$: Observable<string[]>, addNames$: Observable<string>, removeName$: Observable<string>) {
    const emptySelected = defaultNames$;

    const added$ = combineLatest(emptySelected, addNames$).pipe(map(([es, an]) => {
      es.push(an);
      return es;
    }));

    const removed$ = combineLatest(emptySelected, removeName$).pipe(map(([es, rn]) => {
      for (let index = es.length - 1; index >= 0; index--) {
        if (es[index] === rn ) {
          es.splice(index, 1);
        }
      }
      return es;
    }));

    const merged$ = merge(added$, this.defaultNames$.pipe(first()), removed$);

    return merged$;
  }

  addName(name: string) {
    this.addNameEvent$.emit(name);
  }

  removeName(name: string) {
    this.removeNameEvent$.emit(name);
  }
}
