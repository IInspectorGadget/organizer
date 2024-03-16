from django.urls import path
from back_app.views import *

urlpatterns = [
    path('taskslist/', GetAllTasksView.as_view()),
    path('createtask/', CreateNewTaskView.as_view()),
    path('updatetask/<int:pk>/', UpdateTaskView.as_view())


]