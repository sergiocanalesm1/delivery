from django.urls import path
from . import views

urlpatterns = [
    path('lista/',views.lista,name="lista"),
    path('crear/',views.crear,name="crear"),
    path('borrar/<str:pk>/',views.borrar,name="borrar")
]