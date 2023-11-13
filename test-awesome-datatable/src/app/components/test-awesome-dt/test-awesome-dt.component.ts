import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { GenericTableColumnConfig } from '../../../../../libsWS/projects/awesome-ng-datatable/src/lib/models/awesomemodels';


@Component({
  selector: 'app-test-awesome-dt',
  templateUrl: './test-awesome-dt.component.html',
  styleUrls: ['./test-awesome-dt.component.css']
})
export class TestAwesomeDTComponent implements OnInit {
  citiesTableConfig: Array<GenericTableColumnConfig> = [];
  @ViewChild('actionsCelTemp', { static: true })
  actionsCelTemp!: TemplateRef<any>;
  selectedLanguage = 'ar';
  items:Array<any> = [];
  ngOnInit(): void {

    this.citiesTableConfig = [
      { header: 'Lookups.CityName', key: "nameAr", customCellTemplate: null },
      { header: 'region.regionName', key: this.selectedLanguage == "ar" ? "region.nameAr" : "region.nameEn", customCellTemplate: null },
      {
        header: 'Actions', key: "id",
        customCellTemplate: this.actionsCelTemp
      },
    ];
    this.items = [{
      nameAr: 'مدينه ',
      region: { nameAr: "منطقة", nameEn: 'region1' }
    }];
  }
}
