import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LoadingSpinnerState {
    public loadingSpinnerStateData = new Subject<Object>();

    constructor() {
        this.loadingSpinnerStateData['state'] = false;
    }

    public setLoadingSpinnerState (state: boolean) {
        this.loadingSpinnerStateData['state'] = state;
        this.loadingSpinnerStateData.next(state);
    }
}
