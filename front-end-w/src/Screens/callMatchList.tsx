import axios from "axios";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import { MaterialIcons } from "@expo/vector-icons";
import getEnvVars from "../../environment";
import { API_ERROR, API_HEADER } from "../constants/api";
import { moneyComma } from "../constants/regEx";
import { tokenValidateHandler } from "../constants/validate";
import { workerState } from "../recoil/atoms";
import Loading from "./loading";
const { apiUrl } = getEnvVars();

export default function CallMatchList({ navigation }: any) {
  const [worker, setWorker] = useRecoilState(workerState);
  const [callList, setCallList] = useState<any[]>([]);
  const [listPage, setListPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  const getMatchCallList = async () => {
    const token = await tokenValidateHandler(setWorker, navigation);
    return await axios
      .get(
        `${apiUrl}call/match/${worker.cellPhoneNumber}?age=${worker.age}&limit=10&page=${listPage}`,
        API_HEADER(token)
      )
      .then((res) => getMatchCallListSuccess(res.data))
      .catch((err) => API_ERROR(err, setWorker, navigation));
  };

  const getMatchCallListSuccess = (data: any) => {
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
    if (listPage === 0 && callList.length === 0 && !loading) getMatchCallList();
  }, [listPage, callList, loading]);

  const onRefreshHandler = () => {
    setListPage(0);
    setCallList([]);
    setLoading(false);
    setRefresh(true);
  };

  const renderCallList = ({ item }: any) => (
    <Pressable
      key={item._id}
      className="flex-row items-center h-28 border-t border-b border-gray-300 px-3 bg-white"
      onPress={() =>
        navigation.navigate("sub", { screen: "callMatchDetail", params: item })
      }
    >
      <View className="flex flex-wrap justify-center items-center h-4/6 w-3/12 bg-blue-600 rounded-xl px-2">
        <Text className="font-bold text-white text-center">{item.region}</Text>
      </View>
      <View className="flex justify-center items-start h-4/6 w-6/12 pl-10">
        <Text className="font-bold text-lg">{item.customerAge}대 손님</Text>
        <Text className="font-bold text-gray-600">
          요청 나이 {item.expectedAge}대
        </Text>
        <Text className="font-bold text-gray-600">
          요청 인원 수 {item.headCount}명{item.memo}
        </Text>
        <Text className="font-bold">
          &#8361; {moneyComma(item.fee.toString())}
        </Text>
      </View>
      <View className="flex justify-center items-center h-4/6 w-3/12">
        <Text
          className={`text-xl font-bold ${
            item.status ? "text-red-400" : "text-green-400"
          }`}
        >
          {item.status ? "마감" : "모집 중"}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1" edges={["left", "right"]}>
      {!loading ? (
        <Loading />
      ) : callList.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <MaterialIcons name="search-off" size={80} color="#3F3F46" />
          <Text className="mt-4 text-lg text-gray-600">
            매칭 콜 리스트가 없습니다.
          </Text>
        </View>
      ) : (
        <FlatList
          data={callList}
          renderItem={renderCallList}
          keyExtractor={(item) => item._id}
          onEndReached={getMatchCallList}
          onEndReachedThreshold={1}
          refreshing={refresh}
          onRefresh={onRefreshHandler}
          initialNumToRender={10}
        />
      )}
    </SafeAreaView>
  );
}
