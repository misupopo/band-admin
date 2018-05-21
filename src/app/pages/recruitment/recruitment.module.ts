import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ThemeModule } from '../../@theme/theme.module';
import { RecruitmentRoutingModule, routedComponents } from './recruitment-routing.module';
import { DetailDataService } from './components/detail/detail.service';

@NgModule({
    imports: [
        ThemeModule,
        RecruitmentRoutingModule,
        Ng2SmartTableModule,
    ],
    declarations: [
        ...routedComponents,
    ],
    providers: [
        DetailDataService,
    ],
})
export class RecruitmentModule {
}
