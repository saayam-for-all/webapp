import colors from 'ansi-colors';
import {exec, execSync, spawnSync} from 'child_process';
import fs from 'fs';
import {homedir} from 'os';
import path from 'path';

import {copySync, rmDirSync, symbols} from '../../../utils';
import DOWNLOADS from '../downloads.json';
import {Platform} from '../interfaces';
import {downloadWithProgressBar, getBinaryNameForOS} from './common';


export const getDefaultAndroidSdkRoot = (platform: Platform) => {
  if (platform === 'windows') {
    let basePath = process.env.LOCALAPPDATA;
    if (!basePath) {
      basePath = homedir();
    }

    return path.join(basePath, 'Android', 'sdk');
  }

  if (platform === 'linux') {
    return path.join(homedir(), 'Android', 'Sdk');
  }

  return path.join(homedir(), 'Library', 'Android', 'sdk');
};

export const downloadAndSetupAndroidSdk = async (sdkRoot: string, platform: Platform) => {
  // make sure `cmdline-tools` folder is not present already
  const cmdline_tools = path.join(sdkRoot, 'cmdline-tools');
  const temp_cmdline_tools1 = path.join(sdkRoot, 'cmdline-tools-temp1');
  const temp_cmdline_tools2 = path.join(sdkRoot, 'cmdline-tools-temp2');

  const cmdline_tools_latest = path.join(sdkRoot, 'cmdline-tools', 'latest');
  const cmdline_tools_old = path.join(sdkRoot, 'cmdline-tools', 'old');
  const cmdline_tools_new = path.join(sdkRoot, 'cmdline-tools', 'new');

  // remove directors that might conflict later, if present somehow
  rmDirSync(temp_cmdline_tools1);
  rmDirSync(temp_cmdline_tools2);
  rmDirSync(cmdline_tools_old);
  rmDirSync(cmdline_tools_new);

  // if cmdline-tools are already present, shift to temp folder temporarily.
  // also, rename 'latest' to 'old'.
  if (fs.existsSync(cmdline_tools)) {
    if (fs.existsSync(cmdline_tools_latest)) {
      fs.renameSync(cmdline_tools_latest, cmdline_tools_old);
    }
    fs.renameSync(cmdline_tools, temp_cmdline_tools1);
  }

  // download android sdk (cmdline-tools)
  const result = await downloadWithProgressBar(DOWNLOADS.sdk[platform], sdkRoot, true);
  if (!result) {
    // bring cmdline-tools back to original state
    if (fs.existsSync(temp_cmdline_tools1)) {
      fs.renameSync(temp_cmdline_tools1, cmdline_tools);
      if (fs.existsSync(cmdline_tools_old)) {
        fs.renameSync(cmdline_tools_old, cmdline_tools_latest);
      }
    }

    throw new Error('Failed to download cmdline-tools.');
  }

  // re-arrange files
  fs.renameSync(cmdline_tools, temp_cmdline_tools2);
  fs.mkdirSync(cmdline_tools_new, {recursive: true});
  copySync(temp_cmdline_tools2, cmdline_tools_new);
  rmDirSync(temp_cmdline_tools2);
  // bring back older cmdline-tools, if present
  if (fs.existsSync(temp_cmdline_tools1)) {
    copySync(temp_cmdline_tools1, cmdline_tools);
    rmDirSync(temp_cmdline_tools1);
  }

  console.log('cmdline-tools downloaded successfully!\n');

  // update sdkmanager
  console.log('Updating cmdline-tools to the latest version...');
  const binaryFullName = getBinaryNameForOS(platform, 'sdkmanager');
  let cmd: string;

  if (platform === 'windows') {
    cmd = `${binaryFullName} "cmdline-tools;latest"`;
  } else {
    cmd = `./${binaryFullName} "cmdline-tools;latest"`;
  }

  try {
    execSync(cmd, {
      input: 'y',
      stdio: ['pipe', 'inherit', 'inherit'],
      cwd: path.join(cmdline_tools_new, 'bin')
    });

    if (!fs.existsSync(cmdline_tools_latest)) {
      throw Error();
    }

    rmDirSync(cmdline_tools_new);
    console.log(`${colors.green('Success!')} Updated cmdline-tools to the latest version.\n`);
  } catch {
    console.log(`${colors.red('Failed!')} Falling back to the current downloaded version.\n`);
    fs.renameSync(cmdline_tools_new, cmdline_tools_latest);
  }
};

