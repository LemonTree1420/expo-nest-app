import AsyncStorage from "@react-native-async-storage/async-storage";
import getEnvVars from "../../environment";
const { asyncStorageTokenName } = getEnvVars();

export const tokenValidateHandler = async (setWorker: any, navigation: any) => {
  const token = (await AsyncStorage.getItem(asyncStorageTokenName)) as string;
  if (!token) {
    await AsyncStorage.removeItem(asyncStorageTokenName);
    setWorker(null);
    return navigation.replace("noToken", { screen: "signIn" });
  } else return token;
};

export const onSignOutHandler = async (setWorker: any, navigation: any) => {
  navigation.replace("noToken", { screen: "signIn" });
  await AsyncStorage.removeItem(asyncStorageTokenName);
  setWorker(null);
};
