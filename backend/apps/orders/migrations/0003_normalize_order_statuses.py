from django.db import migrations


def normalize_statuses(apps, schema_editor):
    Order = apps.get_model("orders", "Order")
    Order.objects.filter(status__in=["confirmed", "preparing", "ready"]).update(
        status="processing"
    )
    Order.objects.filter(status="delivered").update(status="fulfilled")


def restore_legacy_statuses(apps, schema_editor):
    Order = apps.get_model("orders", "Order")
    Order.objects.filter(status="processing").update(status="preparing")
    Order.objects.filter(status="fulfilled").update(status="delivered")


class Migration(migrations.Migration):

    dependencies = [
        ("orders", "0002_alter_order_status"),
    ]

    operations = [
        migrations.RunPython(normalize_statuses, restore_legacy_statuses),
    ]
