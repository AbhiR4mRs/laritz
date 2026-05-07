from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(unique=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    is_featured = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    name = models.CharField(max_length=180)
    slug = models.SlugField(unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='products/')
    image_alt = models.CharField(max_length=180, default='La Ritz product image')
    is_featured = models.BooleanField(default=False)
    is_new_arrival = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    instagram_message = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name

class Banner(models.Model):
    title = models.CharField(max_length=180)
    subtitle = models.CharField(max_length=240, blank=True)
    button_text = models.CharField(max_length=60, default='Shop Now')
    image = models.ImageField(upload_to='banners/')
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

class SiteSetting(models.Model):
    brand_name = models.CharField(max_length=120, default='La Ritz')
    instagram_url = models.URLField(default='https://www.instagram.com/_needle_craft')
    instagram_dm_url = models.URLField(default='https://ig.me/m/_needle_craft')
    announcement = models.CharField(max_length=240, default='Free shipping on select handcrafted pieces.')
    story_title = models.CharField(max_length=180, default='A handcrafted story')
    story_text = models.TextField(default='La Ritz creates soft, elegant handmade pieces with timeless charm.')

    def __str__(self):
        return self.brand_name
