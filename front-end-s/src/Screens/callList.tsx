import axios from "axios";
import React, { useEffect, useState } from "react";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import { storeState } from "../recoil/atoms";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import getEnvVars from "../../environment";
const { apiUrl } = getEnvVars();
import { API_ERROR, API_HEADER } from "../constants/api";
import { tokenValidateHandler } from "../constants/validate";
import { Alert, FlatList, Pressable, View } from "react-native";
import { moneyComma } from "../constants/regEx";
import Loading from "./loading";

export default function CallList({ navigation }: any) {
  const [store, setStore] = useRecoilState(storeState);
  const [callList, setCallList] = useState<any[]>([]);
  const [listPage, setListPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  const getCallList = async () => {
    const token = await tokenValidateHandler(setStore, navigation);
    return await axios
      .get(
        `${apiUrl}call/store/${store._id}?limit=10&page=${listPage}`,
        API_HEADER(token)
      )
      .then((res) => getCallSuccess(res.data))
      .catch((err) => API_ERROR(err, setStore, navigation));
  };

  const getCallSuccess = (data: any) => {
    setCallList(refresh ? data : callList.concat(data));
    setListPage(listPage + 1);
    setLoading(true);
    setRefresh(false);
  };

  useEffect(() => {
    const focusScreen = navigation.addListener("focus", () => {
      setListPage(0);
      setCallList([]);
      setLoading(false);
    });
    return focusScreen;
  }, [navigation]);

  useEffect(() => {
    if (listPage === 0 && callList.length === 0 && !loading) getCallList();
  }, [listPage, callList, loading]);

  const onRefreshHandler = () => {
    setListPage(0);
    setCallList([]);
    setLoading(false);
    setRefresh(true);
  };

  const onDeleteCallHandler = (id: string) => {
    Alert.alert("", "콜을 마감하시겠습니까?", [
      { text: "확인", onPress: () => onDeleteCallAxios(id) },
      { text: "취소" },
    ]);
  };

  const onDeleteCallAxios = async (id: string) => {
    const token = await tokenValidateHandler(setStore, navigation);
    await axios
      .delete(`${apiUrl}call/delete/${id}`, API_HEADER(token))
      .then((res) => onRefreshHandler())
      .catch((err) => API_ERROR(err, setStore, navigation));
  };

  const renderCallList = ({ item }: any) => (
    <React.Fragment key={item._id}>
      {!item.status && (
        <Pressable
          className="flex-row justify-around items-center bg-white h-28 border-t border-b border-gray-300 px-3"
          onPress={() =>
            navigation.navigate("sub", { screen: "callDetail", params: item })
          }
        >
          <View className="flex justify-center items-center h-4/6 w-4/12">
            <Text className="font-bold text-lg">{item.customerAge} 손님</Text>
            <Text className="font-bold text-gray-600">
              요청 나이 {item.expectedAge}
            </Text>
            <Text className="font-bold text-gray-600">
              요금 {moneyComma(item.fee.toString())}원
            </Text>
          </View>
          <View className="flex justify-center items-center h-4/6 w-5/12">
            <Text className="font-bold text-lg">매칭 인원 수</Text>
            <Text className="text-xl font-bold text-gray-600">
              {item.nowCount}/{item.headCount}
            </Text>
          </View>
          <View className="flex justify-center items-center h-28 w-3/12">
            <Pressable
              className="flex items-center justify-center w-5/6 h-1/2 bg-blue-400 rounded-xl"
              onPress={() => onDeleteCallHandler(item._id)}
            >
              <Text className="font-bold text-white text-xl">마감</Text>
            </Pressable>
          </View>
        </Pressable>
      )}
    </React.Fragment>
  );

  return (
    <SafeAreaView className="flex-1" edges={["left", "right"]}>
      {!loading ? (
        <Loading />
      ) : callList.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <MaterialCommunityIcons
            name="playlist-remove"
            size={80}
            color="#3F3F46"
          />
          <Text className="mt-4 text-lg text-gray-600">
            생성한 콜이 없습니다.
          </Text>
        </View>
      ) : (
        <FlatList
          data={callList}
          renderItem={renderCallList}
          keyExtractor={(item) => item._id}
          onEndReached={getCallList}
          onEndReachedThreshold={1}
          refreshing={refresh}
          onRefresh={onRefreshHandler}
          initialNumToRender={10}
        />
      )}
    </SafeAreaView>
  );
}
