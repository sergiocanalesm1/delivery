from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import DomiciliarioSerializer
from .models import Domiciliario

# Create your views here.
@api_view(['GET'])
def lista(request):
    todos = Domiciliario.objects.all()
    serializer = DomiciliarioSerializer(todos, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def crear(request):
    serializer = DomiciliarioSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

@api_view(['DELETE'])
def borrar(request,pk):
    domiciliario = Domiciliario.objects.get(id=pk)
    domiciliario.delete()
    return Response('item {} deleted'.format(pk))