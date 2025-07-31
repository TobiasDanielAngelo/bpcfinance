import { MyInput, MyInputProps } from "./MyInput";

export const MyTextArea = (props: MyInputProps) => {
  return <MyInput {...props} multiline />;
};
