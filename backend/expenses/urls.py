from django.urls import path
from .views import (
    ExpenseListCreateView,
    ExpenseDetailView,
    ExpenseSummaryView,
    RegisterView
)

urlpatterns = [
    path("", ExpenseListCreateView.as_view()),
    path("<int:pk>/", ExpenseDetailView.as_view()),
    path("summary/", ExpenseSummaryView.as_view()),
    path("register/", RegisterView.as_view()),
   
]
