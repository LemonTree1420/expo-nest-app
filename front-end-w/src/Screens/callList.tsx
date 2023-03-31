import axios from "axios";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRecoilState, useRecoilValue } from "recoil";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import getEnvVars from "../../environment";
import { API_ERROR, API_HEADER } from "../constants/api";
import { moneyComma } from "../constants/regEx";
import { tokenValidateHandler } from "../constants/validate";
import { callRegionState, workerState } from "../recoil/atoms";
import Loading from "./loading";
const { apiUrl } = getEnvVars();

export default function CallList({ navigation }: any) {
  const [worker, setWorker] = useRecoilState(workerState);
  const callRegion = useRecoilValue(callRegionState);
  const [callList, setCallList] = useState<any[]>([]);
  const [listPage, setListPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  const getCallList = async () => {
    const token = await tokenValidateHandler(setWorker, navigation);
    return await axios
      .get(
        `${apiUrl}call/region/${callRegion}/${worker.cellPhoneNumber}?age=${worker.age}&limit=10&page=${listPage}`,
        API_HEADER(token)
      )
      .then((res) => getCallListSuccess(res.data))
      .catch((err) => API_ERROR(err, setWorker, navigation));
  };

  const getCallListSuccess = (data: any) => {
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
    if (
      listPage === 0 &&
      callList.length === 0 &&
      callRegion !== "" &&
      !loading
    )
      getCallList();
  }, [listPage, callList, callRegion, loading]);

  const onRefreshHandler = () => {
    setListPage(0);
    setCallList([]);
    setLoading(false);
    setRefresh(true);
  };

  const renderCallList = ({ item }: any) => (
    <React.Fragment key={item._id}>
      {!item.status && (
        <Pressable
          className="flex-row items-center bg-white h-28 border-t border-b border-gray-300 px-3"
          onPress={() =>
            navigation.navigate("sub", { screen: "callDetail", params: item })
          }
        >
          <View className="flex flex-wrap justify-center items-center h-4/6 w-3/12 bg-blue-600 rounded-xl px-2">
            <Text className="font-bold text-white text-center">
              {item.region}
            </Text>
          </View>
          <View className="flex justify-center items-start h-4/6 w-6/12 pl-10">
            <Text className="font-bold text-lg">{item.customerAge}대 손님</Text>
            <Text className="font-bold text-gray-600">
              요청 나이 {item.expectedAge}대
            </Text>
            <Text className="font-bold text-gray-600">
              요청 인원 수 {item.headCount}명
            </Text>
            <Text className="font-bold">
              &#8361; {moneyComma(item.fee.toString())}
            </Text>
          </View>
          <View className="flex justify-center items-center h-4/6 w-3/12">
            <Text className="text-xl font-bold text-gray-600">
              {item.nowCount}/{item.headCount}
            </Text>
          </View>
        </Pressable>
      )}
    </React.Fragment>
  );

  return (
    <SafeAreaView className="flex-1" edges={["left", "right"]}>
      {callRegion ? (
        !loading ? (
          <Loading />
        ) : callList.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <MaterialIcons name="search-off" size={80} color="#3F3F46" />
            <Text className="mt-4 text-lg text-gray-600">
              선택 지역에 콜 요청이 없습니다.
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
        )
      ) : (
        <View className="flex-1 justify-center items-center">
          <MaterialCommunityIcons
            name="map-marker-off"
            size={80}
            color="#3F3F46"
          />
          <Text className="mt-4 text-lg text-gray-600">
            지역을 선택해 주세요.
          </Text>
          <Button
            mode="contained"
            className="mt-4 bg-blue-600"
            onPress={() => navigation.navigate("sub", { screen: "callRegion" })}
          >
            지역 선택
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
}
