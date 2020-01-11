import {Injectable, OnDestroy} from "@angular/core";
import {EphemeralState} from "./ephemeral-state";
import {defaultStateAccumulation} from "./utils";

@Injectable({
    providedIn: 'root'
})
export class RxEphemeralState<T> extends EphemeralState<T> implements OnDestroy {

    constructor(stateAccumulator: (acc: T, slices: Partial<T>) => T = defaultStateAccumulation) {
        super(stateAccumulator);
    }

    ngOnDestroy(): void {
        this.teardown();
    }

}
