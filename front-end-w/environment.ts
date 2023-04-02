import Constants from "expo-constants";

const ENV: any = {
  dev: {
    apiUrl: "http://13.209.57.85:9001/",
    asyncStorageTokenName: "@tkw",
    notificationTokenName: "@nts",
  },
  staging: {
    apiUrl: "http://13.209.57.85:9001/",
    asyncStorageTokenName: "@tkw",
    notificationTokenName: "@nts",
  },
  prod: {
    apiUrl: "http://13.209.57.85:9001/",
    asyncStorageTokenName: "@tkw",
    notificationTokenName: "@nts",
  },
};

const getEnvVars = (env = Constants?.manifest?.releaseChannel) => {
  if (__DEV__) {
    return ENV.dev;
  } else if (env === "staging") {
    return ENV.staging;
  } else if (env === "prod") {
    return ENV.prod;
  } else {
    return ENV.prod;
  }
};

export default getEnvVars;
