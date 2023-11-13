// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const apiVersion = 'v1';
export const environment = {
  production: false,
  defaultPageSize: 20,
  maxPageSize: 2147483600,
  version: '1.0.0',
  defaultLanguage: 'ar',
  supportedLanguages: ['en', 'ar'],

  serviceSettings: {
      applicationCacheDetailsStorageKey: 'cacheDetailsMaps',
      allowApiResponseLogs: true,
      allowCacheTillDurationInDays: 1,
      camelizeResponse: true,

  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
