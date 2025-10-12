from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _


class Category(models.Model):
    """Модель категории товаров"""
    name = models.CharField(max_length=100, verbose_name=_("Название"))
    slug = models.SlugField(max_length=100, unique=True, verbose_name=_("URL"))
    description = models.TextField(blank=True, verbose_name=_("Описание"))
    image = models.ImageField(upload_to='categories/', blank=True, null=True, verbose_name=_("Изображение"))
    is_active = models.BooleanField(default=True, verbose_name=_("Активна"))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Создано"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("Обновлено"))

    class Meta:
        verbose_name = _("Категория")
        verbose_name_plural = _("Категории")
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Product(models.Model):
    """Модель товара"""
    SIZE_CHOICES = [
        ('XS', 'XS'),
        ('S', 'S'),
        ('M', 'M'),
        ('L', 'L'),
        ('XL', 'XL'),
        ('XXL', 'XXL'),
    ]

    GENDER_CHOICES = [
        ('men', _('Мужская')),
        ('women', _('Женская')),
        ('kids', _('Детская')),
        ('unisex', _('Унисекс')),
    ]

    name = models.CharField(max_length=200, verbose_name=_("Название"))
    slug = models.SlugField(max_length=200, unique=True, verbose_name=_("URL"))
    description = models.TextField(verbose_name=_("Описание"))
    short_description = models.CharField(max_length=300, blank=True, verbose_name=_("Краткое описание"))
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products', verbose_name=_("Категория"))
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default='unisex', verbose_name=_("Пол"))
    
    # Цены
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name=_("Цена"))
    old_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, verbose_name=_("Старая цена"))
    
    # Изображения
    main_image = models.ImageField(upload_to='products/', verbose_name=_("Основное изображение"))
    
    # Характеристики
    material = models.CharField(max_length=100, blank=True, verbose_name=_("Материал"))
    country = models.CharField(max_length=100, default="Россия", verbose_name=_("Страна производства"))
    care_instructions = models.TextField(blank=True, verbose_name=_("Инструкции по уходу"))
    
    # Размеры и цвета
    available_sizes = models.CharField(max_length=50, default="S,M,L,XL", verbose_name=_("Доступные размеры"))
    available_colors = models.CharField(max_length=200, default="white,blue,black", verbose_name=_("Доступные цвета"))
    
    # Статус
    is_active = models.BooleanField(default=True, verbose_name=_("Активен"))
    is_featured = models.BooleanField(default=False, verbose_name=_("Рекомендуемый"))
    stock_quantity = models.PositiveIntegerField(default=0, verbose_name=_("Количество на складе"))
    
    # Метаданные
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Создано"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("Обновлено"))

    class Meta:
        verbose_name = _("Товар")
        verbose_name_plural = _("Товары")
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    @property
    def discount_percentage(self):
        """Вычисляет процент скидки"""
        if self.old_price and self.old_price > self.price:
            return int(((self.old_price - self.price) / self.old_price) * 100)
        return 0

    @property
    def available_sizes_list(self):
        """Возвращает список доступных размеров"""
        return [size.strip() for size in self.available_sizes.split(',')]

    @property
    def available_colors_list(self):
        """Возвращает список доступных цветов"""
        return [color.strip() for color in self.available_colors.split(',')]


class ProductImage(models.Model):
    """Модель дополнительных изображений товара"""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images', verbose_name=_("Товар"))
    image = models.ImageField(upload_to='products/', verbose_name=_("Изображение"))
    alt_text = models.CharField(max_length=200, blank=True, verbose_name=_("Альтернативный текст"))
    is_main = models.BooleanField(default=False, verbose_name=_("Основное изображение"))
    order = models.PositiveIntegerField(default=0, verbose_name=_("Порядок"))

    class Meta:
        verbose_name = _("Изображение товара")
        verbose_name_plural = _("Изображения товаров")
        ordering = ['order']

    def __str__(self):
        return f"{self.product.name} - Изображение {self.order}"


class Review(models.Model):
    """Модель отзыва о товаре"""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews', verbose_name=_("Товар"))
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name=_("Пользователь"))
    rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name=_("Оценка")
    )
    title = models.CharField(max_length=200, verbose_name=_("Заголовок"))
    text = models.TextField(verbose_name=_("Текст отзыва"))
    is_approved = models.BooleanField(default=True, verbose_name=_("Одобрен"))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Создано"))

    class Meta:
        verbose_name = _("Отзыв")
        verbose_name_plural = _("Отзывы")
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.product.name} - {self.user.username} ({self.rating}/5)"


class Contact(models.Model):
    """Модель контактной информации"""
    name = models.CharField(max_length=100, verbose_name=_("Название"))
    phone = models.CharField(max_length=20, verbose_name=_("Телефон"))
    email = models.EmailField(verbose_name=_("Email"))
    address = models.TextField(verbose_name=_("Адрес"))
    working_hours = models.CharField(max_length=200, verbose_name=_("Часы работы"))
    is_active = models.BooleanField(default=True, verbose_name=_("Активен"))

    class Meta:
        verbose_name = _("Контакт")
        verbose_name_plural = _("Контакты")

    def __str__(self):
        return self.name