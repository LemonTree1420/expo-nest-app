import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Button, Snackbar, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo } from "@expo/vector-icons";
import { regionList, regionSplit } from "../constants/region";
import { useRecoilState } from "recoil";
import { callRegionState } from "../recoil/atoms";

export default function CallRegion({ navigation }: any) {
  const [callRegion, setCallRegion] = useRecoilState(callRegionState);

  const [select1, setSelect1] = useState<string>("서울");
  const [select2, setSelect2] = useState<string>("");
  const [visibleSnackBar, setVisibleSnackBar] = useState<boolean>(false);

  const onSelectRegionHandler = () => {
    setCallRegion(`${select1} ${select2}`);
    navigation.pop();
  };

  useEffect(() => {
    const focusScreen = navigation.addListener("focus", () => {
      if (callRegion) {
        const split = regionSplit(callRegion);
        setSelect1(split.region1);
        setSelect2(split.region2);
      }
    });
    return focusScreen;
  }, [navigation]);

  return (
    <SafeAreaView className="flex-1 bg-white p-6">
      <View className="flex mt-8">
        <Text className="text-2xl text-gray-600">
          원하는 지역이 어디신가요?
        </Text>
        <Text className="mt-2 text-sm text-gray-600">
          (선택한 지역의 콜 리스트가 나옵니다.)
        </Text>
      </View>
      <View className="bg-white mt-8 h-1/2 border-t-2 border-b-2 border-gray-300">
        <View className="flex-row h-full">
          <ScrollView className="w-2/6 border-r-2 border-gray-300">
            {regionList.map((item) => (
              <Pressable
                key={item.label}
                onPress={() => {
                  setSelect1(item.value);
                  setSelect2("");
                }}
              >
                <Text
                  className={`text-lg text-center font-bold py-3 ${
                    item.value === select1
                      ? "text-blue-600 bg-white"
                      : "text-zinc-400 bg-zinc-100"
                  }`}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
          <ScrollView className="w-4/6">
            {regionList
              .filter((item) => item.value === select1)
              .map((item) => (
                <React.Fragment key={item.label}>
                  {item.sub?.map((sub) => (
                    <Pressable
                      className="border-t border-b border-gray-100"
                      key={sub.label}
                      onPress={() => setSelect2(sub.value)}
                    >
                      <Text
                        className={`text-lg text-center font-bold py-3 ${
                          sub.value === select2
                            ? "text-blue-600"
                            : "text-zinc-400"
                        }`}
                      >
                        {sub.label}
                      </Text>
                    </Pressable>
                  ))}
                </React.Fragment>
              ))}
          </ScrollView>
        </View>
      </View>
      <View className="bg-white flex-row justify-center mt-8">
        <Button
          mode="contained"
          className="w-full rounded-lg py-1"
          buttonColor="#2563EB"
          onPress={onSelectRegionHandler}
        >
          완료
        </Button>
      </View>
      <Snackbar
        className="bg-zinc-600"
        visible={visibleSnackBar}
        onDismiss={() => setVisibleSnackBar(false)}
        action={{
          label: "x",
          labelStyle: {
            color: "#fff",
          },
          onPress: () => {
            setVisibleSnackBar(false);
          },
        }}
        duration={1000}
      >
        <View className="flex-row items-center">
          <Entypo name="warning" size={18} color="#fff" />
          <Text className="ml-2 text-white">구/군을 선택해주세요.</Text>
        </View>
      </Snackbar>
    </SafeAreaView>
  );
}
