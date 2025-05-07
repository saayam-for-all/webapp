import colors from 'ansi-colors';
import inquirer from 'inquirer';

import Logger from '../../../../logger';
import {Platform} from '../../interfaces';
import {getBinaryLocation} from '../../utils/common';
import {execBinarySync, spawnCommandSync} from '../../utils/sdk';
import apiLevelNames from '../apiLevelNames.json';
import {showMissingBinaryHelp} from '../common';
import {ApiLevelNames, AvailableSystemImages} from '../interfaces';

export async function installSystemImage(sdkRoot: string, platform: Platform): Promise<boolean> {
  try {
    const sdkmanagerLocation = getBinaryLocation(sdkRoot, platform, 'sdkmanager', true);
    if (!sdkmanagerLocation) {
      showMissingBinaryHelp('sdkmanager');

      return false;
    }

    const stdout = execBinarySync(sdkmanagerLocation, 'sdkmanager', platform, '--list');
    if (!stdout) {
      Logger.log(`${colors.red('\nFailed to fetch available system images!')} Please try again.\n`);

      return false;
    }

    // `sdkmanager --list` output have repetitive system image names in different sections
    // (Installed packages, Available packages, Available updates, etc.)
    //
    // Parse the output and store the system image names in a Set to avoid duplicates.
    const availableImageNames = new Set<string>();

    // Before parsing and removing duplicates, sort the system images
    // to get them in increasing order of API level.
    const lines = stdout.split('\n').sort();

    lines.forEach(line => {
      if (!line.includes('system-images;')) {
        return;
      }

      const imageName = line.split('|')[0].trim();
      availableImageNames.add(imageName);
    });

    // System images are represented in the format: system-images;android-<api-level>;<type>;<arch>
    // Group all the system image types by API level. Group all the architectures by system image type.
    const availableSystemImages: AvailableSystemImages = {};
    availableImageNames.forEach(imageName => {
      if (!imageName.includes('system-image')) {
        return;
      }
      const imageSplit = imageName.split(';');
      const apiLevel = imageSplit[1];
      const type = imageSplit[2];
      const arch = imageSplit[3];

      availableSystemImages[apiLevel] ||= [];

      const imageType = availableSystemImages[apiLevel].find(image => image.type === type);
      if (!imageType) {
        availableSystemImages[apiLevel].push({
          type: type,
          archs: [arch]
        });
      } else {
        imageType.archs.push(arch);
      }
    });

    // We've got the available system images grouped by API level.
    // Now, prompt the user to select the API level, system image type, and architecture.
    const apiLevelChoices = Object.keys(availableSystemImages).map(apiLevel => {
      let name = apiLevel;
      if ((apiLevelNames as ApiLevelNames)[apiLevel]) {
        name = `${apiLevel}: ${(apiLevelNames as ApiLevelNames)[apiLevel]}`;
      }

      return {name, value: apiLevel};
    });

    const apiLevelAnswer = await inquirer.prompt({
      type: 'list',
      name: 'apiLevel',
      message: 'Select the API level for system image:',
      choices: apiLevelChoices
    });
    const apiLevel = apiLevelAnswer.apiLevel;

    const systemImageTypeAnswer = await inquirer.prompt({
      type: 'list',
      name: 'systemImageType',
      message: `Select the system image type for ${colors.cyan(apiLevel)}:`,
      choices: availableSystemImages[apiLevel].map(image => image.type)
    });
    const type = systemImageTypeAnswer.systemImageType;

    const systemImageArchAnswer = await inquirer.prompt({
      type: 'list',
      name: 'systemImageArch',
      message: 'Select the architecture for the system image:',
      choices: availableSystemImages[apiLevel].find(image => image.type === type)?.archs
    });
    const arch = systemImageArchAnswer.systemImageArch;

    const systemImageName = `system-images;${apiLevel};${type};${arch}`;

    Logger.log();
    Logger.log(`Installing system image: ${colors.cyan(systemImageName)}\n`);

    const installationStatus = spawnCommandSync(sdkmanagerLocation, 'sdkmanager', platform, [systemImageName]);
    if (installationStatus) {
      Logger.log(colors.green('\nSystem image installed successfully!\n'));

      return true;
    }

    Logger.log(colors.red('\nSomething went wrong while installing system image.\n'));
    Logger.log(`To verify if the system image was installed, run: ${colors.cyan('npx @nightwatch/mobile-helper android.sdkmanager --list_installed')}`);
    Logger.log('If the system image is not found listed, please try installing again.\n');

    return false;
  } catch (error) {
    Logger.log(colors.red('\nError occurred while installing system image.'));
    console.error(error);

    return false;
  }
}
