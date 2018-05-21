import { Injectable } from '@angular/core';
import {DetailModel, UpdateDetailModel, UpdatePm2DetailModel} from './detail.model'
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

    public updatePm2DetailData = (updatePm2DetailModel: UpdatePm2DetailModel) => {
        return this.requestManager.requestPostAction(updatePm2DetailModel);
    }
}
