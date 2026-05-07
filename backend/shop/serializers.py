from rest_framework import serializers
from .models import Banner, Category, Product, SiteSetting


class AbsoluteImageUrlMixin:
    def get_absolute_image_url(self, obj, field_name="image"):
        request = self.context.get("request")
        image_field = getattr(obj, field_name, None)

        if image_field and hasattr(image_field, "url"):
            if request:
                return request.build_absolute_uri(image_field.url)
            return image_field.url

        return None


class CategorySerializer(AbsoluteImageUrlMixin, serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'image', 'is_featured']

    def get_image(self, obj):
        return self.get_absolute_image_url(obj)


class ProductSerializer(AbsoluteImageUrlMixin, serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        source='category',
        queryset=Category.objects.all(),
        write_only=True
    )
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'price', 'description', 'image', 'image_alt',
            'is_featured', 'is_new_arrival', 'is_active', 'instagram_message',
            'category', 'category_id', 'created_at', 'updated_at'
        ]

    def get_image(self, obj):
        return self.get_absolute_image_url(obj)


class BannerSerializer(AbsoluteImageUrlMixin, serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Banner
        fields = ['id', 'title', 'subtitle', 'button_text', 'image', 'is_active']

    def get_image(self, obj):
        return self.get_absolute_image_url(obj)


class SiteSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSetting
        fields = [
            'brand_name',
            'instagram_url',
            'instagram_dm_url',
            'announcement',
            'story_title',
            'story_text'
        ]
