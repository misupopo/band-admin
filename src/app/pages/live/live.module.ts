import {NgModule} from '@angular/core';

import {ThemeModule} from '../../@theme/theme.module';
import {LiveRoutingModule, routedComponents} from './live-routing.module';

@NgModule({
    imports: [
        ThemeModule,
        LiveRoutingModule,
    ],
    declarations: [
        ...routedComponents,
    ],
})
export class LiveModule {
}
