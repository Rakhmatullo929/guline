from django.urls import path
from . import views

app_name = 'shop'

urlpatterns = [
    # Основные страницы
    path('', views.home, name='home'),
    path('catalog/', views.catalog, name='catalog'),
    path('product/<slug:slug>/', views.product_detail, name='product_detail'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),
    path('favorites/', views.favorites_page, name='favorites'),
    
    # HTMX endpoints
    path('htmx/catalog/filter/', views.htmx_catalog_filter, name='htmx_catalog_filter'),
    path('htmx/search/', views.htmx_product_search, name='htmx_product_search'),
    path('htmx/product/<slug:slug>/', views.htmx_product_details, name='htmx_product_details'),
    path('htmx/products/load-more/', views.htmx_load_more_products, name='htmx_load_more_products'),
    path('htmx/favorite/toggle/<int:product_id>/', views.htmx_toggle_favorite, name='htmx_toggle_favorite'),
    
    # API endpoints
    path('api/favorites/data/', views.api_favorites_data, name='api_favorites_data'),
]