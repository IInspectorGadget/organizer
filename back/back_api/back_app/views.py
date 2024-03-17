from django.shortcuts import render
from django.forms import model_to_dict
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Organizer
from .serializer import OrganizerSerializer

# Create your views here.
#get post

class GetAllTasksView(APIView):
    def get(self, request):
        if(request.GET.get("date_start") == "all" or request.GET.get("date_start") is None):
            lst = Organizer.objects.all()
            return Response({"tasks":OrganizerSerializer(lst, many=True).data})
        lst = (Organizer.objects.filter(date_start__gte = request.GET.get("date_start")) 
        & Organizer.objects.filter(data_end__lte = request.GET.get("data_end")))
        return Response({"tasks":OrganizerSerializer(lst, many=True).data})
    


class CreateNewTaskView(APIView):
    def post(self, request):
        serializer = OrganizerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response({"post":serializer.data})

class UpdateTaskView(APIView):
    def put(self, request, *args, **kwargs):
        pk = kwargs.get("pk", None)
        if not pk:
            return Response({"error":"Метод PUT не определён"})
        try:
            instance = Organizer.objects.get(pk=pk)
        except:
            return Response({"error":"Объект не найден"})
        
        serializer = OrganizerSerializer(data=request.data, instance=instance)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"post":serializer.data})


