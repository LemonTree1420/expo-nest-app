import { View } from "react-native";
import { Text } from "react-native-paper";

export default function NoNetWork() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-lg font-bold text-center">
        네트워크가 연결되지 않았습니다.
      </Text>
      <Text className="text-lg font-bold text-center">
        Wi-Fi 또는 데이터를 활성화 해주세요.
      </Text>
    </View>
  );
}
