import {ModuleWithProviders, NgModule} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgUploaderModule } from 'ngx-uploader';

import {
    NbActionsModule,
    NbCardModule,
    NbLayoutModule,
    NbMenuModule,
    NbRouteTabsetModule,
    NbSearchModule,
    NbSidebarModule,
    NbTabsetModule,
    NbThemeModule,
    NbUserModule,
    NbCheckboxModule,
    NbPopoverModule,
    NbContextMenuModule,
} from '@nebular/theme';

import {NbSecurityModule} from '@nebular/security';

import {
    FooterComponent,
    HeaderComponent,
    ModalBasicComponent,
    SearchInputComponent,
    ThemeSettingsComponent,
    ThemeSwitcherComponent,
    TinyMCEComponent,
    ModalContentComponent,
} from './components';
import {CapitalizePipe, PluralPipe, RoundPipe, TimingPipe} from './pipes';
import {
    OneColumnLayoutComponent,
    SampleLayoutComponent,
    ThreeColumnsLayoutComponent,
    TwoColumnsLayoutComponent,
} from './layouts';
import {
    RequestManager,
    CamelcaseConverter,
    DateManager,
} from './services';
import {DEFAULT_THEME} from './styles/theme.default';
import {COSMIC_THEME} from './styles/theme.cosmic';

const BASE_MODULES = [CommonModule, FormsModule, ReactiveFormsModule, NgUploaderModule];

const NB_MODULES = [
    NbCardModule,
    NbLayoutModule,
    NbTabsetModule,
    NbRouteTabsetModule,
    NbMenuModule,
    NbUserModule,
    NbActionsModule,
    NbSearchModule,
    NbSidebarModule,
    NbCheckboxModule,
    NbPopoverModule,
    NbContextMenuModule,
    NgbModule,
    NbSecurityModule, // *nbIsGranted directive
];

const SERVICES = [
    RequestManager,
    CamelcaseConverter,
    DateManager,
];

const COMPONENTS = [
    ThemeSwitcherComponent,
    HeaderComponent,
    FooterComponent,
    SearchInputComponent,
    ThemeSettingsComponent,
    TinyMCEComponent,
    OneColumnLayoutComponent,
    SampleLayoutComponent,
    ThreeColumnsLayoutComponent,
    TwoColumnsLayoutComponent,
    ModalBasicComponent,
    ModalContentComponent,
];

const PIPES = [
    CapitalizePipe,
    PluralPipe,
    RoundPipe,
    TimingPipe,
];

const NB_THEME_PROVIDERS = [
    ...NbThemeModule.forRoot(
        {
            name: 'cosmic',
        },
        [DEFAULT_THEME, COSMIC_THEME],
    ).providers,
    ...NbSidebarModule.forRoot().providers,
    ...NbMenuModule.forRoot().providers,
];

@NgModule({
    imports: [...BASE_MODULES, ...NB_MODULES, HttpClientModule],
    exports: [...BASE_MODULES, ...NB_MODULES, ...COMPONENTS, ...PIPES],
    declarations: [...COMPONENTS, ...PIPES],
})
export class ThemeModule {
    static forRoot(): ModuleWithProviders {
        return <ModuleWithProviders>{
            ngModule: ThemeModule,
            providers: [...NB_THEME_PROVIDERS, ...SERVICES,],
        };
    }
}
