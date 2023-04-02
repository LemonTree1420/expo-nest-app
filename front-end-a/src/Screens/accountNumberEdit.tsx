import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { adminState } from "../recoil/atoms";
import { tokenValidateHandler } from "../constants/validate";
import axios from "axios";
import getEnvVars from "../../environment";
import { API_ERROR, API_HEADER } from "../constants/api";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, TextInput } from "react-native-paper";
const { apiUrl } = getEnvVars();

export default function AccountNumberEdit({ navigation }: any) {
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm();

  const [admin, setAdmin] = useRecoilState(adminState);

  useEffect(() => {
    setValue("accountNumber", admin?.accountNumber);
  }, []);

  const onEditHandler = async (data: any) => {
    const token = await tokenValidateHandler(setAdmin, navigation);
    return await axios
      .patch(
        `${apiUrl}manager/update/account/${admin._id}`,
        data,
        API_HEADER(token as string)
      )
      .then((res) => onEditSuccess(res.data))
      .catch((err) => onEditError(err));
  };

  const onEditSuccess = (data: any) => {
    setAdmin(data);
    return navigation.pop();
  };

  const onEditError = (err: any) => {
    API_ERROR(err, setAdmin, navigation);
    if (err.response.data.message === "accountNumber")
      setError("accountNumber", { type: "check" });
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <Controller
        control={control}
        name="accountNumber"
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
            error={!!errors.accountNumber}
          />
        )}
      />
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
