import { Injectable } from '@angular/core';
import { AppConfigService } from '../../app.config.service';

@Injectable()
export class RequestConfigService {
    private data = {
        url: '',
    };

    constructor(private appConfigService: AppConfigService) {
        this.data.url = this.appConfigService.getConfigData().accessUrl;
    }

    public getRequestUrl (): string {
        return this.data.url;
    }
}
