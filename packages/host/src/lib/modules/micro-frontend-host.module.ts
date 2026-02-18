import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicAppLoaderComponent } from '../components/dynamic-app-loader.component';
import { ExternalAppLoaderService } from '../services/external-app-loader.service';

@NgModule({
    imports: [
        CommonModule,
        DynamicAppLoaderComponent
    ],
    providers: [
        ExternalAppLoaderService
    ],
    exports: [
        DynamicAppLoaderComponent
    ]
})
export class MicroFrontendHostModule { }
