import { useCallback, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { MyIcon } from "./MyIcon";

export type MyInputProps = {
  hidden?: boolean;
  label?: string;
  value?: string;
  onChangeValue?: (t: string) => void;
  corrector?: (t: string) => string;
  pattern?: string;
  isPassword?: boolean;
  optional?: boolean;
  msg?: string;
  placeholder?: string;
  checkpoint?: boolean;
  checkAction?: () => Promise<void>;
  disabled?: boolean;
  flex?: number;
  numeric?: boolean;
  centered?: boolean;
  maxLength?: number;
  autoCapitalize?: boolean;
  enlarged?: boolean;
  multiline?: boolean;
};

export const MyInput = (props: MyInputProps) => {
  const {
    hidden,
    label,
    value,
    onChangeValue,
    corrector,
    isPassword,
    // optional,
    msg,
    placeholder,
    checkpoint,
    checkAction,
    disabled,
    flex,
    numeric,
    centered,
    maxLength,
    autoCapitalize,
    enlarged,
    multiline,
  } = props;

  const [editable, setEditable] = useState(true);

  const onChangeCorrect = (t: string) => {
    let newVal = corrector ? corrector(t) : t;
    onChangeValue?.(newVal);
  };

  const onCheck = useCallback(async () => {
    if (checkAction) await checkAction();
    setEditable(false);
  }, []);

  const onEdit = useCallback(() => {
    setEditable(true);
  }, []);

  return (
    !hidden && (
      <View style={[styles.main, { flex: flex ? flex : 0 }]}>
        <View style={styles.textInput}>
          {label && <Text>{label}</Text>}
          <TextInput
            onChangeText={onChangeCorrect}
            value={String(value)}
            style={[
              styles.input,
              {
                backgroundColor: editable && !disabled ? "white" : "#ddd",
                textAlign: centered ? "center" : numeric ? "right" : "left",
                borderRadius: 5,
              },
            ]}
            editable={editable && !disabled}
            placeholder={placeholder ?? label}
            keyboardType={numeric ? "numeric" : "default"}
            maxLength={maxLength}
            autoCapitalize={autoCapitalize ? "characters" : undefined}
            secureTextEntry={isPassword}
            multiline={multiline}
          />
          {msg && <Text style={{ color: "darkred" }}>{msg}</Text>}
        </View>
        {checkpoint && (
          <MyIcon
            icon={!editable ? "edit" : "check"}
            onPress={!editable ? onEdit : onCheck}
          />
        )}
      </View>
    )
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 3,
  },
  textInput: {
    padding: 3,
    flex: 1,
  },
});
