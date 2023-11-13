import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from '@env/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AwesomeNgDataTableModule} from '../../../libsWS/projects/awesome-ng-datatable/src/lib/awesome-ng-datatable.module'
import { TestAwesomeDTComponent } from './components/test-awesome-dt/test-awesome-dt.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CommonModule, } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { registerLocaleData } from '@angular/common';

import localeArExtra from '@angular/common/locales/extra/ar-SA';

import localeEn from '@angular/common/locales/en';
import localeAr from '@angular/common/locales/ar-SA';

registerLocaleData(localeEn, 'en');
registerLocaleData(localeAr, 'ar', localeArExtra);

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    AppComponent,
    TestAwesomeDTComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    AwesomeNgDataTableModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  })
  ],
  providers: [TranslateService],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(private readonly translate: TranslateService) {
    let currentLanguage = localStorage.getItem('language');
    this.translate.addLangs(environment.supportedLanguages)
    this.translate.setDefaultLang(environment.defaultLanguage);

    const langToSet = currentLanguage ?? environment.defaultLanguage
    if (!currentLanguage) {
        localStorage.setItem('language', langToSet);
        currentLanguage = langToSet;
    }
    this.translate.use(langToSet);

}
}
