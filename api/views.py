from django.shortcuts import render
from rest_framework import generics, status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import *

from api.models import Note
from api.serializers import NoteSerializer
from api.util import *
from api.permissions import *

# Create your views here.


# class NoteViewSet(viewsets.ModelViewSet):
#     queryset = Note.objects.all()
#     serializer_class = NoteSerializer

#     @action(methods=['get'], detail=False, url_path='titles')
#     def getAllTitles(self, request):
#         titles = Note.objects.values_list('title', flat=True)
#         print("yes" if titles else "no")

#         return Response({"titles" : titles}, 
#                         status=status.HTTP_200_OK)
    
#     def get_queryset(self):
#         return Note.objects.all()[:2]
class NoteApiList(generics.ListCreateAPIView):
    queryset = Note.objects.order_by('id')
    
    serializer_class = NoteSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)


class NoteApiUpdate(generics.RetrieveUpdateAPIView):
    queryset = Note.objects.order_by('id')
    serializer_class = NoteSerializer
    permission_classes = (IsAuthenticated,)
    
class NoteApiDelete(generics.RetrieveDestroyAPIView):
    queryset = Note.objects.order_by('id')
    serializer_class = NoteSerializer
    permission_classes = (IsOwnerOrReadOnly, IsAuthenticated,)