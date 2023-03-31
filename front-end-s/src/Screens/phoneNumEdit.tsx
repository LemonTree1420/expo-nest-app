import axios from "axios";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, HelperText, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import { API_ERROR, API_HEADER } from "../constants/api";
import { formRegEx } from "../constants/regEx";
import { storeState } from "../recoil/atoms";
import getEnvVars from "../../environment";
import { tokenValidateHandler } from "../constants/validate";
const { apiUrl } = getEnvVars();

export default function PhoneNumEdit({ navigation }: any) {
  const {
    control,
    handleSubmit,
    setValue,
    setError,
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
      .then((res) => onEditSuccess(res.data))
      .catch((err) => onEditError(err));
  };

  const onEditSuccess = (data: any) => {
    setStore(data);
    return navigation.pop();
  };

  const onEditError = (err: any) => {
    API_ERROR(err, setStore, navigation);
    if (err.response.data.message === "cellPhoneNumber")
      setError("cellPhoneNumber", { type: "check" });
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
      {errors.cellPhoneNumber?.type === "check" && (
        <HelperText type="error" style={{ paddingHorizontal: 0 }}>
          이미 가입된 휴대폰번호입니다.
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
