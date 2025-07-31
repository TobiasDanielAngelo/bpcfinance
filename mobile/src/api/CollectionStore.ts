import { prop } from "mobx-keystone";
import { PropsToInterface, ViewFields } from "../constants/interfaces";
import { MyModel, MyStore } from "./GenericStore";

const slug = "collections/";
const keyName = "Collection";
const props = {
  id: prop<number | string>(-1),
  collectionList: prop<number | null>(null),
  member: prop<number | null>(null),
  receiptNumber: prop<string>(""),
  collectionDate: prop<string>(""),
  createdAt: prop<string>(""),
  amount: prop<number>(0),
  startMonth: prop<string>(""),
  endMonth: prop<string>(""),
};

export type CollectionInterface = PropsToInterface<typeof props>;
export class Collection extends MyModel(keyName, props) {}
export class CollectionStore extends MyStore(keyName, Collection, slug) {}

export const CollectionFields: ViewFields<CollectionInterface> = {
  datetimeFields: ["createdAt"] as const,
  dateFields: ["collectionDate"] as const,
  timeFields: [] as const,
  pricesFields: ["amount"] as const,
};
