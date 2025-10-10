from django.core.management.base import BaseCommand
from shop.models import Product
import os
from django.conf import settings


class Command(BaseCommand):
    help = 'Добавляет изображения к товарам'

    def handle(self, *args, **options):
        self.stdout.write('Добавляем изображения к товарам...')
        
        # Получаем список существующих изображений
        media_path = settings.MEDIA_ROOT
        products_path = os.path.join(media_path, 'products')
        
        if not os.path.exists(products_path):
            self.stdout.write('Папка с изображениями товаров не найдена!')
            return
        
        # Получаем все изображения
        image_files = [f for f in os.listdir(products_path) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
        
        if not image_files:
            self.stdout.write('Изображения не найдены!')
            return
        
        self.stdout.write(f'Найдено изображений: {len(image_files)}')
        
        # Получаем все товары
        products = Product.objects.all()
        
        if not products.exists():
            self.stdout.write('Товары не найдены!')
            return
        
        # Назначаем изображения товарам
        for i, product in enumerate(products):
            if i < len(image_files):
                image_path = os.path.join('products', image_files[i])
                product.main_image = image_path
                product.save()
                self.stdout.write(f'Добавлено изображение к товару: {product.name}')
        
        self.stdout.write(
            self.style.SUCCESS('Изображения успешно добавлены к товарам!')
        )
