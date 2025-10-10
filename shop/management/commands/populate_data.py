from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from shop.models import Category, Product, Contact, Review
from decimal import Decimal
import os


class Command(BaseCommand):
    help = 'Добавляет тестовые данные в базу данных'

    def handle(self, *args, **options):
        self.stdout.write('Начинаем добавление тестовых данных...')
        
        # Создаем суперпользователя если его нет
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@guline.ru', 'admin123')
            self.stdout.write('Создан суперпользователь: admin/admin123')
        
        # Создаем тестового пользователя
        if not User.objects.filter(username='testuser').exists():
            User.objects.create_user('testuser', 'test@guline.ru', 'test123')
            self.stdout.write('Создан тестовый пользователь: testuser/test123')
        
        # Создаем категории
        categories_data = [
            {
                'name': 'Мужская одежда',
                'slug': 'mens-clothing',
                'description': 'Стильная мужская одежда для любого случая'
            },
            {
                'name': 'Женская одежда',
                'slug': 'womens-clothing',
                'description': 'Элегантная женская одежда на каждый день'
            },
            {
                'name': 'Детская одежда',
                'slug': 'kids-clothing',
                'description': 'Удобная и красивая одежда для детей'
            },
            {
                'name': 'Аксессуары',
                'slug': 'accessories',
                'description': 'Модные аксессуары для завершения образа'
            },
            {
                'name': 'Обувь',
                'slug': 'shoes',
                'description': 'Качественная обувь для всех сезонов'
            }
        ]
        
        categories = {}
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                slug=cat_data['slug'],
                defaults=cat_data
            )
            categories[cat_data['slug']] = category
            if created:
                self.stdout.write(f'Создана категория: {category.name}')
        
        # Создаем товары
        products_data = [
            {
                'name': 'Классическая мужская рубашка',
                'slug': 'mens-classic-shirt',
                'description': 'Элегантная мужская рубашка из качественного хлопка. Идеально подходит для офиса и повседневной носки.',
                'short_description': 'Классическая рубашка из хлопка',
                'category': categories['mens-clothing'],
                'gender': 'men',
                'price': Decimal('2999.00'),
                'old_price': Decimal('3999.00'),
                'material': '100% хлопок',
                'available_sizes': 'S,M,L,XL,XXL',
                'available_colors': 'белый,голубой,черный',
                'stock_quantity': 50,
                'is_featured': True
            },
            {
                'name': 'Джинсы прямого кроя',
                'slug': 'straight-fit-jeans',
                'description': 'Классические джинсы прямого кроя из денима. Удобные и стильные, подходят для любого случая.',
                'short_description': 'Джинсы прямого кроя',
                'category': categories['mens-clothing'],
                'gender': 'men',
                'price': Decimal('4999.00'),
                'material': '98% хлопок, 2% эластан',
                'available_sizes': '28,30,32,34,36,38',
                'available_colors': 'синий,черный',
                'stock_quantity': 30,
                'is_featured': True
            },
            {
                'name': 'Элегантное женское платье',
                'slug': 'elegant-womens-dress',
                'description': 'Красивое женское платье для особых случаев. Изящный крой и качественные материалы.',
                'short_description': 'Элегантное платье',
                'category': categories['womens-clothing'],
                'gender': 'women',
                'price': Decimal('6999.00'),
                'old_price': Decimal('8999.00'),
                'material': 'Полиэстер, вискоза',
                'available_sizes': 'XS,S,M,L,XL',
                'available_colors': 'черный,красный,синий',
                'stock_quantity': 25,
                'is_featured': True
            },
            {
                'name': 'Детская футболка с принтом',
                'slug': 'kids-printed-t-shirt',
                'description': 'Яркая детская футболка с забавным принтом. Из мягкого хлопка, не вызывает раздражения.',
                'short_description': 'Футболка с принтом для детей',
                'category': categories['kids-clothing'],
                'gender': 'kids',
                'price': Decimal('1299.00'),
                'material': '100% хлопок',
                'available_sizes': '104,110,116,122,128,134',
                'available_colors': 'белый,розовый,голубой,желтый',
                'stock_quantity': 40,
                'is_featured': False
            },
            {
                'name': 'Кожаная сумка',
                'slug': 'leather-handbag',
                'description': 'Стильная кожаная сумка для повседневного использования. Качественная натуральная кожа.',
                'short_description': 'Кожаная сумка',
                'category': categories['accessories'],
                'gender': 'women',
                'price': Decimal('8999.00'),
                'material': 'Натуральная кожа',
                'available_colors': 'черный,коричневый',
                'stock_quantity': 15,
                'is_featured': True
            },
            {
                'name': 'Кроссовки спортивные',
                'slug': 'sports-sneakers',
                'description': 'Удобные спортивные кроссовки для активного образа жизни. Дышащие материалы и амортизация.',
                'short_description': 'Спортивные кроссовки',
                'category': categories['shoes'],
                'gender': 'unisex',
                'price': Decimal('5999.00'),
                'material': 'Текстиль, синтетические материалы',
                'available_sizes': '36,37,38,39,40,41,42,43,44',
                'available_colors': 'белый,черный,серый',
                'stock_quantity': 60,
                'is_featured': True
            },
            {
                'name': 'Толстовка с капюшоном',
                'slug': 'hoodie-sweatshirt',
                'description': 'Удобная толстовка с капюшоном для прохладной погоды. Мягкий материал и удобный крой.',
                'short_description': 'Толстовка с капюшоном',
                'category': categories['mens-clothing'],
                'gender': 'unisex',
                'price': Decimal('3999.00'),
                'material': '80% хлопок, 20% полиэстер',
                'available_sizes': 'S,M,L,XL,XXL',
                'available_colors': 'черный,серый,синий',
                'stock_quantity': 35,
                'is_featured': False
            },
            {
                'name': 'Юбка-карандаш',
                'slug': 'pencil-skirt',
                'description': 'Классическая юбка-карандаш для делового стиля. Элегантный крой и качественные материалы.',
                'short_description': 'Юбка-карандаш',
                'category': categories['womens-clothing'],
                'gender': 'women',
                'price': Decimal('3499.00'),
                'material': 'Шерсть, полиэстер',
                'available_sizes': 'XS,S,M,L,XL',
                'available_colors': 'черный,серый,синий',
                'stock_quantity': 20,
                'is_featured': False
            }
        ]
        
        for product_data in products_data:
            product, created = Product.objects.get_or_create(
                slug=product_data['slug'],
                defaults=product_data
            )
            if created:
                self.stdout.write(f'Создан товар: {product.name}')
        
        # Создаем контактную информацию
        contact_data = {
            'name': 'GULINE - Интернет-магазин одежды',
            'phone': '+7 (999) 123-45-67',
            'email': 'info@guline.ru',
            'address': 'Москва, ул. Примерная, 123, офис 45',
            'working_hours': 'Пн-Пт: 9:00-21:00, Сб-Вс: 10:00-20:00',
            'is_active': True
        }
        
        contact, created = Contact.objects.get_or_create(
            name=contact_data['name'],
            defaults=contact_data
        )
        if created:
            self.stdout.write(f'Создана контактная информация: {contact.name}')
        
        # Создаем несколько отзывов
        test_user = User.objects.get(username='testuser')
        products = Product.objects.all()[:3]  # Берем первые 3 товара
        
        reviews_data = [
            {
                'product': products[0] if len(products) > 0 else None,
                'user': test_user,
                'rating': 5,
                'title': 'Отличная рубашка!',
                'text': 'Очень качественная рубашка, материал приятный к телу. Размер подошел идеально.'
            },
            {
                'product': products[1] if len(products) > 1 else None,
                'user': test_user,
                'rating': 4,
                'title': 'Хорошие джинсы',
                'text': 'Джинсы качественные, но немного длинные. В остальном все отлично.'
            },
            {
                'product': products[2] if len(products) > 2 else None,
                'user': test_user,
                'rating': 5,
                'title': 'Красивое платье',
                'text': 'Платье очень красивое, хорошо сидит. Рекомендую!'
            }
        ]
        
        for review_data in reviews_data:
            if review_data['product']:
                review, created = Review.objects.get_or_create(
                    product=review_data['product'],
                    user=review_data['user'],
                    defaults=review_data
                )
                if created:
                    self.stdout.write(f'Создан отзыв для товара: {review.product.name}')
        
        self.stdout.write(
            self.style.SUCCESS('Тестовые данные успешно добавлены!')
        )
        self.stdout.write('Создано:')
        self.stdout.write(f'- Категорий: {Category.objects.count()}')
        self.stdout.write(f'- Товаров: {Product.objects.count()}')
        self.stdout.write(f'- Отзывов: {Review.objects.count()}')
        self.stdout.write(f'- Контактов: {Contact.objects.count()}')
        self.stdout.write(f'- Пользователей: {User.objects.count()}')
