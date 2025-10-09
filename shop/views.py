from django.shortcuts import render, get_object_or_404
from django.core.paginator import Paginator
from django.db.models import Q, Avg

from .models import (
    Category, Product, ProductImage, Review, Contact
)


def home(request):
    """Главная страница"""
    # Получаем рекомендуемые товары
    featured_products = Product.objects.filter(
        is_active=True, 
        is_featured=True
    )[:8]
    
    # Получаем категории
    categories = Category.objects.filter(is_active=True)[:3]
    
    # Получаем последние товары
    latest_products = Product.objects.filter(is_active=True)[:8]
    
    context = {
        'featured_products': featured_products,
        'categories': categories,
        'latest_products': latest_products,
    }
    return render(request, 'shop/home.html', context)


def catalog(request):
    """Страница каталога"""
    products = Product.objects.filter(is_active=True)
    
    # Фильтрация по категории
    category_slug = request.GET.get('category')
    if category_slug:
        category = get_object_or_404(Category, slug=category_slug, is_active=True)
        products = products.filter(category=category)
    else:
        category = None
    
    # Фильтрация по полу
    gender = request.GET.get('gender')
    if gender:
        products = products.filter(gender=gender)
    
    # Поиск
    search_query = request.GET.get('search')
    if search_query:
        products = products.filter(
            Q(name__icontains=search_query) | 
            Q(description__icontains=search_query)
        )
    
    # Сортировка
    sort_by = request.GET.get('sort', 'name')
    if sort_by == 'price-low':
        products = products.order_by('price')
    elif sort_by == 'price-high':
        products = products.order_by('-price')
    elif sort_by == 'newest':
        products = products.order_by('-created_at')
    else:
        products = products.order_by('name')
    
    # Пагинация
    paginator = Paginator(products, 12)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Получаем все категории для фильтров
    categories = Category.objects.filter(is_active=True)
    
    context = {
        'products': page_obj,
        'categories': categories,
        'current_category': category,
        'current_gender': gender,
        'search_query': search_query,
        'sort_by': sort_by,
    }
    return render(request, 'shop/catalog.html', context)


def product_detail(request, slug):
    """Страница товара"""
    product = get_object_or_404(Product, slug=slug, is_active=True)
    
    # Получаем дополнительные изображения
    images = product.images.all().order_by('order')
    
    # Получаем отзывы
    reviews = Review.objects.filter(product=product, is_approved=True).order_by('-created_at')
    
    # Вычисляем средний рейтинг
    avg_rating = reviews.aggregate(Avg('rating'))['rating__avg'] or 0
    
    # Получаем похожие товары
    related_products = Product.objects.filter(
        category=product.category,
        is_active=True
    ).exclude(id=product.id)[:4]
    
    context = {
        'product': product,
        'images': images,
        'reviews': reviews,
        'avg_rating': avg_rating,
        'related_products': related_products,
    }
    return render(request, 'shop/product_detail.html', context)


def about(request):
    """Страница о нас"""
    context = {}
    return render(request, 'shop/about.html', context)


def contact(request):
    """Страница контактов"""
    contact_info = Contact.objects.filter(is_active=True).first()
    
    context = {
        'contact_info': contact_info,
    }
    return render(request, 'shop/contact.html', context)