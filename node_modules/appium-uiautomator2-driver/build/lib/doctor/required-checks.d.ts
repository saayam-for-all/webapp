export const androidHomeCheck: {
    varName: string;
    opts: doctor.EnvVarCheckOptions;
    diagnose(): Promise<import("@appium/types").DoctorCheckResult>;
    fix(): Promise<string>;
    hasAutofix(): boolean;
    isOptional(): boolean;
};
export const javaHomeCheck: {
    varName: string;
    opts: doctor.EnvVarCheckOptions;
    diagnose(): Promise<import("@appium/types").DoctorCheckResult>;
    fix(): Promise<string>;
    hasAutofix(): boolean;
    isOptional(): boolean;
};
export const javaHomeValueCheck: doctor.JavaHomeValueCheck;
export const androidSdkCheck: doctor.AndroidSdkCheck;
import { doctor } from 'appium-android-driver';
//# sourceMappingURL=required-checks.d.ts.map