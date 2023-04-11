import axios from "axios";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import { storeState } from "../recoil/atoms";
import getEnvVars from "../../environment";
import { API_ERROR, API_HEADER } from "../constants/api";
import { tokenValidateHandler } from "../constants/validate";
import { moneyComma } from "../constants/regEx";
const { apiUrl } = getEnvVars();

export default function AddCall({ navigation }: any) {
  const {
    control,
    handleSubmit,

    formState: { errors },
  } = useForm();

  const [store, setStore] = useRecoilState(storeState);

  const onAddCallHandler = async (data: any) => {
    data.expectedAge = data.expectedAge.substring(0, 2);
    data.headCount = Number(data.headCount);
    data.fee = Number(data.fee.replaceAll(",", ""));
    if (!data.memo) delete data.memo;
    data.store = store._id;

    const token = await tokenValidateHandler(setStore, navigation);
    await axios
      .post(`${apiUrl}call/create`, data, API_HEADER(token))
      .then((res) => onAddCallSuccess())
      .catch((err) => onAddCallError(err));
  };

  const onAddCallSuccess = () => {
    navigation.navigate("token", { screen: "callList" });
  };

  const onAddCallError = (err: any) => {
    API_ERROR(err, setStore, navigation);
  };

  return (
    <React.Fragment>
      <SafeAreaView className="flex-1 p-6 h-full">
        <View>
          <Controller
            control={control}
            name="customerAge"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="bg-transparent"
                mode="flat"
                label="손님 나이"
                underlineColor="#4B5563"
                activeUnderlineColor="#2563EB"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                style={{ paddingHorizontal: 0 }}
                error={!!errors.customerAge}
              />
            )}
          />
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
                onChangeText={onChange}
                placeholder="요청 인원 수"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                style={{ paddingHorizontal: 0 }}
                error={!!errors.headCount}
              />
            )}
          />
          <Controller
            control={control}
            name="expectedAge"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="bg-transparent"
                mode="flat"
                label="요청 나이"
                underlineColor="#4B5563"
                activeUnderlineColor="#2563EB"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                style={{ paddingHorizontal: 0 }}
                error={!!errors.expectedAge}
              />
            )}
          />
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
                maxLength={300}
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
            onPress={handleSubmit(onAddCallHandler)}
            className="flex justify-center bg-blue-600 mt-2 py-1"
          >
            추가
          </Button>
        </View>
      </SafeAreaView>
    </React.Fragment>
  );
}
