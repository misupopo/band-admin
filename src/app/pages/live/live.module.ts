import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ThemeModule } from '../../@theme/theme.module';
import { LiveRoutingModule, routedComponents } from './live-routing.module';
import { CreateDataService } from './components/create/create.service';
import { ListDataService } from './components/list/list.service';
import { DetailDataService } from './components/detail/detail.service';

@NgModule({
    imports: [
        ThemeModule,
        LiveRoutingModule,
        Ng2SmartTableModule,
    ],
    declarations: [
        ...routedComponents,
    ],
    providers: [
        CreateDataService,
        ListDataService,
        DetailDataService,
    ],
})
export class LiveModule {
}
