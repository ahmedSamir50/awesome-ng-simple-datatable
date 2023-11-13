import { NgModule } from '@angular/core';
import { AwesomeNgDataTableComponent } from './components/dt/awesome-ng-datatable.component';
import { AwesomeTableExporterComponent } from './components/awesome-table-exporter/awesome-table-exporter.component';
import { CommonModule } from '@angular/common';
import { TableActionsTdComponent } from './components/table-actions-td/table-actions-td.component';
import { AwesomePagerComponent } from './components/awesome-pager/awesome-pager.component';
import { FormsModule } from '@angular/forms';
import { PagerService } from './services/pager.service';


@NgModule({
  declarations: [
    AwesomeNgDataTableComponent,
    AwesomeTableExporterComponent,
    TableActionsTdComponent,
    AwesomePagerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
    AwesomeNgDataTableComponent
  ],
  providers:[PagerService]
})
export class AwesomeNgDataTableModule { }
