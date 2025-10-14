from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Category, Product, ProductImage, Review, 
    Contact
)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('name', 'slug', 'description')
        }),
        ('Изображение', {
            'fields': ('image',)
        }),
        ('Статус', {
            'fields': ('is_active',)
        }),
        ('Метаданные', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ['image', 'alt_text', 'is_main', 'order']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'category', 'gender', 'price', 'old_price', 
        'created_at'
    ]
    list_filter = [
        'category', 'gender', 
        'created_at', 'updated_at'
    ]
    search_fields = [
        'name', 'description', 'material'
    ]
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'updated_at', 'discount_percentage', ]
    inlines = [ProductImageInline]
    
    fieldsets = (
        ('Основная информация', {
            'fields': (
                'name', 'slug', 'description',
                'category', 'gender'
            )
        }),
        ('Цены', {
            'fields': ('price', 'old_price', 'discount_percentage')
        }),
        ('Изображения', {
            'fields': ('main_image',)
        }),
        ('Размеры и цвета', {
            'fields': ('available_sizes', 'available_colors')
        }),
        ('Метаданные', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['product', 'user', 'rating', 'title', 'is_approved', 'created_at']
    list_filter = ['rating', 'is_approved', 'created_at']
    search_fields = [
        'product__name', 'user__username', 'title', 'text'
    ]
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('product', 'user', 'rating')
        }),
        ('Отзыв', {
            'fields': ('title', 'text', 'is_approved')
        }),
        ('Метаданные', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone', 'email', 'is_active']
    list_filter = ['is_active']
    search_fields = [
        'name', 'phone', 'email', 'address'
    ]
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('name', 'phone', 'email')
        }),
        ('Адрес и часы работы', {
            'fields': ('address', 'working_hours')
        }),
        ('Статус', {
            'fields': ('is_active',)
        }),
    )