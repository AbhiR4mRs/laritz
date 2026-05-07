from django.urls import path
from .views import categories, home_data, product_detail, product_list

urlpatterns = [
    path('home/', home_data),
    path('products/', product_list),
    path('products/<slug:slug>/', product_detail),
    path('categories/', categories),
]
