import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { basicRegEx } from "../constants/regEx";
import getEnvVars from "../../environment";
const { apiUrl } = getEnvVars();

export default function FindPwStepOne({ navigation }: any) {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm();

  const [checkErr, setCheckErr] = useState<string>("");

  useEffect(() => {
    const focusScreen = navigation.addListener("focus", () => {
      setValue("userId", "");
      setValue("pin", "");
    });
    return focusScreen;
  }, [navigation]);

  const onFindHandler = async (data: any) => {
    await axios
      .post(`${apiUrl}worker/validate/pin`, data)
      .then((res) => findSuccessHandler(res.data))
      .catch((err) =>
        setCheckErr(
          "계정을 찾을 수 없습니다.\n아이디 혹은 PIN 번호를 확인하고 다시 시도하세요."
        )
      );
  };

  const findSuccessHandler = (result: any) => {
    if (result) {
      clearErrors("userId");
      clearErrors("pin");
      return navigation.navigate("noToken", {
        screen: "findPwStepTwo",
        params: result._id,
      });
    } else
      setCheckErr(
        "계정을 찾을 수 없습니다.\n아이디 혹은 PIN 번호를 확인하고 다시 시도하세요."
      );
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <View className="flex-row justify-center">
        <Text className="text-md text-gray-500">
          회원가입 시 입력하신 아이디와 PIN 번호를 입력해 주세요.
        </Text>
      </View>
      <View className="mt-8">
        <Controller
          control={control}
          name="userId"
          rules={{ required: true, pattern: basicRegEx.ENGNUM }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="w-full bg-transparent"
              mode="flat"
              maxLength={12}
              label="아이디"
              underlineColor="#4B5563"
              activeUnderlineColor="#2563EB"
              value={value}
              onBlur={onBlur}
              onChangeText={(value) => {
                setCheckErr("");
                onChange(value);
              }}
              placeholder="아이디"
              placeholderTextColor="#9CA3AF"
              style={{ paddingHorizontal: 0 }}
              error={!!errors.userId}
            />
          )}
        />
        <Controller
          control={control}
          name="pin"
          rules={{
            required: true,
            pattern: basicRegEx.NUM,
            minLength: 6,
            maxLength: 6,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              maxLength={6}
              className="bg-transparent"
              mode="flat"
              label="PIN 번호"
              underlineColor="#4B5563"
              activeUnderlineColor="#2563EB"
              value={value}
              onBlur={onBlur}
              onChangeText={(value) => {
                setCheckErr("");
                onChange(value);
              }}
              placeholder="PIN 번호"
              placeholderTextColor="#9CA3AF"
              style={{ paddingHorizontal: 0 }}
              error={!!errors.pin}
              inputMode="numeric"
            />
          )}
        />
        {(errors.pin?.type === "pattern" ||
          errors.pin?.type === "minLength") && (
          <HelperText type="error" style={{ paddingHorizontal: 0 }}>
            형식에 맞게 입력하세요.
          </HelperText>
        )}
        {checkErr !== "" && (
          <HelperText type="error" style={{ paddingHorizontal: 0 }}>
            {checkErr}
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
