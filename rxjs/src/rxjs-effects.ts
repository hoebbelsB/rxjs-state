import {Observable, Subject, Subscription} from 'rxjs';
import {mergeAll} from 'rxjs/operators';

export class RxjsEffects {
    private _subscription = new Subscription();
    private _effectSubject = new Subject<any>();

    constructor() {

    }

    init() {
        this._subscription.add(
            this._effectSubject.pipe(mergeAll())
                .subscribe()
        );
    }

    /**
     * connectEffect(o: Observable<any>) => void
     *
     * @param o: Observable<any>
     *
     * @example
     * const ls = new LocalState<{test: string, bar: number}>();
     * // Error
     * // ls.connectEffect();
     * ls.connectEffect(of());
     * ls.connectEffect(of().pipe(tap(n => console.log('side effect', n))));
     */
    connectEffect(o: Observable<unknown>): void {
        this._effectSubject.next(o);
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
