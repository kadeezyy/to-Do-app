def validate_note_title(queryset: set, title: str) -> bool:
    return title in queryset.values_list("title", flat=True)
        
