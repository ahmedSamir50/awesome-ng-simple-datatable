import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'lib-table-actions-td',
  templateUrl: './table-actions-td.component.html',
  styleUrls: ['./table-actions-td.component.css']
})
export class TableActionsTdComponent {

  @Input()tdItem :any;
  @Output()onBtnClickCallBack= new EventEmitter<any>();
  @Input()displayActions:Array<'view'|'edit'|'delete'>  = ['view' , 'edit', 'delete'  ];

  displayActionsIncludes(action:'view'|'edit'|'delete'){
   return this.displayActions && this.displayActions?.includes(action);
  }

  btnClicked(sender: 'view'|'edit'|'delete'){
    this.onBtnClickCallBack.emit({clickedItem: this.tdItem ,action: sender});
  }

}
