from rest_framework import serializers
from .models import Domiciliario

class DomiciliarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Domiciliario
        fields = '__all__'
