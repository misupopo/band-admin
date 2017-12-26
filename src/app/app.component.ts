/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {Component, OnInit} from '@angular/core';
import {AnalyticsService} from './@core/utils/analytics.service';


@Component({
    selector: 'ngx-app',
    styleUrls: ['./app.component.scss'],
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

    public loading = false;

    constructor(private analytics: AnalyticsService) {
    }

    ngOnInit(): void {
        this.analytics.trackPageViews();
        this.loading = false;
    }
}
