"""
Утилиты для работы с мультиязычностью
"""
from django.utils import translation
from django.conf import settings


def get_current_language():
    """Получить текущий язык"""
    return translation.get_language()


def get_available_languages():
    """Получить список доступных языков"""
    return [lang[0] for lang in settings.LANGUAGES]


def get_translated_field(obj, field_name, language=None):
    """
    Получить переведенное поле объекта
    
    Args:
        obj: Объект модели
        field_name: Название поля
        language: Язык (если не указан, используется текущий)
    
    Returns:
        Переведенное значение поля или оригинальное, если перевод не найден
    """
    if language is None:
        language = get_current_language()
    
    # Пытаемся получить переведенное поле
    translated_field = f"{field_name}_{language}"
    if hasattr(obj, translated_field):
        translated_value = getattr(obj, translated_field)
        if translated_value:  # Если перевод существует и не пустой
            return translated_value
    
    # Если перевод не найден, пробуем fallback языки
    for fallback_lang in settings.MODELTRANSLATION_FALLBACK_LANGUAGES:
        if fallback_lang != language:
            fallback_field = f"{field_name}_{fallback_lang}"
            if hasattr(obj, fallback_field):
                fallback_value = getattr(obj, fallback_field)
                if fallback_value:
                    return fallback_value
    
    # Возвращаем оригинальное значение
    return getattr(obj, field_name, '')


def get_translated_content(obj, fields, language=None):
    """
    Получить переведенный контент для нескольких полей
    
    Args:
        obj: Объект модели
        fields: Список названий полей
        language: Язык (если не указан, используется текущий)
    
    Returns:
        Словарь с переведенными значениями полей
    """
    result = {}
    for field in fields:
        result[field] = get_translated_field(obj, field, language)
    return result


class TranslationMixin:
    """Миксин для добавления методов перевода к моделям"""
    
    def get_translated_field(self, field_name, language=None):
        """Получить переведенное поле"""
        return get_translated_field(self, field_name, language)
    
    def get_translated_content(self, fields, language=None):
        """Получить переведенный контент для нескольких полей"""
        return get_translated_content(self, fields, language)
    
    def has_translation(self, field_name, language=None):
        """Проверить, есть ли перевод для поля"""
        if language is None:
            language = get_current_language()
        
        translated_field = f"{field_name}_{language}"
        if hasattr(self, translated_field):
            translated_value = getattr(self, translated_field)
            return bool(translated_value)
        return False
