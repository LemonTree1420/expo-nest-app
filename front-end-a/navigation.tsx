import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FontAwesome5 } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import Root from "./src/Screens/root";
import SignIn from "./src/Screens/signIn";
import PointYetList from "./src/Screens/pointYetList";
import PointEndList from "./src/Screens/pointEndList";
import Settings from "./src/Screens/settings";
import BankEdit from "./src/Screens/bankEdit";
import AccountHolderEdit from "./src/Screens/accountHolderEdit";
import AccountNumberEdit from "./src/Screens/accountNumberEdit";

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
        name="bankEdit"
        component={BankEdit}
        options={{ headerTitle: "은행 수정" }}
      />
      <Stack.Screen
        name="accountHolderEdit"
        component={AccountHolderEdit}
        options={{ headerTitle: "예금주 수정" }}
      />
      <Stack.Screen
        name="accountNumberEdit"
        component={AccountNumberEdit}
        options={{ headerTitle: "계좌번호 수정" }}
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
      initialRouteName="pointYetList"
    >
      <Tab.Screen
        name="pointYetList"
        component={PointYetList}
        options={{
          headerTitle: "포인트 요청 리스트",
          tabBarLabel: "포인트 요청 리스트",
          tabBarIcon: ({ color, size }) => {
            return <FontAwesome5 name="list" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="pointEndList"
        component={PointEndList}
        options={{
          headerTitle: "포인트 완료 리스트",
          tabBarLabel: "포인트 완료 리스트",
          tabBarIcon: ({ color, size }) => {
            return (
              <FontAwesome5 name="calendar-check" size={size} color={color} />
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
