export const environment = {
    production: false,
    apiUrl: 'https://kc.mindtechpy.net/admin/realms/Academic',
    serverUrl: 'http://localhost:4001/api',
    keycloakConfig: {
        clientId:"client-academic",
        issuer: 'https://kc.mindtechpy.net/realms/Academic',
        tokenEndpoint: 'https://kc.mindtechpy.net/realms/Academic/protocol/openid-connect/token',
        responseType: 'code',
        scope: 'openid profile',
        showDebugInformation: true,
        clave: 'R8QDxlT5BmeBoyw9KPXtMqjcD2P5DzCJ',
    }
  };
