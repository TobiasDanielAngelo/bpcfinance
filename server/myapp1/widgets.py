from django import forms


class MonthYearWidget(forms.DateInput):
    def __init__(self, attrs=None):
        final_attrs = {"placeholder": "MM/YYYY", "type": "month"}
        if attrs:
            final_attrs.update(attrs)
        super().__init__(format="%Y-%m", attrs=final_attrs)
