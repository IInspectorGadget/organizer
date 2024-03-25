from .models import Organizer
from .serializer import OrganizerSerializer
from datetime import datetime
from collections import OrderedDict



def CheckColision(object_1, object_2):
    ds1 = datetime.strptime(object_1['date_start'], "%Y-%m-%d %H:%M")
    de1 = datetime.strptime(object_1['data_end'], "%Y-%m-%d %H:%M")
    ds2 = datetime.strptime(object_2.data['date_start'], "%Y-%m-%d %H:%M")
    de2 = datetime.strptime(object_2.data['data_end'], "%Y-%m-%d %H:%M")

    if object_2.data.get('date_start') >= object_1['date_start'] and object_2.data.get('data_end') <= object_1['data_end']:
        return de2 - ds2 + de1 - de2
    elif (object_2.data.get('date_start') < object_1['date_start'] and
        object_2.data.get('data_end') > object_1['date_start'] and
        object_2.data.get('data_end') < object_1['data_end']):
        return ds1 - ds2 + de1 - ds1
    elif (object_2.data.get('date_start') > object_1['date_start'] and
          object_2.data.get('date_start') < object_1['data_end'] and
          object_2.data.get['data_end'] > object_1['data_end']):
        return de1 - ds2
    return ds1 - ds1
    


def ColisionsResolve(request):
    
    lst = OrganizerSerializer(Organizer.objects.all(), many=True).data
    de = datetime.strptime(request.data.get('data_end'), "%Y-%m-%d %H:%M")
    ds = datetime.strptime(request.data.get('date_start'), "%Y-%m-%d %H:%M")
    
    for obj in lst:
        time = CheckColision(obj, request)
        ds += time
        de += time

    request.data['date_start'] = ds
    request.data['data_end'] = de

    return request
