from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from shop.models import Product, Review, Order, OrderItem
from decimal import Decimal
import random


class Command(BaseCommand):
    help = 'Добавляет дополнительные отзывы и заказы'

    def handle(self, *args, **options):
        self.stdout.write('Добавляем дополнительные отзывы и заказы...')
        
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
        
        # Создаем тестовые заказы
        order_data = {
            'user': test_user,
            'order_number': f'ORD-{random.randint(1000, 9999)}',
            'status': 'delivered',
            'payment_method': 'card',
            'phone': '+7 (999) 123-45-67',
            'email': 'test@guline.ru',
            'address': 'Москва, ул. Тестовая, 123, кв. 45',
            'city': 'Москва',
            'postal_code': '123456',
            'subtotal': Decimal('0.00'),
            'shipping_cost': Decimal('500.00'),
            'total': Decimal('0.00'),
            'notes': 'Тестовый заказ'
        }
        
        # Создаем заказ
        order = Order.objects.create(**order_data)
        
        # Добавляем товары в заказ
        selected_products = random.sample(products, min(3, len(products)))
        subtotal = Decimal('0.00')
        
        for product in selected_products:
            quantity = random.randint(1, 3)
            order_item = OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                size=random.choice(['S', 'M', 'L', 'XL']),
                color=random.choice(['черный', 'белый', 'синий']),
                price=product.price
            )
            subtotal += order_item.total_price
            self.stdout.write(f'Добавлен товар в заказ: {product.name} x{quantity}')
        
        # Обновляем суммы заказа
        order.subtotal = subtotal
        order.total = subtotal + order.shipping_cost
        order.save()
        
        self.stdout.write(f'Создан заказ: {order.order_number} на сумму {order.total} руб.')
        
        self.stdout.write(
            self.style.SUCCESS('Дополнительные данные успешно добавлены!')
        )
        self.stdout.write(f'Всего отзывов: {Review.objects.count()}')
        self.stdout.write(f'Всего заказов: {Order.objects.count()}')
