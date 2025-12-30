from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Sum
from django.contrib.auth.models import User
from rest_framework import status

from .models import Expense
from .serializers import ExpenseSerializer


# -------------------------
# EXPENSE CRUD (USER SCOPED)
# -------------------------

class ExpenseListCreateView(ListCreateAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user).order_by('-date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ExpenseDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user)


# -------------------------
# ANALYTICS
# -------------------------

class ExpenseSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        expenses = Expense.objects.filter(user=request.user)

        total = expenses.aggregate(total=Sum('amount'))['total'] or 0

        category_wise = (
            expenses.values('category')
            .annotate(total_amount=Sum('amount'))
            .order_by('-total_amount')
        )

        top_category = category_wise[0]['category'] if category_wise else None

        return Response({
            "total_expenses": total,
            "category_wise_expenses": category_wise,
            "top_category": top_category
        })


# -------------------------
# REGISTER
# -------------------------

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"error": "Username and password required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "Username already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        User.objects.create_user(
            username=username,
            password=password,
            is_active=True
        )

        return Response(
            {"message": "User created successfully"},
            status=status.HTTP_201_CREATED
        )
