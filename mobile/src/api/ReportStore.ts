import { prop } from "mobx-keystone";
import { PropsToInterface, ViewFields } from "../constants/interfaces";
import { MyModel, MyStore } from "./GenericStore";

const slug = "reports/";
const keyName = "Report";
const props = {
  id: prop<number | string>(-1),
  monthYear: prop<string>(""),
  beginningBalance: prop<number>(0),
  endingBalance: prop<number>(0),
  treasurer: prop<string>(""),
  auditor: prop<string>(""),
  chairman: prop<string>(""),
  createdAt: prop<string>(""),
};

export type ReportInterface = PropsToInterface<typeof props>;
export class Report extends MyModel(keyName, props) {}
export class ReportStore extends MyStore(keyName, Report, slug) {}

export const ReportFields: ViewFields<ReportInterface> = {
  datetimeFields: ["createdAt"] as const,
  dateFields: [] as const,
  timeFields: [] as const,
  pricesFields: ["beginningBalance", "endingBalance"] as const,
};
