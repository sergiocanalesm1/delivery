# Generated by Django 3.1 on 2020-08-12 22:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('domicilios', '0002_remove_domiciliario_x_domiciliario'),
    ]

    operations = [
        migrations.AddField(
            model_name='domiciliario',
            name='x_domiciliario',
            field=models.IntegerField(default=None),
        ),
    ]
