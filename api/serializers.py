from rest_framework import serializers

from api.models import Note
from .views import * 

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = '__all__'  #('id', 'title', 'description', 'done', 'user')
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

"""

INSERT INTO api_note (
    title,
    description,
    done,
    date_created,
    user_id
  )
VALUES (
    'note from api',
    'added straight from api',
    false,
    current_timestamp,
    '2'
  );

INSERT INTO users_customuser (
            password,
            last_login,
            is_superuser,
            first_name,
            last_name,
            is_staff,
            is_active,
            date_joined,
            email,
            username
          )
        VALUES (
            '31p6hd19',
            current_timestamp,
            true,
            'first-name',
            'last-name',
            true,
            true,
            current_timestamp,
            'myemail@mail.ru',
            'user'
          );
"""