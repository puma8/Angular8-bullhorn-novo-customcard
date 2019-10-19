import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
// Vendor
import { AppBridge, DevAppBridge } from 'novo-elements';
// App
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppBridgeService {
  onRegistered: EventEmitter<boolean> = new EventEmitter();

  // AppBridgeConfig provided by the extension's environment file:
  private appBridgeConfig = environment.appBridgeConfig;

  // Production flag from extension's environment file
  private readonly waitTime: number = environment.production ? 500 : 2000;

  // Query string parameter received from Bullhorn:
  // private readonly currentBullhornUrl: string;

  // Flag provided by the extension in the register method
  private requiresWindowObject = false;

  // Registration variables
  private registered = false;
  private registrationAttempts = 0;
  private readonly maxRegistrationAttempts = 4;

  // The novo elements app bridge instance that communicates with the Novo/S-Release MainFrame
  private bridge: AppBridge;

  constructor(private http: HttpClient,
    private route: ActivatedRoute) {
    // Query string parameter received from Bullhorn:
    console.log("[custom] AppBridgeService Init QuerySnapshot", this.route);

    // this.currentBullhornUrl = this.route.snapshot.queryParamMap.get('currentBullhornUrl');
    // this.currentBullhornUrl = this.route.snapshot.params.currentBullhornUrl;
    // console.log("currentBullhornUrl-1234567890", this.currentBullhornUrl);

    // Connects to Novo/S-Release Mainframe using post robot
    // if (environment.production) {
    //   this.bridge = new AppBridge(this.appBridgeConfig.title);
    // } else {
    //   this.bridge = new DevAppBridge(this.appBridgeConfig.title, http);
    // }

    this.bridge = new AppBridge(this.appBridgeConfig.title);
    // this.bridge = new DevAppBridge(this.appBridgeConfig.title, http);
    this.bridge.tracing = !environment.production;
    console.log("[custom: bridge object]", this.bridge);
  }
  /**
   * Executes an AppBridge command, with a single retry giving time for the app to register if needed
   *
   * @param execute a function that receives the appBridge object and performs some action
   */
  execute(execute: (bridge: AppBridge) => void): void {
    if (this.registered) {
      execute(this.bridge);
    } else {
      setTimeout(() => {
        if (this.registered) {
          execute(this.bridge);
        }
      }, this.waitTime);
    }
  }

  /**
   * Returns a promise that resolves to a boolean value for determining if the app is
   * running within Novo
   *
   * Returns: true for Novo, false for S-Release.
   */
  isNovoEnabled(): Promise<boolean> {
    return new Promise((resolve) => {
      const noOpCallback = { key: undefined, generic: undefined, options: undefined };
      this.execute(bridge => bridge.callback(noOpCallback)
        .then(() => resolve(true))
        .catch(() => resolve(false)));
    });
  }

  /**
   * Register method for Custom Actions (custom record actions and custom list actions)
   *
   * Since custom actions create a new bowling alley tab for the action, the app bridge service
   * will need to connect to the new action window created so that events like close and refresh will
   * work for the newly created window. The url of the new window will not be static, it must
   * be grabbed from the original post parameters.
   *
   * Bullhorn provides the 'currentBullhornUrl' parameter that specifies the url of the new iFrame window.
   */
  registerCustomAction(url: string): void {
    this.requiresWindowObject = true;
    this.appBridgeConfig.url = url.replace(/.*BullhornStaffing/g, '/BullhornStaffing');
    console.log("currentBullhornUrl", this.appBridgeConfig.url);
    this.register();
  }

  /**
   * Register method for Custom Menu Items
   *
   * Since custom menu items create a new bowling alley tab, the app bridge service needs to connect
   * to the new window in order to name it or close it.
   */
  registerCustomMenuItem(): void {
    this.requiresWindowObject = true;
    this.register();
  }

  /**
   * Call this method from your module and listen for onRegistered events.
   *
   * Registers with the Novo or S-Release MainFrame that is running the server side of the App Bridge.
   * If registration fails (due to timing issues), attempts to re-register up to 3 times.
   */
  register(): void {
    this.registrationAttempts++;
    console.log("[custom] register function", this.appBridgeConfig, this.bridge);
    this.bridge.register(this.appBridgeConfig).then((windowName: string) => {
      // Custom actions open inside of a new bowling alley tab, and we must register for the new window object
      // Keep retrying to register until we receive the full window registration. Otherwise, ignore it.
      console.log("[custom] register function windowName:", windowName);
      this.registered = !this.requiresWindowObject || windowName != null;
      if (this.registered) {
        this.onRegistered.emit(true);
      } else {
        this.registerRetry();
      }
    }, (err: any) => {
      this.registerRetry(err);
    });
  }

  private registerRetry(err: any = null) {
    console.log("[custom: registerRetry function:]", this.registered);
    if (!this.registered && this.registrationAttempts < this.maxRegistrationAttempts) {
      setTimeout(() => {
        this.register();
      }, this.waitTime);
    } else {
      this.onRegistered.emit(false);
      if (err) {
        console.error(err);
      }
    }
  }
}