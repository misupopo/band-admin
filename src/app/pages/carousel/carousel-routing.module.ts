import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarouselComponent } from './carousel.component';
import { CreateComponent } from './components/create/create.component';
import { ListComponent } from './components/list/list.component';
import { DetailComponent } from './components/detail/detail.component';

const routes: Routes = [{
    path: '',
    component: CarouselComponent,
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
export class CarouselRoutingModule {
}

export const routedComponents = [
    CarouselComponent,
    CreateComponent,
    ListComponent,
    DetailComponent,
];
