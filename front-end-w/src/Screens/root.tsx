import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { API_HEADER } from "../constants/api";
import { workerState } from "../recoil/atoms";
import { tokenValidateHandler } from "../constants/validate";
import getEnvVars from "../../environment";
const { apiUrl, asyncStorageTokenName, notificationTokenName } = getEnvVars();

export default function Root({ navigation }: any) {
  const setWorker = useSetRecoilState(workerState);

  const validateToken = async () => {
    const token = await tokenValidateHandler(setWorker, navigation);
    const notificationToken = await AsyncStorage.getItem(notificationTokenName);
    const data = {
      notificationToken,
    };
    return await axios
      .post(`${apiUrl}worker/validate/token`, data, API_HEADER(token))
      .then((res) => validateSuccessHandler(res.data))
      .catch((err) => validateFailHandler());
  };

  const validateSuccessHandler = async (data: any) => {
    await AsyncStorage.setItem(asyncStorageTokenName, data.token);
    delete data.token;
    setWorker(data);
    return navigation.replace("token", { screen: "callList" });
  };

  const validateFailHandler = async () => {
    navigation.replace("noToken", { screen: "signIn" });
    await AsyncStorage.removeItem(asyncStorageTokenName);
    setWorker(null);
  };

  useEffect(() => {
    validateToken();
  }, []);

  return null;
}
