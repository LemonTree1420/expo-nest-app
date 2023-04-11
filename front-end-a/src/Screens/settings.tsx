import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import { Octicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import { useRecoilState } from "recoil";
import { adminState } from "../recoil/atoms";
import axios from "axios";
import { API_ERROR, API_HEADER } from "../constants/api";
import { Alert } from "react-native";
import getEnvVars from "../../environment";
import { onSignOutHandler, tokenValidateHandler } from "../constants/validate";
const { apiUrl } = getEnvVars();

export default function Settings({ navigation }: any) {
  const [admin, setAdmin] = useRecoilState(adminState);

  const onReConfirmHandler = () => {
    Alert.alert(
      "회원탈퇴",
      "회원 탈퇴 시 서비스에 설정된 모든 데이터가 삭제됩니다.\n\n 정말 탈퇴하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        { text: "탈퇴", onPress: onWithDrawalHandler },
      ]
    );
  };
  const onWithDrawalHandler = async () => {
    const token = await tokenValidateHandler(setAdmin, navigation);
    await axios
      .delete(
        `${apiUrl}manager/delete/${admin._id}`,
        API_HEADER(token as string)
      )
      .then((res) => onWithDrawalSuccess())
      .catch((err) => API_ERROR(err, setAdmin, navigation));
  };

  const onWithDrawalSuccess = () => {
    Alert.alert("", "회원탈퇴가 완료되었습니다.", [
      {
        text: "확인",
        onPress: () => navigation.replace("noToken", { screen: "signIn" }),
      },
    ]);
  };

  return (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      className="flex-1 items-center justify-between"
    >
      <View
        className="flex justify-center items-center w-full bg-blue-600 h-1/2 scale-x-150 overflow-hidden"
        style={{
          borderBottomStartRadius: 200,
          borderBottomEndRadius: 200,
        }}
      >
        <View
          className="flex items-center"
          style={{ transform: [{ scaleX: 0.666 }] }}
        >
          <View className="h-40 w-40 flex justify-center items-center rounded-full shadow shadow-black bg-white">
            <View className="h-36 w-36 flex justify-center items-center rounded-full shadow shadow-black bg-white">
              <MaterialIcons
                name="admin-panel-settings"
                size={80}
                color="#3F3F46"
              />
            </View>
          </View>
          <View className="flex items-center mt-4">
            <Text className="text-2xl font-bold text-white">
              {admin.role === "master" ? "관리자 계정" : admin.userId}
            </Text>
          </View>
        </View>
      </View>
      <View className="flex items-center justify-end w-full h-1/2 pb-4">
        <TableView style={styles.table} appearance="light">
          {admin.role === "master" && (
            <Section header="회원정보" hideSurroundingSeparators>
              <Cell
                contentContainerStyle={styles.cell}
                cellStyle="RightDetail"
                title="은행"
                detail={admin?.bank}
                cellAccessoryView={
                  <Feather
                    style={{ marginLeft: 12 }}
                    name="edit"
                    size={20}
                    color="#6F6F76"
                    onPress={() =>
                      navigation.navigate("sub", { screen: "bankEdit" })
                    }
                  />
                }
                titleTextColor={"#3F3F46"}
                rightDetailColor={"#3F3F46"}
                titleTextStyle={styles.cellTitle}
                hideSeparator
              />
              <Cell
                contentContainerStyle={styles.cell}
                cellStyle="RightDetail"
                title="예금주"
                detail={admin?.accountHolder}
                cellAccessoryView={
                  <Feather
                    style={{ marginLeft: 12 }}
                    name="edit"
                    size={20}
                    color="#6F6F76"
                    onPress={() =>
                      navigation.navigate("sub", {
                        screen: "accountHolderEdit",
                      })
                    }
                  />
                }
                titleTextColor={"#3F3F46"}
                rightDetailColor={"#3F3F46"}
                titleTextStyle={styles.cellTitle}
                hideSeparator
              />
              <Cell
                contentContainerStyle={styles.cell}
                cellStyle="RightDetail"
                title="계좌번호"
                detail={admin?.accountNumber}
                cellAccessoryView={
                  <Feather
                    style={{ marginLeft: 12 }}
                    name="edit"
                    size={20}
                    color="#6F6F76"
                    onPress={() =>
                      navigation.navigate("sub", {
                        screen: "accountNumberEdit",
                      })
                    }
                  />
                }
                titleTextColor={"#3F3F46"}
                rightDetailColor={"#3F3F46"}
                titleTextStyle={styles.cellTitle}
                hideSeparator
              />
            </Section>
          )}
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
                    await onSignOutHandler(setAdmin, navigation)
                  }
                />
              }
              titleTextStyle={styles.cellTitle}
              titleTextColor={"#3F3F46"}
              rightDetailColor={"#3F3F46"}
              hideSeparator
            />
            {admin.role === "normal" && (
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
            )}
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
