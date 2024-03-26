import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.horodunafarm.app',
  appName: 'horodyna farm',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
