from django.core.management.base import BaseCommand
from shop.models import Category


class Command(BaseCommand):
    help = 'Добавляет основные категории товаров'

    def handle(self, *args, **options):
        categories = [
            {'name': 'Футболки', 'description': 'Классические и модные футболки'},
            {'name': 'Рубашки', 'description': 'Деловые и повседневные рубашки'},
            {'name': 'Джинсы', 'description': 'Классические и модные джинсы'},
            {'name': 'Платья', 'description': 'Элегантные и повседневные платья'},
            {'name': 'Куртки', 'description': 'Демисезонные и зимние куртки'},
            {'name': 'Аксессуары', 'description': 'Сумки, ремни, украшения'},
            {'name': 'Обувь', 'description': 'Кроссовки, туфли, сапоги'},
            {'name': 'Спортивная одежда', 'description': 'Для фитнеса и спорта'},
            {'name': 'Нижнее белье', 'description': 'Трусы, майки, носки'},
            {'name': 'Головные уборы', 'description': 'Шапки, кепки, шляпы'},
        ]

        created_count = 0
        for cat_data in categories:
            category, created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={'description': cat_data['description']}
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Создана категория: {category.name}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Категория уже существует: {category.name}')
                )

        self.stdout.write(
            self.style.SUCCESS(f'Создано {created_count} новых категорий')
        )
