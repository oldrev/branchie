import { BranchieVideoActivity, BranchieVideoConfig, BranchieVideoTransition } from './branchie-video-config';
import { StateMachine, Transition } from 'stateless';

export interface BranchieVideoFsmEventsSink {
    onEnterActivity(trigger: BranchieVideoTransition): Promise<void>;
}

export class BranchieVideoFsm {

    private totalScoreNow = 0;
    private currentActivityID: string;
    private startupActivityInternal: BranchieVideoActivity;
    private endActivityInternal: BranchieVideoActivity;
    private readonly fsm: StateMachine<string, string>;
    private readonly activitiesLookup: { [id: string]: BranchieVideoActivity } = {};
    private readonly transitionsLookup: { [id: string]: BranchieVideoTransition } = {};

    constructor(videoConfig: BranchieVideoConfig, private readonly eventsSink: BranchieVideoFsmEventsSink) {
        this.startupActivityInternal = videoConfig.activities.filter(x => x.isStart)[0];
        this.endActivityInternal = videoConfig.activities.filter(x => x.isEnd)[0];

        this.fsm = new StateMachine<string, string>({
            accessor: () => this.currentActivityID, mutator: state => this.currentActivityID = state
        });

        videoConfig.activities.forEach(a => {
            this.activitiesLookup[a.id] = a;
        });

        videoConfig.transitions.forEach(t => {
            this.transitionsLookup[t.id] = t;
        });

        this.currentActivityID = this.startupActivityInternal.id;

        videoConfig.activities.forEach(theAct => {
            const stateConfig = this.fsm.configure(theAct.id);
            const outcomeTrans = Object.entries(this.transitionsLookup).filter(([k, v]) => v.from.id === theAct.id);
            outcomeTrans.forEach(tranPair => {
                const tran = tranPair[1];
                stateConfig.permitIf(tran.id, tran.to.id, async () => await this.checkTransitionCondition(tran));
                stateConfig.onEntry(async t => await this.onEntryActivityInternal(t));
            });
        });
    }

    get startupActivity(): BranchieVideoActivity {
        return this.startupActivityInternal;
    }

    get endActivity(): BranchieVideoActivity {
        return this.endActivityInternal;
    }

    get totalScore(): number {
        return this.totalScoreNow;
    }

    get currentActivity(): BranchieVideoActivity {
        return this.activitiesLookup[this.currentActivityID];
    }

    async getAllAvaliableTransitions(): Promise<BranchieVideoTransition[]> {
        const trans = (await this.fsm.permittedTriggers).map(x => this.transitionsLookup[x]);
        return trans.sort((a, b) => a.priority - b.priority);
    }

    async fireSignal(transitionID: string): Promise<void> {
        await this.fsm.fire(transitionID);
    }

    private async checkTransitionCondition(tran: BranchieVideoTransition): Promise<boolean> {
        const context = {
            fsm: this,
            transition: tran
        };
        return await tran.evalCondition(context);
    }

    private async onEntryActivityInternal(t: Transition<string, string>): Promise<any>
    {
        this.currentActivityID = t.destination;
        const to = this.activitiesLookup[t.destination];
        const trigger = this.transitionsLookup[t.trigger];
        this.totalScoreNow += to.score; // 计分
        //this.OnActivityEntryEvent?.Invoke(this, new OnActivityEntryEventArgs(from, to, trigger));
        await this.eventsSink.onEnterActivity(trigger);
    }

}
