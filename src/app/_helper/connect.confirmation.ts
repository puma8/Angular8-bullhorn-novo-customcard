import { Injectable } from "@angular/core";
import { ApiService } from "../services/api.service";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";

@Injectable({ providedIn: "root" })
export class ConnectConfirmation implements CanActivate {
  private response: any = [];
  private queryParameters: any;

  constructor(
    private router: Router,
    private apiService: ApiService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    console.log("custom card location: ", location.search);

    const search = location.search.substring(1);
    this.queryParameters = search
      .split("&")
      .map(part => ({
        [part.split("=")[0]]: part.split("=")[1]
      }))
      .reduce(
        (result, e) => ({
          ...result,
          ...e
        }),
        {}
      );

    console.log("[custom] Params:", this.queryParameters);

    if (this.queryParameters) {
      console.log("request time", new Date());
      this.apiService.getContractList(this.queryParameters).then(res => {
        console.log("response time", new Date());
        this.response = res;
        console.log(res);
        if (this.response.isSetup) {
          this.router.navigate([
            "/list-contracts",
            this.queryParameters.appCode,
            this.queryParameters.CorporationID,
            this.queryParameters.UserID,
            this.queryParameters.EntityID
          ]);
        } else {
          this.router.navigate([
            "/party-list",
            this.queryParameters.appCode,
            this.queryParameters.CorporationID,
            this.queryParameters.UserID,
            this.queryParameters.EntityID,
            this.queryParameters.currentBullhornUrl || "",
          ]);
        }
        return true;
      });
      return false;
    } else {
      return false;
    }
  }
}
