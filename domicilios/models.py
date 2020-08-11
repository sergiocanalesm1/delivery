from django.db import models

# Create your models here.
class Domiciliario(models.Model):

    coordenada_x = models.IntegerField()
    coordenada_y = models.IntegerField()

    def __str__(self):
        return (self.coordenada_x,self.coordenada_y)