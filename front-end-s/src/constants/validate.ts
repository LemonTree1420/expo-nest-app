import AsyncStorage from "@react-native-async-storage/async-storage";
import getEnvVars from "../../environment";
const { asyncStorageTokenName } = getEnvVars();

export const tokenValidateHandler = async (setStore: any, navigation: any) => {
  const token = (await AsyncStorage.getItem(asyncStorageTokenName)) as string;
  if (!token) {
    await AsyncStorage.removeItem(asyncStorageTokenName);
    setStore(null);
    return navigation.replace("noToken", { screen: "signIn" });
  } else return token;
};

export const onSignOutHandler = async (setStore: any, navigation: any) => {
  await AsyncStorage.removeItem(asyncStorageTokenName);
  setStore(null);
  navigation.replace("noToken", { screen: "signIn" });
};
