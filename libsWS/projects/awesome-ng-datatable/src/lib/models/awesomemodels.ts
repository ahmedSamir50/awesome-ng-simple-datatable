import { TemplateRef } from "@angular/core";
export class ApiResponse<T> {
    /// <summary>
    /// Gets or sets a value indicating whether confirm.
    /// </summary>
    confirm?: boolean = false;

    /// <summary>
    /// Gets or sets the message.
    /// </summary>
    message?: string = '';

    /// <summary>
    /// Gets or sets the model state errors.
    /// </summary>
    modelStateErrors?: Array<any> = [];

    /// <summary>
    /// Gets or sets a value indicating whether success.
    /// </summary>
    success: boolean = false;
    /// <summary>
    /// Gets or sets the value.
    /// </summary>
    value: T | undefined = undefined;

    correlationId?: string | undefined = undefined;
}


export class GenericTableColumnConfig {
    header: string;
    headerIsTranslationKey?: boolean = true;
    key: string;
    keyAr?: string | null = null;
    suffixKey?: string | null = '';
    colSize?: number | null = 1;
    customCellTemplate: TemplateRef<any>|null = null;
    exportableColumn?: boolean = true;
    position?: ColPositions;
    isId?: boolean;
    hideDetails?: boolean;
    customExportFormateFunction?: (value: any,mainObject: any) => string
    customDisplayFormateFunction?: (value: any,mainObject: any) => string
}

export enum ColPositions {
    details = 'details',
    content = 'content',
    options = 'options',
}

export interface PagerResult {
    totalItems: number,
    currentPage: number,
    pageSize: number,
    totalPages: number,
    startPage: number,
    endPage: number,
    startIndex: number,
    endIndex: number,
    pages: number[]
}

export class ListPagedResultDto<T> {
  items: Array<T> | Array<any>;
  totalRecords: number;
}


export class PagingDto {

  pageNumber?: number = 1;

  pageSize?: number=10;

  isExport?: boolean = false;

  isDescending?: boolean = false;
}

export class PagingDtoGeneric<T> extends PagingDto {
    items?:Array<T> ;

  }


export enum ExportAs {
  // PDF ,
  EXCEL,
  CSV
}