export const installPackagesUsingSdkManager = (
  sdkManagerLocation: string,
  platform: Platform,
  packages: string[]
) => {
  const sdkManagerFullName = path.basename(sdkManagerLocation);
  const sdkManagerDirPath = path.dirname(sdkManagerLocation);
  let result = true;

  for (const packageName of packages) {
    console.log(`Installing ${packageName}...`);
    let cmd: string;

    if (platform === 'windows') {
      cmd = `${sdkManagerFullName} "${packageName}"`;
    } else {
      cmd = `./${sdkManagerFullName} "${packageName}"`;
    }

    try {
      execSync(cmd, {
        input: 'y',
        stdio: ['pipe', 'inherit', 'inherit'],
        cwd: sdkManagerDirPath
      });

      console.log(`${colors.green('Success!')} ${packageName} installed successfully.\n`);
    } catch {
      console.log(
        `${colors.red(symbols().fail)} Failed to run ${colors.cyan(cmd)} inside '${sdkManagerDirPath}'\n`
      );
      result = false;
    }
  }

  return result;
};

export const execBinarySync = (
  binaryLocation: string,
  binaryName: string,
  platform: Platform,
  args: string
): string | null => {
  if (binaryLocation === 'PATH') {
    const binaryFullName = getBinaryNameForOS(platform, binaryName);
    const cmd = `${binaryFullName} ${args}`;

    try {
      const stdout = execSync(cmd, {
        stdio: 'pipe'
      });

      return stdout.toString();
    } catch {
      console.log(
        `  ${colors.red(symbols().fail)} Failed to run ${colors.cyan(cmd)}`
      );

      return null;
    }
  }

  const binaryFullName = path.basename(binaryLocation);
  const binaryDirPath = path.dirname(binaryLocation);
  let cmd: string;

  if (platform === 'windows') {
    cmd = `${binaryFullName} ${args}`;
  } else {
    cmd = `./${binaryFullName} ${args}`;
  }

  try {
    const stdout = execSync(cmd, {
      stdio: 'pipe',
      cwd: binaryDirPath
    });

    return stdout.toString();
  } catch {
    console.log(
      `  ${colors.red(symbols().fail)} Failed to run ${colors.cyan(cmd)} inside '${binaryDirPath}'`
    );

    return null;
  }
};

export const execBinaryAsync = (
  binaryLocation: string,
  binaryName: string,
  platform: Platform,
  args: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    let cmd: string;
    if (binaryLocation === 'PATH') {
      const binaryFullName = getBinaryNameForOS(platform, binaryName);
      cmd = `${binaryFullName} ${args}`;
    } else {
      const binaryFullName = path.basename(binaryLocation);
      const binaryDirPath = path.dirname(binaryLocation);

      if (platform === 'windows') {
        cmd = `${binaryFullName} ${args}`;
      } else {
        cmd = `./${binaryFullName} ${args}`;
      }

      cmd = `cd ${binaryDirPath} && ${cmd}`;
    }

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.log(
          `  ${colors.red(symbols().fail)} Failed to run ${colors.cyan(cmd)}`
        );
        reject(stderr);
      } else {
        resolve(stdout.toString());
      }
    });
  });
};

export const spawnCommandSync = (binaryLocation: string, binaryName: string, platform: Platform, args: string[]): boolean => {
  let cmd: string;
  if (binaryLocation === 'PATH') {
    const binaryFullName = getBinaryNameForOS(platform, binaryName);
    cmd = `${binaryFullName}`;
  } else {
    cmd = binaryLocation;
  }

  const result = spawnSync(cmd, args, {
    stdio: 'inherit',
    ...(platform === 'windows' && cmd.endsWith('.bat') && {shell: true})
  });

  if (result.error) {
    console.error(result.error);

    return false;
  }

  return result.status === 0;
};

export const getBuildToolsAvailableVersions = (buildToolsPath: string): string[] => {
  if (!fs.existsSync(buildToolsPath)) {
    return [];
  }

  const buildToolsContent = fs.readdirSync(buildToolsPath);
  const availableVersions = buildToolsContent.filter(
    (name) => name.match(/^(\d+)(\.\d+){2}(-[a-z1-9]+)?/) !== null
  );

  return availableVersions;
};

export const downloadSdkBuildTools = (
  sdkManagerLocation: string,
  platform: Platform
): boolean => {
  console.log('Looking for the latest version of build-tools...');
  const versionStdout = execBinarySync(
    sdkManagerLocation,
    'sdkmanager',
    platform,
    '--list'
  );

  if (versionStdout !== null) {
    const versionMatch = versionStdout.match(/build-tools;(\d+)(\.\d+){2}(-[a-z1-9]+)?/g);
    if (!versionMatch) {
      console.log(`  ${colors.red(symbols().fail)} Failed to get the latest version of build-tools.\n`);

      return false;
    }

    const latestBuildTools = versionMatch.slice(-1);
    console.log();

    return installPackagesUsingSdkManager(
      sdkManagerLocation,
      platform,
      latestBuildTools
    );
  }
  console.log();

  return false;
};
