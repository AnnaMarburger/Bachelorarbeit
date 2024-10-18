import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'health.hsc.apps.hscclient',
  appName: 'Ernährungsunterstützung App',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    hostname: 'localhost',
    androidScheme: 'https',
    iosScheme: 'https'
  }
};

export default config;
