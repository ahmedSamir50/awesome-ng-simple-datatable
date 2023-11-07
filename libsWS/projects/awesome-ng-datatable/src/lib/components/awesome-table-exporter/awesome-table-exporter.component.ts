import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { extractDeepPropFromObject } from '../../helpers/helpers';
import { ApiResponse, ExportAs, GenericTableColumnConfig, ListPagedResultDto } from '../../models/awesomemodels';
import { Observable, Subscription, catchError, map } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { saveAs } from 'file-saver';
import { Workbook } from 'exceljs';
import { IconNamesEnum } from 'ngx-bootstrap-icons';
import * as _ from 'underscore';

@Component({
  selector: 'lib-awesome-table-exporter',
  templateUrl: './awesome-table-exporter.component.html',
  styleUrls: ['./awesome-table-exporter.component.css']
})
export class AwesomeTableExporterComponent implements OnInit, OnDestroy {
  public iconNames = IconNamesEnum;
  public ExportAs = ExportAs;
  @Input() isExportable = true;
  @Input() items: Array<any> = [];
  @Input() columnConfigs: Array<GenericTableColumnConfig> = [];
  @Input() ExportAsBtns: Array<ExportAs> = [ExportAs.EXCEL, ExportAs.CSV];
  @Input() exportedDataTitle = 'Awesome Data Table By Ahmed Samir ahmed.samir.abdelaal@gmail.com';
  @Input() isLazyLoading = false;
  @Input() fullDataURLForExportCallbackFunction: () => Observable<ApiResponse<ListPagedResultDto<any>>>;
  @Input() exportURLParameters: Object | null = null;

  private fullExportLazySubscriptions: Subscription[] = [];

  private selectedExportAllOption: 'currentPage' | 'all' = 'currentPage';
  constructor(private translate: TranslateService) { }


  ngOnInit(): void { }


  exportEXCEL(selectedExportOption: 'currentPage' | 'all' = 'currentPage', asCSV = false) {
      this.selectedExportAllOption = selectedExportOption;
      if (this.isExportable) {
          if (
              (this.isLazyLoading && this.fullDataURLForExportCallbackFunction) ||
              (this.fullDataURLForExportCallbackFunction && this.selectedExportAllOption == 'all')
          ) {
              const subscription = this.fullDataURLForExportCallbackFunction().pipe()
                  .pipe(map((res) => {
                      if (res.success && res.value && Array.isArray(res.value?.items)) {
                          this.items = res.value.items;
                          const workbook = new Workbook();
                          const worksheet = workbook.addWorksheet(this.exportedDataTitle);
                          const { arrOfHeaders, arrDataAsTableBody, dataKeys }:
                              { arrOfHeaders: string[]; arrDataAsTableBody: any[]; dataKeys: string[] } =
                              this.getExportTableHeadersAndDataRow();
                          const headersAsExcelColumn = arrOfHeaders.map((hV, hIdx) => ({
                              header: hV, key: dataKeys[hIdx], width: 10, style: { font: { name: 'Arial Black', size: 10 } }
                          }));
                          worksheet.columns = [...headersAsExcelColumn];
                          let rows = [...arrDataAsTableBody];
                          worksheet.addRows(rows, 'n');
                          if (!asCSV) {
                              workbook.xlsx.writeBuffer().then((data) => {
                                  const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                                  saveAs(blob, this.exportedDataTitle + '.xlsx');
                              });
                          }
                          else {
                              workbook.csv.writeBuffer().then((data) => {
                                  const BOM = '\uFEFF'; // fixing ar chars issue
                                  const blob = new Blob([BOM + data], { type: 'text/csv' });
                                  saveAs(blob, this.exportedDataTitle + '.csv');
                              });
                          }
                      }
                  }))
                  .pipe(catchError((err) => { return err; }))
                  .subscribe();
              this.fullExportLazySubscriptions.push(subscription);
          }
          else {
              const workbook = new Workbook();
              const worksheet = workbook.addWorksheet(this.exportedDataTitle);
              const { arrOfHeaders, arrDataAsTableBody, dataKeys }:
                  { arrOfHeaders: string[]; arrDataAsTableBody: any[]; dataKeys: string[] } =
                  this.getExportTableHeadersAndDataRow();
              const headersAsExcelColumn = arrOfHeaders.map((hV, hIdx) => ({
                  header: hV, key: dataKeys[hIdx], width: 10, style: { font: { name: 'Arial Black', size: 10 } }
              }));
              worksheet.columns = [...headersAsExcelColumn];
              let rows = [...arrDataAsTableBody];

              worksheet.addRows(rows, 'n');
              if (!asCSV) {
                  workbook.xlsx.writeBuffer().then((data) => {
                      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                      saveAs(blob, this.exportedDataTitle + '.xlsx');
                  });
              }
              else {

                  workbook.csv.writeBuffer().then((data) => {
                      const BOM = '\uFEFF'; // fixing ar chars issue
                      const blob = new Blob([BOM + data], { type: 'text/csv;charset=utf-8;' });
                      saveAs(blob, this.exportedDataTitle + '.csv');
                  });
              }
          }
      }
  }

