import React from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";

export default function FindIdStepTwo({ navigation, route }: any) {
  const store = route.params;
  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <View className="flex items-center">
        <FontAwesome name="check" size={64} color="green" />
        <Text className="text-xl font-bold mt-4">
          {store?.cellPhoneNumber}님의 아이디는
        </Text>
        <View className="flex-row">
          <Text className="text-xl font-bold text-blue-600">
            {store?.userId}
          </Text>
          <Text className="text-xl font-bold">입니다.</Text>
        </View>
      </View>
      <View className="mt-8">
        <Button
          mode="contained"
          onPress={() =>
            navigation.navigate("noToken", { screen: "findPwStepOne" })
          }
          className="flex justify-center bg-blue-600 py-1 rounded-xl"
        >
          비밀번호 찾기
        </Button>
      </View>
    </SafeAreaView>
  );
}
