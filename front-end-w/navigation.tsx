import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Root from "./src/Screens/root";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import Home from "./src/Screens/home";
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
      <Stack.Screen name="휴대폰번호 수정" component={PhoneNumEdit} />
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
      initialRouteName="home"
    >
      <Tab.Screen
        name="home"
        component={Home}
        options={{
          headerTitle: "홈",
          tabBarLabel: "홈",
          tabBarIcon: ({ color, size }) => {
            return <Entypo name="home" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="point"
        component={Point}
        options={{
          headerTitle: "포인트",
          tabBarLabel: "포인트 충전",
          tabBarIcon: ({ color, size }) => {
            return (
              <MaterialCommunityIcons
                name="cash-plus"
                size={size}
                color={color}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="settings"
        component={Settings}
        options={{
          headerTitle: "내 정보",
          tabBarLabel: "내 정보",
          tabBarIcon: ({ color, size }) => {
            return <Feather name="user" size={24} color={color} />;
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
