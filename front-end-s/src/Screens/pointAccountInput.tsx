import { Controller, useForm } from "react-hook-form";
import { Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { tokenValidateHandler } from "../constants/validate";
import { useRecoilState } from "recoil";
import { storeState } from "../recoil/atoms";
import { AUTH } from "../constants/configure";
import axios from "axios";
import getEnvVars from "../../environment";
import { API_ERROR, API_HEADER } from "../constants/api";
const { apiUrl } = getEnvVars();

export default function PointAccountInput({ navigation, route }: any) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const pointData = route.params;
  const [store, setStore] = useRecoilState<any>(storeState);

  const onPayHandler = async (data: any) => {
    const token = await tokenValidateHandler(setStore, navigation);
    const postData = {
      ...data,
      request_id: store._id,
      request_auth: AUTH,
      depositAmount: pointData.money,
      requestPoint: pointData.point,
    };
    await axios
      .post(`${apiUrl}point/charge/request`, postData, API_HEADER(token))
      .then((res) => navigation.pop())
      .catch((err) => API_ERROR(err, setStore, navigation));
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
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
    </SafeAreaView>
  );
}
