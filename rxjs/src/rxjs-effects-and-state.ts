import {RxjsState} from "./rxjs-state";
import {RxjsEffects} from "./rxjs-effects";

export class RxjsEffectsAndState<T> {
    private rxjsState = new RxjsState();
    private rxjsEffects = new RxjsEffects();

    init(): void {
        this.rxjsState.init();
        this.rxjsEffects.init();
    }

    teardown(): void {
        this.rxjsState.teardown();
        this.rxjsEffects.teardown();
    }
}
