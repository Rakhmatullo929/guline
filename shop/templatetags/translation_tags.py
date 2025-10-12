"""
Template tags для работы с мультиязычностью
"""
from django import template
from django.utils import translation
from shop.utils import get_translated_field, get_translated_content

register = template.Library()


@register.simple_tag
def get_translated(obj, field_name, language=None):
    """
    Получить переведенное поле объекта в шаблоне
    
    Использование:
    {% get_translated product "name" %}
    {% get_translated product "name" "en" %}
    """
    return get_translated_field(obj, field_name, language)


@register.simple_tag
def get_translated_content(obj, fields, language=None):
    """
    Получить переведенный контент для нескольких полей
    
    Использование:
    {% get_translated_content product "name,description" %}
    """
    field_list = [field.strip() for field in fields.split(',')]
    return get_translated_content(obj, field_list, language)


@register.filter
def translate_field(obj, field_name):
    """
    Фильтр для перевода поля
    
    Использование:
    {{ product|translate_field:"name" }}
    """
    return get_translated_field(obj, field_name)


@register.inclusion_tag('shop/partials/translated_content.html')
def show_translated_content(obj, fields, language=None):
    """
    Показать переведенный контент в отдельном шаблоне
    
    Использование:
    {% show_translated_content product "name,description" %}
    """
    field_list = [field.strip() for field in fields.split(',')]
    content = get_translated_content(obj, field_list, language)
    
    return {
        'content': content,
        'language': language or translation.get_language(),
        'object': obj,
    }
