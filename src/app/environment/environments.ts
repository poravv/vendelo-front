export const environment = {
    production: false,
    apiUrl: 'https://kc.mindtechpy.net/admin/realms/realm_vendelo',
    //serverUrl: 'http://localhost:3000/vendelo/api',
    serverUrl: 'https://back.mindtechpy.net/dolce/vendelo/api',
    keycloakConfig: {
        clientId:"client-vendelo",
        issuer: 'https://kc.mindtechpy.net/realms/realm_vendelo',
        tokenEndpoint: 'https://kc.mindtechpy.net/realms/realm_vendelo/protocol/openid-connect/token',
        responseType: 'code',
        scope: 'openid profile',
        showDebugInformation: true,
    }
  };
