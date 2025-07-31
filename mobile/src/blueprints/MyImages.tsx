import { Image, Pressable } from "react-native";

const imageMap = {
  members: require("../../assets/images/members.png"),
  table: require("../../assets/images/table.png"),
  receipts: require("../../assets/images/receipts.png"),
  reports: require("../../assets/images/reports.png"),
  transfers: require("../../assets/images/transfers.png"),
  tally: require("../../assets/images/tally.png"),
  moreIncomes: require("../../assets/images/more-incomes.png"),
  expenses: require("../../assets/images/expenses.png"),

  accounts: require("../../assets/images/accounts.png"),
  back: require("../../assets/images/back.png"),
  bodyFats: require("../../assets/images/body-fats.png"),
  career: require("../../assets/images/career.png"),
  categories: require("../../assets/images/categories.png"),
  credentials: require("../../assets/images/credentials.png"),
  dashboard: require("../../assets/images/dashboard.png"),
  dreams: require("../../assets/images/dreams.png"),
  events: require("../../assets/images/events.png"),
  finance: require("../../assets/images/finance.png"),
  followUps: require("../../assets/images/follow-ups.png"),
  goals: require("../../assets/images/goals.png"),
  habits: require("../../assets/images/habits.png"),
  health: require("../../assets/images/health.png"),
  inventoryTypes: require("../../assets/images/inventory-types.png"),
  inventory: require("../../assets/images/inventory.png"),
  issueComments: require("../../assets/images/issue-comments.png"),
  issueTags: require("../../assets/images/issue-tags.png"),
  jobs: require("../../assets/images/jobs.png"),
  journals: require("../../assets/images/journals.png"),
  logout: require("../../assets/images/logout.png"),
  logs: require("../../assets/images/logs.png"),
  meals: require("../../assets/images/meals.png"),
  payables: require("../../assets/images/payables.png"),
  personal: require("../../assets/images/personal.png"),
  platforms: require("../../assets/images/platforms.png"),
  productivity: require("../../assets/images/productivity.png"),
  properties: require("../../assets/images/properties.png"),
  receivables: require("../../assets/images/receivables.png"),
  schedules: require("../../assets/images/schedules.png"),
  settings: require("../../assets/images/settings.png"),
  support: require("../../assets/images/support.png"),
  tags: require("../../assets/images/tags.png"),
  tasks: require("../../assets/images/tasks.png"),
  tickets: require("../../assets/images/tickets.png"),
  transactions: require("../../assets/images/transactions.png"),
  waistMeasure: require("../../assets/images/waist-measure.png"),
  weighIns: require("../../assets/images/weigh-ins.png"),
  wishlist: require("../../assets/images/wishlist.png"),
  workouts: require("../../assets/images/workouts.png"),
};

export type ImageNameType = keyof typeof imageMap;

export type MyImageProps = {
  image?: ImageNameType;
  width?: number;
  height?: number;
  onPress?: () => void;
};

export const MyImage = ({
  image = "journals",
  width = 50,
  height = 50,
  onPress,
}: MyImageProps) => {
  const source = Object.keys(imageMap).includes(image)
    ? imageMap[image]
    : imageMap["journals"];

  return (
    <Pressable onPress={onPress}>
      <Image
        source={source}
        style={{ width: width, height: height }}
        resizeMode="contain"
      />
    </Pressable>
  );
};
