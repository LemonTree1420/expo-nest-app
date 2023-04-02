import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import {
  Dialog,
  Portal,
  RadioButton,
  Text,
  TouchableRipple,
} from "react-native-paper";
import { ageList } from "../../constants/age";

export default function AgeDialouge(props: any) {
  const [select, setSelect] = useState<number>(0);

  const onSelectAgeHandler = (value: number) => {
    setSelect(value);
    props.setValue(props.inputKey, `${value}대`);
    props.clearErrors(props.inputKey);
    props.close();
  };

  useEffect(() => {
    if (props.value) setSelect(Number(props.value.substring(0, 2)));
    else setSelect(0);
  }, [props]);

  return (
    // <Portal>
    <Dialog onDismiss={props.close} visible={props.visible}>
      <Dialog.ScrollArea className="max-h-96">
        <ScrollView>
          <View>
            {ageList.map((item) => (
              <TouchableRipple
                key={item.value}
                onPress={() => {
                  onSelectAgeHandler(item.value);
                }}
              >
                <View className="flex-row justify-between items-center py-2">
                  <Text className="pl-4 text-lg">{item.label}</Text>
                  <View pointerEvents="none">
                    <RadioButton
                      value="normal"
                      status={item.value === select ? "checked" : "unchecked"}
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
