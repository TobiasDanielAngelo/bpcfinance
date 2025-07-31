import { modelAction, prop } from "mobx-keystone";
import { PropsToInterface } from "../constants/interfaces";
import { functionBinder, MyModel, MyStore } from "./GenericStore";

const slug = "users/";
const keyName = "User";
const props = {
  id: prop<number | string>(-1),
  username: prop<string>(""),
  firstName: prop<string>(""),
  lastName: prop<string>(""),
  isActive: prop<boolean>(true),
  isSuperuser: prop<boolean>(true),
};

const derivedProps = (item: UserInterface) => ({
  fullName: `${item.lastName}${item.firstName || item.lastName ? "," : ""} ${
    item.firstName
  }`,
});

export type UserInterface = PropsToInterface<typeof props>;
export interface SignupInterface extends UserInterface {
  password?: string;
  password2?: string;
}
export type LoginInterface = {
  username: string;
  password: string;
};

export class User extends MyModel(keyName, props, derivedProps) {}
export class UserStore extends MyStore(keyName, User, slug) {
  constructor(args: any) {
    super(args);
    functionBinder(this);
  }

  @modelAction
  loginUser = function (this: UserStore, credentials: LoginInterface) {
    return this.authBase("login", credentials);
  };

  @modelAction
  logoutUser = function (this: UserStore) {
    return this.authBase("logout");
  };

  @modelAction
  reauthUser = function (this: UserStore) {
    return this.authBase("reauth");
  };
}
