import { StatusBar } from "expo-status-bar";
import { Provider as PaperProvider } from "react-native-paper";
import React from "react";
import { RecoilRoot } from "recoil";
import Navigation from "./navigation";
import { useNetInfo, NetInfoState } from "@react-native-community/netinfo";
import NoNetWork from "./src/Screens/noNetWork";
import registerNNPushToken from "native-notify";

export default function App() {
  const internetState: NetInfoState = useNetInfo();
  registerNNPushToken(6966, "5AFyHR9a0QxPtoqgcmNmWl");

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
