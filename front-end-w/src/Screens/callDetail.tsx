import React, { useEffect, useState } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Linking, Pressable, View } from "react-native";
import { Button, Snackbar, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { tokenValidateHandler } from "../constants/validate";
import { useRecoilState } from "recoil";
import { workerState } from "../recoil/atoms";
import axios from "axios";
import getEnvVars from "../../environment";
import { API_ERROR, API_HEADER } from "../constants/api";
import { DEDUCT_POINT } from "../constants/point";
import { moneyComma } from "../constants/regEx";
import { BottomSheet } from "react-native-btr";
import { Controller, useForm } from "react-hook-form";
const { apiUrl } = getEnvVars();

export default function CallDetail({ navigation, route }: any) {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const call = route.params;

  const [worker, setWorker] = useRecoilState(workerState);
  const [store, setStore] = useState<any>(null);
  const [visibleBottomSheet, setVisibleBottomSheet] = useState<boolean>(false);
  const [visibleSnackBar, setVisibleSnackBar] = useState<boolean>(false);

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

  const onCallNowCountHandler = () => {
    setVisibleBottomSheet(true);
  };

  const onTakeCallHandler = async (data: any) => {
    if (worker.point * data.count < DEDUCT_POINT * data.count) {
      setVisibleBottomSheet(false);
      return setVisibleSnackBar(true);
    }
    const token = await tokenValidateHandler(setWorker, navigation);
    const patchData = {
      workerNumber: worker.cellPhoneNumber,
      count: data.count,
    };
    await axios
      .patch(`${apiUrl}call/take/${call._id}`, patchData, API_HEADER(token))
      .then((res) => onTakeCallSuccess())
      .catch((err) => onTakeCallError(err));
  };

  const onTakeCallSuccess = () => {
    setWorker({ ...worker, point: worker.point - DEDUCT_POINT });
    navigation.pop();
  };

  const onTakeCallError = (err: any) => {
    API_ERROR(err, setWorker, navigation);
    if (err.response.data.message.includes("Point"))
      return setVisibleSnackBar(true);
  };

  useEffect(() => {
    if (!visibleBottomSheet) {
      setValue("count", "");
    }
  }, [visibleBottomSheet]);

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
              <View className="absolute top-14 left-1/2 transform -translate-x-40 bg-white rounded-md w-80 pt-12 pb-4 flex items-center shadow-sm shadow-black">
                <Text className="text-2xl font-bold text-zinc-800 mt-1">
                  {store?.name}
                </Text>
                <Pressable
                  className="flex-row items-center"
                  onPress={() => onPhoneCallHandler(store?.phoneNumber)}
                >
                  <Entypo name="old-phone" size={20} color="#52525B" />
                  <Text className="mt-2 mx-2 text-lg font-bold text-zinc-600">
                    {store?.phoneNumber}
                  </Text>
                </Pressable>
                <Pressable
                  className="flex-row items-center"
                  onPress={() => onPhoneCallHandler(store?.cellPhoneNumber)}
                >
                  <FontAwesome5 name="phone-alt" size={18} color="#52525B" />
                  <Text className="mx-2 text-lg font-bold text-zinc-600">
                    {store?.cellPhoneNumber}
                  </Text>
                </Pressable>
              </View>
            </View>
            <View className="absolute bottom-4 w-11/12 h-auto">
              <View className="bg-white shadow-sm shadow-black py-2 px-4">
                <Text className="text-zinc-800">가게 주소</Text>
                <Text className="text-zinc-600">
                  {store?.address1} {store?.address2}
                </Text>
              </View>
              <View className="mt-4 bg-white shadow-sm shadow-black py-2 px-4">
                <Text className="text-zinc-800">매칭 인원 수</Text>
                <Text className="text-zinc-600">
                  {call.nowCount} / {call.headCount}
                </Text>
              </View>
              <View className="bg-white shadow-sm shadow-black py-2 px-4">
                <Text className="text-zinc-800">손님 나이</Text>
                <Text className="text-zinc-600">{call.customerAge}대</Text>
              </View>
              <View className="bg-white shadow-sm shadow-black py-2 px-4">
                <Text className="text-zinc-800">요청 나이</Text>
                <Text className="text-zinc-600">{call.expectedAge}대</Text>
              </View>
              <View className="bg-white shadow-sm shadow-black py-2 px-4">
                <Text className="text-zinc-800">요금</Text>
                <Text className="text-zinc-600">
                  {moneyComma(call.fee.toString())}원
                </Text>
              </View>
              <View className="bg-white shadow-sm shadow-black py-2 px-4">
                <Text className="text-zinc-800">메모</Text>
                <Text className="text-zinc-600">{call.memo}</Text>
              </View>
              <Button
                mode="contained"
                className="bg-blue-600 mt-8 rounded-xl py-1"
                onPress={onCallNowCountHandler}
              >
                매칭
              </Button>
            </View>
          </React.Fragment>
        )}
        <Snackbar
          className="bg-red-600"
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
          duration={2000}
        >
          <View className="flex-row items-center">
            <Entypo name="warning" size={18} color="#fff" />
            <Text className="ml-2 text-white">보유 포인트가 부족합니다.</Text>
          </View>
        </Snackbar>
      </SafeAreaView>
      <BottomSheet
        visible={visibleBottomSheet}
        onBackButtonPress={() => {
          setVisibleBottomSheet(false);
        }}
        onBackdropPress={() => {
          setVisibleBottomSheet(false);
        }}
      >
        <View className="bg-white w-full p-4 justify-center items-center rounded-t-lg">
          <Controller
            control={control}
            name="count"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="bg-transparent w-full"
                mode="flat"
                label="매칭할 인원 수"
                maxLength={2}
                underlineColor="#4B5563"
                activeUnderlineColor="#2563EB"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="현재 콜에 매칭할 인원 수를 입력해 주세요."
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                style={{ paddingHorizontal: 0 }}
                error={!!errors.count}
              />
            )}
          />
          <Button
            mode="contained"
            className="bg-blue-600 w-full mt-8 rounded-xl py-1"
            onPress={handleSubmit(onTakeCallHandler)}
          >
            매칭
          </Button>
        </View>
      </BottomSheet>
    </React.Fragment>
  );
}
