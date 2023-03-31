import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Root from "./src/Screens/root";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SignIn from "./src/Screens/signIn";
import SignUp from "./src/Screens/signUp";
import FindIdStepOne from "./src/Screens/findIdStepOne";
import FindIdStepTwo from "./src/Screens/findIdStepTwo";
import FindPwStepOne from "./src/Screens/findPwStepOne";
import FindPwStepTwo from "./src/Screens/findPwStepTwo";
import FindPwStepThree from "./src/Screens/findPwStepThree";
import Point from "./src/Screens/point";
import Settings from "./src/Screens/settings";
import PhoneNumEdit from "./src/Screens/phoneNumEdit";
import { Pressable } from "react-native";
import CallRegion from "./src/Screens/callRegion";
import CallList from "./src/Screens/callList";
import CallDetail from "./src/Screens/callDetail";
import CallMatchDetail from "./src/Screens/callMatchDetail";
import CallMatchList from "./src/Screens/callMatchList";
import PointChargeList from "./src/Screens/pointChargeList";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function NoToken({ navigation }: any) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#2563EB",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTitleAlign: "center",
        headerBackVisible: false,
        headerRight: () => (
          <Ionicons
            name="close"
            size={32}
            color="#fff"
            onPress={() => {
              navigation.pop();
            }}
          />
        ),
      }}
      initialRouteName={"signIn"}
    >
      <Stack.Screen
        name="signIn"
        component={SignIn}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="signUp"
        component={SignUp}
        options={{
          headerTitle: "회원가입",
        }}
      />
      <Stack.Screen
        name="findIdStepOne"
        component={FindIdStepOne}
        options={{
          headerTitle: "아이디 찾기",
        }}
      />
      <Stack.Screen
        name="findIdStepTwo"
        component={FindIdStepTwo}
        options={{
          headerTitle: "아이디 찾기",
        }}
      />
      <Stack.Screen
        name="findPwStepOne"
        component={FindPwStepOne}
        options={{
          headerTitle: "비밀번호 찾기",
        }}
      />
      <Stack.Screen
        name="findPwStepTwo"
        component={FindPwStepTwo}
        options={{
          headerTitle: "비밀번호 재설정",
        }}
      />
      <Stack.Screen
        name="findPwStepThree"
        component={FindPwStepThree}
        options={{
          headerTitle: "비밀번호 재설정",
          headerRight: () => null,
        }}
      />
    </Stack.Navigator>
  );
}

function SubScreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: "#2563EB",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="phoneNumEdit"
        component={PhoneNumEdit}
        options={{ headerTitle: "휴대폰 번호 수정" }}
      />
      <Stack.Screen
        name="callRegion"
        component={CallRegion}
        options={{ headerTitle: "지역 선택" }}
      />
      <Stack.Screen
        name="callDetail"
        component={CallDetail}
        options={{ headerTitle: "콜 정보" }}
      />
      <Stack.Screen
        name="callMatchDetail"
        component={CallMatchDetail}
        options={{
          headerTitle: "매칭 콜 정보",
        }}
      />
      <Stack.Screen
        name="pointChargeList"
        component={PointChargeList}
        options={{
          headerTitle: "포인트 충전 내역",
        }}
      />
    </Stack.Navigator>
  );
}

function TokenBottom() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#2563EB",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTitleAlign: "center",
        tabBarStyle: {
          backgroundColor: "#2563EB",
        },
        tabBarActiveTintColor: "#fff",
        headerShadowVisible: false,
      }}
      initialRouteName="callList"
    >
      <Tab.Screen
        name="callList"
        component={CallList}
        options={({ navigation }) => ({
          headerTitle: "콜 리스트",
          tabBarLabel: "콜 리스트",
          tabBarIcon: ({ color, size }) => {
            return <FontAwesome5 name="list" size={size} color={color} />;
          },
          headerRight: () => (
            <Pressable
              className="px-4"
              onPress={() =>
                navigation.navigate("sub", { screen: "callRegion" })
              }
            >
              <FontAwesome5 name="map-marked" size={24} color="#fff" />
            </Pressable>
          ),
        })}
      />
      <Tab.Screen
        name="callMatchList"
        component={CallMatchList}
        options={{
          headerTitle: "매칭 리스트",
          tabBarLabel: "매칭 리스트",
          tabBarIcon: ({ color, size }) => {
            return (
              <FontAwesome5 name="calendar-check" size={size} color={color} />
            );
          },
        }}
      />
      <Tab.Screen
        name="point"
        component={Point}
        options={({ navigation }) => ({
          headerTitle: "포인트",
          tabBarLabel: "포인트 충전",
          tabBarIcon: ({ color, size }) => {
            return <FontAwesome5 name="coins" size={size} color={color} />;
          },
          // headerLeft: () => (
          //   <Pressable
          //     className="px-4"
          //     onPress={
          //       () => {}
          //       // navigation.navigate("sub", { screen: "callRegion" })
          //     }
          //   >
          //     <MaterialCommunityIcons
          //       name="account-cash"
          //       size={24}
          //       color="#fff"
          //     />
          //   </Pressable>
          // ),
          headerRight: () => (
            <Pressable
              className="px-4"
              onPress={() =>
                navigation.navigate("sub", { screen: "pointChargeList" })
              }
            >
              <Fontisto name="shopping-basket-add" size={24} color="#fff" />
            </Pressable>
          ),
        })}
      />
      <Tab.Screen
        name="settings"
        component={Settings}
        options={{
          headerTitle: "내 정보",
          tabBarLabel: "내 정보",
          tabBarIcon: ({ color, size }) => {
            return <FontAwesome5 name="user-alt" size={24} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="root"
      >
        <Stack.Screen name="root" component={Root} />
        <Stack.Screen
          name="noToken"
          component={NoToken}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="token" component={TokenBottom} />
        <Stack.Screen name="sub" component={SubScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
