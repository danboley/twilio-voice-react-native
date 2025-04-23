const { withInfoPlist } = require('@expo/config-plugins');

const withTwilioVoiceIOS = (config) => {
  // Add necessary iOS permissions
  config = withInfoPlist(config, (config) => {
    const infoPlist = config.modResults;

    // Add background modes
    if (!infoPlist.UIBackgroundModes) {
      infoPlist.UIBackgroundModes = [];
    }

    if (!infoPlist.UIBackgroundModes.includes('audio')) {
      infoPlist.UIBackgroundModes.push('audio');
    }

    if (!infoPlist.UIBackgroundModes.includes('voip')) {
      infoPlist.UIBackgroundModes.push('voip');
    }

    // Add necessary permission descriptions
    infoPlist.NSMicrophoneUsageDescription =
      infoPlist.NSMicrophoneUsageDescription ||
      'Need microphone access for VoIP calls';

    return config;
  });

  return config;
};

module.exports = withTwilioVoiceIOS;
