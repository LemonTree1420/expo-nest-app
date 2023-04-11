import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FindIdStepOne from "./src/Screens/findIdStepOne";
import FindPwStepOne from "./src/Screens/findPwStepOne";
import CallList from "./src/Screens/callList";
import Settings from "./src/Screens/settings";
import SignIn from "./src/Screens/signIn";
import SignUp from "./src/Screens/signUp";
import Point from "./src/Screens/point";
import PhoneNumEdit from "./src/Screens/phoneNumEdit";
import Root from "./src/Screens/root";
import FindIdStepTwo from "./src/Screens/findIdStepTwo";
import FindPwStepTwo from "./src/Screens/findPwStepTwo";
import FindPwStepThree from "./src/Screens/findPwStepThree";
import { Text } from "react-native-paper";
import { Pressable } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import CallDetail from "./src/Screens/callDetail";
import AddCall from "./src/Screens/addCall";
import CallEndList from "./src/Screens/callEndList";
import CallEndDetail from "./src/Screens/callEndDetail";
import PointChargeList from "./src/Screens/pointChargeList";
import PointAccountInput from "./src/Screens/pointAccountInput";

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
        name="addCall"
        component={AddCall}
        options={{ headerTitle: "콜 추가" }}
      />
      <Stack.Screen
        name="callDetail"
        component={CallDetail}
        options={{ headerTitle: "콜 정보" }}
      />
      <Stack.Screen
        name="callEndDetail"
        component={CallEndDetail}
        options={{ headerTitle: "마감된 콜 정보" }}
      />
      {/* <Stack.Screen
        name="pointChargeList"
        component={PointChargeList}
        options={{
          headerTitle: "포인트 충전 내역",
        }}
      /> */}
      <Stack.Screen
        name="pointAccountInput"
        component={PointAccountInput}
        options={{
          headerTitle: "계좌 정보 입력",
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
              onPress={() => navigation.navigate("sub", { screen: "addCall" })}
            >
              <Text className="text-white font-bold text-lg">추가</Text>
            </Pressable>
          ),
        })}
      />
      <Tab.Screen
        name="callEndList"
        component={CallEndList}
        options={{
          headerTitle: "마감 리스트",
          tabBarLabel: "마감 리스트",
          tabBarIcon: ({ color, size }) => {
            return (
              <FontAwesome5 name="calendar-check" size={size} color={color} />
            );
          },
        }}
      />
      {/* <Tab.Screen
        name="point"
        component={Point}
        options={({ navigation }) => ({
          headerTitle: "포인트",
          tabBarLabel: "포인트 충전",
          tabBarIcon: ({ color, size }) => {
            return <FontAwesome5 name="coins" size={size} color={color} />;
          },
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
      /> */}
      <Tab.Screen
        name="settings"
        component={Settings}
        options={{
          headerTitle: "내 정보",
          tabBarLabel: "내 정보",
          tabBarIcon: ({ color, size }) => {
            return <FontAwesome5 name="user-alt" size={size} color={color} />;
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
