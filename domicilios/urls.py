from django.urls import path
from . import views

urlpatterns = [
    path('lista/',views.lista,name="lista"),
    path('crear/',views.crear,name="crear"),
    path('borrar/<str:pk>/',views.borrar,name="borrar"),
    path('fetch_info/',views.fetch_info, name='fetch_info'),
    path('borrar_info/',views.borrar_info,name="borrar_info")
]