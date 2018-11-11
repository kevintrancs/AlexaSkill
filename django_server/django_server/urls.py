from django.conf.urls import url, include
from django.contrib import admin
from rest_framework import routers
from django_api.views import TestViewSet
router = routers.DefaultRouter()
router.register(r'test', TestViewSet, base_name='test')
urlpatterns = [
    url(r'^api/', include(router.urls)),
    url(r'^admin/', admin.site.urls),
]
