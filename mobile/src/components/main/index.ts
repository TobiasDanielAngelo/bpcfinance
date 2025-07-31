export type ViewPath = {
  title: string;
  items?: string[];
  mainLink?: string;
};

export const allViewPaths = [
  {
    title: "Reports",
    items: ["reports"],
    mainLink: "reports",
  },

  {
    title: "Incomes",
    items: ["incomes"],
    mainLink: "incomes",
  },
  {
    title: "Expenses",
    items: ["expenses"],
    mainLink: "expenses",
  },
] as ViewPath[];
