import Constants from "expo-constants";

const ENV: any = {
  dev: {
    apiUrl: "http://13.209.57.85:9001/",
    asyncStorageTokenName: "@tks",
    pushNotificationUrl: "https://app.nativenotify.com/api/indie/notification",
    pushNotificationAppId: 6973,
    pushNotificationAppToken: "km10STqzVOMfvoHqchEskm",
    pushNotificationAdminId: "admin1234",
  },
  staging: {
    apiUrl: "http://13.209.57.85:9001/",
    asyncStorageTokenName: "@tks",
    pushNotificationUrl: "https://app.nativenotify.com/api/indie/notification",
    pushNotificationAppId: 6973,
    pushNotificationAppToken: "km10STqzVOMfvoHqchEskm",
    pushNotificationAdminId: "admin1234",
  },
  prod: {
    apiUrl: "http://13.209.57.85:9001/",
    asyncStorageTokenName: "@tks",
    pushNotificationUrl: "https://app.nativenotify.com/api/indie/notification",
    pushNotificationAppId: 6973,
    pushNotificationAppToken: "km10STqzVOMfvoHqchEskm",
    pushNotificationAdminId: "admin1234",
  },
};

const getEnvVars = (env = Constants?.manifest?.releaseChannel) => {
  if (__DEV__) {
    return ENV.dev;
  } else if (env === "staging") {
    return ENV.staging;
  } else if (env === "prod") {
    return ENV.prod;
  }
};

export default getEnvVars;
