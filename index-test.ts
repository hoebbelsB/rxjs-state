import {ConnectableObservable, merge, Observable, OperatorFunction, pipe, Subject, Subscription} from 'rxjs';
import {distinctUntilChanged, filter, map, mergeAll, publishReplay, scan, shareReplay} from 'rxjs/operators';


export function select<T>(...ops: OperatorFunction<T, any>[]) {
    return pipe(
        // ????????
        filter(v => v !== undefined),
        distinctUntilChanged(),
        shareReplay(1)
    );
}

export class LocalState<T> {
    private _subscription = new Subscription();
    private _stateObservables = new Subject<Observable<Partial<T>>>();
    private _stateSlices = new Subject<Partial<T>>();

    private stateAccumulator = (acc: T, command: Partial<T>): T => ({...acc, ...command});

    // tslint:disable-next-line:member-ordering
    private _state$ = merge(
        this._stateObservables.pipe(mergeAll()),
        this._stateSlices
    ).pipe(
        scan(this.stateAccumulator, {} as T),
        publishReplay(1)
    );

    constructor() {
        this._subscription.add((this._state$ as ConnectableObservable<T>).connect());
    }

    connectSlice<A extends keyof T>(strOrObs: A | Observable<Partial<T>>, obs?: Observable<T[A]>): void {
        let _obs;
        if (typeof strOrObs === 'string') {
            const str: A = strOrObs;
            const o = obs as Observable<T[A]>;
            _obs = o.pipe(
                map(s => ({[str]: s}))
            );
        } else {
            const ob = strOrObs as Observable<Partial<T>>;
            _obs = ob;
        }
        this._stateObservables.next(_obs as Observable<Partial<T>> | Observable<T[A]>);
    }

    select(...opOrMapFn: OperatorFunction<T, any>[] | string[]): Observable<any> {
        return this._state$
            .pipe(
                filter(v => v !== undefined),
                distinctUntilChanged(),
                shareReplay(1)
            );
    }

}

export function stateAccumulator(acc, command): { [key: string]: number } {
    return ({...acc, ...command})
};


/*
select<R>(operator?: OperatorFunction<T, R>): Observable<T | R>

@param operator?: OperatorFunction<T, R>

@example
const ls = new LocalState<{test: string, bar: number}>();
ls.select();
// Error
// ls.select('foo');
ls.select('test');
// Error
// ls.select(of(7));
ls.select(mapTo(7));
// Error
// ls.select(map(s => s.foo));
ls.select(map(s => s.test));
// Error
// ls.select(pipe());
// ls.select(pipe(map(s => s.test), startWith(7)));
ls.select(pipe(map(s => s.test), startWith('unknown test value')));
@TODO consider state keys as string could be passed
// For state keys as string i.e. 'bar'
 select<R, K extends keyof T>(operator?: K): Observable<T>;
 if (typeof operator === 'string') {
      const key: string = operator;
      operators = pipe(map(s => operator ? s[key] : s));
    }
@TODO consider ngrx selectors could be passed
// For project functions i.e. (s) => s.slice, (s) => s.slice2 or (s) => 2
select<R>(operator: (value: T, index?: number) => T | R, thisArg?: any): Observable<T | R>;
 if (typeof operator === 'function') {
      const mapFn: (value: T, index: number) => R = operator ? operator : (value: T, index: number): R => value;
      operators = pipe(map(mapFn));
    }
*/
