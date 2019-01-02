# Generated by Django 2.0 on 2019-01-01 14:33

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Annotation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('context', models.CharField(default='http://www.w3.org/ns/anno.jsonld', max_length=255)),
                ('type', models.CharField(default='Annotation', max_length=255)),
                ('created', models.DateField(db_index=True, default=datetime.date(2019, 1, 1))),
            ],
        ),
        migrations.CreateModel(
            name='Body',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('format', models.CharField(default='text/plain', max_length=255)),
                ('type', models.CharField(default='TextualBody', max_length=255)),
                ('value', models.TextField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Selector',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sel_type', models.CharField(blank=True, max_length=255)),
                ('type', models.CharField(blank=True, max_length=255)),
                ('image_id', models.FloatField(blank=True)),
                ('width', models.FloatField(blank=True)),
                ('height', models.FloatField(blank=True)),
                ('x', models.FloatField(blank=True)),
                ('y', models.FloatField(blank=True)),
                ('start', models.IntegerField(blank=True)),
                ('end', models.IntegerField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Target',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('source', models.CharField(blank=True, max_length=255)),
                ('selector', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, related_name='annotation', to='annotations.Selector')),
            ],
        ),
        migrations.AddField(
            model_name='annotation',
            name='body',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, related_name='annotation', to='annotations.Body'),
        ),
        migrations.AddField(
            model_name='annotation',
            name='creator',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='annotation',
            name='target',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, related_name='annotation', to='annotations.Target'),
        ),
    ]