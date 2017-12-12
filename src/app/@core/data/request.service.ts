import { Injectable } from '@angular/core';

@Injectable()
export class RequestConfigService {

    private data = {
        url: 'http://localhost:9001',
    };

    constructor() {
    }

    public getRequestUrl (): string {
        return this.data.url;
    }
}
