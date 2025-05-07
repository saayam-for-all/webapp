import colors from 'ansi-colors';
import inquirer from 'inquirer';

import Logger from '../../../../logger';
import {symbols} from '../../../../utils';
import {Platform} from '../../interfaces';
import {getBinaryLocation} from '../../utils/common';
import {execBinarySync} from '../../utils/sdk';

export async function connectWirelessAdb(sdkRoot: string, platform: Platform): Promise<boolean> {
  try {
    const adbLocation = getBinaryLocation(sdkRoot, platform, 'adb', true);
    if (adbLocation === '') {
      Logger.log(`  ${colors.red(symbols().fail)} ${colors.cyan('adb')} binary not found.\n`);
      Logger.log(`Run: ${colors.cyan('npx @nightwatch/mobile-helper android --mode real --standalone')} to setup missing requirements.`);
      Logger.log(`(Remove the ${colors.gray('--standalone')} flag from the above command if setting up for testing.)\n`);

      return false;
    }

    Logger.log(`${colors.yellow('\nNote: Wireless debugging connection is only supported in Android 11 and above.\n')}`);

    Logger.log(colors.bold('Follow the below steps to connect to your device wirelessly:\n'));

    Logger.log('  1. Connect your device to the same network as your computer.');
    Logger.log(`     ${colors.grey('You may connect your device to your computer\'s hotspot')}\n`);

    Logger.log('  2. Enable developer options on your device by going to:');
    Logger.log(`     ${colors.cyan('Settings > About phone > Build number')}`);
    Logger.log(`     and tapping the ${colors.bold('Build number')} 7 times until you see the message: ${colors.bold('You are now a developer!')}\n`);
    Logger.log(`     ${colors.grey('For more info, see: https://developer.android.com/studio/debug/dev-options#enable')}\n`);

    Logger.log(`  3. Enable ${colors.bold('Wireless debugging')} on your device by going to:`);
    Logger.log(`     ${colors.cyan('Settings > Developer options > Wireless debugging')}`);
    Logger.log(`     or, search for ${colors.bold('wireless debugging')} on your device's Settings app.\n`);

    Logger.log('  4. Find the IP address and port number of your device on the Wireless debugging screen');
    Logger.log(`     ${colors.grey('IP address and port number are separated by \':\' in the format <ip_address>:<port>')}`);
    Logger.log(`     ${colors.grey('where IP address comes before \':\' and port number comes after \':\'')}\n`);

    const deviceIPAnswer = await inquirer.prompt({
      type: 'input',
      name: 'deviceIP',
      message: 'Enter the IP address of your device:'
    });
    const deviceIP = deviceIPAnswer.deviceIP;

    const portAnswer = await inquirer.prompt({
      type: 'input',
      name: 'port',
      message: 'Enter the port number:'
    });
    const port = portAnswer.port;

    // Run the connect command using ip address and port number provided. If the device is previously
    // paired, then connection will succeed and we don't require to pair again. If not, then prompt
    // user for pairing details. Pair the device and then proceed to connect.
    let connectionStatus = execBinarySync(adbLocation, 'adb', platform, `connect ${deviceIP}:${port}`);
    if (connectionStatus?.includes('connected')) {
      Logger.log('\n' + colors.green('Connected successfully!\n'));

      return true;
    }

    Logger.log();
    Logger.log('  5. Now, find your device\'s pairing code and pairing port number by going to:');
    Logger.log(`     ${colors.cyan('Wireless debugging > Pair device with pairing code')}`);
    Logger.log(`     Here, you will find a pairing code and an IP address and port combination ${colors.grey('(in the format <ip_address>:<port>)')}`);
    Logger.log('     The port number associated with the IP address is the required pairing port number.\n');

    const pairingCodeAnswer = await inquirer.prompt({
      type: 'input',
      name: 'pairingCode',
      message: 'Enter the pairing code displayed on your device:'
    });
    const pairingCode = pairingCodeAnswer.pairingCode;

    const pairingPortAnswer = await inquirer.prompt({
      type: 'input',
      name: 'pairingPort',
      message: 'Enter the pairing port number displayed on your device:'
    });
    const pairingPort = pairingPortAnswer.pairingPort;

    Logger.log();
    Logger.log('Pairing with your device...');

    const pairing = execBinarySync(adbLocation, 'adb', platform, `pair ${deviceIP}:${pairingPort} ${pairingCode}`);
    if (pairing) {
      Logger.log(colors.green('Pairing successful!\n'));
      Logger.log('Connecting to your device...');
    } else {
      Logger.log(`\n${colors.red('Pairing failed!')} Please try again.\n`);

      return false;
    }

    connectionStatus = execBinarySync(adbLocation, 'adb', platform, `connect ${deviceIP}:${port}`);
    if (!connectionStatus?.includes('connected')) {
      if (connectionStatus) {
        Logger.log(colors.red(`  ${symbols().fail} Failed to connect: ${connectionStatus}`), 'Please try again.\n');
      } else {
        Logger.log(`\n${colors.red('Failed to connect!')} Please try again.\n`);
      }

      return false;
    }

    Logger.log(colors.green('Connected successfully!\n'));

    return true;
  } catch (error) {
    Logger.log(colors.red('Error occurred while connecting to device wirelessly.'));
    console.error(error);

    return false;
  }
}

