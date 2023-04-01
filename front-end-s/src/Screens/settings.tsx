import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import { Octicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Divider, Text } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import { useRecoilState } from "recoil";
import { storeState } from "../recoil/atoms";
import axios from "axios";
import { API_ERROR, API_HEADER } from "../constants/api";
import { Alert } from "react-native";
import getEnvVars from "../../environment";
import { onSignOutHandler, tokenValidateHandler } from "../constants/validate";
const { apiUrl } = getEnvVars();

export default function Settings({ navigation }: any) {
  const [store, setStore] = useRecoilState(storeState);

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
    const token = await tokenValidateHandler(setStore, navigation);
    await axios
      .delete(
        `${apiUrl}store/delete/${store._doc._id}`,
        API_HEADER(token as string)
      )
      .then((res) => onWithDrawalSuccess())
      .catch((err) => API_ERROR(err, setStore, navigation));
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
        className="flex justify-center items-center w-full bg-blue-600 h-1/4 scale-x-150 overflow-hidden"
        style={{
          borderBottomStartRadius: 200,
          borderBottomEndRadius: 200,
        }}
      >
        <View
          className="flex items-center"
          style={{ transform: [{ scaleX: 0.666 }] }}
        >
          <View className="h-20 w-20 flex justify-center items-center rounded-full shadow shadow-black bg-white">
            <View className="h-16 w-16 flex justify-center items-center rounded-full shadow shadow-black bg-white">
              <FontAwesome5 name="home" size={30} color="#3F3F46" />
            </View>
          </View>
          <View className="flex items-center mt-2">
            <Text className="text-xl font-bold text-white">{store?.name}</Text>
            <Text className="text-lg font-bold text-white">
              {store?.region}
            </Text>
          </View>
        </View>
      </View>
      <View className="flex items-center justify-end w-full h-2/3 pb-4">
        <TableView style={styles.table} appearance="light">
          <Section header="회원정보" hideSurroundingSeparators>
            <Cell
              contentContainerStyle={styles.cell}
              cellStyle="RightDetail"
              title="휴대폰번호"
              detail={store?.cellPhoneNumber}
              cellAccessoryView={
                <Feather
                  style={{ marginLeft: 12 }}
                  name="edit"
                  size={20}
                  color="#6F6F76"
                  onPress={() =>
                    navigation.navigate("sub", { screen: "phoneNumEdit" })
                  }
                />
              }
              titleTextColor={"#3F3F46"}
              rightDetailColor={"#3F3F46"}
              titleTextStyle={styles.cellTitle}
              hideSeparator
            />
          </Section>
          <Section header="업체정보" hideSurroundingSeparators>
            <Cell
              contentContainerStyle={styles.cell}
              cellStyle="RightDetail"
              title="주소"
              detail={store?.address1}
              titleTextColor={"#3F3F46"}
              rightDetailColor={"#3F3F46"}
              titleTextStyle={styles.cellTitle}
              hideSeparator
            />
            <Cell
              contentContainerStyle={styles.cell}
              cellStyle="RightDetail"
              title="상세 주소"
              detail={store?.address2}
              titleTextColor={"#3F3F46"}
              rightDetailColor={"#3F3F46"}
              titleTextStyle={styles.cellTitle}
              hideSeparator
            />
            <Cell
              contentContainerStyle={styles.cell}
              cellStyle="RightDetail"
              title="전화번호"
              detail={store?.phoneNumber}
              titleTextColor={"#3F3F46"}
              rightDetailColor={"#3F3F46"}
              titleTextStyle={styles.cellTitle}
              hideSeparator
            />
          </Section>
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
                    await onSignOutHandler(setStore, navigation)
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
