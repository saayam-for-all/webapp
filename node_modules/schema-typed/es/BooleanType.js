import { MixedType } from './MixedType';
export class BooleanType extends MixedType {
    constructor(errorMessage) {
        super('boolean');
        super.pushRule({
            onValid: v => typeof v === 'boolean',
            errorMessage: errorMessage || this.locale.type
        });
    }
}
export default function getBooleanType(errorMessage) {
    return new BooleanType(errorMessage);
}
//# sourceMappingURL=BooleanType.js.map