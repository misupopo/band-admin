import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ThemeModule } from '../../@theme/theme.module';
import { LiveRoutingModule, routedComponents } from './release-routing.module';
import { CreateDataService } from './components/create/create.service';
import { ListDataService } from './components/list/list.service';
import { DetailDataService } from './components/detail/detail.service';

import { NgUploaderModule } from 'ngx-uploader';

@NgModule({
    imports: [
        ThemeModule,
        LiveRoutingModule,
        Ng2SmartTableModule,
        NgUploaderModule,
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
export class ReleaseModule {
}
