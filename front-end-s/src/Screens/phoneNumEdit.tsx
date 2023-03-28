import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import { API_HEADER, API_URL } from "../constants/api";
import { tks } from "../constants/asyncStorage";
import { formRegEx } from "../constants/regEx";
import { storeState } from "../recoil/atoms";

export default function PhoneNumEdit({ navigation }: any) {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [store, setStore] = useRecoilState(storeState);

  useEffect(() => {
    setValue("cellPhoneNumber", store?.cellPhoneNumber);
  }, []);

  const onEditHandler = async (data: any) => {
    const token = await AsyncStorage.getItem(tks);

    return await axios
      .patch(
        `${API_URL}store/update/${store._id}`,
        data,
        API_HEADER(token as string)
      )
      .then((res) => {
        setStore(res.data);
        return navigation.pop();
      })
      .catch((err) => {
        if (err.response.status === 401) {
          Alert.alert("", "인증 세션이 만료되었습니다.\n다시 로그인하세요.", [
            {
              text: "확인",
              onPress: onSignOutHandler,
            },
          ]);
        }
        console.error(err);
      });
  };

  const onSignOutHandler = async () => {
    await AsyncStorage.removeItem(tks);
    setStore(null);
    navigation.replace("noToken", { screen: "signIn" });
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
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
      <Button
        mode="contained"
        onPress={handleSubmit(onEditHandler)}
        className="flex justify-center bg-blue-600 mt-4 py-1 rounded-xl"
      >
        수정
      </Button>
    </SafeAreaView>
  );
}
