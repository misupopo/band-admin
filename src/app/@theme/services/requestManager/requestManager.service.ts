import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { LoadingSpinnerState } from '../../../@core/share/loadingSpinner.state';

@Injectable()
export class RequestManager {

    constructor(private http: Http) {
    }


}
