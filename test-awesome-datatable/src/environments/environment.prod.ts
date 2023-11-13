const apiVersion = 'v1';

export const environment = {

    production: true,
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
