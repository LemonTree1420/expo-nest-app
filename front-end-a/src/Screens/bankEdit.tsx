import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { adminState } from "../recoil/atoms";
import { tokenValidateHandler } from "../constants/validate";
import axios from "axios";
import getEnvVars from "../../environment";
import { API_ERROR, API_HEADER } from "../constants/api";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, TextInput } from "react-native-paper";
import BankDialog from "./dialog/bank.dialog";
import { Pressable } from "react-native";
const { apiUrl } = getEnvVars();

export default function BankEdit({ navigation }: any) {
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm();

  const [admin, setAdmin] = useRecoilState(adminState);
  const [bankDialog, setBankDialog] = useState<boolean>(false);

  useEffect(() => {
    setValue("bank", admin?.bank);
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
    if (err.response.data.message === "bank")
      setError("bank", { type: "check" });
  };

  const bankDialogProps = {
    visible: bankDialog,
    close: () => {
      setBankDialog(false);
    },
    value: watch("bank"),
    setValue,
    clearErrors,
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <Controller
        control={control}
        name="bank"
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Pressable
            onPress={() => {
              setBankDialog(true);
            }}
          >
            <TextInput
              className="bg-transparent w-full"
              mode="flat"
              label="은행"
              editable={false}
              underlineColor="#4B5563"
              activeUnderlineColor="#2563EB"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="은행"
              placeholderTextColor="#9CA3AF"
              style={{ paddingHorizontal: 0 }}
              error={!!errors.bank}
            />
          </Pressable>
        )}
      />
      <Button
        mode="contained"
        onPress={handleSubmit(onEditHandler)}
        className="flex justify-center bg-blue-600 mt-4 py-1 rounded-xl"
      >
        수정
      </Button>
      <BankDialog {...bankDialogProps} />
    </SafeAreaView>
  );
}
