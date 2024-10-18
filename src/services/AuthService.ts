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
    const browser = new CapacitorBrowser();
    
    const authService = new AuthService(browser, new CapacitorSecureStorage(), requestor);

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
        import.meta.env.VITE_OIDC_SERVER_URL || 'https://api.staging.hsc.health',
      redirect_url: isPlatform('capacitor')
        ? (import.meta.env.VITE_OIDC_REDIRECT_PREFIX_APP || 'https://localhost') + '/oidc-callback'
        : window.location.origin + '/oidc-callback',
      end_session_redirect_url: isPlatform('capacitor')
        ? (import.meta.env.VITE_OIDC_REDIRECT_PREFIX_APP || 'https://localhost') + '/endsession'
        : window.location.origin + '/endsession',
      scopes: import.meta.env.VITE_OIDC_SCOPES || 'openid offline_access',
      pkce: true,
    };

    if (isPlatform('capacitor')) {
      App.addListener('appUrlOpen', (data: any) => {
        console.log('------> App opened with URL:'+ data.url);

        if (data.url && data.url.includes('/oidc-callback')) {
          authService.authorizationCallback(data.url);
        } else {
          authService.endSessionCallback();
        }
      });
      console.log("added listener")
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