import { useContext } from 'react';
import { IconContext } from '../IconProvider';
export function useIconContext() {
    var _ref = useContext(IconContext) || {}, _ref_classPrefix = _ref.classPrefix, classPrefix = _ref_classPrefix === void 0 ? 'rs-' : _ref_classPrefix, csp = _ref.csp, _ref_disableInlineStyles = _ref.disableInlineStyles, disableInlineStyles = _ref_disableInlineStyles === void 0 ? false : _ref_disableInlineStyles;
    return {
        classPrefix: classPrefix,
        csp: csp,
        disableInlineStyles: disableInlineStyles
    };
}
