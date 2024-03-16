from rest_framework import serializers
from .models import Organizer

class OrganizerSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    date_start = serializers.DateTimeField()
    data_end = serializers.DateTimeField()
    title = serializers.CharField(max_length = 120)
    description = serializers.CharField(allow_blank=True)

    def create(self, validated_data):
        return Organizer.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.date_start = validated_data.get('date_start', instance.date_start)
        instance.data_end = validated_data.get('data_end', instance.data_end)
        instance.description = validated_data.get('description', instance.description)
        instance.save()
        return instance

    
