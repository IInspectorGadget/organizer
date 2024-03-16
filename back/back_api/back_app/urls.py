from django.urls import path
from back_app.views import OrganizerAPIView

urlpatterns = [
    path('taskslist', OrganizerAPIView.as_view())

]