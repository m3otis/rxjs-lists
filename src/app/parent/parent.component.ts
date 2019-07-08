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

export class Project {
  id;
  description;
}

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.css']
})
export class ParentComponent implements OnInit {
  defaultNames$ = of(['Mitchell', 'Hugo']);
  freeNames$ = of(['Hanneke', 'Emiel', 'Dennis']);
  allNames$: Observable<string[]>;
  unselectedNames$: Observable<string[]>;
  selectedNames$: Observable<string[]> = new Observable<string[]>();
  addNameEvent$: EventEmitter<string> = new EventEmitter<string>();
  removeNameEvent$: EventEmitter<string> = new EventEmitter<string>();
  sn$: Observable<string[]>;

  constructor() {}

  ngOnInit() {
    this.allNames$ = this.createAllNames();
    this.sn$ = this.createSelectedNames(
      this.defaultNames$,
      this.addNameEvent$,
      this.removeNameEvent$
    ).pipe(tap(x => console.log('selected')));
    this.unselectedNames$ = this.createUnselectedNames(
      this.allNames$,
      this.sn$
    ).pipe(tap(x => console.log('unselected')));
  }

  createAllNames() {
    const allNames = zip(this.defaultNames$, this.freeNames$).pipe(
      map(([a, b]) => {
        return [...a, ...b];
      })
    );

    return allNames;
  }

  createUnselectedNames(
    allNames$: Observable<string[]>,
    selectedNames$: Observable<string[]>
  ): Observable<string[]> {
    const unselectedNames$ = combineLatest(allNames$, selectedNames$).pipe(
      map(([an, sn]) => {
      const tests = an;
      const test = sn;
      const filtered = tests.filter(p => !test.includes(p));
      return filtered;
      }),
    );

    return unselectedNames$;
  }

  createSelectedNames(
    defaultNames$: Observable<string[]>,
    addNames$: Observable<string>,
    removeName$: Observable<string>
  ) {
    const added$ = combineLatest(defaultNames$, addNames$).pipe(
      map(([es, an]) => {
        es.push(an);
        return es;
      }),
      publish(),
      refCount(),
      tap(() => console.log('add'))
    );

    const removed$ = combineLatest(defaultNames$, removeName$).pipe(
      map(([es, rn]) => {
        for (let index = es.length - 1; index >= 0; index--) {
          if (es[index] === rn) {
            es.splice(index, 1);
          }
        }
        return es;
      })
    );

    const merged$ = merge(added$, this.defaultNames$.pipe(first()), removed$);

    return merged$;
  }

  addName(name: string) {
    console.log('addName');
    this.addNameEvent$.emit(name);
  }

  removeName(name: string) {
    this.removeNameEvent$.emit(name);
  }
}
