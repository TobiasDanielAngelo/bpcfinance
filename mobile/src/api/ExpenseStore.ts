import { prop } from "mobx-keystone";
import { PropsToInterface, ViewFields } from "../constants/interfaces";
import { MyModel, MyStore } from "./GenericStore";

export const EXPENSE_CATEGORY_CHOICES = [
  "Electric Bill",
  "Water Bill",
  "Priest's Stipend",
  "Food",
  "Transportation",
  "Repairs/Maintenance",
  "Allowance for Caretaker",
  "Worship",
  "Evangelization",
  "Service",
  "Stewardship",
  "Youth",
  "Family & Life",
  "Recollection/Seminar",
  "Others",
  "Payable To",
];

const slug = "expenses/";
const keyName = "Expense";
const props = {
  id: prop<number | string>(-1),
  dateAdded: prop<string>(""),
  amount: prop<number>(0),
  notes: prop<string>(""),
  category: prop<number | null>(null),
};

export type ExpenseInterface = PropsToInterface<typeof props>;
export class Expense extends MyModel(keyName, props) {}
export class ExpenseStore extends MyStore(keyName, Expense, slug) {}

export const ExpenseFields: ViewFields<ExpenseInterface> = {
  datetimeFields: [] as const,
  dateFields: ["dateAdded"] as const,
  timeFields: [] as const,
  pricesFields: ["amount"] as const,
};
