export const msalConfig = {
    auth: {
      clientId: "a7c1752f-adb0-437f-a95a-0bb44ae8ef58",
      authority: "https://login.microsoftonline.com/common",
      redirectUri: "http://localhost:3000",
    },
    cache: {
      cacheLocation: "sessionStorage", // This configures where your cache will be stored
      storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    }
  };
  
  // Add scopes here for ID token to be used at Microsoft identity platform endpoints.
  export const loginRequest = {
   scopes: ["User.Read", "Calendars.Read", "Calendars.ReadWrite"]
  };
  
  // Add the endpoints here for Microsoft Graph API services you'd like to use.
  export const graphConfig = {
      graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
      graphCalendarEndpoint: "https://graph.microsoft.com/v1.0/me/calendarview?$top=999&startDateTime=2020-01-01T19:00:00-08:00&endDateTime=2022-10-01T19:00:00.00-08:00",
      graphEventEndpoint: "https://graph.microsoft.com/v1.0/me/events",
  };