import Postcode from "@actbase/react-daum-postcode";
import { OnCompleteParams } from "@actbase/react-daum-postcode/lib/types";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Button, HelperText, Modal, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { PLATFORM_NAME } from "../constants/configure";
import { Ionicons } from "@expo/vector-icons";
import RegionSelect from "./modal/regionSelect";
import { useForm, Controller } from "react-hook-form";
import { basicRegEx, formRegEx } from "../constants/regEx";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { storeState } from "../recoil/atoms";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getEnvVars from "../../environment";
const { apiUrl, asyncStorageTokenName, notificationTokenName } = getEnvVars();

export default function SignUp({ navigation }: any) {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const focusScreen = navigation.addListener("focus", () => {
      setIdCheck(false);
      setCheckErr("");
      clearErrors();
      setRegionErr(false);
    });
    return focusScreen;
  }, [navigation]);

  const [idCheck, setIdCheck] = useState<boolean>(false);
  const [checkErr, setCheckErr] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(true);
  const [passwordCheckVisible, setPasswordCheckVisible] =
    useState<boolean>(true);
  const [region1, setRegion1] = useState<string>("");
  const [region2, setRegion2] = useState<string>("");
  const [regionErr, setRegionErr] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isRegionModal, setIsRegionModal] = useState<boolean>(false);
  const setStore = useSetRecoilState(storeState);

  const onUserIdCheckHandler = async () => {
    const userId = watch("userId");
    if (!userId || userId.length === 0) return false;
    return await axios
      .get(`${apiUrl}store/duplicate/${userId}`)
      .then((res) => idCheckSuccessHandler(res.data))
      .catch((err) => console.error(err));
  };

  const idCheckSuccessHandler = (data: boolean) => {
    if (data) {
      setIdCheck(true);
      setCheckErr("");
    } else {
      setIdCheck(false);
      setCheckErr("이미 사용중인 아이디입니다.");
    }
  };

  const onAddressHandler = (data: OnCompleteParams) => {
    setValue("address1", data.address, { shouldValidate: true });
    setRegion1(data.sido);
    setRegion2(data.sigungu);
    setRegionErr(false);
    setIsModalOpen(false);
  };

  const onSignUpHandler = async (data: any) => {
    if (!idCheck) return setCheckErr("아이디 중복체크를 해주세요.");
    if (data.password !== data.passwordCheck)
      return setError("passwordCheck", { type: "validate" });
    if (region1 === "" || region2 === "") return setRegionErr(true);

    delete data.passwordCheck;

    const notificationToken = await AsyncStorage.getItem(notificationTokenName);

    const signUpData = {
      ...data,
      region: `${region1} ${region2}`,
      notificationToken: notificationToken,
    };

    return await axios
      .post(`${apiUrl}store/register`, signUpData)
      .then((res) => signUpSuccessHandler(res.data))
      .catch((err) => {
        if (err.response.data.message === "cellPhoneNumber")
          setError("cellPhoneNumber", { type: "check" });
      });
  };

  const signUpSuccessHandler = async (data: any) => {
    await AsyncStorage.setItem(asyncStorageTokenName, data.token);
    delete data.token;
    setStore(data);
    return navigation.replace("token", { screen: "list" });
  };

  const regionModalProps = {
    region1,
    region2,
    setRegion1,
    setRegion2,
    setRegionErr,
    setIsRegionModal,
  };

  return (
    <React.Fragment>
      <ScrollView>
        <SafeAreaView className="flex-1 p-6">
          <View className="flex items-center">
            <Text className="text-3xl font-bold text-blue-600">
              {PLATFORM_NAME}
            </Text>
          </View>
          <View className="mt-16">
            <View className="flex-row justify-between items-center w-full">
              <Controller
                control={control}
                name="userId"
                rules={{ required: true, pattern: basicRegEx.ENGNUM }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="bg-transparent w-4/6"
                    mode="flat"
                    maxLength={12}
                    label="아이디"
                    underlineColor="#4B5563"
                    activeUnderlineColor="#2563EB"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(value) => {
                      setIdCheck(false);
                      onChange(value);
                    }}
                    placeholder="영문+숫자"
                    placeholderTextColor="#9CA3AF"
                    style={{ paddingHorizontal: 0 }}
                    error={!!errors.userId || checkErr !== ""}
                  />
                )}
              />
              <Button
                className="mt-2 w-auto"
                mode="outlined"
                textColor={watch("userId")?.length > 0 ? "#2563EB" : "#4B5563"}
                labelStyle={{ fontSize: 14 }}
                style={{
                  borderColor:
                    watch("userId")?.length > 0 ? "#2563EB" : "#4B5563",
                }}
                onPress={onUserIdCheckHandler}
              >
                중복확인
              </Button>
            </View>
            {errors.userId?.type === "pattern" && (
              <HelperText type="error" style={{ paddingHorizontal: 0 }}>
                형식에 맞게 입력하세요.
              </HelperText>
            )}
            {checkErr !== "" && (
              <HelperText type="error" style={{ paddingHorizontal: 0 }}>
                {checkErr}
              </HelperText>
            )}
            {idCheck && (
              <HelperText
                type="info"
                className="text-blue-600"
                style={{ paddingHorizontal: 0 }}
              >
                사용가능한 아이디입니다.
              </HelperText>
            )}
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
                    !!errors.passwordCheck ||
                    errors.password?.type === "validate"
                  }
                />
              )}
            />
            {errors.passwordCheck?.type === "validate" && (
              <HelperText type="error" style={{ paddingHorizontal: 0 }}>
                비밀번호가 일치하지 않습니다.
              </HelperText>
            )}
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
                  onChangeText={onChange}
                  placeholder="계정 찾기에 활용되는 암호 (숫자 6자리)"
                  placeholderTextColor="#9CA3AF"
                  style={{ paddingHorizontal: 0 }}
                  error={!!errors.pin}
                  keyboardType="numeric"
                />
              )}
            />
            {(errors.pin?.type === "pattern" ||
              errors.pin?.type === "minLength") && (
              <HelperText type="error" style={{ paddingHorizontal: 0 }}>
                형식에 맞게 입력하세요.
              </HelperText>
            )}
          </View>
          <View className="mt-8">
            <Controller
              control={control}
              name="name"
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="bg-transparent"
                  mode="flat"
                  label="업체명"
                  maxLength={12}
                  underlineColor="#4B5563"
                  activeUnderlineColor="#2563EB"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="업체명"
                  placeholderTextColor="#9CA3AF"
                  style={{ paddingHorizontal: 0 }}
                  error={!!errors.name}
                />
              )}
            />

            <Controller
              control={control}
              name="phoneNumber"
              rules={{ required: true, pattern: formRegEx.PH_NUM }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="bg-transparent"
                  mode="flat"
                  label="업체 전화번호"
                  maxLength={11}
                  underlineColor="#4B5563"
                  activeUnderlineColor="#2563EB"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  keyboardType="numeric"
                  placeholder="업체 전화번호 (- 제외)"
                  placeholderTextColor="#9CA3AF"
                  style={{ paddingHorizontal: 0 }}
                  error={!!errors.phoneNumber}
                />
              )}
            />
            {errors.phoneNumber?.type === "pattern" && (
              <HelperText type="error" style={{ paddingHorizontal: 0 }}>
                형식에 맞게 입력하세요.
              </HelperText>
            )}

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
                  keyboardType="numeric"
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
                이미 가입된 휴대폰번호입니다.
              </HelperText>
            )}
            <Controller
              control={control}
              name="address1"
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="bg-transparent"
                  mode="flat"
                  label="주소"
                  underlineColor="#4B5563"
                  activeUnderlineColor="#2563EB"
                  editable={false}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  right={
                    <TextInput.Icon
                      icon="magnify"
                      color="#000000"
                      onPress={() => {
                        setIsModalOpen(true);
                      }}
                    />
                  }
                  style={{ paddingHorizontal: 0 }}
                  error={!!errors.address1}
                />
              )}
            />
            <Controller
              control={control}
              name="address2"
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="bg-transparent"
                  mode="flat"
                  label="상세 주소"
                  maxLength={32}
                  editable={watch("address1")?.length > 0}
                  underlineColor="#4B5563"
                  activeUnderlineColor="#2563EB"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="상세 주소"
                  placeholderTextColor="#9CA3AF"
                  style={{ paddingHorizontal: 0 }}
                  error={!!errors.address2}
                />
              )}
            />
            <Pressable
              className={`rounded-md mt-2 bg-white p-3 ${
                regionErr ? "border-2 border-red-700" : "border border-gray-400"
              }`}
              onPress={() => {
                setIsRegionModal(true);
              }}
            >
              <Text>
                {region1 === "" || region2 === ""
                  ? "지역을 선택하세요."
                  : `${region1} ${region2}`}
              </Text>
            </Pressable>
          </View>
          <View className="mt-8">
            <Button
              mode="contained"
              onPress={handleSubmit(onSignUpHandler)}
              className="flex justify-center bg-blue-600 mt-2 py-1"
            >
              회원가입
            </Button>
          </View>
        </SafeAreaView>
      </ScrollView>
      <Modal
        visible={isModalOpen}
        onDismiss={() => setIsModalOpen(false)}
        contentContainerStyle={{ padding: 20 }}
      >
        <View className="flex flex-row justify-between items-center bg-black py-3 px-4">
          <Text variant="titleLarge" className="text-white">
            주소찾기
          </Text>
          <Ionicons
            name="close"
            size={32}
            color="#fff"
            onPress={() => {
              setIsModalOpen(false);
            }}
          />
        </View>
        <Postcode
          style={{
            width: "100%",
            height: "90%",
            borderWidth: 2,
          }}
          jsOptions={{ animation: true, hideMapBtn: true }}
          onSelected={onAddressHandler}
          onError={() => {}}
        />
      </Modal>
      <Modal
        visible={isRegionModal}
        onDismiss={() => setIsRegionModal(false)}
        contentContainerStyle={{ padding: 20 }}
      >
        <RegionSelect {...regionModalProps} />
      </Modal>
    </React.Fragment>
  );
}
