import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecruitmentComponent } from './recruitment.component';
import { DetailComponent } from './components/detail/detail.component';

const routes: Routes = [{
    path: '',
    component: RecruitmentComponent,
    children: [
        {
            path: 'detail',
            component: DetailComponent,
        },
    ],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RecruitmentRoutingModule {
}

export const routedComponents = [
    RecruitmentComponent,
    DetailComponent,
];
