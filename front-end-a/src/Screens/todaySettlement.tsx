import React from "react";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView, View } from "react-native";
import { moneyComma } from "../constants/regEx";

export default function TodaySettlement(props: any) {
  return (
    <View className="flex items-center">
      <View className="w-full h-1/5 bg-white mb-2 flex justify-center items-center">
        <Text className="text-xl mb-2">당일 총 정산 금액</Text>
        <Text className="text-3xl font-bold text-blue-600">
          {moneyComma(props.total.toString())}원
        </Text>
      </View>
      <View className="w-full h-4/5 items-center bg-white pb-20">
        <View className="my-4">
          <Text className="text-base">매니저 별 정산 금액</Text>
        </View>
        {props.list.length === 0 ? (
          <View className="w-11/12 flex-1 justify-center items-center">
            <MaterialCommunityIcons
              name="playlist-remove"
              size={80}
              color="#3F3F46"
            />
            <Text className="mt-4 text-lg text-gray-600">
              당일 정산 내역이 없습니다.
            </Text>
          </View>
        ) : (
          <ScrollView className="w-11/12">
            {props.list.map((item: any, idx: number) => (
              <View
                key={idx}
                className="flex-row justify-between items-center bg-white h-16 mb-2 px-3 border border-gray-300 rounded-lg"
              >
                <Text className="text-center font-bold text-base text-gray-600 w-1/2">
                  {item.managerUserId}
                </Text>
                <Text className="text-center font-bold text-base text-blue-600 w-1/2">
                  {moneyComma(item.sumOfAmount.toString())}원
                </Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}
