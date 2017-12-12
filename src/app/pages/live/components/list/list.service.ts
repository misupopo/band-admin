import { Injectable } from '@angular/core';
import { ListModel } from './list.model';
import { RequestManager } from '../../../../@theme/services';

@Injectable()
export class ListDataService {
    constructor(private requestManager: RequestManager) {
    }

    public getListData = (listModel: ListModel) => {
        return this.requestManager.requestGetAction(listModel);
    }
}
