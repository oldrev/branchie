import { InjectionToken } from '@angular/core';


export interface BranchieSettings {
    app?: Record<string, never> | undefined;

    video: {
        videoDirectory: string | undefined;
    };
}
