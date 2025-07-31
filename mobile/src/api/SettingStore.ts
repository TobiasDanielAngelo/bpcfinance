import { prop } from "mobx-keystone";
import { PropsToInterface, ViewFields } from "../constants/interfaces";
import { MyModel, MyStore } from "./GenericStore";

const slug = "settings/";
const keyName = "Setting";
const props = {
  id: prop<number | string>(-1),
  key: prop<string>(""),
  value: prop<string>(""),
  description: prop<string>(""),
};

export type SettingInterface = PropsToInterface<typeof props>;
export class Setting extends MyModel(keyName, props) {}
export class SettingStore extends MyStore(keyName, Setting, slug) {}

export const SettingFields: ViewFields<SettingInterface> = {
  datetimeFields: [] as const,
  dateFields: [] as const,
  timeFields: [] as const,
  pricesFields: [] as const,
};
