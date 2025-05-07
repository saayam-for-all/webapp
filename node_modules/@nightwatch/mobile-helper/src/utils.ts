import fs from 'fs';
import path from 'path';

export const symbols = () => {
  let ok = String.fromCharCode(10004);
  let fail = String.fromCharCode(10006);

  if (process.platform === 'win32') {
    ok = '\u221A';
    fail = '\u00D7';
  }

  return {
    ok: ok,
    fail: fail
  };
};

export const getPlatformName = (platform = process.platform) => {
  if (platform === 'win32') {
    return 'windows';
  } else if (platform === 'darwin') {
    return 'mac';
  }

  return 'linux';
};

export const copySync = (src: string, dest: string, excludeDir: string[] = []): void => {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest, excludeDir);
  } else {
    fs.copyFileSync(src, dest);
  }
};

const copyDir = (srcDir: string, destDir: string, excludeDir: string[]): void => {
  if (excludeDir.some((dir) => srcDir.endsWith(dir))) {
    return;
  }

  fs.mkdirSync(destDir, {recursive: true});
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copySync(srcFile, destFile, excludeDir);
  }
};

export const rmDirSync = (dirPath: string) => {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const curPath = path.join(dirPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        rmDirSync(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dirPath);
  }
};

export const iosRealDeviceUDID = (udid: string) => {
  if (udid.length > 25) {
    return udid;
  }

  return `${udid.substring(0, 8)}-${udid.substring(9, 25)}`;
};
