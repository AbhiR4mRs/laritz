from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Banner, Category, Product, SiteSetting
from .serializers import (
    BannerSerializer,
    CategorySerializer,
    ProductSerializer,
    SiteSettingSerializer
)


@api_view(['GET'])
def home_data(request):
    settings_obj = SiteSetting.objects.first()
    banners = Banner.objects.filter(is_active=True)[:5]
    categories = Category.objects.filter(is_featured=True)
    featured = Product.objects.filter(is_active=True, is_featured=True)[:8]
    arrivals = Product.objects.filter(is_active=True, is_new_arrival=True)[:8]

    return Response({
        'settings': SiteSettingSerializer(settings_obj, context={'request': request}).data if settings_obj else None,
        'banners': BannerSerializer(banners, many=True, context={'request': request}).data,
        'categories': CategorySerializer(categories, many=True, context={'request': request}).data,
        'featured_products': ProductSerializer(featured, many=True, context={'request': request}).data,
        'new_arrivals': ProductSerializer(arrivals, many=True, context={'request': request}).data,
    })


@api_view(['GET'])
def product_list(request):
    queryset = Product.objects.filter(is_active=True)
    category = request.GET.get('category')
    search = request.GET.get('search')

    if category:
        queryset = queryset.filter(category__slug=category)
    if search:
        queryset = queryset.filter(name__icontains=search)

    return Response(ProductSerializer(queryset, many=True, context={'request': request}).data)


@api_view(['GET'])
def product_detail(request, slug):
    product = Product.objects.get(slug=slug, is_active=True)
    return Response(ProductSerializer(product, context={'request': request}).data)


@api_view(['GET'])
def categories(request):
    return Response(CategorySerializer(Category.objects.all(), many=True, context={'request': request}).data)