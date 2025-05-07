import path from 'path';
export var getPackagelock = function (_a) {
    var packagePath = _a.packagePath;
    return path.join(path.dirname(packagePath), 'package-lock.json');
};
