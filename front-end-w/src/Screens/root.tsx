import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { API_HEADER } from "../constants/api";
import { workerState } from "../recoil/atoms";
import getEnvVars from "../../environment";
import { tokenValidateHandler } from "../constants/validate";
const { apiUrl, asyncStorageTokenName } = getEnvVars();

export default function Root({ navigation }: any) {
  const setWorker = useSetRecoilState(workerState);

  const validateToken = async () => {
    const token = await tokenValidateHandler(setWorker, navigation);

    return await axios
      .post(`${apiUrl}worker/validate/token`, null, API_HEADER(token))
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
