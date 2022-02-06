import { Component, OnInit } from '@angular/core';
import { BranchieVideoService, ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { APP_CONFIG } from '../environments/environment';
import { AppSettingsService } from './core/services';
import { app } from 'electron';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    constructor(
        private readonly appSettings: AppSettingsService,
        private readonly electronService: ElectronService,
        private readonly videoService: BranchieVideoService,
        private readonly translate: TranslateService
    ) {
        this.translate.setDefaultLang('en');
        console.log('APP_CONFIG', APP_CONFIG);

        if (electronService.isElectron) {
            console.log(process.env);
            console.log('Run in electron');
            console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
            console.log('NodeJS childProcess', this.electronService.childProcess);
        } else {
            console.log('Run in browser');
        }
    }

    async ngOnInit(): Promise<void> {
        const appSettings = this.appSettings.getSettings();
        /*
        const videoConfigPath = this.electronService.path.join(appSettings.video.videoDirectory, 'branchie-video.xml');
        if (!this.electronService.fs.existsSync(videoConfigPath)) {
            throw new Error('Can not found: ' + videoConfigPath);
        }
        */
    }
}
