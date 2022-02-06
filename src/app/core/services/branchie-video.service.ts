import { Injectable, OnInit } from '@angular/core';
import { ElectronService } from '.';
import { BranchieSettings } from '../models/branchie.settings';
import { AppSettingsService } from './appsettings.service';
import * as xml2js from 'xml2js';
import { StateMachine } from 'stateless';
import { BranchieVideoActivity, BranchieVideoConfig, BranchieVideoTransition } from '../models/branchie-video-config';

@Injectable({
    providedIn: 'root'
})
export class BranchieVideoService {
    private readonly settings: BranchieSettings;

    constructor(
        private readonly electron: ElectronService,
        private readonly appSettingService: AppSettingsService) {
        this.settings = this.appSettingService.getSettings();
    }

    makeVideoPath(videoFileName: string): string {
        const appSettings = this.appSettingService.getSettings();
        return this.electron.path.join(appSettings.video.videoDirectory, videoFileName);
    }

    makeVideoUrl(videoFileName: string): URL {
        return this.electron.url.pathToFileURL(this.makeVideoPath(videoFileName));
    }

    async loadVideoConfig(): Promise<BranchieVideoConfig> {
        const result = await this.parseVideoConfig();
        return result;
    }

    private async parseVideoConfig(): Promise<BranchieVideoConfig> {
        const xmlPath = this.electron.path.join(this.settings.video.videoDirectory, 'branchie-video.xml');
        const xmlContent = await this.electron.fs.promises.readFile(xmlPath);

        const xmlDoc = await xml2js.parseStringPromise(xmlContent, {
            explicitRoot: true,
            normalizeTags: true,
            explicitArray: false,
            async: true,
        });
        const vc = new BranchieVideoConfig();

        // 处理 activities
        xmlDoc['branchie-video'].activities.activity.forEach(ele => {
            const videoUrl = this.makeVideoUrl(ele.$.video);
            const act = new BranchieVideoActivity(ele.$.id, videoUrl, ele.$.start, ele.$.end, {
                score: isNaN(ele.$.score) ? 0 : parseInt(ele.$.score, 10),
                isLoop: ele.$.loop === 'true',
                timeStart: ele.$['time-start'],
                timeEnd: ele.$['time-end'],
            });
            vc.activities.push(act);
        });

        // 处理 transitions
        xmlDoc['branchie-video'].transitions.transition.forEach(ele => {
            const fromAct = vc.activities.filter(x => x.id === ele.$.from)[0];
            const toAct = vc.activities.filter(x => x.id === ele.$.to)[0];
            const tran = new BranchieVideoTransition(fromAct, toAct, {
                caption: ele.$.caption,
                waitSignal: ele.$['wait-signal'] === undefined ? true : ele.$['wait-signal'] === 'true',
                priority: ele.$.priority,
                condition: ele.$.if,
            });
            vc.transitions.push(tran);
        });

        return vc;
    }

}

