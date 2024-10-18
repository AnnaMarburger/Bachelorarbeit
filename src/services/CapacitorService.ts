import { Requestor } from '@openid/appauth';
import { XhrSettings } from 'ionic-appauth/lib/cordova';
import axios from 'axios';

export class CapacitorRequestor implements Requestor {
  public async xhr<T>(settings: XhrSettings): Promise<T> {
    if (!settings.method) {
      settings.method = 'GET';
    }

    const axiosConfig = {
      method: settings.method,
      url: settings.url,
      headers: settings.headers,
      data: settings.data,
    };

    const response = await axios(axiosConfig);
    return response.data as T;
  }
}