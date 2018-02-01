import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadingSpinnerState } from './loadingSpinner.state';
import { ModalState } from './modal.state';

const SERVICES = [
    LoadingSpinnerState,
    ModalState,
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
