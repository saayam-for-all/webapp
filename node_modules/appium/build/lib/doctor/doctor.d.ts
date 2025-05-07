export const EXIT_CODE: Readonly<{
    SUCCESS: 0;
    HAS_MAJOR_ISSUES: 127;
}>;
export class Doctor {
    /**
     * @param {DoctorCheck[]} [checks=[]]
     */
    constructor(checks?: DoctorCheck[]);
    log: import("@appium/types").AppiumLogger;
    /** @type {DoctorCheck[]} */
    checks: DoctorCheck[];
    /** @type {DoctorIssue[]} */
    foundIssues: DoctorIssue[];
    /**
     * @returns {DoctorIssue[]}
     */
    get issuesRequiredToFix(): DoctorIssue[];
    /**
     * @returns {DoctorIssue[]}
     */
    get issuesOptionalToFix(): DoctorIssue[];
    /**
     * The doctor shows the report
     */
    diagnose(): Promise<void>;
    /**
     * @returns {Promise<boolean>}
     */
    reportManualIssues(): Promise<boolean>;
    /**
     * @param {DoctorIssue} f
     */
    runAutoFix(f: DoctorIssue): Promise<void>;
    /**
     * @returns {Promise<boolean>}
     */
    runAutoFixes(): Promise<boolean>;
    /**
     * @returns {Promise<EXIT_CODE[keyof EXIT_CODE]>}
     */
    run(): Promise<0 | 127>;
    /**
     * @param {DoctorCheckResult} result
     * @param {DoctorCheck} check
     * @returns {DoctorIssue?}
     */
    toIssue(result: DoctorCheckResult, check: DoctorCheck): DoctorIssue | null;
    /**
     * @returns {string}
     */
    buildFixMessage(): string;
    /**
     * @returns {boolean}
     */
    reportSuccess(): boolean;
}
export type DoctorIssue = {
    check: DoctorCheck;
    error: string;
    fixed?: boolean | undefined;
};
export type DoctorCheck = import("@appium/types").IDoctorCheck;
export type DoctorCheckResult = import("@appium/types").DoctorCheckResult;
//# sourceMappingURL=doctor.d.ts.map