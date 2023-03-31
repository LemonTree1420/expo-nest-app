import { Alert } from "react-native";
import { onSignOutHandler } from "./validate";

export const API_HEADER = (token: string) => {
  const header = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return header;
};

export const API_ERROR = (err: any, setStore: any, navigation: any) => {
  if (err.response.status === 401) {
    Alert.alert("", "인증 세션이 만료되었습니다.\n다시 로그인하세요.", [
      {
        text: "확인",
        onPress: () => onSignOutHandler(setStore, navigation),
      },
    ]);
  }
};
