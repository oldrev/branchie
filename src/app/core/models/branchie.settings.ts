import {InjectionToken} from '@angular/core';


export interface BranchieSettings {
    app?: {
    } | undefined;

    video: {
        videoDirectory: string | undefined;
    };
}
