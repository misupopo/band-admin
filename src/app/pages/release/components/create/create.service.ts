import { Injectable } from '@angular/core';
import { CreateModel } from './create.model';
import { RequestManager } from '../../../../@theme/services';

@Injectable()
export class CreateDataService {
    constructor(private requestManager: RequestManager) {
    }

    public createData = (createModel: CreateModel) => {
        return this.requestManager.requestPostAction(createModel);
    }
}
