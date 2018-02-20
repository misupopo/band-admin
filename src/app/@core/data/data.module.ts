import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UserService} from './users.service';
import {ElectricityService} from './electricity.service';
import {StateService} from './state.service';
import {SmartTableService} from './smart-table.service';
import {PlayerService} from './player.service';
import {RequestConfigService} from './request.service';

import { AppConfigService } from '../../app.config.service';

const SERVICES = [
    UserService,
    ElectricityService,
    StateService,
    SmartTableService,
    PlayerService,
    RequestConfigService,
    AppConfigService,
];

@NgModule({
    imports: [
        CommonModule,
    ],
    providers: [
        ...SERVICES,
    ],
})
export class DataModule {
    static forRoot(): ModuleWithProviders {
        return <ModuleWithProviders>{
            ngModule: DataModule,
            providers: [
                ...SERVICES,
            ],
        };
    }
}
