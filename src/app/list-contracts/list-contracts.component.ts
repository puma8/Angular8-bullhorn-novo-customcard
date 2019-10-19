import { Component, OnInit } from "@angular/core";

import { ApiService } from "src/app/services";
import { LinkCellComponent } from "./extras/link-cell.component";
import { Router, ActivatedRoute } from "@angular/router";

/**
 * @title Rows Data Table Example
 */
@Component({
  selector: "app-list-contracts",
  templateUrl: "./list-contracts.component.html",
  styleUrls: ["./list-contracts.component.scss"]
})
export class ListContractsComponent implements OnInit {
  public contractList: any = [];
  public isLoading: boolean = true;
  private tableData: any = [];
  // Table configuration
  public configuration: any = {
    columns: [
      {
        name: "name",
        title: "NAME"
      },
      {
        name: "type",
        title: "TYPE"
      },
      {
        name: "status",
        title: "STATUS"
      },
      {
        title: "LINK",
        name: "link",
        renderer: LinkCellComponent,
        sorting: false
      }
    ],
    rows: this.tableData,
    config: {
      paging: {
        current: 1,
        itemsPerPage: 10,
        onPageChange: event => {
          this.configuration.config.paging.current = event.page;
          this.configuration.config.paging.itemsPerPage = event.itemsPerPage;
        }
      },
      sorting: true
    }
  };

  public responseData: any = [];
  public queryString: any = [];

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    document.body.className = "zoom-out";
  }

  ngOnInit(): void {
    this.queryString = this.route.snapshot.params;
    console.log(this.queryString);
    this.apiService.getContractList(this.queryString).then(res => {
      // console.log(res);
      if (res) {
        this.responseData = res;
        this.queryString = this.responseData.query_string;
        // this.templateID = res.te
        this.contractList = this.responseData.data;
        for (const iterator of this.contractList) {
          this.tableData.push({
            name: iterator.Name,
            type: iterator["Contract Type"],
            status: iterator.Status,
            link: iterator.Uri
          });
        }
        this.isLoading = false;
      }
    });
  }

  goToNewContract() {
    this.router.navigate([
      "/add-new-contract",
      this.queryString.appCode,
      this.queryString.CorporationID,
      this.queryString.UserID,
      this.queryString.EntityID
    ]);
  }

  goToIntelAgree() {
    const url: string =
      // "https://preview.intelagree.com/Party/Edit/" + this.responseData.ia_id;
      "https://preview.intelagree.com/Contract/Search?searchCondition=Party+Name+is+" + this.responseData.ia_name_encoded;
    window.open(url);
  }
}
