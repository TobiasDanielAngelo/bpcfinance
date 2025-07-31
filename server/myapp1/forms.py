from django import forms
from .models import Report


class ReportForm(forms.ModelForm):
    class Meta:
        model = Report
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["month_year"].input_formats = ["%Y-%m"]
        self.fields["month_year"].widget.format = "%Y-%m"
        self.fields["month_year"].widget.attrs.update(
            {"type": "month", "placeholder": "YYYY-MM"}
        )
