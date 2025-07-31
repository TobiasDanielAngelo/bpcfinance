import { prop } from "mobx-keystone";
import { PropsToInterface, ViewFields } from "../constants/interfaces";
import { MyModel, MyStore } from "./GenericStore";

const slug = "transfers/";
const keyName = "Transfer";
const props = {
  id: prop<number | string>(-1),
  dateAdded: prop<string>(""),
  amount: prop<number>(0),
  toBank: prop<boolean>(false),
  notes: prop<string>(""),
};

export type TransferInterface = PropsToInterface<typeof props>;
export class Transfer extends MyModel(keyName, props) {}
export class TransferStore extends MyStore(keyName, Transfer, slug) {}

export const TransferFields: ViewFields<TransferInterface> = {
  datetimeFields: [] as const,
  dateFields: ["dateAdded"] as const,
  timeFields: [] as const,
  pricesFields: ["amount"] as const,
};
