from api import views
from . import index

from django.contrib import admin
from django.urls import path, include, re_path
from api.views import *
from rest_framework import routers


# router = routers.DefaultRouter()
# router.register(r'note', NoteViewSet)


urlpatterns = [
    # path('', include(router.urls)),
    path('auth/', include('djoser.urls')),
    re_path(r'^auth/', include('djoser.urls.authtoken')),
    path('note/', NoteApiList.as_view()),
    path('note/<int:pk>/', NoteApiUpdate.as_view()),
    path('note-delete/<int:pk>/', NoteApiDelete.as_view()),
    path('note/page/', index.getPages),
    path('note/size', index.getNoteLength),
    path('note/find', index.findNote),
]