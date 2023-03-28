import { View } from "react-native";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { Button } from "react-native-paper";
import { BackHandler } from "react-native";
import { useEffect } from "react";

export default function FindPwStepThree({ navigation }: any) {
  const handleBackButtonHandler = () => {
    navigation.navigate("noToken", { screen: "findPwStepTwo", params: "" });
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonHandler);
    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonHandler
      );
    };
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <View className="flex items-center">
        <FontAwesome name="check" size={64} color="green" />
        <Text className="text-xl font-bold mt-4">
          비밀번호가 재설정되었습니다.
        </Text>
        <Text className="text-xl font-bold mt-2">
          다시 로그인하여 어플을 이용하세요.
        </Text>
      </View>
      <View className="mt-8">
        <Button
          mode="contained"
          onPress={() => navigation.replace("noToken", { screen: "signIn" })}
          className="flex justify-center bg-blue-600 py-1 rounded-xl"
        >
          로그인
        </Button>
      </View>
    </SafeAreaView>
  );
}
