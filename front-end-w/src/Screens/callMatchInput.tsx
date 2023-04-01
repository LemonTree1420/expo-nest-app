import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { Button, Snackbar, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import { workerState } from "../recoil/atoms";
import { DEDUCT_POINT } from "../constants/point";
import { tokenValidateHandler } from "../constants/validate";
import axios from "axios";
const { apiUrl } = getEnvVars();
import getEnvVars from "../../environment";
import { useState } from "react";
import { API_ERROR, API_HEADER } from "../constants/api";
import { Entypo } from "@expo/vector-icons";

export default function CallMatchInput({ navigation, route }: any) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const call = route.params;

  const [worker, setWorker] = useRecoilState(workerState);
  const [visibleSnackBar, setVisibleSnackBar] = useState<boolean>(false);

  const onTakeCallHandler = async (data: any) => {
    if (worker.point * data.count < DEDUCT_POINT * data.count) {
      setVisibleSnackBar(true);
    }
    const token = await tokenValidateHandler(setWorker, navigation);
    const patchData = {
      cellPhoneNumber: worker.cellPhoneNumber,
      count: data.count,
    };
    await axios
      .patch(`${apiUrl}call/take/${call._id}`, patchData, API_HEADER(token))
      .then((res) => onTakeCallSuccess())
      .catch((err) => onTakeCallError(err));
  };

  const onTakeCallSuccess = () => {
    setWorker({ ...worker, point: worker.point - DEDUCT_POINT });
    navigation.navigate("token", { screen: "callMatchList" });
  };

  const onTakeCallError = (err: any) => {
    API_ERROR(err, setWorker, navigation);
    if (err.response.data.message.includes("Point"))
      return setVisibleSnackBar(true);
  };
  return (
    <SafeAreaView className="flex-1 bg-white px-4">
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
        className="bg-blue-600 w-full mt-4 py-1 rounded-xl"
        onPress={handleSubmit(onTakeCallHandler)}
      >
        매칭
      </Button>
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
  );
}
