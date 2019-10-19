import { Component, OnInit, NgZone } from "@angular/core";
// Vendor
import {
  FormUtils,
  TextBoxControl,
  DateControl,
  SelectControl,
  FieldInteractionApi
} from "novo-elements";
import { ApiService } from "../services/api.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-add-new-contract",
  templateUrl: "./add-new-contract.component.html",
  styleUrls: ["./add-new-contract.component.scss"]
})
export class AddNewContractComponent implements OnInit {
  public contractOrganizationControl: any;
  public contractTemplateControl: any;
  public contractNameControl: any;
  public effectiveDateControl: any;
  public expirationDateControl: any;
  public textForm: any;
  public isLoading: boolean = true;
  public responseData: any = [];
  public contractTemplate: any = [];
  public contractTemplateOptions: any = [];
  public quertyString: any = [];

  constructor(
    private apiService: ApiService,
    private formUtils: FormUtils,
    private route: ActivatedRoute,
    private router: Router,
    private api: FieldInteractionApi
  ) { }
  ngOnInit(): void {
    document.body.className = "zoom-out";
    this.quertyString = this.route.snapshot.params;

    this.contractOrganizationControl = new SelectControl({
      key: "organization",
      type: "select",
      dataType: "String",
      label: "Organization",
      // tooltip: "Organization",
      placeholder: "Select...",
      options: [
        { label: 'Bullhorn Demo', value: '2' },
        { label: 'CoLabs', value: '1' }
      ],
      required: true
    });

    // console.log(this.quertyString);
    // getContractTemplateList
    this.apiService.getContractTemplateList(this.quertyString).then(res => {
      this.responseData = res;
      this.contractTemplate = this.responseData.data;
      if (this.contractTemplate) {
        this.contractTemplate.forEach((element: any, index: any) => {
          this.contractTemplateOptions.push({
            label: element.templateName,
            value: index + 1
          });
        });
      } else {
        this.contractTemplateOptions = [];
      }
      this.isLoading = false;
    });

    this.contractTemplateControl = new SelectControl({
      key: "contractTemplate",
      type: "select",
      dataType: "String",
      label: "Contract Template",
      // tooltip: "Contract Template",
      placeholder: "Select...",
      options: this.contractTemplateOptions,
      required: true
    });

    this.contractNameControl = new TextBoxControl({
      key: "contractName",
      label: "Contract Name",
      // tooltip: "Contract Name",
      required: true
    });

    const effectiveDateScript = (API: FieldInteractionApi) => {
      console.log("----effective date:", API.currentKey);
      const effectiveDate = this.getCustomDate(API.getActiveValue());
      API.form.controls.expirationDate.startDate = new Date(effectiveDate);
    };
    this.effectiveDateControl = new DateControl({
      key: "effectiveDate",
      allowInvalidDate: false,
      dateFormat: "M/D/YYYY",
      type: "date",
      // tooltip: "Effective Date",
      label: "Effective Date",
      // startDate: new Date(),
      required: true,
      interactions: [
        {
          event: "change",
          script: effectiveDateScript,
          invokeOnInit: true
        }
      ]
    });

    const expirationDateScript = (API: FieldInteractionApi) => {
      const expirationDate = this.getCustomDate(API.getActiveValue());
      API.form.controls.effectiveDate.endDate = new Date(expirationDate);
    };
    this.expirationDateControl = new DateControl({
      key: "expirationDate",
      allowInvalidDate: false,
      type: "date",
      dateFormat: "M/D/YYYY",
      // tooltip: "Expiration Date",
      label: "Expiration Date",
      // startDate: new Date(),
      required: true,
      interactions: [
        {
          event: "change",
          script: expirationDateScript,
          invokeOnInit: true
        }
      ]
    });

    this.textForm = this.formUtils.toFormGroup([
      this.contractOrganizationControl,
      this.contractTemplateControl,
      this.contractNameControl,
      this.effectiveDateControl,
      this.expirationDateControl
    ]);
  }

  save(form) {
    // submit code
    if (!form.isValid) {
      // console.log("invalid form:", form);
      // form.showOnlyRequired(true);
      // if (form.value.contractName === "") {
      //   window.alert("CONTRACT NAME is required field!");
      // } else if (form.value.contractTemplate === "") {
      //   window.alert("CONTRACT TEMPLATE is required field!");
      // } else if (form.value.effectiveDate === "") {
      //   window.alert("EFFECTIVE DATE is required field!");
      // } else if (form.value.expirationDate === "") {
      //   window.alert("EXPIRATION DATE is required field!");
      // }
    } else {
      let effectiveDateStr = form.value.effectiveDate;
      let expirationDateStr = form.value.expirationDate;
      effectiveDateStr = this.getCustomDate(effectiveDateStr);
      expirationDateStr = this.getCustomDate(expirationDateStr);
      const params = {
        contractName: form.value.contractName,
        contractTemplate: form.value.contractTemplate,
        effectiveDate: effectiveDateStr,
        expirationDate: expirationDateStr,
        appCode: this.quertyString.appCode,
        CorporationID: this.quertyString.CorporationID,
        UserID: this.quertyString.UserID,
        EntityID: this.quertyString.EntityID
      };
      this.apiService.addNewContract(params).then(res => {
        if (res) {
          this.router.navigate([
            "/list-contracts",
            this.quertyString.appCode,
            this.quertyString.CorporationID,
            this.quertyString.UserID,
            this.quertyString.EntityID
          ]);
        }
      });
    }
  }

  getCustomDate(date: any): string {
    const dateTemp = new Date(date);
    const dateStr: string =
      dateTemp.getMonth() +
      1 +
      "/" +
      dateTemp.getDate() +
      "/" +
      dateTemp.getFullYear();
    return dateStr;
  }

  goToListContracts(): void {
    this.router.navigate([
      "/list-contracts",
      this.quertyString.appCode,
      this.quertyString.CorporationID,
      this.quertyString.UserID,
      this.quertyString.EntityID
    ]);
  }
}
