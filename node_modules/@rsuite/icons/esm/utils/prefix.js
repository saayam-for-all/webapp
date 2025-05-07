import classNames from 'classnames';
export var prefix = function(pre) {
    return function(className) {
        if (!pre || !className) {
            return '';
        }
        if (Array.isArray(className)) {
            return classNames(className.filter(function(name) {
                return !!name;
            }).map(function(name) {
                return "".concat(pre, "-").concat(name);
            }));
        }
        return "".concat(pre, "-").concat(className);
    };
};
