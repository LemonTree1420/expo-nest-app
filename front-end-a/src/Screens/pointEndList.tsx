import axios from "axios";
import React, { useEffect, useState } from "react";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import { adminState } from "../recoil/atoms";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import getEnvVars from "../../environment";
const { apiUrl } = getEnvVars();
import { API_ERROR, API_HEADER } from "../constants/api";
import { tokenValidateHandler } from "../constants/validate";
import { FlatList, Pressable, View } from "react-native";
import { moneyComma } from "../constants/regEx";
import Loading from "./loading";
import dayjs from "dayjs";

export default function PointEndList({ navigation }: any) {
  const [admin, setAdmin] = useRecoilState(adminState);
  const [pointList, setPointList] = useState<any[]>([]);
  const [listPage, setListPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  const getCallList = async () => {
    const token = await tokenValidateHandler(setAdmin, navigation);
    const api =
      admin.role === "master"
        ? `${apiUrl}point/end/all?limit=10&page=${listPage}`
        : `${apiUrl}point/end?manager=${admin.userId}&limit=10&page=${listPage}`;
    return await axios
      .get(api, API_HEADER(token))
      .then((res) => getCallSuccess(res.data))
      .catch((err) => API_ERROR(err, setAdmin, navigation));
  };

  const getCallSuccess = (data: any) => {
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
    if (listPage === 0 && pointList.length === 0 && !loading) getCallList();
  }, [listPage, pointList, loading]);

  const onRefreshHandler = () => {
    setListPage(0);
    setPointList([]);
    setLoading(false);
    setRefresh(true);
  };

  const renderCallList = ({ item }: any) => (
    <React.Fragment key={item._id}>
      {!item.status && (
        <View className="mb-2">
          <View className="w-full bg-zinc-400 flex-row justify-around items-center py-1 px-3">
            <Text className="text-center font-bold text-base text-gray-100 w-1/2">
              {item.request_auth === "worker" ? "직원" : "가게"}
            </Text>
            <Text className="text-center font-bold text-base text-gray-100 w-1/2">
              {dayjs(item.createdAt).format("YYYY.MM.DD HH:mm")}
            </Text>
          </View>
          <View className="flex-row justify-around items-center bg-white h-20 px-3">
            <View className="w-1/2 flex items-center">
              <Text className="font-bold text-gray-500">예금주</Text>
              <Text className="text-xl font-bold text-gray-600">
                {item.requestBankHolder}
              </Text>
            </View>
            <View className="w-1/2 flex items-center">
              <Text className="font-bold text-gray-500">입금 금액</Text>
              <Text className="text-xl font-bold text-gray-600">
                {moneyComma(item.depositAmount.toString())}원
              </Text>
            </View>
          </View>
        </View>
      )}
    </React.Fragment>
  );

  return (
    <SafeAreaView className="flex-1" edges={["left", "right"]}>
      {!loading ? (
        <Loading />
      ) : pointList.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <MaterialCommunityIcons
            name="playlist-remove"
            size={80}
            color="#3F3F46"
          />
          <Text className="mt-4 text-lg text-gray-600">
            포인트 완료 리스트가 없습니다.
          </Text>
        </View>
      ) : (
        <FlatList
          data={pointList}
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
