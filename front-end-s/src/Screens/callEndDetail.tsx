import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Linking, Pressable, View } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { moneyComma } from "../constants/regEx";
import { useRecoilValue } from "recoil";
import { storeState } from "../recoil/atoms";

export default function CallEndDetail({ navigation, route }: any) {
  const call = route.params;
  const store = useRecoilValue(storeState);

  const onPhoneCallHandler = async (str: string) => {
    const url = `tel://${str}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      className="flex-1 items-center justify-between"
    >
      {call && store && (
        <React.Fragment>
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
                  <FontAwesome5 name="home" size={30} color="#27272A" />
                </View>
              </View>
              <View className="flex items-center mt-2">
                <Text className="text-2xl font-bold text-white">
                  {store?.name}
                </Text>
              </View>
            </View>
          </View>
          <View className="flex items-center justify-end w-11/12 h-3/4 pb-4">
            <View className="w-full bg-white mt-4 shadow-sm shadow-black py-2 px-4">
              <Text className="text-base text-zinc-800">매칭 인원 수</Text>
              <Text className="text-base text-zinc-600">
                {call.nowCount} / {call.headCount}
              </Text>
            </View>
            <View className="w-full bg-white shadow-sm shadow-black py-2 px-4">
              <Text className="text-base text-zinc-800">
                매칭 인원 전화번호
              </Text>
              {call.workers.map((item: any) => (
                <Pressable
                  key={item.cellPhoneNumber}
                  className="flex-row items-center py-1"
                  onPress={() => onPhoneCallHandler(item.cellPhoneNumber)}
                >
                  <FontAwesome name="phone-square" size={18} color="#52525B" />
                  <Text className="ml-1 text-base text-zinc-600">
                    {item.cellPhoneNumber}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View className="w-full bg-white shadow-sm shadow-black py-2 px-4">
              <Text className="text-base text-zinc-800">손님 나이</Text>
              <Text className="text-base text-zinc-600">
                {call.customerAge}
              </Text>
            </View>
            <View className="w-full bg-white shadow-sm shadow-black py-2 px-4">
              <Text className="text-base text-zinc-800">요청 나이</Text>
              <Text className="text-base text-zinc-600">
                {call.expectedAge}
              </Text>
            </View>
            <View className="w-full bg-white shadow-sm shadow-black py-2 px-4">
              <Text className="text-base text-zinc-800">요금</Text>
              <Text className="text-base text-zinc-600">
                {moneyComma(call.fee.toString())}원
              </Text>
            </View>
            <View className="w-full bg-white shadow-sm shadow-black py-2 px-4">
              <Text className="text-base text-zinc-800">메모</Text>
              <Text className="text-base text-zinc-600">{call.memo}</Text>
            </View>
            <View className="mt-8 h-8"></View>
          </View>
        </React.Fragment>
      )}
    </SafeAreaView>
  );
}
