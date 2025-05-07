import { prefix } from './prefix';
import { useIconContext } from './useIconContext';
export default function useClassNames() {
    var classPrefix = useIconContext().classPrefix;
    var className = "".concat(classPrefix, "icon");
    return [
        className,
        prefix(className)
    ];
}
