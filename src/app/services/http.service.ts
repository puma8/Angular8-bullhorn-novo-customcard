import { Injectable } from '@angular/core';

// Vendor
import { AppBridge } from 'novo-elements';
import { EntityTypes } from '@bullhorn/bullhorn-types';
// APP
import { AppBridgeService } from './app-bridge.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private appBridgeService: AppBridgeService) { }

  /**
   * Handles errors and unwraps nested response from App Bridge
   *
   * The AppBridge returns a response that wraps the server response:
   * {
   *     data: { <http server response> },
   *     error: { <any post-robot errors> }
   * }
   *
   * A null response means that AppBridge did not connect and the call failed.
   *
   * @param response the server response wrapped in a post-robot response from AppBridge
   * @param resolve  the resolve method to call if successful
   * @param reject   the reject method to call if unsuccessful
   */
  private static handleAppBridgeResponse(response: any, resolve: (any) => void, reject: (any) => void): void {
    if (!response) {
      reject(response);
    } else if (response.error) {
      reject(response.error);
    } else if (response.data) {
      resolve(response.data);
    } else {
      resolve(response);
    }
  }

  /**
  * Performs a bullhorn /entity call to get an entity by ID using appBridge
  */
  getEntity(entityType: EntityTypes, entityId: number, fields: string = '*', meta: string = 'off'): Promise<any> {
    return new Promise((resolve, reject) => {
      this.appBridgeService.execute((appBridge: AppBridge) => {
        appBridge.httpGET(`entity/${entityType}/${entityId}?fields=${fields}&meta=${meta}`).then((response: any) => {
          HttpService.handleAppBridgeResponse(response, resolve, reject);
        }).catch((error: Error) => {
          reject(error);
        });
      });
    });
  }
}
