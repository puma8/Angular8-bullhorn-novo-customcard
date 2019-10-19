import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private httpClient: HttpClient) { }

  /**
   * get contract list
   */
  getContractList(data) {
    const params = new HttpParams()
      .set("appCode", data.appCode)
      .set("UserID", data.UserID)
      .set("CorporationID", data.CorporationID)
      .set("EntityID", data.EntityID);
    // .set("EntityType", "Client")
    // .set("PrivateLabelID", data.PrivateLabelID)
    // .set("timestamp", "1565726859")
    // .set("nonce", "6546235082831348")
    // .set("authCode", "ITM90miRtYPm8PWJeYBJKm918W0")
    // .set(
    //   "currentBullhornUrl",
    //   "https://app.bullhornstaffing.com/content/record/ClientCorporation/8/overview"
    // );

    return new Promise((resolve, reject) => {
      this.httpClient
        .get(
          environment.api_url,
          {
            responseType: "json",
            params
          }
        )
        .subscribe(
          res => {
            resolve(res);
          },
          error => {
            resolve(error.error.message);
          }
        );
    });
  }

  /**
   * get contract template list
   */
  getContractTemplateList(data: any) {
    const params = new HttpParams()
      .set("action", "contractTemplateList")
      .set("appCode", data.appCode)
      .set("UserID", data.UserID)
      .set("CorporationID", data.CorporationID)
      .set("EntityID", data.EntityID);

    return new Promise((resolve, reject) => {
      this.httpClient
        .get(
          environment.api_url,
          {
            responseType: "json",
            params
          }
        )
        .subscribe(
          res => {
            resolve(res);
          },
          error => {
            resolve(error.error.message);
          }
        );
    });
  }

  /**
   * Add a new contract
   */
  addNewContract(data: any) {
    const params = new HttpParams()
      .set("action", "contractAdd")
      .set("appCode", data.appCode)
      .set("UserID", data.UserID)
      .set("CorporationID", data.CorporationID)
      .set("EntityID", data.EntityID)
      .set("templateID", data.contractTemplate)
      .set("contractName", data.contractName)
      .set("effectiveDate", data.effectiveDate)
      .set("expirationDate", data.expirationDate);
    // console.log("-----------********", params);
    return new Promise((resolve, reject) => {
      this.httpClient
        .get(
          environment.api_url,
          {
            responseType: "json",
            params
          }
        )
        .subscribe(
          res => {
            resolve(res);
          },
          error => {
            resolve(error.error.message);
          }
        );
    });
  }

  /**
   * Add a new contract from placement
   */
  addNewContractFromPlacement(data: any) {
    const params = new HttpParams()
      .set("templates", data.templates)
      .set("CorporationID", data.CorporationID)
      .set("action", "contractAdd")
      .set("appCode", "BwYKBQ8GBAcLAQUCBAoIAQ")
      .set("k", data.k);
    return new Promise((resolve, reject) => {
      this.httpClient
        .get(
          environment.api_url,
          {
            responseType: "json",
            params
          }
        )
        .subscribe(
          res => {
            resolve(res);
          },
          error => {
            resolve(error.error.message);
          }
        );
    });
  }

  /**
   * get party list
   */
  getPartyList(data) {
    const params = new HttpParams()
      .set("CorporationID", data.CorporationID)
      .set("UserID", data.UserID)
      .set("EntityID", data.EntityID)
      .set("action", "addFromPlacement")
      .set("appCode", data.appCode);
    return new Promise((resolve, reject) => {
      this.httpClient
        .get(
          environment.api_url,
          {
            responseType: "json",
            params
          }
        )
        .subscribe(
          res => {
            resolve(res);
          },
          error => {
            resolve(error.error.message);
          }
        );
    });
  }

  /**
   * get party list by the selected company
   */
  getSelectedPartyList(selectedParams) {
    const params = new HttpParams()
      .set("CorporationID", selectedParams.CorporationID)
      .set("action", "addFromPlacement")
      .set("appCode", "BwYKBQ8GBAcLAQUCBAoIAQ")
      .set("EntityID", selectedParams.EntityID);
    return new Promise((resolve, reject) => {
      this.httpClient
        .get(
          environment.api_url,
          {
            responseType: "json",
            params
          }
        )
        .subscribe(
          res => {
            resolve(res);
          },
          error => {
            resolve(error.error.message);
          }
        );
    });
  }

  /**
   * go to company
   */
  companyLink(data: any) {
    const params = new HttpParams()
      .set("action", "companyLink")
      .set("appCode", data.appCode)
      .set("UserID", data.UserID)
      .set("CorporationID", data.CorporationID)
      .set("EntityID", data.EntityID)
      .set("id", data.partyId)
      .set("name", data.selectedCompany);
    return new Promise((resolve, reject) => {
      this.httpClient
        .get(
          environment.api_url,
          {
            responseType: "json",
            params
          }
        )
        .subscribe(
          res => {
            resolve(res);
          },
          error => {
            resolve(error.error.message);
          }
        );
    });
  }

  /**
   * add new company
   */
  companyAdd(data: any) {
    const params = new HttpParams()
      .set("action", "companyAdd")
      .set("appCode", data.appCode)
      .set("UserID", data.UserID)
      .set("CorporationID", data.CorporationID)
      .set("EntityID", data.EntityID)
      .set("name", data.name);
    return new Promise((resolve, reject) => {
      this.httpClient
        .get(
          environment.api_url,
          {
            responseType: "json",
            params
          }
        )
        .subscribe(
          res => {
            resolve(res);
          },
          error => {
            resolve(error.error.message);
          }
        );
    });
  }
}
