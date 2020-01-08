import {ConnectableObservable, merge, Observable, OperatorFunction, Subject, Subscription} from 'rxjs';
import {map, mergeAll, pluck, publishReplay, scan} from 'rxjs/operators';
import {stateful} from './operators/stateful';

export class RxjsState<T> {
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

    }

    init() {
        this._subscription.add((this._state$ as ConnectableObservable<T>).connect());
    }

    /**
     * setState(s: Partial<T>) => void
     *
     * @param s: Partial<T>
     *
     * @example
     * const ls = new LocalState<{test: string, bar: number}>();
     * // Error
     * // ls.setState({test: 7});
     * ls.setState({test: 'tau'});
     * // Error
     * // ls.setState({bar: 'tau'});
     * ls.setState({bar: 7});
     */
    setState(s: Partial<T>): void {
        this._stateSlices.next(s);
    }

    /**
     * connectState(o: Observable<Partial<T>>) => void
     *
     * @param o: Observable<Partial<T>>
     *
     * @example
     * const ls = new LocalState<{test: string, bar: number}>();
     * // Error
     * // ls.connectState(of(7));
     * // ls.connectState(of('tau'));
     * ls.connectState(of());
     * // Error
     * // ls.connectState(of({test: 7}));
     * ls.connectState(of({test: 'tau'}));
     * // Error
     * // ls.connectState(of({bar: 'tau'}));
     * ls.connectState(of({bar: 7}));
     */
    connectState<A extends keyof T>(strOrObs: A | Observable<Partial<T>>, obs?: Observable<T[A]>): void {
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


    /**
     * select<R>(operator?: OperatorFunction<T, R>): Observable<T | R>
     *
     * @param operator?: OperatorFunction<T, R>
     *
     * @example
     * const ls = new LocalState<{test: string, bar: number}>();
     */
    // ls.select();
    select(): Observable<T>;
    // Error
    // ls.select(pipe());
    // ls.select(pipe(map(s => s.test), startWith(7)));
    // ls.select(pipe(map(s => s.test), startWith('unknown test value')));
    select<A = T>(pathOrOpr: OperatorFunction<T, A>): Observable<A>;
    select<A = T, B = A>(pathOrOpr: OperatorFunction<T, A>, opr2: OperatorFunction<A, B>): Observable<B>;
    select<A = T, B = A, C = B>(pathOrOpr: OperatorFunction<T, A>, opr2: OperatorFunction<A, B>, opr3: OperatorFunction<B, C>): Observable<C>;
    select<A = T, B = A, C = B, D = C>(pathOrOpr: OperatorFunction<T, A>, opr2: OperatorFunction<A, B>, opr3: OperatorFunction<B, C>, opr4: OperatorFunction<C, D>): Observable<D>;
    select<A = T, B = A, C = B, D = C, E = D>(pathOrOpr: OperatorFunction<T, A>, opr2: OperatorFunction<A, B>, opr3: OperatorFunction<B, C>, opr4: OperatorFunction<C, D>, opr5: OperatorFunction<D, E>): Observable<E>;
    select<A = T, B = A, C = B, D = C, E = D, F = E>(pathOrOpr: OperatorFunction<T, A>, opr2: OperatorFunction<A, B>, opr3: OperatorFunction<B, C>, opr4: OperatorFunction<E, F>, opr5: OperatorFunction<D, E>, opr6: OperatorFunction<E, F>): Observable<F>;
    // Error
    // ls.select('foo');
    // ls.select('test');
    select<A = T>(pathOrOpr: string): Observable<A>;
    select<U extends keyof T>(pathOrOpr?: any): Observable<T | T[U]> {
        if (pathOrOpr === undefined) {
            return this._state$.pipe(
                stateful()) as Observable<T>;
        }

        if (typeof pathOrOpr === 'string') {
            const key: U = pathOrOpr as U;
            return this._state$.pipe(
                pluck(key),
                stateful()) as Observable<T[U]>;
        }

        if (typeof pathOrOpr === 'function') {
            return this._state$.pipe(
                pathOrOpr,
                stateful());
        }

        throw new Error(`Wrong type`);
    }

    /**
     * teardown(): void
     *
     * When called it teardown all internal logic
     * used to connect to the `OnDestroy` life-cycle hook of services, components, directives, pipes
     */
    teardown(): void {
        this._subscription.unsubscribe();
    }

}

// @TODO Experiment with cleanup logic for undefined state slices
export function deleteUndefinedStateAccumulator<T>(state: T, [keyToDelete, value]: [string, any]): T {
    const isKeyToDeletePresent = keyToDelete in state;
    // The key you want to delete is not stored :)
    if (!isKeyToDeletePresent && value === undefined) {
        return state;
    }
    // Delete slice
    if (value === undefined) {
        const {[keyToDelete]: v, ...newS} = state as any;
        return newS;
    }
    // update state
    return ({...state, [keyToDelete]: value});
}

const ls = new RxjsState<{test: string, bar: number}>();

const c = ls.select('test');
