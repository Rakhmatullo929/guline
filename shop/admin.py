from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Category, Product, ProductImage, Review, 
    Cart, Order, OrderItem, Contact
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
        ('Основная информация', {
            'fields': ('name', 'slug', 'description', 'short_description', 'category', 'gender')
        }),
        ('Цены', {
            'fields': ('price', 'old_price', 'discount_percentage')
        }),
        ('Изображения', {
            'fields': ('main_image',)
        }),
        ('Характеристики', {
            'fields': ('material', 'country', 'care_instructions')
        }),
        ('Размеры и цвета', {
            'fields': ('available_sizes', 'available_colors')
        }),
        ('Статус и склад', {
            'fields': ('is_active', 'is_featured', 'stock_quantity')
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
    search_fields = ['product__name', 'user__username', 'title', 'text']
    readonly_fields = ['created_at']


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'product', 'quantity', 'size', 'color', 'total_price', 'created_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['user__username', 'product__name']
    readonly_fields = ['created_at', 'updated_at', 'total_price']


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['total_price']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        'order_number', 'user', 'status', 'payment_method', 
        'total', 'created_at'
    ]
    list_filter = ['status', 'payment_method', 'created_at']
    search_fields = ['order_number', 'user__username', 'phone', 'email']
    readonly_fields = ['order_number', 'created_at', 'updated_at']
    inlines = [OrderItemInline]
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('order_number', 'user', 'status', 'payment_method')
        }),
        ('Контактная информация', {
            'fields': ('phone', 'email')
        }),
        ('Адрес доставки', {
            'fields': ('address', 'city', 'postal_code')
        }),
        ('Стоимость', {
            'fields': ('subtotal', 'shipping_cost', 'total')
        }),
        ('Комментарии', {
            'fields': ('notes',)
        }),
        ('Метаданные', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone', 'email', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name', 'phone', 'email', 'address']