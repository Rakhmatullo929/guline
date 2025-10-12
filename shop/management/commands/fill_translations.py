"""
Команда для заполнения переводов существующих данных
"""
from django.core.management.base import BaseCommand
from django.utils import translation
from shop.models import Category, Product, Review, Contact


class Command(BaseCommand):
    help = 'Заполняет переводы для существующих данных'

    def add_arguments(self, parser):
        parser.add_argument(
            '--model',
            type=str,
            help='Модель для заполнения переводов (category, product, review, contact)',
        )
        parser.add_argument(
            '--language',
            type=str,
            default='ru',
            help='Язык для заполнения (по умолчанию ru)',
        )

    def handle(self, *args, **options):
        model_name = options.get('model')
        language = options.get('language')
        
        if language not in ['ru', 'en', 'uz']:
            self.stdout.write(
                self.style.ERROR(f'Неподдерживаемый язык: {language}')
            )
            return

        if model_name:
            self.fill_model_translations(model_name, language)
        else:
            # Заполняем все модели
            for model in ['category', 'product', 'review', 'contact']:
                self.fill_model_translations(model, language)

    def fill_model_translations(self, model_name, language):
        """Заполняет переводы для указанной модели"""
        models_map = {
            'category': Category,
            'product': Product,
            'review': Review,
            'contact': Contact,
        }

        if model_name not in models_map:
            self.stdout.write(
                self.style.ERROR(f'Неизвестная модель: {model_name}')
            )
            return

        model_class = models_map[model_name]
        objects = model_class.objects.all()
        
        updated_count = 0
        
        for obj in objects:
            updated = False
            
            # Определяем поля для перевода в зависимости от модели
            if model_name == 'category':
                fields = ['name', 'description']
            elif model_name == 'product':
                fields = ['name', 'description', 'short_description', 'material', 'care_instructions']
            elif model_name == 'review':
                fields = ['title', 'text']
            elif model_name == 'contact':
                fields = ['name', 'address', 'working_hours']
            
            for field in fields:
                original_value = getattr(obj, field)
                translated_field = f"{field}_{language}"
                
                if hasattr(obj, translated_field):
                    translated_value = getattr(obj, translated_field)
                    # Если перевод пустой, копируем оригинальное значение
                    if not translated_value and original_value:
                        setattr(obj, translated_field, original_value)
                        updated = True
            
            if updated:
                obj.save()
                updated_count += 1
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Обновлено {updated_count} объектов модели {model_name} для языка {language}'
            )
        )
