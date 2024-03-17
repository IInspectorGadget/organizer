from django.db import models

# Create your models here.
class Organizer(models.Model):
    id = models.AutoField(primary_key=True)
    date_start = models.DateTimeField()
    data_end = models.DateTimeField()
    title = models.CharField(max_length = 120)
    description = models.TextField()
    