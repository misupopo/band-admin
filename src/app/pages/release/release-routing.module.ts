import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReleaseComponent } from './release.component';
import { CreateComponent } from './components/create/create.component';
import { ListComponent } from './components/list/list.component';
import { DetailComponent } from './components/detail/detail.component';

const routes: Routes = [{
    path: '',
    component: ReleaseComponent,
    children: [
        {
            path: 'create',
            component: CreateComponent,
        },
        {
            path: 'list',
            component: ListComponent,
        },
        {
            path: 'detail/:id',
            component: DetailComponent,
        },
    ],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LiveRoutingModule {
}

export const routedComponents = [
    ReleaseComponent,
    CreateComponent,
    ListComponent,
    DetailComponent,
];
