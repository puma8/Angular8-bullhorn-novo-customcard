import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AddNewContractComponent } from "./add-new-contract/add-new-contract.component";
import { ListContractsComponent } from "./list-contracts/list-contracts.component";
import { PartyListComponent } from "./party-list/party-list.component";
import { ConnectConfirmation } from "./_helper/connect.confirmation";

const routes: Routes = [
  {
    path: "",
    canActivate: [ConnectConfirmation],
    component: ListContractsComponent
    // redirectTo: "list-contracts",
    // pathMatch: "full"
  },
  {
    path: "list-contracts/:appCode/:CorporationID/:UserID/:EntityID",
    component: ListContractsComponent
  },
  {
    path: "party-list/:appCode/:CorporationID/:UserID/:EntityID/:currentBullhornUrl",
    component: PartyListComponent
  },
  {
    path: "add-new-contract/:appCode/:CorporationID/:UserID/:EntityID",
    component: AddNewContractComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes
      // { enableTracing: true } // <-- debugging purposes only
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
