import {ConnectableObservable, merge, Observable, queueScheduler, Subject, Subscribable, Subscription} from "rxjs";
import {distinctUntilChanged, mergeAll, observeOn, publishReplay, scan, tap} from "rxjs/operators";

export function createAccumulationObservable<T>(
    stateObservables = new Subject<Observable<Partial<T>>>(),
    stateSlices = new Subject<Partial<T>>(),
    stateAccumulator: (st: T, sl: Partial<T>) => T = (st: T, sl: Partial<T>): T => {
        return {...st, ...sl} as T;
    }
): {
    state: T,
    state$: Observable<T>,
    nextSlice: (stateSlice: Partial<T>) => void,
    nextSliceObservable: (state$: Observable<Partial<T>>) => void,
} & Subscribable<T> {
    let state = {} as T;
    const state$: Observable<T> = merge(
        stateObservables.pipe(
            distinctUntilChanged(),
            mergeAll(),
            observeOn(queueScheduler)
        ),
        stateSlices.pipe(observeOn(queueScheduler))
    ).pipe(
        scan(stateAccumulator, state),
        tap(s => state = s),
        publishReplay(1)
    );

    function nextSlice(stateSlice: Partial<T>): void {
        stateSlices.next(stateSlice);
    }

    function nextSliceObservable(state$: Observable<Partial<T>>): void {
        stateObservables.next(state$);
    }

    function subscribe(): Subscription {
        return (state$ as ConnectableObservable<T>).connect()
    }

    return {
        state,
        state$,
        nextSlice,
        nextSliceObservable,
        subscribe
    }
}
