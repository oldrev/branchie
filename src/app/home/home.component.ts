import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BranchieVideoActivity, BranchieVideoTransition } from '../core/models';
import { BranchieVideoFsm, BranchieVideoFsmEventsSink } from '../core/models/branchie-video-fsm';
import { BranchieVideoService, ElectronService } from '../core/services';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, BranchieVideoFsmEventsSink{
    @ViewChild('player') player: ElementRef;

    videoUrl: URL | undefined = undefined;
    videoLoop = false;
    videoTime = 0;
    videoDuration = 0;
    isVideoPlaying = false;
    x = 0;
    selectableTransitions: BranchieVideoTransition[];
    videoFsm: BranchieVideoFsm;
    canSelect = false;

    constructor(
        private router: Router,
        private readonly electronService: ElectronService,
        private readonly videoService: BranchieVideoService) {
    }

    private get isPaused(): boolean { return this.player.nativeElement.paused; }

    /**
     * 进入某个状态
     * 进入状态以后我们就播放视频，播放完成以后根据设置处理
     *
     * @param trigger 触发进入此状态的 transition
     */
    async onEnterActivity(trigger: BranchieVideoTransition): Promise<void> {
        // 进入了
        console.log('进入了状态，id=' + trigger.to.id);
        console.log('触发器 tid=' + trigger.id);

        const act = this.videoFsm.currentActivity;
        if(this.videoUrl !== act.video) {
            this.videoUrl = act.video;
        }

        this.rewind(act.timeStart); // activity 里的时间是毫秒，播放器需要秒
        this.resume();
    }

    async ngOnInit(): Promise<void> {
        const fs = this.electronService.fs.promises;
        console.log('HomeComponent INIT');
        console.log('------------------------------------------');
        //alert(this.appSettingsService.getSettings().videoDirectory);
        this.reinit();
    }

    onVideoDurationChanged(event): void {
        console.log(this.videoUrl.toString());
        /*
        if (!isNaN(this.videoDuration)) {
            this.videoDuration = this.player.nativeElement.duration * 1000;
        }
        */
    }

    /**
     * 播放器视频播放完毕
     */
    async onVideoEnded(event): Promise<void> {
        this.isVideoPlaying = false;
        await this.finishVideoClip();
    }

    /**
     * 分支按钮点击后事件处理
     *
     * @param event
     * @param tran
     */
    async onTransitionSelected(event, tran: BranchieVideoTransition): Promise<void> {
        this.clearTransitions();
        await this.videoFsm.fireSignal(tran.id);
    }

    /**
     * 播放器时间（进度）更新
     */
    async onVideoTimeUpdated(event): Promise<void> {
        if (!isNaN(this.videoTime)) {
            this.updateTime();
            const realVideoTime = this.player.nativeElement.currentTime * 1000;
            const act = this.videoFsm.currentActivity;
            if(act.timeEnd !== undefined && realVideoTime >= act.timeEnd) {
                await this.finishVideoClip();
            }
        }
    }

    onVideoPlaying(event) {
        this.isVideoPlaying = true;
    }

    onVideoPaused(event) {
        this.isVideoPlaying = false;
    }

    onReplayClicked(event) {
        this.reinit();
    }

    private async reinit(): Promise<void> {
        this.clearTransitions();
        const videoConfig = await this.videoService.loadVideoConfig();
        this.videoFsm  = new BranchieVideoFsm(videoConfig, this);
        this.playVideo();
    }

    /**
     * 视频片段播放完毕的处理
     */
    private async finishVideoClip() {
        const haveToWait = await this.showTransitions();
        if (haveToWait) {
            const act = this.videoFsm.currentActivity;
            if (act.isLoop) {
                this.rewind(act.timeStart);
            }
            else {
                this.player.nativeElement.pause();
            }
        }
    }

    /**
     * 视频跳转位置
     *
     * @param time 视频位置（毫秒）
     */
    private rewind(time: number): void {
        this.player.nativeElement.currentTime = time / 1000.0;
        this.updateTime();
    }

    private async showTransitions(): Promise<boolean> {
        this.canSelect = true;
        const availableTransitions = await this.videoFsm.getAllAvaliableTransitions();
        this.selectableTransitions = availableTransitions.filter(t => t.waitSignal);
        const autoSkipTransitions = availableTransitions.filter(t => !t.waitSignal);
        if(this.selectableTransitions.length === 0 && autoSkipTransitions.length === 1) {
            this.videoFsm.fireSignal(autoSkipTransitions[0].id);
            return false;
        }
        else {
            return true;
        }
    }

    private clearTransitions(): void {
        this.canSelect = false;
        this.selectableTransitions = [];
    }

    private playVideo(): void {
        const act = this.videoFsm.currentActivity;
        this.videoUrl = act.video;
        this.videoLoop = act.isLoop;
        this.rewind(act.timeStart); // activity 里的时间是毫秒，播放器需要秒
    }

    private resume(): void {
        if(this.isPaused) {
            this.player.nativeElement.play();
        }
    }

    private updateTime(): void {
        const act = this.videoFsm.currentActivity;
        this.videoTime = (this.player.nativeElement.currentTime * 1000.0) - act.timeStart;
        let endTime = (act.timeEnd !== undefined && !isNaN(act.timeEnd) ?
            act.timeEnd : this.player.nativeElement.duration * 1000);
        endTime = isNaN(endTime) ? 0 : endTime;
        this.videoDuration = endTime - act.timeStart;
    }

}
