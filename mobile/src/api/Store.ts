import { model, Model, prop } from "mobx-keystone";
import { createContext, useContext } from "react";
import { CollectionStore } from "./CollectionStore";
import { ExpenseStore } from "./ExpenseStore";
import { IncomeStore } from "./IncomeStore";
import { MemberStore } from "./MemberStore";
import { ReportStore } from "./ReportStore";
import { SettingStore } from "./SettingStore";
import { TransferStore } from "./TransferStore";
import { UserStore } from "./UserStore";

@model("myApp/Store")
export class Store extends Model({
  reportStore: prop<ReportStore>(),
  memberStore: prop<MemberStore>(),
  collectionStore: prop<CollectionStore>(),
  expenseStore: prop<ExpenseStore>(),
  incomeStore: prop<IncomeStore>(),
  transferStore: prop<TransferStore>(),
  settingStore: prop<SettingStore>(),
  userStore: prop<UserStore>(),
}) {}

export const createStore = () =>
  new Store({
    reportStore: new ReportStore({}),
    memberStore: new MemberStore({}),
    collectionStore: new CollectionStore({}),
    expenseStore: new ExpenseStore({}),
    transferStore: new TransferStore({}),
    incomeStore: new IncomeStore({}),
    settingStore: new SettingStore({}),
    userStore: new UserStore({}),
  });

export const StoreContext = createContext<Store | null>(null);
export const useStore = () => useContext(StoreContext)!;
