export declare function isTokenExpired({ expiresAt, clockDrift, tolerance, }: {
    expiresAt: number;
    clockDrift: number;
    tolerance?: number;
}): boolean;
