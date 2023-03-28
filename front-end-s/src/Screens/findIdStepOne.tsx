import axios from "axios";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_URL } from "../constants/api";
import { formRegEx } from "../constants/regEx";

export default function FindIdStepOne({ navigation }: any) {
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const focusScreen = navigation.addListener("focus", () => {
      setValue("cellPhoneNumber", "");
    });
    return focusScreen;
  }, [navigation]);

  const onFindHandler = async (data: any) => {
    await axios
      .get(`${API_URL}store/find/account/${data.cellPhoneNumber}`)
      .then((res) => findSuccessHandler(res.data))
      .catch((err) => setError("cellPhoneNumber", { type: "check" }));
  };

  const findSuccessHandler = (result: any) => {
    if (result) {
      clearErrors("cellPhoneNumber");
      return navigation.navigate("noToken", {
        screen: "findIdStepTwo",
        params: result,
      });
    } else setError("cellPhoneNumber", { type: "check" });
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <View className="flex-row justify-center">
        <Text className="text-md text-gray-500">
          회원가입 시 입력하신 휴대폰 번호를 입력해 주세요.
        </Text>
      </View>
      <View className="mt-8">
        <Controller
          control={control}
          name="cellPhoneNumber"
          rules={{ required: true, pattern: formRegEx.HP_NUM }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="bg-transparent"
              mode="flat"
              label="휴대폰 번호"
              maxLength={11}
              underlineColor="#4B5563"
              activeUnderlineColor="#2563EB"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              inputMode="tel"
              placeholder="휴대폰 번호 (- 제외)"
              placeholderTextColor="#9CA3AF"
              style={{ paddingHorizontal: 0 }}
              error={!!errors.cellPhoneNumber}
            />
          )}
        />
        {errors.cellPhoneNumber?.type === "pattern" && (
          <HelperText type="error" style={{ paddingHorizontal: 0 }}>
            형식에 맞게 입력하세요.
          </HelperText>
        )}
        {errors.cellPhoneNumber?.type === "check" && (
          <HelperText type="error" style={{ paddingHorizontal: 0 }}>
            가입하신 계정이 없습니다.
          </HelperText>
        )}
        <Button
          mode="contained"
          onPress={handleSubmit(onFindHandler)}
          className="flex justify-center bg-blue-600 mt-4 py-1 rounded-xl"
        >
          확인
        </Button>
      </View>
    </SafeAreaView>
  );
}
