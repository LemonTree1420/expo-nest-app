import React, { useEffect, useState } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Linking, Pressable, View } from "react-native";
import {
  Button,
  Divider,
  HelperText,
  Text,
  TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { tokenValidateHandler } from "../constants/validate";
import { useRecoilState } from "recoil";
import { workerState } from "../recoil/atoms";
import axios from "axios";
import getEnvVars from "../../environment";
import { API_ERROR, API_HEADER } from "../constants/api";
import { DEDUCT_POINT } from "../constants/point";
import { moneyComma } from "../constants/regEx";
const { apiUrl } = getEnvVars();

export default function CallMatchDetail({ navigation, route }: any) {
  const call = route.params;

  const [worker, setWorker] = useRecoilState(workerState);
  const [store, setStore] = useState<any>(null);

  const getStoreInfo = async () => {
    const token = await tokenValidateHandler(setWorker, navigation);
    await axios
      .get(`${apiUrl}store/search/${call.store}`, API_HEADER(token))
      .then((res) => setStore(res.data))
      .catch((err) => API_ERROR(err, setWorker, navigation));
  };

  useEffect(() => {
    const focusScreen = navigation.addListener("focus", () => {
      getStoreInfo();
    });
    return focusScreen;
  }, [navigation]);

  const onPhoneCallHandler = async (str: string) => {
    const url = `tel://${str}`;
    Linking.openURL(url);
  };

  const onCancelCallHandler = async () => {
    const findMatchWorker = call.workers.filter(
      (item: any) => worker.cellPhoneNumber === item.cellPhoneNumber
    );
    const token = await tokenValidateHandler(setWorker, navigation);
    const patchData = findMatchWorker[0];
    await axios
      .patch(`${apiUrl}call/cancel/${call._id}`, patchData, API_HEADER(token))
      .then((res) => onCancelCallSuccess())
      .catch((err) => onCancelCallError(err));
  };

  const onCancelCallSuccess = () => {
    setWorker({ ...worker, point: worker.point - DEDUCT_POINT });
    navigation.pop();
  };

  const onCancelCallError = (err: any) => {
    API_ERROR(err, setWorker, navigation);
  };

  return (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      className="flex-1 items-center space-between"
    >
      {call && store && (
        <React.Fragment>
          <View
            className="flex justify-center items-center w-full bg-blue-600 h-1/3 scale-x-150 overflow-hidden"
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
              <Divider className="w-16 divide-white my-2" />
              <Pressable
                className="flex-row items-center"
                onPress={() => onPhoneCallHandler(store?.phoneNumber)}
              >
                <Entypo name="old-phone" size={16} color="#fff" />
                <Text className="ml-1 text-lg font-bold text-white">
                  {store?.phoneNumber}
                </Text>
              </Pressable>
              <Pressable
                className="flex-row items-center"
                onPress={() => onPhoneCallHandler(store?.cellPhoneNumber)}
              >
                <FontAwesome5 name="phone-alt" size={14} color="#fff" />
                <Text className="ml-1 text-lg font-bold text-white">
                  {store?.cellPhoneNumber}
                </Text>
              </Pressable>
            </View>
          </View>
          <View className="flex items-center justify-end w-11/12 h-2/3 pb-4">
            <View className="w-full bg-white shadow-sm shadow-black py-2 px-4">
              <Text className="text-zinc-800">가게 주소</Text>
              <Text className="text-zinc-600">
                {store?.address1} {store?.address2}
              </Text>
            </View>
            <View className="mt-4 w-full bg-white shadow-sm shadow-black py-2 px-4">
              <Text className="text-zinc-800">매칭 인원 수</Text>
              <Text className="text-zinc-600">
                {call.nowCount} / {call.headCount}
              </Text>
            </View>
            <View className="w-full bg-white shadow-sm shadow-black py-2 px-4">
              <Text className="text-zinc-800">손님 나이</Text>
              <Text className="text-zinc-600">{call.customerAge}대</Text>
            </View>
            <View className="w-full bg-white shadow-sm shadow-black py-2 px-4">
              <Text className="text-zinc-800">요청 나이</Text>
              <Text className="text-zinc-600">{call.expectedAge}대</Text>
            </View>
            <View className="w-full bg-white shadow-sm shadow-black py-2 px-4">
              <Text className="text-zinc-800">요금</Text>
              <Text className="text-zinc-600">
                {moneyComma(call.fee.toString())}원
              </Text>
            </View>
            <View className="w-full bg-white shadow-sm shadow-black py-2 px-4">
              <Text className="text-zinc-800">메모</Text>
              <Text className="text-zinc-600">{call.memo}</Text>
            </View>
            {call.status ? (
              <View className="mt-8 h-12"></View>
            ) : (
              <Button
                mode="contained"
                className="bg-blue-600 mt-8 w-full rounded-xl py-1"
                onPress={onCancelCallHandler}
              >
                취소
              </Button>
            )}
          </View>
        </React.Fragment>
      )}
    </SafeAreaView>
  );
}
