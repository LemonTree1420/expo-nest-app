import { StatusBar } from "expo-status-bar";
import { Provider as PaperProvider } from "react-native-paper";
import React, { useEffect } from "react";
import { RecoilRoot } from "recoil";
import Navigation from "./navigation";
import { useNetInfo, NetInfoState } from "@react-native-community/netinfo";
import NoNetWork from "./src/Screens/noNetWork";
import * as SplashScreen from "expo-splash-screen";

export default function App() {
  const internetState: NetInfoState = useNetInfo();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

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
