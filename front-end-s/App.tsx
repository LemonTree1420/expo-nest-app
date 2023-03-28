import { StatusBar } from "expo-status-bar";
import { Provider as PaperProvider } from "react-native-paper";
import React from "react";
import { RecoilRoot } from "recoil";
import Navigation from "./navigation";
import { useNetInfo, NetInfoState } from "@react-native-community/netinfo";
import NoNetWork from "./src/Screens/noNetWork";
import * as Notifications from "expo-notifications";
import registerNNPushToken from "native-notify";
import getEnvVars from "./environment";
const { pushNotificationAppId, pushNotificationAppToken } = getEnvVars();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const internetState: NetInfoState = useNetInfo();
  registerNNPushToken(pushNotificationAppId, pushNotificationAppToken);

  return (
    <RecoilRoot>
      <React.Suspense>
        <PaperProvider>
          {internetState.isConnected ? <Navigation /> : <NoNetWork />}
          <StatusBar style="auto" />
        </PaperProvider>
      </React.Suspense>
    </RecoilRoot>
  );
}
