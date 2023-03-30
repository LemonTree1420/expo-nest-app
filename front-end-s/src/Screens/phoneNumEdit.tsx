import axios from "axios";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import { API_HEADER } from "../constants/api";
import { formRegEx } from "../constants/regEx";
import { storeState } from "../recoil/atoms";
import getEnvVars from "../../environment";
import { onSignOutHandler, tokenValidateHandler } from "../constants/validate";
const { apiUrl } = getEnvVars();

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
    const token = await tokenValidateHandler(setStore, navigation);

    return await axios
      .patch(
        `${apiUrl}store/update/${store._id}`,
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
              onPress: async () => await onSignOutHandler(setStore, navigation),
            },
          ]);
        }
        console.error(err);
      });
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
