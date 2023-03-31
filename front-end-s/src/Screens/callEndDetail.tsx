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
    <React.Fragment>
      <SafeAreaView
        edges={["bottom", "left", "right"]}
        className="flex-1 items-center space-between"
      >
        {call && store && (
          <React.Fragment>
            <View className="relative w-full bg-blue-600 pt-4 pb-32">
              <View className="absolute top-4 left-1/2 transform -translate-x-10 z-10">
                <View className="h-20 w-20 flex justify-center items-center rounded-full shadow shadow-black bg-white">
                  <FontAwesome5 name="home" size={48} color="#27272A" />
                </View>
              </View>
              <View className="absolute top-14 left-1/2 transform -translate-x-40 bg-white rounded-md w-80 pt-12 pb-6 flex items-center shadow-sm shadow-black">
                <Text className="text-2xl font-bold text-zinc-800 mt-1">
                  {store?.name}
                </Text>
              </View>
            </View>
            <View className="absolute bottom-4 w-11/12 h-auto">
              <View className="mt-4 bg-white shadow-sm shadow-black py-2 px-4">
                <Text className="text-base text-zinc-800">매칭 인원 수</Text>
                <Text className="text-base text-zinc-600">
                  {call.nowCount} / {call.headCount}
                </Text>
              </View>
              <View className="bg-white shadow-sm shadow-black py-2 px-4">
                <Text className="text-base text-zinc-800">
                  매칭 인원 전화번호
                </Text>
                {call.workerNumbers.map((phone: string) => (
                  <Pressable
                    key={phone}
                    className="flex-row items-center py-1"
                    onPress={() => onPhoneCallHandler(phone)}
                  >
                    <FontAwesome
                      name="phone-square"
                      size={18}
                      color="#52525B"
                    />
                    <Text className="ml-1 text-base text-zinc-600">
                      {phone}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <View className="bg-white shadow-sm shadow-black py-2 px-4">
                <Text className="text-base text-zinc-800">손님 나이</Text>
                <Text className="text-base text-zinc-600">
                  {call.customerAge}대
                </Text>
              </View>
              <View className="bg-white shadow-sm shadow-black py-2 px-4">
                <Text className="text-base text-zinc-800">요청 나이</Text>
                <Text className="text-base text-zinc-600">
                  {call.expectedAge}대
                </Text>
              </View>
              <View className="bg-white shadow-sm shadow-black py-2 px-4">
                <Text className="text-base text-zinc-800">요금</Text>
                <Text className="text-base text-zinc-600">
                  {moneyComma(call.fee.toString())}원
                </Text>
              </View>
              <View className="bg-white shadow-sm shadow-black py-2 px-4">
                <Text className="text-base text-zinc-800">메모</Text>
                <Text className="text-base text-zinc-600">{call.memo}</Text>
              </View>
              <View className="mt-8 h-8"></View>
            </View>
          </React.Fragment>
        )}
      </SafeAreaView>
    </React.Fragment>
  );
}
