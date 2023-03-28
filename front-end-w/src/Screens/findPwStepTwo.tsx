import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Text, View } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { formRegEx } from "../constants/regEx";
import getEnvVars from "../../environment";
const { apiUrl } = getEnvVars();

export default function FindPwStepTwo({ navigation, route }: any) {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const _id = route.params;

  const [passwordVisible, setPasswordVisible] = useState<boolean>(true);
  const [passwordCheckVisible, setPasswordCheckVisible] =
    useState<boolean>(true);

  useEffect(() => {
    const focusScreen = navigation.addListener("focus", () => {
      setValue("password", "");
      setValue("passwordCheck", "");
      if (!_id || _id === "") {
        Alert.alert("", "비정상적인 접근입니다.", [
          {
            text: "확인",
            onPress: () => navigation.replace("noToken", { screen: "signIn" }),
          },
        ]);
      }
    });
    return focusScreen;
  }, [navigation, _id]);

  const onChangePwHandler = async (data: any) => {
    const changeData = {
      password: data.password,
    };
    await axios
      .patch(`${apiUrl}worker/update/password/${_id}`, changeData)
      .then((res) => changeSuccessHandler(res.data))
      .catch((err) => console.error(err));
  };

  const changeSuccessHandler = (result: any) => {
    if (result) {
      return navigation.navigate("noToken", {
        screen: "findPwStepThree",
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <View className="flex-row justify-center">
        <Text className="text-md text-gray-500">
          새로운 비밀번호를 입력해 주세요.
        </Text>
      </View>
      <View className="mt-8">
        <Controller
          control={control}
          name="password"
          rules={{
            required: true,
            pattern: formRegEx.PASSWORD,
            minLength: 8,
            maxLength: 16,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="bg-transparent"
              mode="flat"
              label="비밀번호"
              underlineColor="#4B5563"
              activeUnderlineColor="#2563EB"
              secureTextEntry={passwordVisible}
              maxLength={16}
              right={
                value?.length > 0 && (
                  <TextInput.Icon
                    icon={passwordVisible ? "eye" : "eye-off"}
                    onPress={() => setPasswordVisible(!passwordVisible)}
                  />
                )
              }
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              style={{ paddingHorizontal: 0 }}
              placeholder="영문+숫자+특수문자 (8~16자리)"
              placeholderTextColor="#9CA3AF"
              error={!!errors.password}
            />
          )}
        />
        {(errors.password?.type === "pattern" ||
          errors.password?.type === "minLength") && (
          <HelperText type="error" style={{ paddingHorizontal: 0 }}>
            형식에 맞게 입력하세요.
          </HelperText>
        )}
        <Controller
          control={control}
          name="passwordCheck"
          rules={{
            required: true,
            validate: (value) => watch("password") === value,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="bg-transparent"
              mode="flat"
              label="비밀번호 확인"
              maxLength={16}
              underlineColor="#4B5563"
              activeUnderlineColor="#2563EB"
              secureTextEntry={passwordCheckVisible}
              right={
                value?.length > 0 && (
                  <TextInput.Icon
                    icon={passwordCheckVisible ? "eye" : "eye-off"}
                    onPress={() =>
                      setPasswordCheckVisible(!passwordCheckVisible)
                    }
                  />
                )
              }
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="비밀번호 재입력"
              placeholderTextColor="#9CA3AF"
              style={{ paddingHorizontal: 0 }}
              error={
                !!errors.passwordCheck || errors.password?.type === "validate"
              }
            />
          )}
        />
        {errors.passwordCheck?.type === "validate" && (
          <HelperText type="error" style={{ paddingHorizontal: 0 }}>
            비밀번호가 일치하지 않습니다.
          </HelperText>
        )}

        <Button
          mode="contained"
          onPress={handleSubmit(onChangePwHandler)}
          className="flex justify-center bg-blue-600 mt-4 py-1 rounded-xl"
        >
          확인
        </Button>
      </View>
    </SafeAreaView>
  );
}
