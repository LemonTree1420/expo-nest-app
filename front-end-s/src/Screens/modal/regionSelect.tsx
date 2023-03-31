import React, { useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { Button, Snackbar, Text } from "react-native-paper";
import { regionList } from "../../constants/region";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

export default function RegionSelect(props: any) {
  const [select1, setSelect1] = useState<string>(
    props.region1 === "" ? "서울" : props.region1
  );
  const [select2, setSelect2] = useState<string>(props.region2);
  const [visibleSnackBar, setVisibleSnackBar] = useState<boolean>(false);

  const onRegionHandler = () => {
    if (select1 === "" || select2 === "") return setVisibleSnackBar(true);
    props.setIsRegionModal(false);
    props.setRegion1(select1);
    props.setRegion2(select2);
    props.setRegionErr(false);
  };

  return (
    <View>
      <View className="flex flex-row justify-between items-center bg-blue-600 py-3 px-4 rounded-t-lg">
        <Text variant="titleLarge" className="text-white">
          지역선택
        </Text>
        <Ionicons
          name="close"
          size={32}
          color="#fff"
          onPress={() => {
            props.setIsRegionModal(false);
          }}
        />
      </View>
      <View className="bg-white py-1 px-2">
        <View className="flex-row border-b border-gray-200 py-2">
          <View className="w-2/5">
            <Text className="text-lg text-center">시/도</Text>
          </View>
          <View className="w-3/5">
            <Text className="text-lg text-center">구/군</Text>
          </View>
        </View>
        <View className="flex-row h-80 border-b border-gray-200">
          <ScrollView className="w-2/5 border-r border-gray-200">
            {regionList.map((item) => (
              <Pressable
                key={item.label}
                onPress={() => {
                  setSelect1(item.value);
                  setSelect2("");
                }}
              >
                <Text
                  className={`text-lg text-center py-1 ${
                    item.value === select1 ? "text-blue-600" : "text-black"
                  }`}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
          <ScrollView className="w-3/5">
            {regionList
              .filter((item) => item.value === select1)
              .map((item) => (
                <React.Fragment key={item.label}>
                  {item.sub?.map((sub) => (
                    <Pressable
                      key={sub.label}
                      onPress={() => setSelect2(sub.value)}
                    >
                      <Text
                        className={`text-lg text-center py-1 ${
                          sub.value === select2 ? "text-blue-600" : "text-black"
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
      <View className="bg-white rounded-b-lg flex-row justify-center pt-2 pb-3">
        <Button
          mode="contained"
          className="w-1/2"
          buttonColor="#2563EB"
          onPress={onRegionHandler}
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
    </View>
  );
}
