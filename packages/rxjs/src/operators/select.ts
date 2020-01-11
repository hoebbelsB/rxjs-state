import {Observable, of, OperatorFunction, pipe, UnaryFunction} from 'rxjs';
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

/*
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
*/

export function select<T>(): UnaryFunction<T, T>;
export function select<T, A>(fn1: UnaryFunction<T, A>): UnaryFunction<T, A>;
export function select<T, A, B>(fn1: UnaryFunction<T, A>, fn2: UnaryFunction<A, B>): UnaryFunction<T, B>;
export function select<T, A, B, C>(fn1: UnaryFunction<T, A>, fn2: UnaryFunction<A, B>, fn3: UnaryFunction<B, C>): UnaryFunction<T, C>;
export function select<T, A, B, C, D>(fn1: UnaryFunction<T, A>, fn2: UnaryFunction<A, B>, fn3: UnaryFunction<B, C>, fn4: UnaryFunction<C, D>): UnaryFunction<T, D>;
export function select<T, A, B, C, D, E>(fn1: UnaryFunction<T, A>, fn2: UnaryFunction<A, B>, fn3: UnaryFunction<B, C>, fn4: UnaryFunction<C, D>, fn5: UnaryFunction<D, E>): UnaryFunction<T, E>;
export function select<T, A, B, C, D, E, F>(fn1: UnaryFunction<T, A>, fn2: UnaryFunction<A, B>, fn3: UnaryFunction<B, C>, fn4: UnaryFunction<C, D>, fn5: UnaryFunction<D, E>, fn6: UnaryFunction<E, F>): UnaryFunction<T, F>;
export function select<T, A, B, C, D, E, F, G>(fn1: UnaryFunction<T, A>, fn2: UnaryFunction<A, B>, fn3: UnaryFunction<B, C>, fn4: UnaryFunction<C, D>, fn5: UnaryFunction<D, E>, fn6: UnaryFunction<E, F>, fn7: UnaryFunction<F, G>): UnaryFunction<T, G>;
export function select<T, A, B, C, D, E, F, G, H>(fn1: UnaryFunction<T, A>, fn2: UnaryFunction<A, B>, fn3: UnaryFunction<B, C>, fn4: UnaryFunction<C, D>, fn5: UnaryFunction<D, E>, fn6: UnaryFunction<E, F>, fn7: UnaryFunction<F, G>, fn8: UnaryFunction<G, H>): UnaryFunction<T, H>;
export function select<T, A, B, C, D, E, F, G, H, I>(fn1: UnaryFunction<T, A>, fn2: UnaryFunction<A, B>, fn3: UnaryFunction<B, C>, fn4: UnaryFunction<C, D>, fn5: UnaryFunction<D, E>, fn6: UnaryFunction<E, F>, fn7: UnaryFunction<F, G>, fn8: UnaryFunction<G, H>, fn9: UnaryFunction<H, I>): UnaryFunction<T, I>;
export function select<T, A, B, C, D, E, F, G, H, I>(fn1: UnaryFunction<T, A>, fn2: UnaryFunction<A, B>, fn3: UnaryFunction<B, C>, fn4: UnaryFunction<C, D>, fn5: UnaryFunction<D, E>, fn6: UnaryFunction<E, F>, fn7: UnaryFunction<F, G>, fn8: UnaryFunction<G, H>, fn9: UnaryFunction<H, I>, ...fns: UnaryFunction<any, any>[]): UnaryFunction<T, {}>;
// ================================
export function select<T, K1 extends keyof T>(k1: K1): OperatorFunction<T, T[K1]>;
export function select<T, K1 extends keyof T, K2 extends keyof T[K1]>(k1: K1, k2: K2): OperatorFunction<T, T[K1][K2]>;
export function select<T, K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2]>(k1: K1, k2: K2, k3: K3): OperatorFunction<T, T[K1][K2][K3]>;
export function select<T, K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2], K4 extends keyof T[K1][K2][K3]>(k1: K1, k2: K2, k3: K3, k4: K4): OperatorFunction<T, T[K1][K2][K3][K4]>;
export function select<T, K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2], K4 extends keyof T[K1][K2][K3], K5 extends keyof T[K1][K2][K3][K4]>(k1: K1, k2: K2, k3: K3, k4: K4, k5: K5): OperatorFunction<T, T[K1][K2][K3][K4][K5]>;
export function select<T, K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2], K4 extends keyof T[K1][K2][K3], K5 extends keyof T[K1][K2][K3][K4], K6 extends keyof T[K1][K2][K3][K4][K5]>(k1: K1, k2: K2, k3: K3, k4: K4, k5: K5, k6: K6): OperatorFunction<T, T[K1][K2][K3][K4][K5][K6]>;
// export function pluck<T, R>(...properties: string[]): OperatorFunction<T, R>;
// =======================
export function select<T, R>(...opOrMapFn: UnaryFunction<any, any>[] | string[]): UnaryFunction<T, any> {
    if (!opOrMapFn || opOrMapFn.length === 0) {
        return pipe(
            stateful()
        );
    } else if (!this.isOperateFnArray(opOrMapFn)) {
        const path: string[] = opOrMapFn as string[];
        return pipe(
            pluck(...path),
            stateful()
        );
    }
    return pipe(
       ...opOrMapFn as [],
        stateful()
    );
}


interface MyState {
    test: { baz: { boo: { loo: { foo: { baz: string } } } } },
    bar: number
}


const state: MyState = {
    test: {
        baz: {
            boo: {
                loo: {
                    foo: {
                        baz: 'test'
                    }
                }
            }
        },
    },
    bar: 42
};


const r1 = of(state)
    .pipe(select());
