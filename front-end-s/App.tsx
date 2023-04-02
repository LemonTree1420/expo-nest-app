import { StatusBar } from "expo-status-bar";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import React, { useEffect } from "react";
import { RecoilRoot } from "recoil";
import Navigation from "./navigation";
import { useNetInfo, NetInfoState } from "@react-native-community/netinfo";
import NoNetWork from "./src/Screens/noNetWork";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const internetState: NetInfoState = useNetInfo();

  useEffect(() => {
    setTimeout(async () => await SplashScreen.hideAsync(), 1000);
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
