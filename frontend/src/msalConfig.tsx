import { Configuration } from "@azure/msal-browser";

export const msalConfig: Configuration = {
    auth: {
        clientId: "72a45e05-f5e2-477e-a5ab-5336525ad39a", // Replace with your client ID from Azure AD
        authority: "https://login.microsoftonline.com/a89793c3-6c27-4c6a-8140-8a1742571cb3", // Replace with your tenant ID
        redirectUri: "/", // Make sure this matches Azure Portal settings
    },
    cache: {
        cacheLocation: "localStorage", // Options: "localStorage" or "sessionStorage"
        storeAuthStateInCookie: false, // Set to "true" if you have issues on IE11 or Edge
    }
};
