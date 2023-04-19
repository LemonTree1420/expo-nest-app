import axios from "axios";
import React, { useEffect, useState } from "react";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { adminState, settlementRefreshState } from "../recoil/atoms";
import getEnvVars from "../../environment";
const { apiUrl } = getEnvVars();
import { API_ERROR, API_HEADER } from "../constants/api";
import { tokenValidateHandler } from "../constants/validate";
import { Pressable, View } from "react-native";
import Loading from "./loading";
import TodaySettlement from "./todaySettlement";
import MonthSettlement from "./monthSettlement";

export default function SettlementList({ navigation }: any) {
  const setAdmin = useSetRecoilState(adminState);
  const settlementRefresh = useRecoilValue(settlementRefreshState);
  const [menu, setMenu] = useState<string>("today");
  const [loading, setLoading] = useState<boolean>(false);
  const [props, setProps] = useState<any>({ total: 0, list: [] });

  const getTodaySettlementTotal = async () => {
    const token = await tokenValidateHandler(setAdmin, navigation);
    return await axios
      .get(`${apiUrl}point/today/settlement`, API_HEADER(token))
      .then((res) => getTodayTotalSuccess(res.data))
      .catch((err) => API_ERROR(err, setAdmin, navigation));
  };

  const getTodayTotalSuccess = async (data: any) => {
    setProps({ ...props, total: data });
    await getTodaySettlementList(data);
  };

  const getTodaySettlementList = async (total: number) => {
    const token = await tokenValidateHandler(setAdmin, navigation);
    return await axios
      .get(`${apiUrl}point/today/settlement/bymanager`, API_HEADER(token))
      .then((res) => getTodayListSuccess(total, res.data))
      .catch((err) => API_ERROR(err, setAdmin, navigation));
  };

  const getTodayListSuccess = (total: number, list: any[]) => {
    setProps({ total, list });
    setLoading(true);
  };

  const getMonthSettlementTotal = async () => {
    const token = await tokenValidateHandler(setAdmin, navigation);
    return await axios
      .get(`${apiUrl}point/month/settlement`, API_HEADER(token))
      .then((res) => getMonthTotalSuccess(res.data))
      .catch((err) => API_ERROR(err, setAdmin, navigation));
  };

  const getMonthTotalSuccess = async (data: any) => {
    await getMonthSettlementList(data);
  };

  const getMonthSettlementList = async (total: number) => {
    const token = await tokenValidateHandler(setAdmin, navigation);
    return await axios
      .get(`${apiUrl}point/month/settlement/bymanager`, API_HEADER(token))
      .then((res) => getMonthListSuccess(total, res.data))
      .catch((err) => API_ERROR(err, setAdmin, navigation));
  };

  const getMonthListSuccess = (total: number, list: any[]) => {
    setProps({ total, list });
    setLoading(true);
  };

  useEffect(() => {
    const focusScreen = navigation.addListener("focus", async () => {
      setLoading(false);
      setProps({ total: 0, list: [] });
      setMenu("today");
    });
    return focusScreen;
  }, [navigation]);

  useEffect(() => {
    const getSettlement = async () => {
      if (menu === "today") await getTodaySettlementTotal();
      if (menu === "month") await getMonthSettlementTotal();
    };
    getSettlement();
  }, [menu, loading, settlementRefresh]);

  return (
    <SafeAreaView className="flex-1" edges={["left", "right"]}>
      <View className="w-full h-12 flex-row">
        <Pressable
          className={`w-1/2 h-full flex justify-center items-center ${
            menu === "today" && "border-b-2 border-b-blue-600"
          }`}
          onPress={() => {
            setMenu("today");
          }}
        >
          <Text
            className={`text-center text-base font-bold ${
              menu === "today" ? "text-blue-600" : "text-gray-400"
            }`}
          >
            당일 내역
          </Text>
        </Pressable>
        <Pressable
          className={`w-1/2 h-full flex justify-center items-center ${
            menu === "month" && "border-b-2 border-b-blue-600"
          }`}
          onPress={() => {
            setMenu("month");
          }}
        >
          <Text
            className={`text-center text-base font-bold ${
              menu === "month" ? "text-blue-600" : "text-gray-400"
            }`}
          >
            당월 내역
          </Text>
        </Pressable>
      </View>
      <React.Fragment>
        {!loading ? (
          <Loading />
        ) : menu === "today" ? (
          <TodaySettlement {...props} />
        ) : (
          <MonthSettlement {...props} />
        )}
      </React.Fragment>
    </SafeAreaView>
  );
}
