import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import { adminState } from "../recoil/atoms";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import getEnvVars from "../../environment";
const { apiUrl } = getEnvVars();
import { API_ERROR, API_HEADER } from "../constants/api";
import { tokenValidateHandler } from "../constants/validate";
import { Alert, FlatList, Pressable, View } from "react-native";
import { moneyComma } from "../constants/regEx";
import Loading from "./loading";
import dayjs from "dayjs";

export default function PointYetList({ navigation }: any) {
  const [admin, setAdmin] = useRecoilState(adminState);
  const [pointList, setPointList] = useState<any[]>([]);
  const [listPage, setListPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  const getCallList = async () => {
    const token = await tokenValidateHandler(setAdmin, navigation);
    return await axios
      .get(`${apiUrl}point/yet?limit=10&page=${listPage}`, API_HEADER(token))
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

  const onChargeRequestHandler = (item: any) => {
    Alert.alert(
      "",
      `아래 정보로 입금되었는지 확인하세요.\n\n예금주 ${
        item.requestBankHolder
      }\n계좌번호 ${item.requestBankAccountNum}\n결제금액 ${moneyComma(
        item.depositAmount.toString()
      )}원\n\n정말 충전하시겠습니까?`,
      [
        {
          text: "확인",
          onPress: () => onChargePointHandler(item),
        },
        {
          text: "취소",
        },
      ]
    );
  };

  const onChargePointHandler = async (item: any) => {
    let subApi;
    const patchData = {
      responsePoint: item.requestPoint,
    };
    if (item.request_auth === "store") subApi = "point/charge/response/store/";
    if (item.request_auth === "worker")
      subApi = "point/charge/response/worker/";
    const token = await tokenValidateHandler(setAdmin, navigation);
    axios
      .patch(`${apiUrl}${subApi}${item._id}`, patchData, API_HEADER(token))
      .then((res) => onRefreshHandler())
      .catch((err) => API_ERROR(err, setAdmin, navigation));
  };

  const renderCallList = ({ item }: any) => (
    <React.Fragment key={item._id}>
      {!item.status && (
        <View className="mb-2">
          <View className="w-full bg-blue-300 flex-row justify-around items-center py-1 px-3">
            <Text className="font-bold text-base text-gray-100 w-1/2">
              {item.request_auth === "worker" ? "직원" : "가게"}
            </Text>
            <Text className="font-bold text-base text-gray-100 w-1/2">
              {dayjs(item.createdAt).format("YYYY.MM.DD HH:mm")}
            </Text>
          </View>
          <View className="flex-row justify-between items-center">
            <View className="flex-row justify-around items-center bg-white h-28 w-3/4 px-3">
              <View className="flex justify-center items-start h-5/6 w-3/5">
                <View>
                  <Text className="font-bold text-gray-600">예금주</Text>
                  <Text className="font-bold text-gray-600">
                    {item.requestBankHolder}
                  </Text>
                </View>
                <View className="mt-2">
                  <Text className="font-bold text-gray-600">계좌번호</Text>
                  <Text className="font-bold text-gray-600">
                    {item.requestBankAccountNum}
                  </Text>
                </View>
              </View>
              <View className="flex justify-center items-start h-4/6 w-2/5">
                <View>
                  <Text className="font-bold text-gray-600">입금 금액</Text>
                  <Text className="font-bold text-gray-600">
                    {moneyComma(item.depositAmount.toString())}원
                  </Text>
                </View>
                <View className="mt-2">
                  <Text className="font-bold text-gray-600">요청 포인트</Text>
                  <Text className="font-bold text-gray-600">
                    {moneyComma(item.requestPoint.toString())}p
                  </Text>
                </View>
              </View>
            </View>
            <View className="flex justify-center items-center bg-white h-28 w-1/4">
              <Pressable
                className="flex items-center justify-center w-5/6 h-1/2 bg-blue-400 rounded-xl"
                onPress={() => onChargeRequestHandler(item)}
              >
                <Text className="font-bold text-white text-xl">충전</Text>
              </Pressable>
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
            포인트 요청 중인 사용자가 없습니다.
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
