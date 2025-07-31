import { prop } from "mobx-keystone";
import { PropsToInterface, ViewFields } from "../constants/interfaces";
import { MyModel, MyStore } from "./GenericStore";

const slug = "members/";
const keyName = "Member";
const props = {
  id: prop<number | string>(-1),
  firstName: prop<string>(""),
  lastName: prop<string>(""),
  dateAdded: prop<string>(""),
  isActive: prop<boolean>(true),
};

const derivedProps = (item: MemberInterface) => {
  return {
    fullName: [item.lastName, item.firstName].join(", "),
  };
};
export type MemberInterface = PropsToInterface<typeof props>;
export class Member extends MyModel(keyName, props, derivedProps) {}
export class MemberStore extends MyStore(keyName, Member, slug) {}

export const MemberFields: ViewFields<MemberInterface> = {
  datetimeFields: [] as const,
  dateFields: ["dateAdded"] as const,
  timeFields: [] as const,
  pricesFields: [] as const,
};
