import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import axios from "axios";
import { TokenResponse } from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../configure";
import CheckToken from "./checkToken";
import { useRecoilState, useSetRecoilState } from "recoil";
// import { profileSelector } from "../recoil/selectors";
import JWT from "expo-jwt";
import { tokenState } from "../recoil/atoms";

export default function SignIn({ navigation }: any) {
  WebBrowser.maybeCompleteAuthSession();

  const setToken = useSetRecoilState(tokenState);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "992837967174-utl893655tkbmbgpg21gdmcqt4avdh9i.apps.googleusercontent.com",
    webClientId:
      "992837967174-utl893655tkbmbgpg21gdmcqt4avdh9i.apps.googleusercontent.com",
    // scopes: ["email","profile", "openid", "https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"]
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      signInHandler(authentication);
    }
  }, [response]);

  const signInHandler = async (authentication: TokenResponse | null) => {
    await axios
      .post(API_URL + "auth/sign", authentication)
      .then((res) => signInSuccess(res))
      .catch((err) => console.error(err));
  };

  const signInSuccess = async (res: any) => {
    setToken(res.data);
    return navigation.navigate("home");
  };

  return (
    <>
      <CheckToken navigation={navigation} />
      <View className="flex-1 items-center justify-center bg-black">
        <TouchableOpacity
          disabled={!request}
          onPress={() => {
            promptAsync();
          }}
        >
          <Image source={require("../../assets/btn_google.png")} />
        </TouchableOpacity>
      </View>
    </>
  );
}
