import { useState } from "react";
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
  const [value, setValue] = useState<number>(props.age ? props.age : 20);
  const onSelectAgeHandler = (value: number) => {
    setValue(value);
    props.setValue("age", `${value}대`);
    props.clearErrors("age");
    props.close();
  };
  return (
    <Portal>
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
                        status={item.value === value ? "checked" : "unchecked"}
                      />
                    </View>
                  </View>
                </TouchableRipple>
              ))}
            </View>
          </ScrollView>
        </Dialog.ScrollArea>
      </Dialog>
    </Portal>
  );
}
