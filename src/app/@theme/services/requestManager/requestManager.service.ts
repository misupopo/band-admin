import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { LoadingSpinnerState } from '../../../@core/share/loadingSpinner.state';
import { RequestConfigService } from '../../../@core/data/request.service';

@Injectable()
export class RequestManager {
    private requestUrl: string;

    constructor(private http: Http,
                private requestConfigService: RequestConfigService,
                private loadingSpinnerState: LoadingSpinnerState) {
        this.requestUrl = this.requestConfigService.getRequestUrl();
    }

    public requestPostAction (postData: any) {
        this.loadingSpinnerState.setLoadingSpinnerState(true);

        return this.http.post(this.requestUrl + '/' + postData.action, postData)
        .map((response: Response) => {
            this.loadingSpinnerState.setLoadingSpinnerState(false);
            return response.json();
        })
        .do((response) => {

        });
    }

    public requestGetAction (getData: any) {
        this.loadingSpinnerState.setLoadingSpinnerState(true);

        return this.http.get(this.requestUrl + '/' + getData.action, getData)
            .map((response: Response) => {
                this.loadingSpinnerState.setLoadingSpinnerState(false);
                return response.json();
            })
            .do((response) => {

            });
    }
}
