from django.urls import path
from . import views

app_name = 'homepage'

urlpatterns = [
    path('<int:article_id>/', views.detail, name='detail'),
   # path('', views.articles, name='articles'),
    path('', views.index, name='index'),
]

