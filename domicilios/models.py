from django.db import models
from decimal import Decimal
# Create your models here.
class Domiciliario(models.Model):

    x_domiciliario = models.IntegerField(default=None)
    y_domiciliario = models.IntegerField()
    x_pedido = models.IntegerField()
    y_pedido = models.IntegerField()
    id_domiciliario_escogido = models.IntegerField()
    distancia = models.DecimalField(decimal_places=4,max_digits=8,default=Decimal(0))

    def __str__(self):
        return self.id