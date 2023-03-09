from django.http import JsonResponse
from .models import Note
from .serializers import NoteSerializer


def getPages(request):
    page = request.GET.get('page', 1)
    pagesize = request.GET.get('pagesize', 6)
    current = (int(page) - 1) * pagesize
    queryset = (Note.objects.order_by('id')[current : current + pagesize])
    serializer_class = NoteSerializer

    return JsonResponse(serializer_class(queryset, many=True).data, safe=False)   

def getNoteLength(request):
    return JsonResponse(Note.objects.count(), safe=False)


def findNote(request):
    if request.GET.get('id'):
        queryset = Note.objects.filter(id=request.GET.get('id'))
        
        return JsonResponse(NoteSerializer(queryset, many=True).data, safe=False)
    if request.GET.get('title'):
        queryset = Note.objects.filter(title__contains=request.GET.get('title'))
        return JsonResponse(NoteSerializer(queryset, many=True).data, safe=False)
