import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import {
  Dialog,
  Portal,
  RadioButton,
  Text,
  TouchableRipple,
} from "react-native-paper";
import { bankList } from "../../constants/bank";

export default function BankDialog(props: any) {
  const [select, setSelect] = useState<string>("");

  const onSelectBankHandler = (value: string) => {
    setSelect(value);
    props.setValue("bank", value);
    props.clearErrors("bank");
    props.close();
  };

  useEffect(() => {
    if (props.value) setSelect(props.value);
    else setSelect("");
  }, [props]);

  return (
    // <Portal>
    <Dialog onDismiss={props.close} visible={props.visible}>
      <Dialog.ScrollArea className="max-h-96">
        <ScrollView>
          <View>
            {bankList.map((item) => (
              <TouchableRipple
                key={item.label}
                onPress={() => {
                  onSelectBankHandler(item.label);
                }}
              >
                <View className="flex-row justify-between items-center py-2">
                  <Text className="pl-4 text-lg">{item.label}</Text>
                  <View pointerEvents="none">
                    <RadioButton
                      value="normal"
                      status={item.label === select ? "checked" : "unchecked"}
                    />
                  </View>
                </View>
              </TouchableRipple>
            ))}
          </View>
        </ScrollView>
      </Dialog.ScrollArea>
    </Dialog>
    // </Portal>
  );
}
