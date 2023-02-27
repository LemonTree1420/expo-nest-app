import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./src/Screens/home";
import List from "./src/Screens/list";
import SignIn from "./src/Screens/signIn";
import { Entypo } from "@expo/vector-icons";
import { useRecoilState, useRecoilValue } from "recoil";
import { tokenState } from "./src/recoil/atoms";
import { useEffect } from "react";

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const token = useRecoilValue(tokenState);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: "#0E86D4",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerTitleAlign: "center",
          headerBackVisible: false,
          headerLeft: () => (
            <Entypo
              name="menu"
              size={24}
              color="white"
              onPress={() => {
                alert("메뉴 버튼");
              }}
            />
          ),
        }}
        initialRouteName={token ? "home" : "signIn"}
      >
        <Stack.Screen
          name="signIn"
          component={SignIn}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="home"
          component={Home}
          options={{ title: "My Home" }}
        />
        <Stack.Screen name="list" component={List} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
