from django.core.management.base import BaseCommand
from shop.models import Category


class Command(BaseCommand):
    help = 'Добавляет основные категории модной одежды'

    def handle(self, *args, **options):
        categories = [
            'Брюки',
            'Рубашка', 
            'Футболка',
            'Кроссовки',
            'Платья',
            'Аксессуары'
        ]

        created_count = 0
        for category_name in categories:
            category, created = Category.objects.get_or_create(
                name=category_name,
                defaults={'is_active': True}
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
