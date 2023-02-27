import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

export default function CheckToken({ navigation }: any) {
  useEffect(() => {
    const checkAuth = async () => {
      const auth = await AsyncStorage.getItem("@auth");
      if (!auth) return navigation.navigate("signIn");
    };
    checkAuth();
  }, []);

  return null;
}
