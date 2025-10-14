from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from shop.models import Category, Product
import os


class Command(BaseCommand):
    help = 'Добавляет тестовые данные продуктов с полными характеристиками'

    def handle(self, *args, **options):
        # Создаем категории если их нет
        categories_data = [
            {
                'name': 'Платья',
                'description': 'Элегантные платья для любого случая'
            },
            {
                'name': 'Рубашки',
                'description': 'Классические и современные рубашки'
            },
            {
                'name': 'Брюки',
                'description': 'Удобные и стильные брюки'
            },
            {
                'name': 'Детская одежда',
                'description': 'Модная детская одежда'
            }
        ]

        categories = {}
        for cat_data in categories_data:
            # Добавляем slug если его нет
            if 'slug' not in cat_data:
                from django.utils.text import slugify
                cat_data['slug'] = slugify(cat_data['name'])
            
            # Создаем категорию напрямую
            category = Category.objects.create(
                name=cat_data['name'],
                slug=cat_data['slug'],
                description=cat_data['description']
            )
            categories[cat_data['name']] = category
            self.stdout.write(f'Создана категория: {category.name}')

        # Создаем продукты
        products_data = [
            {
                'name': 'Элегантное черное платье',
                'description': 'Классическое черное платье для особых случаев. Изготовлено из качественного материала, идеально сидит по фигуре.',
                'category': categories['Платья'],
                'gender': 'women',
                'price': 5999.00,
                'old_price': 7999.00,
                'available_sizes': 'S,M,L,XL',
                'available_colors': 'Черный,Синий,Красный',
                'is_featured': True
            },
            {
                'name': 'Классическая белая рубашка',
                'description': 'Универсальная белая рубашка из хлопка. Подходит для офиса и повседневной носки.',
                'category': categories['Рубашки'],
                'gender': 'unisex',
                'price': 2999.00,
                'old_price': None,
                'available_sizes': 'S,M,L,XL,XXL',
                'available_colors': 'Белый,Голубой,Розовый',
                'is_featured': False
            },
            {
                'name': 'Стильные джинсы',
                'description': 'Классические синие джинсы из денима. Удобные и прочные, подходят для повседневной носки.',
                'category': categories['Брюки'],
                'gender': 'unisex',
                'price': 4499.00,
                'old_price': 5999.00,
                'available_sizes': 'S,M,L,XL,XXL',
                'available_colors': 'Синий,Черный,Серый',
                'is_featured': True
            },
            {
                'name': 'Детское платье с цветочками',
                'description': 'Милое детское платье с цветочным принтом. Изготовлено из мягкого хлопка, безопасно для детской кожи.',
                'category': categories['Детская одежда'],
                'gender': 'kids',
                'price': 1999.00,
                'old_price': None,
                'available_sizes': 'XS,S,M',
                'available_colors': 'Розовый,Голубой,Желтый',
                'is_featured': False
            },
            {
                'name': 'Мужская рубашка в клетку',
                'description': 'Стильная мужская рубашка в клетку. Подходит для офиса и неформальных встреч.',
                'category': categories['Рубашки'],
                'gender': 'men',
                'price': 3499.00,
                'old_price': 4499.00,
                'available_sizes': 'S,M,L,XL,XXL',
                'available_colors': 'Красный,Синий,Зеленый',
                'is_featured': True
            }
        ]

        for product_data in products_data:
            # Генерируем slug
            slug = slugify(product_data['name'])
            
            # Создаем продукт
            product = Product.objects.create(
                name=product_data['name'],
                slug=slug,
                description=product_data['description'],
                category=product_data['category'],
                gender=product_data['gender'],
                price=product_data['price'],
                old_price=product_data['old_price'],
                available_sizes=product_data['available_sizes'],
                available_colors=product_data['available_colors'],
                is_featured=product_data['is_featured']
            )


            self.stdout.write(
                self.style.SUCCESS(f'Создан продукт: {product.name}')
            )

        self.stdout.write(
            self.style.SUCCESS(f'Успешно создано {len(products_data)} продуктов!')
        )