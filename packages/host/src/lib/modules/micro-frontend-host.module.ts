import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DynamicAppLoaderComponent } from '../components/dynamic-app-loader.component';
import { ExternalAppLoaderService } from '../services/external-app-loader.service';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
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
