import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import { Octicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Divider, Text } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import { useRecoilState } from "recoil";
import { workerState } from "../recoil/atoms";
import axios from "axios";
import { API_HEADER } from "../constants/api";
import { Alert } from "react-native";
import getEnvVars from "../../environment";
import { onSignOutHandler, tokenValidateHandler } from "../constants/validate";
const { apiUrl } = getEnvVars();

export default function Settings({ navigation }: any) {
  const [worker, setWorker] = useRecoilState(workerState);

  const onReConfirmHandler = () => {
    Alert.alert(
      "회원탈퇴",
      "회원 탈퇴 시 서비스에 설정된 모든 데이터가 삭제됩니다.\n\n- 보유 중인 포인트도 삭제됩니다.\n\n 정말 탈퇴하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        { text: "탈퇴", onPress: onWithDrawalHandler },
      ]
    );
  };
  const onWithDrawalHandler = async () => {
    const token = await tokenValidateHandler(setWorker, navigation);
    await axios
      .delete(
        `${apiUrl}worker/delete/${worker._id}`,
        API_HEADER(token as string)
      )
      .then((res) =>
        Alert.alert("", "회원탈퇴가 완료되었습니다.", [
          {
            text: "확인",
            onPress: () => navigation.replace("noToken", { screen: "signIn" }),
          },
        ])
      )
      .catch((err) => {
        if (err.response.status === 401) {
          Alert.alert("", "인증 세션이 만료되었습니다.\n다시 로그인하세요.", [
            {
              text: "확인",
              onPress: async () =>
                await onSignOutHandler(setWorker, navigation),
            },
          ]);
        }
        console.error(err);
      });
  };

  return (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      className="flex-1 items-center space-between"
    >
      <View
        className="flex justify-center items-center w-full bg-blue-600 h-4/6 scale-x-150 overflow-hidden"
        style={{
          borderBottomStartRadius: 200,
          borderBottomEndRadius: 200,
        }}
      >
        <View
          className="flex items-center"
          style={{ transform: [{ scaleX: 0.666 }] }}
        >
          <View className="h-44 w-44 flex justify-center items-center rounded-full shadow shadow-black bg-white">
            <View className="h-40 w-40 flex justify-center items-center rounded-full shadow shadow-black bg-white">
              <FontAwesome5 name="user-alt" size={96} color="#3F3F46" />
            </View>
          </View>
          <View className="flex items-center mt-2">
            <Text className="text-3xl font-bold text-white">
              {worker?.userId}
            </Text>
            <Text className="text-xl font-bold text-white">
              {`${worker?.age}대`}
            </Text>
          </View>
          <Divider className="w-24 divide-white mt-4 mb-8" />
          <View className="flex-row items-center">
            <Text className="text-xl font-bold text-white">
              {worker?.cellPhoneNumber}
            </Text>
            <Feather
              style={{ marginLeft: 12 }}
              name="edit"
              size={20}
              color="#fff"
              onPress={() =>
                navigation.navigate("sub", { screen: "phoneNumEdit" })
              }
            />
          </View>
        </View>
      </View>
      <View className="absolute bottom-12 w-full h-auto">
        <TableView style={styles.table} appearance="light">
          <Section header="서비스" hideSurroundingSeparators>
            <Cell
              contentContainerStyle={styles.cell}
              cellStyle="RightDetail"
              title="로그아웃"
              cellAccessoryView={
                <Octicons
                  name="sign-out"
                  size={24}
                  color="#3F3F46"
                  onPress={async () =>
                    await onSignOutHandler(setWorker, navigation)
                  }
                />
              }
              titleTextStyle={styles.cellTitle}
              titleTextColor={"#3F3F46"}
              rightDetailColor={"#3F3F46"}
              hideSeparator
            />
            <Cell
              contentContainerStyle={styles.cell}
              cellStyle="RightDetail"
              title="회원탈퇴"
              cellAccessoryView={
                <FontAwesome5
                  name="user-minus"
                  size={24}
                  color="#3F3F46"
                  onPress={onReConfirmHandler}
                />
              }
              titleTextStyle={styles.cellTitle}
              titleTextColor={"#3F3F46"}
              rightDetailColor={"#3F3F46"}
              hideSeparator
            />
          </Section>
        </TableView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  table: {
    width: "100%",
  },
  cell: {
    backgroundColor: "inherit",
    paddingTop: 3,
    paddingBottom: 3,
  },
  cellTitle: {
    fontWeight: "bold",
  },
});
