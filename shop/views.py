from django.shortcuts import render, get_object_or_404, redirect
from django.core.paginator import Paginator
from django.db.models import Q, Avg
from django.utils import translation
from django.conf import settings
from django.http import JsonResponse
from django.template.loader import render_to_string
from django.views.decorators.csrf import csrf_exempt
import json

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


def set_language(request):
    """Переключение языка"""
    from django.urls import reverse
    from django.utils.translation import get_language
    import re
    
    lang_code = request.GET.get('lang')
    if lang_code and lang_code in [lang[0] for lang in settings.LANGUAGES]:
        translation.activate(lang_code)
        request.session['django_language'] = lang_code
        
        # Получаем URL для перенаправления
        next_url = request.GET.get('next')
        if next_url:
            # Убираем текущий языковой префикс и добавляем новый
            # Убираем префиксы типа /ru/, /en/, /uz/
            next_url = re.sub(r'^/[a-z]{2}/', '/', next_url)
            # Добавляем новый языковой префикс
            next_url = f'/{lang_code}{next_url}'
        else:
            # Если нет next параметра, перенаправляем на главную страницу с языковым префиксом
            next_url = f'/{lang_code}/'
        
        response = redirect(next_url)
        response.set_cookie('django_language', lang_code)
        return response
    
    # Если язык не найден, перенаправляем на главную
    return redirect('/')


# HTMX Views
def htmx_catalog_filter(request):
    """HTMX представление для фильтрации каталога"""
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
    
    context = {
        'products': page_obj,
        'current_category': category,
        'current_gender': gender,
        'search_query': search_query,
        'sort_by': sort_by,
    }
    
    # Если это HTMX запрос, возвращаем только HTML
    if request.headers.get('HX-Request'):
        return render(request, 'shop/partials/product_grid.html', context)
    
    return render(request, 'shop/catalog.html', context)


def htmx_product_search(request):
    """HTMX представление для поиска товаров"""
    search_query = request.GET.get('q', '').strip()
    
    if not search_query:
        return render(request, 'shop/partials/search_results.html', {'products': []})
    
    products = Product.objects.filter(
        Q(name__icontains=search_query) | 
        Q(description__icontains=search_query),
        is_active=True
    )[:8]
    
    context = {
        'products': products,
        'search_query': search_query,
    }
    
    return render(request, 'shop/partials/search_results.html', context)


def htmx_product_details(request, slug):
    """HTMX представление для детальной информации о товаре"""
    product = get_object_or_404(Product, slug=slug, is_active=True)
    
    # Получаем дополнительные изображения
    images = product.images.all().order_by('order')
    
    # Получаем отзывы
    reviews = Review.objects.filter(product=product, is_approved=True).order_by('-created_at')
    
    # Вычисляем средний рейтинг
    avg_rating = reviews.aggregate(Avg('rating'))['rating__avg'] or 0
    
    context = {
        'product': product,
        'images': images,
        'reviews': reviews,
        'avg_rating': avg_rating,
    }
    
    # Если это HTMX запрос, возвращаем только HTML
    if request.headers.get('HX-Request'):
        return render(request, 'shop/partials/product_details.html', context)
    
    return render(request, 'shop/product_detail.html', context)


# HTMX представление для добавления в корзину удалено - теперь используется Telegram


def htmx_load_more_products(request):
    """HTMX представление для подгрузки дополнительных товаров"""
    page = int(request.GET.get('page', 1))
    category_slug = request.GET.get('category')
    gender = request.GET.get('gender')
    
    products = Product.objects.filter(is_active=True)
    
    if category_slug:
        category = get_object_or_404(Category, slug=category_slug, is_active=True)
        products = products.filter(category=category)
    
    if gender:
        products = products.filter(gender=gender)
    
    # Пагинация
    paginator = Paginator(products, 12)
    page_obj = paginator.get_page(page)
    
    context = {
        'products': page_obj,
        'has_next': page_obj.has_next(),
        'next_page': page + 1 if page_obj.has_next() else None,
    }
    
    return render(request, 'shop/partials/product_grid.html', context)


def htmx_toggle_favorite(request, product_id):
    """HTMX представление для добавления/удаления из избранного"""
    product = get_object_or_404(Product, id=product_id, is_active=True)
    
    # Получаем список избранных товаров из localStorage (передается через JavaScript)
    favorites_data = request.POST.get('favorites', '[]')
    try:
        favorites = json.loads(favorites_data)
    except (json.JSONDecodeError, TypeError):
        favorites = []
    
    # Определяем текущий статус
    is_favorite = product_id in favorites
    
    context = {
        'product': product,
        'is_favorite': is_favorite,
    }
    
    return render(request, 'shop/partials/favorite_button.html', context)


def favorites_page(request):
    """Страница избранных товаров"""
    # Получаем список избранных товаров из localStorage (передается через JavaScript)
    favorites_data = request.GET.get('favorites', '[]')
    try:
        favorites = json.loads(favorites_data)
    except (json.JSONDecodeError, TypeError):
        favorites = []
    
    # Получаем товары из базы данных
    products = Product.objects.filter(
        id__in=favorites,
        is_active=True
    ).order_by('-created_at')
    
    context = {
        'products': products,
        'favorites_count': len(products),
    }
    
    return render(request, 'shop/favorites.html', context)


@csrf_exempt
def api_favorites_data(request):
    """API для получения данных избранных товаров"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            product_ids = data.get('product_ids', [])
            
            # Получаем товары из базы данных
            products = Product.objects.filter(
                id__in=product_ids,
                is_active=True
            )
            
            # Формируем данные для ответа
            products_data = []
            for product in products:
                products_data.append({
                    'id': product.id,
                    'name': product.name,
                    'slug': product.slug,
                    'price': float(product.price),
                    'old_price': float(product.old_price) if product.old_price else None,
                    'main_image': product.main_image.url if product.main_image else None,
                    'discount_percentage': product.discount_percentage,
                    'category': {
                        'name': product.category.name,
                        'slug': product.category.slug,
                    },
                    'gender': product.gender,
                    'available_sizes': product.available_sizes_list,
                    'available_colors': product.available_colors_list,
                })
            
            return JsonResponse({
                'success': True,
                'products': products_data,
                'count': len(products_data)
            })
            
        except (json.JSONDecodeError, TypeError) as e:
            return JsonResponse({
                'success': False,
                'error': 'Invalid JSON data'
            }, status=400)
    
    return JsonResponse({
        'success': False,
        'error': 'Method not allowed'
    }, status=405)