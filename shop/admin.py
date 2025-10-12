from django.contrib import admin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from modeltranslation.admin import TranslationAdmin
from .models import (
    Category, Product, ProductImage, Review, 
    Contact
)


@admin.register(Category)
class CategoryAdmin(TranslationAdmin):
    list_display = ['name', 'slug', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description', 'name_en', 'name_uz', 'description_en', 'description_uz']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        (_('Основная информация'), {
            'fields': ('name', 'slug', 'description')
        }),
        (_('Переводы'), {
            'fields': (
                ('name_en', 'name_uz'),
                ('description_en', 'description_uz'),
            ),
            'classes': ('collapse',)
        }),
        (_('Изображение'), {
            'fields': ('image',)
        }),
        (_('Статус'), {
            'fields': ('is_active',)
        }),
        (_('Метаданные'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ['image', 'alt_text', 'is_main', 'order']


@admin.register(Product)
class ProductAdmin(TranslationAdmin):
    list_display = [
        'name', 'category', 'gender', 'price', 'old_price', 
        'is_active', 'is_featured', 'stock_quantity', 'created_at'
    ]
    list_filter = [
        'category', 'gender', 'is_active', 'is_featured', 
        'created_at', 'updated_at'
    ]
    search_fields = [
        'name', 'description', 'material', 'name_en', 'name_uz',
        'description_en', 'description_uz', 'material_en', 'material_uz'
    ]
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'updated_at', 'discount_percentage']
    inlines = [ProductImageInline]
    
    fieldsets = (
        (_('Основная информация'), {
            'fields': (
                'name', 'slug', 'description', 'short_description',
                'category', 'gender'
            )
        }),
        (_('Переводы'), {
            'fields': (
                ('name_en', 'name_uz'),
                ('description_en', 'description_uz'),
                ('short_description_en', 'short_description_uz'),
            ),
            'classes': ('collapse',)
        }),
        (_('Цены'), {
            'fields': ('price', 'old_price', 'discount_percentage')
        }),
        (_('Изображения'), {
            'fields': ('main_image',)
        }),
        (_('Характеристики'), {
            'fields': (
                'material', 'country', 'care_instructions'
            )
        }),
        (_('Переводы характеристик'), {
            'fields': (
                ('material_en', 'material_uz'),
                ('care_instructions_en', 'care_instructions_uz'),
            ),
            'classes': ('collapse',)
        }),
        (_('Размеры и цвета'), {
            'fields': ('available_sizes', 'available_colors')
        }),
        (_('Статус и склад'), {
            'fields': ('is_active', 'is_featured', 'stock_quantity')
        }),
        (_('Метаданные'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Review)
class ReviewAdmin(TranslationAdmin):
    list_display = ['product', 'user', 'rating', 'title', 'is_approved', 'created_at']
    list_filter = ['rating', 'is_approved', 'created_at']
    search_fields = [
        'product__name', 'user__username', 'title', 'text',
        'title_en', 'title_uz', 'text_en', 'text_uz'
    ]
    readonly_fields = ['created_at']
    
    fieldsets = (
        (_('Основная информация'), {
            'fields': ('product', 'user', 'rating')
        }),
        (_('Отзыв'), {
            'fields': ('title', 'text', 'is_approved')
        }),
        (_('Переводы'), {
            'fields': (
                ('title_en', 'title_uz'),
                ('text_en', 'text_uz'),
            ),
            'classes': ('collapse',)
        }),
        (_('Метаданные'), {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )


@admin.register(Contact)
class ContactAdmin(TranslationAdmin):
    list_display = ['name', 'phone', 'email', 'is_active']
    list_filter = ['is_active']
    search_fields = [
        'name', 'phone', 'email', 'address', 
        'name_en', 'name_uz', 'address_en', 'address_uz',
        'working_hours_en', 'working_hours_uz'
    ]
    
    fieldsets = (
        (_('Основная информация'), {
            'fields': ('name', 'phone', 'email')
        }),
        (_('Переводы'), {
            'fields': (
                ('name_en', 'name_uz'),
            ),
            'classes': ('collapse',)
        }),
        (_('Адрес и часы работы'), {
            'fields': ('address', 'working_hours')
        }),
        (_('Переводы адреса и часов'), {
            'fields': (
                ('address_en', 'address_uz'),
                ('working_hours_en', 'working_hours_uz'),
            ),
            'classes': ('collapse',)
        }),
        (_('Статус'), {
            'fields': ('is_active',)
        }),
    )