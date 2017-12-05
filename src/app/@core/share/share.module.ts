import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadingSpinnerState } from './loadingSpinner.state';

const SERVICES = [
    LoadingSpinnerState
];

@NgModule({
    imports: [
        CommonModule,
    ],
    providers: [
        ...SERVICES,
    ],
})
export class ShareModule {
    static forRoot(): ModuleWithProviders {
        return <ModuleWithProviders>{
            ngModule: ShareModule,
            providers: [
                ...SERVICES,
            ],
        };
    }
}
