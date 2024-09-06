import { isPlatform } from '@ionic/react';
import { App } from '@capacitor/app';
import { AuthService } from 'ionic-appauth';
import { CapacitorBrowser, CapacitorSecureStorage } from 'ionic-appauth/lib/capacitor';
import { AxiosRequestor } from './AxiosService';
import { CapacitorRequestor } from './CapacitorService';

export class Auth {

  private static authService: AuthService | undefined;

  private static buildAuthInstance() {
    
    const requestor = isPlatform('ios') ? new CapacitorRequestor() : new AxiosRequestor();
    const authService = new AuthService(new CapacitorBrowser(), new CapacitorSecureStorage(), requestor);

    if (
      import.meta.env.VITE_OIDC_CLIENT_ID === undefined ||
      import.meta.env.VITE_OIDC_SERVER_URL === undefined
    ) {
      throw new Error(
        'OIDC_CLIENT_ID and OIDC_SERVER_URL must be defined in .env file',
      );
    }

    authService.authConfig = {
      client_id: import.meta.env.VITE_OIDC_CLIENT_ID || 'app',
      server_host:
        import.meta.env.VITE_OIDC_SERVER_URL ||
        'https://api.staging.hsc.health',
      redirect_url: isPlatform('capacitor')
        ? (import.meta.env.VITE_OIDC_REDIRECT_PREFIX_APP ||
          'health.hsc.apps.hscclient') + '://oidc-callback'
        : window.location.origin + '/oidc-callback',
      end_session_redirect_url: isPlatform('capacitor')
        ? (import.meta.env.VITE_OIDC_REDIRECT_PREFIX_APP ||
          'health.hsc.apps.hscclient') + '://endsession'
        : window.location.origin + '/endsession',
      scopes: import.meta.env.VITE_OIDC_SCOPES || 'openid offline_access',
      pkce: true,
    };
    console.log('AuthService Config', authService.authConfig);

    if (isPlatform('capacitor')) {
      App.addListener('appUrlOpen', (data: any) => {
        if ((data.url).indexOf(authService.authConfig.redirect_url) === 0) {
          authService.authorizationCallback(data.url);
        } else {
          authService.endSessionCallback();
        }
      });
    }

    authService.init();
    return authService;
  }

  public static get Instance(): AuthService {
    if (!this.authService) {
      this.authService = this.buildAuthInstance();
    }

    return this.authService;
  }
}