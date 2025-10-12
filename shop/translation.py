from modeltranslation.translator import translator, TranslationOptions
from .models import Category, Product, Review, Contact


class CategoryTranslationOptions(TranslationOptions):
    """Настройки переводов для модели Category"""
    fields = ('name', 'description')


class ProductTranslationOptions(TranslationOptions):
    """Настройки переводов для модели Product"""
    fields = ('name', 'description', 'short_description', 'material', 'care_instructions')


class ReviewTranslationOptions(TranslationOptions):
    """Настройки переводов для модели Review"""
    fields = ('title', 'text')


class ContactTranslationOptions(TranslationOptions):
    """Настройки переводов для модели Contact"""
    fields = ('name', 'address', 'working_hours')


# Регистрируем переводы
translator.register(Category, CategoryTranslationOptions)
translator.register(Product, ProductTranslationOptions)
translator.register(Review, ReviewTranslationOptions)
translator.register(Contact, ContactTranslationOptions)
