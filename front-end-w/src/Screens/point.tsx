import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Share, View } from "react-native";
import { Button, Divider, Snackbar, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { moneyList } from "../constants/money";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomSheet } from "react-native-btr";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import getEnvVars from "../../environment";
import axios from "axios";
import { workerState } from "../recoil/atoms";
import { useRecoilState } from "recoil";
import { tokenValidateHandler } from "../constants/validate";
import { API_ERROR, API_HEADER } from "../constants/api";
import { Controller, useForm } from "react-hook-form";
import { AUTH } from "../constants/configure";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const { apiUrl } = getEnvVars();

export default function Point({ navigation }: any) {
  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  const [worker, setWorker] = useRecoilState<any>(workerState);
  const [money, setMoney] = useState<number>(0);
  const [point, setPoint] = useState<number>(0);
  const [account, setAccount] = useState<any>(null);
  const [visibleBottomSheet, setVisibleBottomSheet] = useState<boolean>(false);
  const [visibleSnackBar, setVisibleSnackBar] = useState<boolean>(false);
  const [pointSnackBar, setPointSnackBar] = useState<boolean>(false);

  const getWorkerInfo = async () => {
    const token = await tokenValidateHandler(setWorker, navigation);
    await axios
      .get(`${apiUrl}worker/search/${worker._id}`, API_HEADER(token))
      .then((res) => setWorker(res.data))
      .catch((err) => API_ERROR(err, setWorker, navigation));
  };

  const getManagerAccount = async () => {
    const token = await tokenValidateHandler(setWorker, navigation);
    await axios
      .get(`${apiUrl}manager/account`, API_HEADER(token))
      .then((res) => setAccount(res.data))
      .catch((err) => API_ERROR(err, setWorker, navigation));
  };

  useEffect(() => {
    const focusScreen = navigation.addListener("focus", () => {
      getWorkerInfo();
      getManagerAccount();
    });
    return focusScreen;
  }, [navigation]);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(account?.accountNumber.replaceAll("-", ""));
    setVisibleBottomSheet(false);
  };

  const onShareHandler = async () => {
    Share.share({
      message: `${account?.bank} ${account?.accountNumber.replaceAll("-", "")}`,
    });
  };

  useEffect(() => {
    const focusScreen = navigation.addListener("focus", () => {
      setMoney(0);
      setPoint(0);
      clearErrors();
      setValue("requestBankHolder", "");
    });
    return focusScreen;
  }, [navigation]);

  const onPayHandler = async (data: any) => {
    if (money === 0 || point === 0) return setVisibleSnackBar(true);
    const token = await tokenValidateHandler(setWorker, navigation);
    const postData = {
      ...data,
      request_id: worker._id,
      request_auth: AUTH,
      depositAmount: money,
      requestPoint: point,
      managerUserId: worker.managerUserId,
    };
    await axios
      .post(`${apiUrl}point/charge/request`, postData, API_HEADER(token))
      .then((res) =>
        Alert.alert("", "포인트 요청 완료", [
          {
            text: "확인",
            onPress: () =>
              navigation.navigate("sub", { screen: "pointChargeList" }),
          },
        ])
      )
      .catch((err) => API_ERROR(err, setWorker, navigation));
  };

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1">
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <View className="flex items-center h-32 w-full bg-blue-600">
          <Text variant="bodyLarge" className="text-blue-800">
            사용가능 포인트
          </Text>
          <Text className="text-white font-bold text-5xl mt-4">
            {worker.point}P
          </Text>
        </View>
        <View className="w-full py-4">
          <View className="flex items-center justify-center w-full">
            <View className="flex w-11/12 bg-white py-4 px-4 rounded-md">
              <View className="flex flex-row justify-between">
                {moneyList.map((item) => (
                  <Pressable
                    key={item.label}
                    className={`flex justify-center items-center border rounded-md h-16 w-20
                  ${
                    item.value === money
                      ? "bg-blue-300 border-blue-600"
                      : "bg-white border-black"
                  }`}
                    onPress={() => {
                      setMoney(item.value);
                      setPoint(item.pValue);
                    }}
                  >
                    <View
                      key={item.label}
                      className="flex justify-center items-center"
                    >
                      <Text className="font-bold">&#8361;{item.label}</Text>
                      <Text>&#43;{item.pValue}p</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
              <View className="w-full mt-2">
                <Controller
                  control={control}
                  name="requestBankHolder"
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="bg-transparent w-full"
                      mode="flat"
                      label="예금주"
                      maxLength={12}
                      underlineColor="#4B5563"
                      activeUnderlineColor="#2563EB"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder="예금주"
                      placeholderTextColor="#9CA3AF"
                      style={{ paddingHorizontal: 0 }}
                      error={!!errors.requestBankHolder}
                    />
                  )}
                />
              </View>
              <View className="flex w-full mt-4">
                <View className="flex">
                  <View className="flex-row mb-2">
                    <Text className="text-lg font-bold">
                      &#8251; 포인트 충전 방법
                    </Text>
                    <Text className="text-lg font-bold text-red-600">
                      {" "}
                      (필독)
                    </Text>
                  </View>
                  <Text className="text-base text-slate-600">
                    1. 원하시는 금액을 선택해 충전하세요.
                  </Text>
                  <Text className="text-base text-slate-600">
                    2. 해당 금액을 아래 계좌에 입금해주세요.
                  </Text>
                  <Text className="text-base text-slate-600">
                    3. 입금이 확인되면, 포인트가 충전됩니다.
                  </Text>
                  <Text className="text-md text-slate-600 mt-2">
                    * 포인트가 충전되기까지 시간이 지연될 수 있습니다.
                  </Text>
                </View>
              </View>
            </View>
            <Button
              mode="contained"
              className="w-11/12 bg-blue-600 mt-4 py-1 rounded-xl"
              labelStyle={{
                fontSize: 16,
              }}
              onPress={handleSubmit(onPayHandler)}
              icon={() => (
                <MaterialCommunityIcons
                  name="lightning-bolt"
                  size={20}
                  color="#fff"
                />
              )}
            >
              충전
            </Button>
          </View>
          <View className="w-full flex justify-center items-center mt-4">
            <View className="rounded-xl bg-cyan-700/90 py-4 px-6 w-11/12 shadow shadow-cyan-500/90">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-xl text-white">{account?.bank}</Text>
                <Entypo
                  name="dots-three-vertical"
                  size={22}
                  color="#fff"
                  onPress={() => {
                    setVisibleBottomSheet(true);
                  }}
                />
              </View>
              <Text className="text-xl text-white">
                {account?.accountHolder}
              </Text>
              <Text className="text-xl font-bold text-white">
                {account?.accountNumber}
              </Text>
            </View>
          </View>
        </View>
        <BottomSheet
          visible={visibleBottomSheet}
          onBackButtonPress={() => {
            setVisibleBottomSheet(false);
          }}
          onBackdropPress={() => {
            setVisibleBottomSheet(false);
          }}
        >
          <View className="bg-white w-full h-36 justify-center items-center rounded-t-lg">
            <Pressable
              className="w-full flex-row items-center py-2 px-4"
              onPress={copyToClipboard}
            >
              <Ionicons name="copy-outline" size={24} color="#475569" />
              <Text className="text-xl text-slate-600 ml-4">계좌 복사</Text>
            </Pressable>
            <Divider className="mt-4" />
            <Pressable
              className="w-full flex-row items-center py-2 px-4"
              onPress={onShareHandler}
            >
              <Entypo name="share" size={24} color="#475569" />
              <Text className="text-xl text-slate-600 ml-4">계좌 공유</Text>
            </Pressable>
          </View>
        </BottomSheet>
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
            <Text className="ml-2 text-white">충전하실 금액을 선택하세요.</Text>
          </View>
        </Snackbar>
        <Snackbar
          className="bg-gray-600"
          visible={pointSnackBar}
          onDismiss={() => setPointSnackBar(false)}
          action={{
            label: "x",
            labelStyle: {
              color: "#fff",
            },
            onPress: () => {
              setPointSnackBar(false);
            },
          }}
          duration={2000}
        >
          <View className="flex-row items-center">
            <Entypo name="warning" size={18} color="#fff" />
            <Text className="ml-2 text-white">충전 요청이 발송되었습니다.</Text>
          </View>
        </Snackbar>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
