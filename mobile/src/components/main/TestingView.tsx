import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { Text } from "react-native";

export const TestingView = observer(() => {
  return <Text style={{ textAlign: "center" }}>Test</Text>;
});
