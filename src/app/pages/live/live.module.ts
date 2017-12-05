import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { LiveRoutingModule, routedComponents } from './live-routing.module';
import { CreateDataService } from './components/create/create.service';

@NgModule({
    imports: [
        ThemeModule,
        LiveRoutingModule,
    ],
    declarations: [
        ...routedComponents,
    ],
    providers: [
        CreateDataService,
    ],
})
export class LiveModule {
}
