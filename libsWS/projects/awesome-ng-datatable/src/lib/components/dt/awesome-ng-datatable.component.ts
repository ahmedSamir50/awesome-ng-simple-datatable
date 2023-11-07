import { DatePipe } from '@angular/common';
import {
    Component, DoCheck, EventEmitter, Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    TemplateRef,
    ViewChild, ViewEncapsulation
} from '@angular/core';
import '../../helpers/arrayExtensions';

import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import {GenericTableColumnConfig , ExportAs , ApiResponse , ListPagedResultDto, PagerResult} from '../../models/awesomemodels'
import { PagerService } from '../../services/pager.service';
import { extractDeepPropFromObject } from '../../helpers/helpers';

@Component({
    selector: 'awesome-ng-dataTable-component',
    templateUrl: './awesome-ng-datatable.component.html',
    styleUrls: ['./awesome-ng-datatable.component.css'],
    encapsulation: ViewEncapsulation.Emulated,
})
export class AwesomeNgDataTableComponent implements OnInit, OnChanges, DoCheck {
    @Input() columnConfigs: Array<GenericTableColumnConfig> = [];
    @Input() ExportAsBtns: Array<ExportAs> = [ExportAs.EXCEL, ExportAs.CSV];
    @Input() tableItems: Array<any>;
    @Input() isExportable = false;
    @Input() dataTitle = 'Awesome Data Table By Ahmed Samir ahmed.samir.abdelaal@gmail.com';
    @Input() showDataTitle = true;
    @Input() isLazyLoading = false;
    @Input() pagerPageSize = 10;
    @Input() totalItemsCountIfLazyloading = 0;
    @Input() showTotalItemsCount = true;
    @Input() fullDataURLForExportCallbackFunction: () => Observable<ApiResponse<ListPagedResultDto<any>>>;
    @Input() showDateTimeWhenFormattingDates = false;
    @Input() datePipePreviewFormate = 'd MMMM y';
    @Input() showDefaultOptionsColumn = false;
    @Input() displayActions: Array<'view' | 'edit' | 'delete'>;
    @Input() enableSelection = false;
    @Input() appendToHeaderInlineTemplate: TemplateRef<any>|null = null;
    @Input() emptyListMessage = "NoItemsFound";
    @Output() onTableRowClicked = new EventEmitter<any>();
    @Output() onDefaultOptionsColumnClicked = new EventEmitter<any>();
    @Output() onTablePageChanged = new EventEmitter<PagerResult>();
    @Output() onTablePageSizeChanged = new EventEmitter<number>();

    innerWidth: number;
    mobileListCol: GenericTableColumnConfig[];
    showOptions: boolean;
    @ViewChild('customCellTemplate', { static: true }) customCellTemplate!: TemplateRef<any>;
    @ViewChild('cardCustomCellTemplate', { static: true }) cardCustomCellTemplate!: TemplateRef<any>;

    @Input() stringifyArrayObjectValues = true;
    @Input() distinctStringifiedArrayObjectValues = true;
    selectedRow: any;
    currentViewItems: Array<any> = [];
    currentPage: number = 1;
    constructor(private pagerService: PagerService, private translate: TranslateService) { }
    ngOnInit() {
        this.datePipePreviewFormate = !this.showDateTimeWhenFormattingDates ? 'd MMMM y' : 'd MMMM y , h:mm a';
        if (this.showDefaultOptionsColumn && !this.displayActions) {
            this.displayActions = ['view', 'edit', 'delete'];
        }
        if (!this.isLazyLoading) this.totalItemsCountIfLazyloading = this.tableItems?.length;
        if (this.tableItems?.length > 0) {
            const pager = this.pagerService.getPager(this.isLazyLoading ?
                this.totalItemsCountIfLazyloading : this.tableItems?.length,
                this.currentPage, this.tableItems?.length > 0 ? this.pagerPageSize : 0);

            this.currentViewItems = this.tableItems?.arraySkip(pager.startIndex).arrayTake((pager.endIndex + 1) - pager.startIndex)
        }
    }


    ngDoCheck() {
        this.ngOnInit();
    }


    tableRowClicked(row:object) {
        this.onTableRowClicked.emit(row);
    }

