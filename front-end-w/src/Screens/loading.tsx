import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export default function Loading({ navigation }: any) {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator animating={true} color="#2563EB" size="large" />
    </View>
  );
}
