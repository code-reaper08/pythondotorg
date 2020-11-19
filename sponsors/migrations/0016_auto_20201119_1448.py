# Generated by Django 2.0.13 on 2020-11-19 14:48

from django.db import migrations, models
import django_countries.fields


class Migration(migrations.Migration):

    dependencies = [
        ("sponsors", "0015_auto_20201117_1739"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="sponsor",
            name="mailing_address",
        ),
        migrations.AddField(
            model_name="sponsor",
            name="city",
            field=models.CharField(default="", max_length=64, verbose_name="City"),
        ),
        migrations.AddField(
            model_name="sponsor",
            name="country",
            field=django_countries.fields.CountryField(default="", max_length=2),
        ),
        migrations.AddField(
            model_name="sponsor",
            name="mailing_address_line_1",
            field=models.CharField(
                default="", max_length=128, verbose_name="Mailing Address line 1"
            ),
        ),
        migrations.AddField(
            model_name="sponsor",
            name="mailing_address_line_2",
            field=models.CharField(
                blank=True,
                default="",
                max_length=128,
                verbose_name="Mailing Address line 2",
            ),
        ),
        migrations.AddField(
            model_name="sponsor",
            name="postal_code",
            field=models.CharField(
                default="", max_length=64, verbose_name="Zip/Postal Code"
            ),
        ),
        migrations.AddField(
            model_name="sponsor",
            name="state",
            field=models.CharField(
                blank=True,
                default="",
                max_length=64,
                verbose_name="State/Province/Region",
            ),
        ),
    ]
