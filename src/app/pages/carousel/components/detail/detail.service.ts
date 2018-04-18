import { Injectable } from '@angular/core';
import { DetailModel, UpdateDetailModel } from './detail.model';
import { RequestManager } from '../../../../@theme/services';

@Injectable()
export class DetailDataService {
    constructor(private requestManager: RequestManager) {
    }

    public getDetailData = (detailModel: DetailModel) => {
        return this.requestManager.requestGetAction(detailModel);
    }

    public updateDetailData = (updateDetailModel: UpdateDetailModel) => {
        return this.requestManager.requestPostAction(updateDetailModel);
    }
}
