import {Observable, OperatorFunction} from 'rxjs';
import {stateful} from "./stateful";
import {pluck} from "rxjs/operators";

/*
* EXAMPLE
* interface State {foo: string}
* const s: State = {foo: 'bar'};
* of(s)
*   .pipe(
*       // select() => {foo: 'bar'} and Observable<State>
*       // select('foo') => bar and Observable<string>
*       // select(map(s => s.foo)) => bar and Observable<string>
*       // select(map(s => s.foo), mapTo(42)) => 42 and Observable<number>
*   )
*
* */

export function select<T>(): Observable<T>;
export function select<T, A>(pathOrOpr: OperatorFunction<T, A>): Observable<A>;
export function select<T, A, B>(pathOrOpr: OperatorFunction<T, A>, opr2: OperatorFunction<A, B>): Observable<B>;
export function select<T, A, B, C>(pathOrOpr: OperatorFunction<T, A>, opr2: OperatorFunction<A, B>, opr3: OperatorFunction<B, C>): Observable<C>;
export function select<A, T, B, C, D>(pathOrOpr: OperatorFunction<T, A>, opr2: OperatorFunction<A, B>, opr3: OperatorFunction<B, C>, opr4: OperatorFunction<C, D>): Observable<D>;
export function select<A, T, B, C, D, E>(pathOrOpr: OperatorFunction<T, A>, opr2: OperatorFunction<A, B>, opr3: OperatorFunction<B, C>, opr4: OperatorFunction<C, D>, opr5: OperatorFunction<D, E>): Observable<E>;
export function select<A, T, B, C, D, E, F>(pathOrOpr: OperatorFunction<T, A>, opr2: OperatorFunction<A, B>, opr3: OperatorFunction<B, C>, opr4: OperatorFunction<C, D>, opr5: OperatorFunction<D, E>, opr6: OperatorFunction<E, F>): Observable<F>;
// Error
// ls.select('foo');
// ls.select('test');
export function select<T, A>(pathOrOpr: string): Observable<A>;
export function select<T, U extends keyof T>(pathOrOpr?: any): Observable<T | T[U]> {
    return (o: Observable<T>): Observable<T, U, T[U]> => {
        if (pathOrOpr === undefined) {
            return o.pipe(
                stateful()) as Observable<T>;
        }

        if (typeof pathOrOpr === 'string') {
            const key: U = pathOrOpr as U;
            return o.pipe(
                pluck(key),
                stateful()) as Observable<T[U]>;
        }

        if (typeof pathOrOpr === 'function') {
            return o.pipe(
                pathOrOpr,
                stateful());
        } else {
            throw new Error(`Wrong type`);
        }
    }
}