    extractDeepProp(object: any, propName: string): any {
        let returnVal = '';
        if (propName.includes('||')) {
            try {
                returnVal = extractDeepPropFromObject(object, propName.split('||')[0]);
                if (!returnVal)
                    returnVal = extractDeepPropFromObject(object, propName.split('||')[1]);
            }
            catch {
                returnVal = extractDeepPropFromObject(object, propName.split('||')[1]);
            }
        }
        else returnVal = extractDeepPropFromObject(object, propName);
        // if the values is array of values concatenate them
        if (returnVal && Array.isArray(returnVal) && this.stringifyArrayObjectValues)
            return this.distinctStringifiedArrayObjectValues ? [...new Set(returnVal)].join(' , ') : returnVal.join(' , ');

        return returnVal;
    }
    extractSimpleProp(object: any, propName: string) {
        let returnVal = '';
        if (propName.includes('||')) {
            returnVal = object.hasOwnProperty(propName.split('||')[0]) ?
                object[propName.split('||')[0]] ?
                    object[propName.split('||')[0]] :
                    object.hasOwnProperty(propName.split('||')[1]) ? object[propName.split('||')[1]] : undefined :
                object.hasOwnProperty(propName.split('||')[1]) ? object[propName.split('||')[1]] : undefined;
        }
        else returnVal = object[propName];
        const hasCustomFormate = this.columnConfigs.find(x => x.key == propName)?.customDisplayFormateFunction;
        if (hasCustomFormate && typeof (hasCustomFormate) == typeof (Function)) { try { returnVal = hasCustomFormate(returnVal,object); } catch (err) { } }

        return returnVal;
    }

    onDefaultOptionsColumnClick(sender: any) {
        this.onDefaultOptionsColumnClicked.emit(sender);
    }

    onPageChanged(pageEvent: number) {

        this.currentPage = pageEvent;
        const pager = this.pagerService.getPager(this.isLazyLoading ?
            this.totalItemsCountIfLazyloading : this.tableItems?.length,
            this.currentPage, this.pagerPageSize);
        this.currentViewItems = this.tableItems?.arraySkip(pager.startIndex).arrayTake((pager.endIndex + 1) - pager.startIndex);
        console.log(pager);
        if (this.isLazyLoading) {
            this.onTablePageChanged.emit(pager);
        }
    }

    /**
     *
     * @param pageEvent
     * you should reset the current page to 1 from your side
     */
    onPageSizeChanged(pageEvent: number) {
        this.pagerPageSize = pageEvent;
        if (!this.isLazyLoading)
            this.setCurrentViewItemsFromTableItems();
        this.onTablePageSizeChanged.emit(pageEvent);
    }

    getDatePropFormatted(row:object, colKey:string, deepProp = false, colSuffix:string|null = null) {
        const propVal = deepProp ? this.extractDeepProp(row, colKey) : this.extractSimpleProp(row, colKey);
        try {
            let dateVal = new DatePipe(this.translate.currentLang).transform(propVal, this.datePipePreviewFormate);
            // too old date / invalided date / < year 1000
            if (new Date(propVal).getFullYear() < 1000)
                dateVal = '-';

            return colSuffix && colSuffix?.length > 1 ? `${dateVal} ${this.translate.instant(colSuffix)}` : dateVal;
        } catch (error) {
            return propVal;
        }

    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.tableItems) {
            this.setCurrentViewItemsFromTableItems();
            if (!this.isLazyLoading) this.totalItemsCountIfLazyloading = this.tableItems?.length;
        }
    }

    getTableViewItems(): Array<any> {
        this.setCurrentViewItemsFromTableItems();
        return this.currentViewItems??[];
    }

    setCurrentViewItemsFromTableItems() {
        const pager = this.pagerService.getPager(this.isLazyLoading ?
            this.totalItemsCountIfLazyloading : this.tableItems?.length,
            this.currentPage, this.pagerPageSize);
        if (!this.isLazyLoading)
            this.currentViewItems = this.tableItems?.arraySkip(pager.startIndex).arrayTake((pager.endIndex + 1) - pager.startIndex);
        else
            this.currentViewItems = Array.from([...this.tableItems]);
    }

    getTotalItemsCount(){
        return this.isLazyLoading ?this.totalItemsCountIfLazyloading : (this.tableItems?.length??0);
    }


}
