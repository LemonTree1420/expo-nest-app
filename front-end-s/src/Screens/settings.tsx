import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import { Octicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Text } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import { useRecoilState } from "recoil";
import { storeState } from "../recoil/atoms";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { tks } from "../constants/asyncStorage";
import axios from "axios";
import { API_HEADER, API_URL } from "../constants/api";
import { Alert } from "react-native";

export default function Settings({ navigation }: any) {
  const [store, setStore] = useRecoilState(storeState);
  console.log("@@@", store);

  const onSignOutHandler = async () => {
    await AsyncStorage.removeItem(tks);
    setStore(null);
    navigation.replace("noToken", { screen: "signIn" });
  };

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
    const token = await AsyncStorage.getItem(tks);
    await axios
      .delete(
        `${API_URL}store/delete/${store._doc._id}`,
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
              onPress: onSignOutHandler,
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
      <View className="relative w-full bg-blue-600 pt-4 pb-32">
        <View className="absolute top-4 left-1/2 transform -translate-x-10 z-10">
          <View className="h-20 w-20 flex justify-center items-center rounded-full shadow shadow-black bg-white">
            <FontAwesome5 name="user-alt" size={48} color="#3F3F46" />
          </View>
        </View>
        <View className="absolute top-14 left-1/2 transform -translate-x-40 bg-white rounded-md w-80 pt-12 pb-6 flex items-center">
          <Text className="text-lg font-bold text-zinc-600 mt-1">
            {store?.name}
          </Text>
          <Text className="text-lg font-bold text-zinc-400">
            {store?.region}
          </Text>
        </View>
      </View>
      <View className="absolute bottom-12 w-full h-auto">
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
              title="업체명"
              detail={store?.name}
              titleTextColor={"#3F3F46"}
              rightDetailColor={"#3F3F46"}
              titleTextStyle={styles.cellTitle}
              hideSeparator
            />
            <Cell
              contentContainerStyle={styles.cell}
              cellStyle="RightDetail"
              title="주소"
              detail={`${store?.address1}, ${store?.address2}`}
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
                  onPress={onSignOutHandler}
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
