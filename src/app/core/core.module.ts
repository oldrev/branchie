import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppSettingsService, BranchieVideoService, ElectronService } from './services';

@NgModule({
    declarations: [],
    imports: [
        CommonModule
    ],
    providers: [
        AppSettingsService,
        ElectronService,
        BranchieVideoService
    ]
})
export class CoreModule { }
