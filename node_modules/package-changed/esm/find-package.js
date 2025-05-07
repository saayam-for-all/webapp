import path from 'path';
import fs from 'fs';
export var findPackage = function (_a) {
    var cwd = (_a === void 0 ? {
        cwd: process.cwd(),
    } : _a).cwd;
    var current = cwd;
    var last = current;
    do {
        var search = path.join(current, 'package.json');
        if (fs.existsSync(search)) {
            return search;
        }
        last = current;
        current = path.dirname(current);
    } while (current !== last);
};
