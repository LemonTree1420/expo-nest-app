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
import { FlatList, Pressable, View } from "react-native";
import { moneyComma } from "../constants/regEx";
import Loading from "./loading";

export default function CallEndList({ navigation }: any) {
  const [store, setStore] = useRecoilState(storeState);
  const [callList, setCallList] = useState<any[]>([]);
  const [listPage, setListPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  const getEndCallList = async () => {
    const token = await tokenValidateHandler(setStore, navigation);
    return await axios
      .get(
        `${apiUrl}call/end/${store._id}?limit=10&page=${listPage}`,
        API_HEADER(token)
      )
      .then((res) => getEndCallSuccess(res.data))
      .catch((err) => API_ERROR(err, setStore, navigation));
  };

  const getEndCallSuccess = (data: any) => {
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
    if (listPage === 0 && callList.length === 0 && !loading) getEndCallList();
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
      className="flex-row items-center bg-gray-200 h-28 border-t border-b border-gray-300 px-3"
      onPress={() =>
        navigation.navigate("sub", {
          screen: "callEndDetail",
          params: item,
        })
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
            마감된 콜 리스트가 없습니다.
          </Text>
        </View>
      ) : (
        <FlatList
          data={callList}
          renderItem={renderCallList}
          keyExtractor={(item) => item._id}
          onEndReached={getEndCallList}
          onEndReachedThreshold={1}
          refreshing={refresh}
          onRefresh={onRefreshHandler}
          initialNumToRender={10}
        />
      )}
    </SafeAreaView>
  );
}
