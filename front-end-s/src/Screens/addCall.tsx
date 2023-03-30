import axios from "axios";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, ScrollView, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import { storeState } from "../recoil/atoms";
import AgeDialouge from "./dialog/age.dialog";
import getEnvVars from "../../environment";
import { API_HEADER } from "../constants/api";
import { tokenValidateHandler } from "../constants/validate";
import { moneyComma } from "../constants/regEx";
const { apiUrl } = getEnvVars();

export default function AddCall({ navigation }: any) {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  const [store, setStore] = useRecoilState(storeState);
  const [ageDialog, setAgeDialog] = useState<boolean>(false);
  const [inputKey, setInputKey] = useState<string>("");

  const onAddCallHandler = async (data: any) => {
    data.customerAge = Number(data.customerAge.substr(0, 2));
    data.expectedAge = Number(data.expectedAge.substr(0, 2));
    data.headCount = Number(data.headCount);
    data.fee = Number(data.fee.replaceAll(",", ""));
    if (!data.memo) delete data.memo;
    data.store = store._id;

    const token = await tokenValidateHandler(setStore, navigation);
    await axios
      .post(`${apiUrl}call/create`, data, API_HEADER(token))
      .then((res) => navigation.navigate("token", { screen: "list" }))
      .catch((err) => console.error(err));
  };

  const ageDialogProps = {
    visible: ageDialog,
    close: () => {
      setAgeDialog(false);
    },
    inputKey,
    value: watch(inputKey),
    setValue,
    clearErrors,
  };

  return (
    <ScrollView>
      <SafeAreaView className="flex-1 p-6">
        <View>
          <Controller
            control={control}
            name="customerAge"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Pressable
                onPress={() => {
                  setInputKey("customerAge");
                  setAgeDialog(true);
                }}
              >
                <TextInput
                  className="bg-transparent"
                  mode="flat"
                  label="손님 연령대"
                  editable={false}
                  underlineColor="#4B5563"
                  activeUnderlineColor="#2563EB"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={{ paddingHorizontal: 0 }}
                  error={!!errors.customerAge}
                />
              </Pressable>
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
              <Pressable
                onPress={() => {
                  setInputKey("expectedAge");
                  setAgeDialog(true);
                }}
              >
                <TextInput
                  className="bg-transparent"
                  mode="flat"
                  label="요청 연령대"
                  editable={false}
                  underlineColor="#4B5563"
                  activeUnderlineColor="#2563EB"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={{ paddingHorizontal: 0 }}
                  error={!!errors.expectedAge}
                />
              </Pressable>
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
            onPress={handleSubmit(onAddCallHandler)}
            className="flex justify-center bg-blue-600 mt-2 py-1"
          >
            추가
          </Button>
        </View>
      </SafeAreaView>
      <AgeDialouge {...ageDialogProps} />
    </ScrollView>
  );
}
