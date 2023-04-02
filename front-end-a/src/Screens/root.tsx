import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { tokenValidateHandler } from "../constants/validate";
import getEnvVars from "../../environment";
import { adminState } from "../recoil/atoms";
import { API_HEADER } from "../constants/api";
const { apiUrl, asyncStorageTokenName } = getEnvVars();

export default function Root({ navigation }: any) {
  const setAdmin = useSetRecoilState(adminState);

  const validateToken = async () => {
    const token = await tokenValidateHandler(setAdmin, navigation);

    return await axios
      .post(`${apiUrl}manager/validate/token`, null, API_HEADER(token))
      .then((res) => validateSuccessHandler(res.data))
      .catch((err) => validateFailHandler());
  };

  const validateSuccessHandler = async (data: any) => {
    await AsyncStorage.setItem(asyncStorageTokenName, data.token);
    delete data.token;
    setAdmin(data);
    return navigation.replace("token", { screen: "pointYetList" });
  };

  const validateFailHandler = async () => {
    navigation.replace("noToken", { screen: "signIn" });
    await AsyncStorage.removeItem(asyncStorageTokenName);
    setAdmin(null);
  };

  useEffect(() => {
    validateToken();
  }, []);

  return null;
}
