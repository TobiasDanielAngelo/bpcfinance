import moment from "moment";

export class DayInPercent {
  num: number;
  constructor(n: number) {
    this.num = n;
  }
  get asDays() {
    return this.num / 100;
  }
  get asHours() {
    return Math.round(this.num * 24) / 100;
  }
  get asMinutes() {
    return Math.round(this.num * 24 * 60) / 100;
  }
  get asHumanTime() {
    let date = new Date(864000 * this.num);
    return moment(date).utc(false).format("h:mm A");
  }
  asWorkDays(workingHours: number) {
    let u = Math.round(this.num * (24 / workingHours)) / 100;
    return `${u} days`;
  }

  get timeDuration() {
    let end = moment(this.num * 864000);
    let duration = moment.duration(end.diff(0));
    return duration;
  }

  get timeHumanized() {
    return [
      {
        num: this.timeDuration.years(),
        app: "Y",
      },
      {
        num: this.timeDuration.months(),
        app: "M",
      },
      {
        num: this.timeDuration.weeks(),
        app: "W",
      },
      {
        num: this.timeDuration.days() - 7 * this.timeDuration.weeks(),
        app: "D",
      },
      {
        num: this.timeDuration.hours(),
        app: "h",
      },
      {
        num: this.timeDuration.minutes(),
        app: "m",
      },
    ]
      .filter((s) => s.num > 0)
      .map((s) => `${s.num}${s.app}`)
      .join(" ");
  }
}

export class TwoDates {
  start: Date;
  end: Date;

  constructor(
    dt1: string | Date | number | undefined,
    dt2: string | Date | number | undefined
  ) {
    let d1 = new Date(dt1 ?? "");
    let d2 = new Date(dt2 ?? "");
    this.start = d1 > d2 ? d2 : d1;
    this.end = d1 > d2 ? d1 : d2;
  }

  get getRangeString(): string {
    const s = this.start;
    const e = this.end;

    const sameYear = s.getFullYear() === e.getFullYear();
    const sameMonth = sameYear && s.getMonth() === e.getMonth();
    const sameDate = sameMonth && s.getDate() === e.getDate();

    if (sameDate) {
      return `${s.getDate()} ${s.toLocaleString("default", {
        month: "short",
      })} ${s.getFullYear()}`;
    } else if (sameMonth) {
      return `${s.getDate()}–${e.getDate()} ${s.toLocaleString("default", {
        month: "short",
      })} ${s.getFullYear()}`;
    } else if (sameYear) {
      return `${s.getDate()} ${s.toLocaleString("default", {
        month: "short",
      })} – ${e.getDate()} ${e.toLocaleString("default", {
        month: "short",
      })} ${s.getFullYear()}`;
    } else {
      return `${s.getDate()} ${s.toLocaleString("default", {
        month: "short",
      })} ${s.getFullYear()} – ${e.getDate()} ${e.toLocaleString("default", {
        month: "short",
      })} ${e.getFullYear()}`;
    }
  }

  get datesBetween() {
    const dateArr = [];
    let curr = new Date(this.start);
    let next = new Date(this.start);
    while (curr <= this.end) {
      dateArr.push(next);
      next = new Date(curr.getTime() + 24 * 60 * 60 * 1000);
      curr.setDate(curr.getDate() + 1);
    }
    return dateArr;
  }

  get monthsBetween() {
    const months = [];
    const start = new Date(this.start);
    const end = new Date(this.end);

    // Normalize to the 1st of the month
    let current = new Date(start.getFullYear(), start.getMonth(), 1);

    while (current <= end) {
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, "0");
      months.push(`${year}-${month}`);
      // Move to next month
      current.setMonth(current.getMonth() + 1);
    }

    return months;
  }

  get hoursByTimeRegion() {
    let startDateOnly = new Date(this.start);
    startDateOnly.setHours(0, 0, 0, 0);
    let startTimeSE =
      (this.start.getTime() - startDateOnly.getTime()) / (1000 * 60 * 60);
    let endTimeSE =
      (this.end.getTime() - startDateOnly.getTime()) / (1000 * 60 * 60);

    let curr = startTimeSE,
      next = 0;
    let day = 0,
      night = 0;

    while (curr <= endTimeSE) {
      let modCurr = curr % 24;
      let quoCurr = Math.floor(curr / 24);
      if (modCurr >= 0 && modCurr < 6) {
        next = quoCurr * 24 + 6;
        night += (next < endTimeSE ? quoCurr * 24 + 6 : endTimeSE) - curr;
      } else if (modCurr >= 6 && modCurr < 22) {
        next = quoCurr * 24 + 22;
        day += (next < endTimeSE ? next : endTimeSE) - curr;
      } else {
        next = quoCurr * 24 + 24;
        night += (curr < endTimeSE ? next : endTimeSE) - curr;
      }
      curr = next;
    }

    return { day: day, night: night };
  }

  get monthDelta() {
    return (
      this.end.getMonth() -
      this.start.getMonth() +
      12 * (this.end.getFullYear() - this.start.getFullYear())
    );
  }

  get timeDelta() {
    let start = moment(this.start);
    let end = moment(this.end);
    let duration = moment.duration(end.diff(start));
    return duration;
  }

  get timeDeltaHumanized() {
    return [
      {
        num: this.timeDelta.years(),
        app: "Y",
      },
      {
        num: this.timeDelta.months(),
        app: "M",
      },
      {
        num: this.timeDelta.weeks(),
        app: "W",
      },
      {
        num: this.timeDelta.days() - 7 * this.timeDelta.weeks(),
        app: "D",
      },
      {
        num: this.timeDelta.hours(),
        app: "h",
      },
      {
        num: this.timeDelta.minutes(),
        app: "m",
      },
    ]
      .filter((s) => s.num > 0)
      .map((s) => `${s.num}${s.app}`)
      .join(" ");
  }

  get isEqualDate() {
    return this.start.toDateString() === this.end.toDateString();
  }

  get isEqualTime() {
    return this.start.toTimeString() === this.end.toTimeString();
  }

  get earlier() {
    return this.start > this.end ? this.end : this.start;
  }

  get later() {
    return this.start < this.end ? this.end : this.start;
  }

  isOverlapWith(td: TwoDates) {
    return this.start <= td.end && td.start <= this.end;
  }

  contains(dt: Date) {
    return this.start <= dt && dt <= this.end;
  }

  numberOfSpecifiedDay(dayNum: number) {
    let weekendDayCount = 0;
    let fromDate = this.start;
    let toDate = this.end;
    while (fromDate < toDate) {
      fromDate.setDate(fromDate.getDate() + 1);
      if (fromDate.getDay() === dayNum) {
        weekendDayCount++;
      }
    }
    return weekendDayCount;
  }
}
