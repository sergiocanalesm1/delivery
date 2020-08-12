from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import DomiciliarioSerializer
from .models import Domiciliario
import urllib.request, json

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
    return Response('item {} borrado'.format(pk))
@api_view(['DELETE'])
def borrar_info(request):
    Domiciliario.objects.all().delete()
    return Response("todo borrado")

@api_view(['GET'])
def fetch_info(request):
    with urllib.request.urlopen("https://gist.githubusercontent.com/CesarF/24a0d07afa64532a0ee72b32f554ed8f/raw/ae28ea0e1f9eb4e143d96fe932731d24763beb92/points.json") as url:
        data = json.loads(url.read().decode())
    return Response(data)