  exportAsCSV(selectedExportOption: 'currentPage' | 'all' = 'currentPage') {
      this.exportEXCEL(selectedExportOption, true);
  }

  private getExportTableHeadersAndDataRow() {

      let exportableColumns = this.columnConfigs && this.columnConfigs.length > 0 ?
          this.columnConfigs.filter(exp => exp.exportableColumn??true) :
          Object.keys(this.items[0]).map((k) => { return { key: k, header: k, headerIsTranslationKey: false ,keyAr:null} });
      if (exportableColumns.length == 0)
          exportableColumns = this.columnConfigs;

      const arrKeys = [... new Set([...exportableColumns.map(x => {
          if (x.keyAr && this.translate.currentLang == 'ar')
              return x.keyAr
          else return x.key;
      })])];
      const arrOfHeaders = exportableColumns.map((x) => { if (arrKeys.includes(x.key)) { return !x.headerIsTranslationKey ? x.header : this.translate.instant(x.header); } });
      const arrData:any[] = [];
      this.items.forEach(elem => {
          const obj = {};
          arrKeys.forEach((prop, _idx) => {
              if (elem[prop])
                  if (prop.toLocaleLowerCase() == 'status')
                      {//@ts-ignore
                        obj[prop] = this.extractSimpleProp( elem , prop) ? this.translate.instant('Active') : this.translate.instant('InActive');}
                  else
                     { //@ts-ignore
                      obj[prop] = this.extractSimpleProp( elem , prop);}
              else if (prop.includes('.') && this.extractDeepProp(elem, prop))
                  if (prop.toLocaleLowerCase() == 'status')
                     { //@ts-ignore
                      obj[prop] = this.extractDeepProp(elem, prop) ? this.translate.instant('Active') : this.translate.instant('InActive');}
                  else
                      {//@ts-ignore
                        obj[prop] = this.extractDeepProp(elem, prop);}
              else
                 { //@ts-ignore
                  obj[prop] = '';}
              const hasCustomFormate = this.columnConfigs.find(x => x.key == prop)?.customExportFormateFunction;
              if (hasCustomFormate && typeof (hasCustomFormate) == typeof (Function)) { try { //@ts-ignore
                obj[prop] = hasCustomFormate(obj[prop],elem); } catch (err) { } }
          });
          if (!_.isEqual(obj, {}))
              arrData.push(obj);
      });
      const arrDataAsTableBody: Array<any> = arrData ? arrData.map((dt) => Object.values(dt)) : [];
      return { arrOfHeaders, arrDataAsTableBody, dataKeys: arrKeys };
  }

  btnIsDisplayed(exportAsBtn: ExportAs) {
      return this.ExportAsBtns.filter(x => x == exportAsBtn).length > 0;
  }

  ngOnDestroy(): void {
      if (this.fullExportLazySubscriptions && this.fullExportLazySubscriptions.length > 0)
          this.fullExportLazySubscriptions.map((sub) => sub.unsubscribe());
  }

  // PropX.BrNameEn||PropX.BrNameAr
  extractDeepProp(object: any, propName: string): any {
    let returnVal ='';
    if(propName.includes('||')){
      try{
        returnVal = extractDeepPropFromObject(object, propName.split('||')[0]);
      }
      catch{
        returnVal = extractDeepPropFromObject(object, propName.split('||')[1]);
      }
    }
    else returnVal = extractDeepPropFromObject(object, propName);
    return returnVal;
  }
  extractSimpleProp( object: any, propName: string){
    let returnVal ='';
    if(propName.includes('||')){
        returnVal =  object.hasOwnProperty(propName.split('||')[0] ) ?
        object[propName.split('||')[0]] :
        object.hasOwnProperty(propName.split('||')[1] )?  object[propName.split('||')[1]] : undefined;
    }
    else returnVal = object[propName];
    return returnVal;
  }
}
