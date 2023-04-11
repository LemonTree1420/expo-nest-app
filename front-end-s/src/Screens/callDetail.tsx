import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Linking, Pressable, ScrollView, View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { moneyComma } from "../constants/regEx";
import { FontAwesome } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { tokenValidateHandler } from "../constants/validate";
import { useSetRecoilState } from "recoil";
import { storeState } from "../recoil/atoms";
import axios from "axios";
import getEnvVars from "../../environment";
import { API_ERROR, API_HEADER } from "../constants/api";
const { apiUrl } = getEnvVars();

export default function CallDetail({ navigation, route }: any) {
  const call = route.params;
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const setStore = useSetRecoilState(storeState);
  const [phoneVisible, setPhoneVisible] = useState<boolean>(false);

  useEffect(() => {
    setValue("headCount", call.headCount.toString());
    setValue("fee", moneyComma(call.fee.toString()));
    if (call.memo) setValue("memo", call.memo);
  }, []);

  const onPhoneCallHandler = async (str: string) => {
    const url = `tel://${str}`;
    Linking.openURL(url);
  };

  const onEditCallHandler = async (data: any) => {
    if (Number(data.headCount) < call.nowCount)
      return setError("headCount", { type: "check" });
    data.headCount = Number(data.headCount);
    data.fee = Number(data.fee.replaceAll(",", ""));
    if (!data.memo) delete data.memo;

    const token = await tokenValidateHandler(setStore, navigation);
    await axios
      .patch(`${apiUrl}call/update/store/${call._id}`, data, API_HEADER(token))
      .then((res) => navigation.navigate("token", { screen: "callList" }))
      .catch((err) => API_ERROR(err, setStore, navigation));
  };

  const onDeleteCallHandler = () => {
    Alert.alert("", "콜을 마감하시겠습니까?", [
      { text: "확인", onPress: () => onDeleteCallAxios() },
      { text: "취소" },
    ]);
  };

  const onDeleteCallAxios = async () => {
    const token = await tokenValidateHandler(setStore, navigation);
    await axios
      .delete(`${apiUrl}call/delete/${call._id}`, API_HEADER(token))
      .then((res) => navigation.navigate("token", { screen: "callList" }))
      .catch((err) => API_ERROR(err, setStore, navigation));
  };

  return (
    <ScrollView>
      <SafeAreaView className="flex-1" edges={["bottom", "left", "right"]}>
        <View className="flex items-center bg-blue-600 w-full pt-2 pb-4">
          <View className="flex items-center">
            <Text className="font-bold text-white">
              손님 나이 : {call.customerAge}
            </Text>
            <Text className="font-bold text-white mb-2">
              요청 나이 : {call.expectedAge}
            </Text>
            <Text className="font-bold text-lg text-white">
              현재 매칭된 인원 : {call.nowCount}명
            </Text>
            {call.nowCount > 0 && (
              <React.Fragment>
                {phoneVisible ? (
                  <Octicons
                    name="triangle-up"
                    size={48}
                    color="#fff"
                    onPress={() => setPhoneVisible(false)}
                  />
                ) : (
                  <Octicons
                    name="triangle-down"
                    size={48}
                    color="#fff"
                    onPress={() => setPhoneVisible(true)}
                  />
                )}
              </React.Fragment>
            )}
          </View>
          {phoneVisible &&
            call.workers.map((item: any) => (
              <Pressable
                key={item.cellPhoneNumber}
                className="flex-row items-center"
                onPress={() => onPhoneCallHandler(item.cellPhoneNumber)}
              >
                <FontAwesome name="phone-square" size={24} color="#fff" />
                <Text className="mx-2 text-lg text-white">
                  {item.cellPhoneNumber}
                </Text>
              </Pressable>
            ))}
        </View>
        <View className="px-6">
          <View className="mt-8">
            <Controller
              control={control}
              name="headCount"
              rules={{ required: true, validate: (value) => value !== "0" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="bg-transparent"
                  mode="flat"
                  label="요청 인원 수"
                  maxLength={2}
                  underlineColor="#4B5563"
                  activeUnderlineColor="#2563EB"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={(value) => {
                    clearErrors("headCount");
                    onChange(value);
                  }}
                  placeholder="요청 인원 수"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  style={{ paddingHorizontal: 0 }}
                  error={!!errors.headCount}
                />
              )}
            />
            {errors.headCount?.type === "check" && (
              <HelperText type="error" style={{ paddingHorizontal: 0 }}>
                요청 인원 수가 현재 매칭 인원 수보다 적습니다.
              </HelperText>
            )}
            <Controller
              control={control}
              name="fee"
              rules={{ required: true, validate: (value) => value !== "0" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="bg-transparent"
                  mode="flat"
                  label="요금"
                  maxLength={13}
                  underlineColor="#4B5563"
                  activeUnderlineColor="#2563EB"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={(value) => {
                    value = value.replaceAll(",", "");
                    value = moneyComma(value);
                    return onChange(value);
                  }}
                  placeholder="요금"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  style={{ paddingHorizontal: 0 }}
                  error={!!errors.fee}
                />
              )}
            />
            <Controller
              control={control}
              name="memo"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="bg-transparent h-40"
                  mode="flat"
                  label="메모"
                  maxLength={100}
                  underlineColor="#4B5563"
                  activeUnderlineColor="#2563EB"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  multiline
                  placeholder="메모 (100자 이내)"
                  placeholderTextColor="#9CA3AF"
                  style={{ paddingHorizontal: 0 }}
                  error={!!errors.memo}
                />
              )}
            />
          </View>
          <View className="mt-8">
            <Button
              mode="contained"
              onPress={handleSubmit(onEditCallHandler)}
              className="flex justify-center bg-blue-600 mt-2 py-1"
            >
              수정
            </Button>
            <Button
              mode="outlined"
              onPress={onDeleteCallHandler}
              textColor="#2563EB"
              className="flex justify-center bg-white border-blue-600 mt-2 py-1"
            >
              마감
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
