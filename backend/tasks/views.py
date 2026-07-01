from rest_framework import generics, viewsets, permissions
from rest_framework.response import Response
from .models import Task
from .serializers import TaskSerializer, RegisterSerializer

class RegisterView(generics.CreateAPIView):
    queryset = None
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        from django.contrib.auth.models import User
        return User.objects.all()


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Task.objects.filter(owner=self.request.user)
        status_param = self.request.query_params.get('status')
        if status_param == 'completed':
            queryset = queryset.filter(completed=True)
        elif status_param == 'pending':
            queryset = queryset.filter(completed=False)
        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)