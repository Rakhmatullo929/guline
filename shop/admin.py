from django.contrib import admin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
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


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ['image', 'alt_text', 'is_main', 'order']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'category', 'gender', 'price', 'old_price', 
        'is_active', 'is_featured', 'stock_quantity', 'created_at'
    ]
    list_filter = [
        'category', 'gender', 'is_active', 'is_featured', 
        'created_at', 'updated_at'
    ]
    search_fields = ['name', 'description', 'material']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'updated_at', 'discount_percentage']
    inlines = [ProductImageInline]
    
    fieldsets = (
        (_('Основная информация'), {
            'fields': ('name', 'slug', 'description', 'short_description', 'category', 'gender')
        }),
        (_('Цены'), {
            'fields': ('price', 'old_price', 'discount_percentage')
        }),
        (_('Изображения'), {
            'fields': ('main_image',)
        }),
        (_('Характеристики'), {
            'fields': ('material', 'country', 'care_instructions')
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
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['product', 'user', 'rating', 'title', 'is_approved', 'created_at']
    list_filter = ['rating', 'is_approved', 'created_at']
    search_fields = ['product__name', 'user__username', 'title', 'text']
    readonly_fields = ['created_at']


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone', 'email', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name', 'phone', 'email', 'address']