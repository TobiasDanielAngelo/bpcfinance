import { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import type { Option } from "../constants/interfaces";
import { MyCheckBox } from "./MyCheckbox";
import { MyIcon } from "./MyIcon";
import { MyInput } from "./MyInput";

export const MyDropdownSelector = (props: {
  label?: string;
  value: number | null;
  onChangeValue: (t: number | null) => void;
  options?: Option[];
  msg?: string;
  noSearch?: boolean;
  flex?: number;
}) => {
  const {
    label,
    options = [],
    onChangeValue,
    value,
    msg,
    noSearch,
    flex,
  } = props;

  const [isOpen, setOpen] = useState(false);

  const [isOption, setIsOption] = useState(true);
  const [search, setSearch] = useState("");

  const filteredOptions = options?.filter((opt) =>
    String(opt.name).toLowerCase().includes(search.toLowerCase())
  );

  const toggleValue = (t: number) => {
    onChangeValue(t === value ? null : t);
    setOpen(false);
    setSearch("");
    setIsOption(true);
  };

  return (
    <View style={{ paddingHorizontal: 2 }}>
      {label && (
        <Text style={{ fontSize: 15, color: "blue", marginBottom: 5 }}>
          {label}
        </Text>
      )}

      {isOption ? (
        <View style={{ flexDirection: "row", gap: 10, flex: flex }}>
          <Pressable
            style={{
              borderWidth: 1,
              borderColor: "gray",
              borderRadius: 5,
              justifyContent: "space-between",
              paddingHorizontal: 10,
              alignItems: "center",
              flexDirection: "row",
              flex: 1,
              backgroundColor: "white",
            }}
            onPress={() => setOpen(!isOpen)}
          >
            <Text ellipsizeMode="tail">
              {options.find((s) => s.id === value)
                ? options.find((s) => s.id === value)?.name
                : "No item selected."}
            </Text>
            <MyIcon
              icon={isOpen ? "angle-up" : "angle-down"}
              onPress={() => setOpen(!isOpen)}
            />
          </Pressable>
          {!noSearch && (
            <MyIcon icon={"searchengin"} onPress={() => setIsOption(false)} />
          )}
        </View>
      ) : (
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ flex: 1 }}>
            <MyInput
              value={search}
              onChangeValue={setSearch}
              placeholder="Search"
            />
          </View>
          {!noSearch && (
            <MyIcon icon={"searchengin"} onPress={() => setIsOption(true)} />
          )}
        </View>
      )}

      {(isOpen || search) && (
        <View
          style={{
            marginTop: 5,
            padding: 5,
            borderWidth: 1,
            borderRadius: 5,
            borderColor: "gray",
            backgroundColor: "white",
          }}
        >
          <FlatList
            data={filteredOptions}
            keyExtractor={(_, i) => i.toString()}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item: opt }) => (
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                }}
                key={opt.id}
              >
                <MyCheckBox
                  value={value === opt.id}
                  onChangeValue={() => toggleValue(opt.id as number)}
                />
                <Text onPress={() => toggleValue(opt.id as number)}>
                  {opt.name}
                </Text>
              </View>
            )}
          />
        </View>
      )}
      <Text style={{ color: "darkred" }}>{msg}</Text>
    </View>
  );
};
