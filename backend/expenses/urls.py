from django.urls import path
from .views import (
    ExpenseListCreateView,
    ExpenseDetailView,
    ExpenseSummaryView,
    RegisterView
)

urlpatterns = [
    # Expenses CRUD
    path("", ExpenseListCreateView.as_view(), name="expense-list-create"),
    path("<int:pk>/", ExpenseDetailView.as_view(), name="expense-detail"),

    # Analytics
    path("summary/", ExpenseSummaryView.as_view(), name="expense-summary"),

    # Auth
    path("register/", RegisterView.as_view(), name="register"),
]
