import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import { storeState } from "../recoil/atoms";
import getEnvVars from "../../environment";
const { apiUrl } = getEnvVars();
import { API_HEADER } from "../constants/api";
import { tokenValidateHandler } from "../constants/validate";
import { FlatList, Pressable, View } from "react-native";
import { moneyComma } from "../constants/regEx";

export default function CallList({ navigation }: any) {
  const [store, setStore] = useRecoilState(storeState);
  const [callList, setCallList] = useState<any[]>([]);
  const [listPage, setListPage] = useState<number>(0);

  const getCallList = async () => {
    const token = await tokenValidateHandler(setStore, navigation);
    return await axios
      .get(
        `${apiUrl}call/store/${store._id}?limit=10&page=${listPage}`,
        API_HEADER(token)
      )
      .then((res) => {
        setCallList(callList.concat(res.data));
        setListPage(listPage + 1);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    const focusScreen = navigation.addListener("focus", () => {
      setListPage(0);
      setCallList([]);
    });
    return focusScreen;
  }, [navigation]);

  useEffect(() => {
    if (listPage === 0 && callList.length === 0) getCallList();
  }, [listPage, callList]);

  const renderCallList = ({ item }: any) => (
    <React.Fragment key={item._id}>
      {item.workerNumbers.length < item.headCount && (
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
              {item.workerNumbers.length}/{item.headCount}
            </Text>
          </View>
        </Pressable>
      )}
    </React.Fragment>
  );

  return (
    <SafeAreaView edges={["left", "right"]}>
      <FlatList
        data={callList}
        renderItem={renderCallList}
        keyExtractor={(item) => item._id}
        onEndReached={getCallList}
        onEndReachedThreshold={1}
      />
    </SafeAreaView>
  );
}
