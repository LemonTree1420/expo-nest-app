import Constants from "expo-constants";

const ENV: any = {
  dev: {
    apiUrl: "http://13.209.57.85:9001/",
    asyncStorageTokenName: "@tks",
    pushNotificationUrl: "https://app.nativenotify.com/api/indie/notification",
    pushNotificationAppId: 6966,
    pushNotificationAppToken: "5AFyHR9a0QxPtoqgcmNmWl",
  },
  staging: {
    apiUrl: "http://13.209.57.85:9001/",
    asyncStorageTokenName: "@tks",
    pushNotificationUrl: "https://app.nativenotify.com/api/indie/notification",
    pushNotificationAppId: 6966,
    pushNotificationAppToken: "5AFyHR9a0QxPtoqgcmNmWl",
  },
  prod: {
    apiUrl: "http://13.209.57.85:9001/",
    asyncStorageTokenName: "@tks",
    pushNotificationUrl: "https://app.nativenotify.com/api/indie/notification",
    pushNotificationAppId: 6966,
    pushNotificationAppToken: "5AFyHR9a0QxPtoqgcmNmWl",
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
