from . import fields


class Report(fields.CustomModel):
    month_year = fields.MonthYearField(unique=True)
    beginning_balance = fields.AmountField()
    ending_balance = fields.AmountField()
    treasurer = fields.ShortCharField()
    auditor = fields.ShortCharField()
    chairman = fields.ShortCharField()
    created_at = fields.AutoCreatedAtField()


class Member(fields.CustomModel):
    first_name = fields.ShortCharField(display=True)
    last_name = fields.ShortCharField(display=True)
    date_added = fields.DefaultTodayField()
    is_active = fields.DefaultBooleanField(True)

    class Meta:
        unique_together = ("first_name", "last_name")


class Collection(fields.CustomModel):
    collection_date = fields.DefaultTodayField()
    member = fields.SetNullOptionalForeignKey("Member")
    receipt_number = fields.ShortCharField(display=True, unique=True, blank=False)
    created_at = fields.AutoCreatedAtField()
    start_month = fields.MonthYearField()
    end_month = fields.MonthYearField()
    amount = fields.AmountField()


class Income(fields.CustomModel):
    INCOME_CATEGORY_CHOICES = [
        (0, "Mass Bag Collections"),
        (1, "Mass Envelope Offerings"),
        (2, "Mass Intentions"),
        (3, "Donations"),
        (4, "Solicitations"),
    ]
    category = fields.ChoiceIntegerField(INCOME_CATEGORY_CHOICES)
    date_added = fields.DefaultTodayField()
    amount = fields.AmountField()
    notes = fields.LongCharField()


class Expense(fields.CustomModel):
    EXPENSE_CATEGORY_CHOICES = [
        (0, "Electric Bill"),
        (1, "Water Bill"),
        (2, "Priest's Stipend"),
        (3, "Food"),
        (4, "Transportation"),
        (5, "Repairs/Maintenance"),
        (6, "Worship"),
        (7, "Evangelization"),
        (8, "Service"),
        (9, "Stewardship"),
        (10, "Youth"),
        (11, "Family & Life"),
        (12, "Recollection/Seminar"),
        (13, "Others"),
    ]
    category = fields.ChoiceIntegerField(EXPENSE_CATEGORY_CHOICES)
    date_added = fields.DefaultTodayField()
    amount = fields.AmountField()
    notes = fields.LongCharField()


class Transfer(fields.CustomModel):
    date_added = fields.DefaultTodayField()
    amount = fields.AmountField()
    to_bank = fields.DefaultBooleanField(True)
    notes = fields.LongCharField()


class Setting(fields.CustomModel):
    key = fields.ShortCharField(unique=True, display=True)
    value = fields.LongCharField()
    description = fields.MediumCharField()
