import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import {
  Button,
  Divider,
  HelperText,
  Text,
  TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSetRecoilState } from "recoil";
import { AUTH, PLATFORM_NAME } from "../constants/configure";
import { workerState } from "../recoil/atoms";
import getEnvVars from "../../environment";
const { apiUrl, asyncStorageTokenName, notificationTokenName } = getEnvVars();

export default function SignIn({ navigation }: any) {
  const { control, handleSubmit, watch, clearErrors } = useForm();

  const [passwordVisible, setPasswordVisible] = useState(true);
  const [checkAccount, setCheckAccount] = useState<string>("");
  const setWorker = useSetRecoilState(workerState);

  useEffect(() => {
    const focusScreen = navigation.addListener("focus", () => {
      setCheckAccount("");
      clearErrors();
    });
    return focusScreen;
  }, [navigation]);

  const onSignInHandler = async (data: any) => {
    const notificationToken = await AsyncStorage.getItem(notificationTokenName);
    const signInData = {
      ...data,
      notificationToken,
    };
    await axios
      .post(`${apiUrl}worker/login`, signInData)
      .then((res) => signInSuccess(res.data))
      .catch((err) =>
        setCheckAccount(
          "계정을 찾을 수 없습니다.\n아이디 혹은 비밀번호를 확인하고 다시 시도하세요."
        )
      );
  };

  const signInSuccess = async (data: any) => {
    await AsyncStorage.setItem(asyncStorageTokenName, data.token);
    delete data.token;
    setWorker(data);
    return navigation.replace("token", { screen: "callList" });
  };

  return (
    <SafeAreaView className="flex-1 justify-center p-8">
      <View className="flex items-center">
        <Text className="text-4xl font-bold text-blue-600">
          {PLATFORM_NAME}
        </Text>
        <Text className="text-sm font-bold text-blue-600">- {AUTH} - </Text>
      </View>
      <View className="mt-16">
        <Controller
          control={control}
          name="userId"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="w-full bg-transparent"
              mode="flat"
              label="아이디"
              underlineColor="#4B5563"
              activeUnderlineColor="#2563EB"
              maxLength={12}
              value={value}
              onBlur={onBlur}
              onChangeText={(value) => {
                setCheckAccount("");
                onChange(value);
              }}
              placeholder="아이디"
              placeholderTextColor="#9CA3AF"
              left={<TextInput.Icon icon={"account-outline"} />}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="w-full bg-transparent mt-4"
              mode="flat"
              label="비밀번호"
              underlineColor="#4B5563"
              activeUnderlineColor="#2563EB"
              secureTextEntry={passwordVisible}
              maxLength={16}
              left={<TextInput.Icon icon={"lock-outline"} />}
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
              onChangeText={(value) => {
                setCheckAccount("");
                onChange(value);
              }}
              placeholder="비밀번호"
              placeholderTextColor="#9CA3AF"
            />
          )}
        />
        {checkAccount !== "" && (
          <HelperText
            type="error"
            style={{ paddingHorizontal: 0, marginTop: 16 }}
          >
            {checkAccount}
          </HelperText>
        )}
        <Button
          mode="contained"
          onPress={handleSubmit(onSignInHandler)}
          className={`flex justify-center mt-8 py-1 ${
            watch("userId")?.length > 0 && watch("password")?.length > 0
              ? "bg-blue-600"
              : "bg-blue-400"
          }`}
        >
          로그인
        </Button>
      </View>
      <Divider className="divide-zinc-500 my-8" />
      <View className="flex flex-row justify-around items-center divide-x divide-zinc-500">
        <Text
          className="px-4 text-zinc-500"
          onPress={() => {
            navigation.navigate("noToken", { screen: "findIdStepOne" });
          }}
        >
          아이디 찾기
        </Text>
        <Text
          className="px-4 text-zinc-500"
          onPress={() => {
            navigation.navigate("noToken", { screen: "findPwStepOne" });
          }}
        >
          비밀번호 찾기
        </Text>
        <Text
          className="px-4 text-zinc-500"
          onPress={() => {
            navigation.navigate("noToken", { screen: "signUp" });
          }}
        >
          회원가입
        </Text>
      </View>
    </SafeAreaView>
  );
}
