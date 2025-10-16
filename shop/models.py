from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.text import slugify


class Category(models.Model):
    """Модель категории товаров"""
    name = models.CharField(max_length=100, verbose_name="Название")
    slug = models.SlugField(max_length=100, blank=True, null=True, verbose_name="URL")
    is_active = models.BooleanField(default=True, verbose_name="Активна")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Создано")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Обновлено")

    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"
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
        ('men', 'Мужская'),
        ('women', 'Женская'),
        ('kids', 'Детская'),
        ('unisex', 'Унисекс'),
    ]

    name = models.CharField(max_length=200, verbose_name="Название")
    slug = models.SlugField(max_length=200, blank=True, null=True, verbose_name="URL")
    description = models.TextField(verbose_name="Описание")
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products', verbose_name="Категория")
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default='unisex', verbose_name="Пол")
    # Цены
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Цена")
    old_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, verbose_name="Старая цена")
    # Изображения
    main_image = models.ImageField(upload_to='products/', verbose_name="Основное изображение")
    # Размеры и цвета
    available_sizes = models.CharField(max_length=50, default="S,M,L,XL", verbose_name="Доступные размеры")
    available_colors = models.CharField(max_length=200, default="white,blue,black", verbose_name="Доступные цвета")
    # Метаданные
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Создано")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Обновлено")

    class Meta:
        verbose_name = "Товар"
        verbose_name_plural = "Товары"
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
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images', verbose_name="Товар")
    image = models.ImageField(upload_to='products/', verbose_name="Изображение")
    alt_text = models.CharField(max_length=200, blank=True, verbose_name="Альтернативный текст")
    is_main = models.BooleanField(default=False, verbose_name="Основное изображение")
    order = models.PositiveIntegerField(default=0, verbose_name="Порядок")

    class Meta:
        verbose_name = "Изображение товара"
        verbose_name_plural = "Изображения товаров"
        ordering = ['order']

    def __str__(self):
        return f"{self.product.name} - Изображение {self.order}"


class Review(models.Model):
    """Модель отзыва о товаре"""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews', verbose_name="Товар")
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Пользователь")
    rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name="Оценка"
    )
    title = models.CharField(max_length=200, verbose_name="Заголовок")
    text = models.TextField(verbose_name="Текст отзыва")
    is_approved = models.BooleanField(default=True, verbose_name="Одобрен")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Создано")

    class Meta:
        verbose_name = "Отзыв"
        verbose_name_plural = "Отзывы"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.product.name} - {self.user.username} ({self.rating}/5)"


class Contact(models.Model):
    """Модель контактной информации"""
    name = models.CharField(max_length=100, verbose_name="Название")
    phone = models.CharField(max_length=20, verbose_name="Телефон")
    email = models.EmailField(verbose_name="Email")
    address = models.TextField(verbose_name="Адрес")
    working_hours = models.CharField(max_length=200, verbose_name="Часы работы")
    is_active = models.BooleanField(default=True, verbose_name="Активен")

    class Meta:
        verbose_name = "Контакт"
        verbose_name_plural = "Контакты"

    def __str__(self):
        return self.name