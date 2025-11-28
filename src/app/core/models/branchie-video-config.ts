import { timestamp } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { TimeSpan } from './timespan';
import * as expressionEval from 'expression-eval';
import * as jsep from 'jsep';


export interface BranchieVideoNode {
    readonly id: string;
}

export class BranchieVideoActivity implements BranchieVideoNode {
    readonly timeStart: number;
    readonly timeEnd: number | undefined;
    readonly isLoop: boolean;
    readonly score: number;

    constructor(readonly id: string,
                readonly video: URL,
                readonly isStart: boolean = false,
                readonly isEnd: boolean = false, options: {
        score?: number;
        isLoop?: boolean;
        timeStart?: string;
        timeEnd?: string;
    } = {}) {
        this.isLoop = options.isLoop ?? false;
        this.score = options.score ?? 0;
        this.timeStart = options.timeStart === undefined ? 0 : TimeSpan.parse(options.timeStart).totalMilliseconds;
        this.timeEnd = options.timeEnd === undefined ? undefined : TimeSpan.parse(options.timeEnd).totalMilliseconds;
    }
}

export class BranchieVideoTransition implements BranchieVideoNode {
    readonly id: string = uuid();
    readonly caption: string;
    readonly priority: number;
    readonly waitSignal: boolean = true;
    readonly condition: jsep.Expression;

    constructor(
        readonly from: BranchieVideoActivity,
        readonly to: BranchieVideoActivity,
        options: {
            caption?: string;
            priority?: number;
            waitSignal?: boolean;
            condition?: string;
        } = {}
    ) {
        this.caption = options.caption ?? '';
        this.priority = options.priority ?? 0;
        this.waitSignal = options.waitSignal ?? true;
        this.condition = options.condition === undefined ? expressionEval.parse('true') : expressionEval.parse(options.condition);
    }

    evalCondition(context: object): Promise<boolean> {
        return expressionEval.eval(this.condition, context);
    }
}

export class BranchieVideoConfig {
    activities: BranchieVideoActivity[] = [];
    transitions: BranchieVideoTransition[] = [];
};
