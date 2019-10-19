import { Component, Input } from '@angular/core';
import { BaseRenderer } from 'novo-elements';
import { Variable } from '@angular/compiler/src/render3/r3_ast';

/**
 * @title Link Cell Cpmponent
 */
@Component({
    selector: 'app-link-cell',
    template: `
      <a href="{{link}}" target="_blank">View in IntelAgree</a>
    `,
})
export class LinkCellComponent extends BaseRenderer {

  link: string;
  constructor() {
    super();
  }
  ngOnInit(): void {
    this.link = this.data.link;
  }

  getActionContext(data, meta) {
    return { item: data, meta };
  }
}
