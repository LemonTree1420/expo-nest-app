import { useEffect, useState } from "react";
import { Pressable, Share, View } from "react-native";
import { Button, Divider, Snackbar, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ACCOUNT_BANK,
  ACCOUNT_NUM,
  ACCOUNT_OWNER,
  AUTH,
} from "../constants/configure";
import { moneyList } from "../constants/money";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomSheet } from "react-native-btr";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import getEnvVars from "../../environment";
import axios from "axios";
import { storeState } from "../recoil/atoms";
import { useRecoilState } from "recoil";
import { tokenValidateHandler } from "../constants/validate";
import { API_ERROR, API_HEADER } from "../constants/api";
import { Controller, useForm } from "react-hook-form";
const { apiUrl } = getEnvVars();

export default function Point({ navigation }: any) {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [store, setStore] = useRecoilState<any>(storeState);
  const [money, setMoney] = useState<number>(0);
  const [point, setPoint] = useState<number>(0);
  const [visibleBottomSheet, setVisibleBottomSheet] = useState<boolean>(false);
  const [pointBottomSheet, setPointBottomSheet] = useState<boolean>(false);
  const [visibleSnackBar, setVisibleSnackBar] = useState<boolean>(false);
  const [pointSnackBar, setPointSnackBar] = useState<boolean>(false);

  const getWorkerInfo = async () => {
    const token = await tokenValidateHandler(setStore, navigation);
    await axios
      .get(`${apiUrl}store/search/${store._id}`, API_HEADER(token))
      .then((res) => setStore(res.data))
      .catch((err) => API_ERROR(err, setStore, navigation));
  };

  useEffect(() => {
    const focusScreen = navigation.addListener("focus", () => {
      getWorkerInfo();
    });
    return focusScreen;
  }, [navigation]);

  const onInputPayHandler = () => {
    if (money === 0 || point === 0) setVisibleSnackBar(true);
    else setPointBottomSheet(true);
  };

  const onPayHandler = async (data: any) => {
    const token = await tokenValidateHandler(setStore, navigation);
    const postData = {
      ...data,
      request_id: store._id,
      request_auth: AUTH,
      depositAmount: money,
      requestPoint: point,
    };
    await axios
      .post(`${apiUrl}point/charge/request`, postData, API_HEADER(token))
      .then((res) => setPointBottomSheet(false))
      .catch((err) => API_ERROR(err, setStore, navigation));
  };

  useEffect(() => {
    if (!pointBottomSheet) {
      setValue("requestBankHolder", "");
      setValue("requestBankAccountNum", "");
      setMoney(0);
      setPoint(0);
    }
  }, [pointBottomSheet]);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(ACCOUNT_NUM.replaceAll("-", ""));
    setVisibleBottomSheet(false);
  };

  const onShareHandler = async () => {
    Share.share({
      message: `${ACCOUNT_BANK} ${ACCOUNT_NUM.replaceAll("-", "")}`,
    });
  };

  useEffect(() => {
    const focusScreen = navigation.addListener("focus", () => {
      setMoney(0);
      setPoint(0);
    });
    return focusScreen;
  }, [navigation]);

  return (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      className="flex-1 items-center justify-between"
    >
      <View className="flex items-center w-full bg-blue-600 pt-4 pb-40">
        <Text variant="bodyLarge" className="text-blue-800">
          사용가능 포인트
        </Text>
        <Text className="text-white font-bold text-5xl mt-4">
          {store.point}P
        </Text>
      </View>
      <View className="absolute top-36 left-1/2 transform -translate-x-6 rotate-45 w-12 h-12 bg-white"></View>
      <View className="absolute top-36 w-11/12">
        <View className="flex bg-white py-6 px-4 rounded-md">
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
          <Divider className="divide-zinc-500 my-8" />
          <View className="flex">
            <View className="flex">
              <View className="flex-row mb-2">
                <Text className="text-lg font-bold">
                  &#8251; 포인트 충전 방법
                </Text>
                <Text className="text-lg font-bold text-red-600"> (필독)</Text>
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
        <View>
          <Button
            mode="contained"
            onPress={onInputPayHandler}
            icon={() => (
              <MaterialCommunityIcons
                name="lightning-bolt"
                size={20}
                color="#fff"
              />
            )}
            className="bg-blue-600 mt-2 py-1"
            labelStyle={{
              fontSize: 16,
            }}
          >
            충전
          </Button>
        </View>
      </View>
      <View className="rounded-xl bg-cyan-700/90 py-4 px-6 w-11/12 mb-4 shadow shadow-cyan-500/90">
        <View className="flex-row justify-between items-center mb-8">
          <Text className="text-lg text-white">{ACCOUNT_BANK}</Text>
          <Entypo
            name="dots-three-vertical"
            size={20}
            color="#fff"
            onPress={() => {
              setVisibleBottomSheet(true);
            }}
          />
        </View>
        <Text className="text-lg text-white">{ACCOUNT_OWNER}</Text>
        <Text className="text-lg font-bold text-white">{ACCOUNT_NUM}</Text>
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
      <BottomSheet
        visible={pointBottomSheet}
        onBackButtonPress={() => {
          setPointBottomSheet(false);
        }}
        onBackdropPress={() => {
          setPointBottomSheet(false);
        }}
      >
        <View className="bg-white w-full p-4 justify-center items-center rounded-t-lg">
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
          <Controller
            control={control}
            name="requestBankAccountNum"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="bg-transparent w-full"
                mode="flat"
                label="계좌번호"
                maxLength={14}
                underlineColor="#4B5563"
                activeUnderlineColor="#2563EB"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="계좌번호(- 제외)"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                style={{ paddingHorizontal: 0 }}
                error={!!errors.requestBankAccountNum}
              />
            )}
          />
          <Button
            mode="contained"
            className="w-full bg-blue-600 mt-4 py-1 rounded-xl"
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
    </SafeAreaView>
  );
}
