from django.shortcuts import render
from rest_framework import generics
from .models import Organizer
from .serializer import OrganizerSerializer

# Create your views here.
#get post
class OrganizerAPIView(generics.ListAPIView):
    queryset = Organizer.objects.all()
    serializer_class = OrganizerSerializer



