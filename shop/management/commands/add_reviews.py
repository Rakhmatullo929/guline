from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from shop.models import Product, Review
import random


class Command(BaseCommand):
    help = 'Добавляет дополнительные отзывы'

    def handle(self, *args, **options):
        self.stdout.write('Добавляем дополнительные отзывы...')
        
        # Получаем пользователей и товары
        test_user = User.objects.get(username='testuser')
        products = list(Product.objects.all())
        
        if not products:
            self.stdout.write('Товары не найдены!')
            return
        
        # Создаем дополнительные отзывы
        review_templates = [
            {
                'rating': 5,
                'title': 'Отличное качество!',
                'text': 'Очень доволен покупкой. Качество на высоте, материал приятный.'
            },
            {
                'rating': 4,
                'title': 'Хороший товар',
                'text': 'В целом товар хороший, но есть небольшие недочеты.'
            },
            {
                'rating': 5,
                'title': 'Рекомендую!',
                'text': 'Отличное соотношение цена-качество. Буду покупать еще.'
            },
            {
                'rating': 3,
                'title': 'Нормально',
                'text': 'Товар соответствует описанию, но ожидал большего.'
            },
            {
                'rating': 5,
                'title': 'Супер!',
                'text': 'Превысил все ожидания. Очень качественный товар.'
            }
        ]
        
        # Добавляем отзывы к случайным товарам
        for i in range(10):
            product = random.choice(products)
            template = random.choice(review_templates)
            
            review, created = Review.objects.get_or_create(
                product=product,
                user=test_user,
                title=template['title'],
                defaults={
                    'rating': template['rating'],
                    'text': template['text']
                }
            )
            if created:
                self.stdout.write(f'Создан отзыв: {product.name} - {template["rating"]}/5')
        
        self.stdout.write(
            self.style.SUCCESS('Дополнительные отзывы успешно добавлены!')
        )
        self.stdout.write(f'Всего отзывов: {Review.objects.count()}')
