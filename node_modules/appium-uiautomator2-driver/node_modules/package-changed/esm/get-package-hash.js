import crypto from 'crypto';
import fs from 'fs';
export var getPackageHash = function (packagePath) {
    var hashSum = crypto.createHash('md5');
    var contents = fs.readFileSync(packagePath, 'utf-8');
    var packageBlob = JSON.parse(contents);
    var dependencies = {
        dependencies: packageBlob['dependencies'] || {},
        devDependencies: packageBlob['devDependencies'] || {},
    };
    var depsJson = JSON.stringify(dependencies);
    hashSum.update(Buffer.from(depsJson));
    return hashSum.digest('hex');
};
