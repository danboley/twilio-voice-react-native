const {
  withProjectBuildGradle,
  withAppBuildGradle,
  withAndroidManifest,
} = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withTwilioVoiceAndroid = (config) => {
  // Modify project build.gradle
  config = withProjectBuildGradle(config, (config) => {
    const buildGradle = config.modResults.contents;

    // Check if Google Services plugin is already included
    if (!buildGradle.includes('com.google.gms:google-services')) {
      // Add Google Services plugin for FCM
      const modifiedBuildGradle = buildGradle.replace(
        /dependencies\s*{/,
        `dependencies {
        classpath 'com.google.gms:google-services:4.3.15'`
      );

      config.modResults.contents = modifiedBuildGradle;
    }

    return config;
  });

  // Modify app build.gradle
  config = withAppBuildGradle(config, (config) => {
    const buildGradle = config.modResults.contents;

    // Check if Google Services plugin is already applied
    if (
      !buildGradle.includes("apply plugin: 'com.google.gms.google-services'")
    ) {
      // Apply Google Services plugin
      const modifiedBuildGradle =
        buildGradle + "\napply plugin: 'com.google.gms.google-services'\n";

      config.modResults.contents = modifiedBuildGradle;
    }

    return config;
  });

  // Add config.xml for FCM settings
  config = withAndroidManifest(config, async (config) => {
    const mainAppPath = path.join(
      config.modRequest.projectRoot,
      'android',
      'app',
      'src',
      'main'
    );
    const valuesPath = path.join(mainAppPath, 'res', 'values');

    if (!fs.existsSync(valuesPath)) {
      fs.mkdirSync(valuesPath, { recursive: true });
    }

    const configPath = path.join(valuesPath, 'config.xml');
    const configContent = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <bool name="twiliovoicereactnative_firebasemessagingservice_enabled">true</bool>
</resources>`;

    fs.writeFileSync(configPath, configContent);

    return config;
  });

  return config;
};

module.exports = withTwilioVoiceAndroid;
