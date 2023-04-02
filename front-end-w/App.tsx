import { StatusBar } from "expo-status-bar";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import React, { useEffect } from "react";
import { RecoilRoot } from "recoil";
import Navigation from "./navigation";
import { useNetInfo, NetInfoState } from "@react-native-community/netinfo";
import NoNetWork from "./src/Screens/noNetWork";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import getEnvVars from "./environment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerForPushNotificationsAsync } from "./src/constants/notification";

const { notificationTokenName } = getEnvVars();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

SplashScreen.preventAutoHideAsync();

export default function App() {
  const internetState: NetInfoState = useNetInfo();

  useEffect(() => {
    registerForPushNotificationsAsync().then(async (token) => {
      await AsyncStorage.setItem(notificationTokenName, token as string);
      await SplashScreen.hideAsync();
    });
  }, []);

  return (
    <RecoilRoot>
      <React.Suspense>
        <PaperProvider theme={DefaultTheme}>
          {internetState.isConnected ? <Navigation /> : <NoNetWork />}
          <StatusBar style="auto" />
        </PaperProvider>
      </React.Suspense>
    </RecoilRoot>
  );
}
