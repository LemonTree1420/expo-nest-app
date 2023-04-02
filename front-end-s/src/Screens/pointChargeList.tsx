import axios from "axios";
import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import { MaterialIcons } from "@expo/vector-icons";
import getEnvVars from "../../environment";
import { API_ERROR, API_HEADER } from "../constants/api";
import { moneyComma } from "../constants/regEx";
import { tokenValidateHandler } from "../constants/validate";
import { storeState } from "../recoil/atoms";
import Loading from "./loading";
import dayjs from "dayjs";
const { apiUrl } = getEnvVars();

export default function PointChargeList({ navigation }: any) {
  const [store, setStore] = useRecoilState(storeState);
  const [pointList, setPointList] = useState<any[]>([]);
  const [listPage, setListPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  const getPointChargeList = async () => {
    const token = await tokenValidateHandler(setStore, navigation);
    return await axios
      .get(
        `${apiUrl}point/request/${store._id}?limit=10&page=${listPage}`,
        API_HEADER(token)
      )
      .then((res) => getPointChargeSuccess(res.data))
      .catch((err) => API_ERROR(err, setStore, navigation));
  };

  const getPointChargeSuccess = (data: any) => {
    setPointList(refresh ? data : pointList.concat(data));
    setListPage(listPage + 1);
    setLoading(true);
    setRefresh(false);
  };

  useEffect(() => {
    const focusScreen = navigation.addListener("focus", () => {
      setListPage(0);
      setPointList([]);
      setLoading(false);
    });
    return focusScreen;
  }, [navigation]);

  useEffect(() => {
    if (listPage === 0 && pointList.length === 0 && !loading)
      getPointChargeList();
  }, [listPage, pointList, loading]);

  const onRefreshHandler = () => {
    setListPage(0);
    setPointList([]);
    setLoading(false);
    setRefresh(true);
  };

  const renderPointList = ({ item }: any) => (
    <View
      key={item._id}
      className="flex-row items-center bg-white h-28 border-t border-b border-gray-300 px-3"
    >
      <View className="flex justify-center items-center h-3/6 w-2/12 bg-blue-600 rounded-full">
        <Text className="font-bold text-white">
          {moneyComma(item.requestPoint.toString())}P
        </Text>
      </View>
      <View className="flex justify-center items-start h-3/6 w-7/12 pl-10">
        <Text className="font-bold text-lg">
          &#8361; {moneyComma(item.depositAmount.toString())}
        </Text>
        <Text className="font-bold text-zinc-500 text-base">
          {dayjs(item.createdAt).format("YYYY.MM.DD HH:mm")}
        </Text>
      </View>
      <View className="flex justify-center items-center h-3/6 w-3/12">
        {item.responsePoint === item.requestPoint ? (
          <Text className="text-xl font-bold text-green-400">충전 완료</Text>
        ) : (
          <Text className="text-xl font-bold text-red-400">충전 예정</Text>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1" edges={["left", "right"]}>
      {!loading ? (
        <Loading />
      ) : pointList.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <MaterialIcons name="search-off" size={80} color="#3F3F46" />
          <Text className="mt-4 text-lg text-gray-600">
            포인트 충전 내역이 없습니다.
          </Text>
        </View>
      ) : (
        <FlatList
          data={pointList}
          renderItem={renderPointList}
          keyExtractor={(item) => item._id}
          onEndReached={getPointChargeList}
          onEndReachedThreshold={1}
          refreshing={refresh}
          onRefresh={onRefreshHandler}
          initialNumToRender={10}
        />
      )}
    </SafeAreaView>
  );
}
