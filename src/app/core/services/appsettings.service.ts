import { Injectable } from '@angular/core';

import * as toml from 'toml-js';
import { BranchieSettings } from '../models/branchie.settings';
import { ElectronService } from '.';
import { BrowserWindow } from 'electron';
//import 'rxjs/add/observable/of';


@Injectable({
    providedIn: 'root'
})
export class AppSettingsService {
    private static appSettings: BranchieSettings | undefined = undefined;

    constructor(
        private readonly electron: ElectronService
    ) {
        // Conditional imports
    }

    getSettings(): BranchieSettings {

        if(!AppSettingsService.appSettings) {
            console.log('>>>>>>>>>>>>>>>>>>> Command line args:', this.electron.process.argv);
            const settingsFilePath = this.electron.path.join(this.electron.appDir, 'etc', 'branchie.ini');
            if(!this.electron.fs.existsSync(settingsFilePath)) {
                throw new Error('Can not found settings file: ' + settingsFilePath);
            }
            const iniBuffer = this.electron.fs.readFileSync(settingsFilePath, 'utf-8');
            const settings = toml.parse(iniBuffer) as BranchieSettings;
            settings.video.videoDirectory = this.electron.path.resolve(settings.video.videoDirectory ?? '');
            AppSettingsService.appSettings = settings;
        }
        return AppSettingsService.appSettings;
    }

}

