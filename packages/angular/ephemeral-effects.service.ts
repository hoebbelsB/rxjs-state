import {Injectable, OnDestroy} from "@angular/core";
import {EphemeralEffects} from "./ephemeral-effects";

@Injectable({
    providedIn: 'root'
})
export class RxEphemeralEffects<T> extends EphemeralEffects implements OnDestroy {

    ngOnDestroy(): void {
        this.teardown();
    }

}

