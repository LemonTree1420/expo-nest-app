import { StatusBar } from "expo-status-bar";
import React from "react";
import { RecoilRoot } from "recoil";
import Navigation from "./navigation";

export default function App() {
  return (
    <RecoilRoot>
      <React.Suspense>
        <Navigation />
        <StatusBar style="auto" />
      </React.Suspense>
    </RecoilRoot>
  );
}
