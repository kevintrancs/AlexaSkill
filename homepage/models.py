from django.db import models

# Create your models here.
class Article(models.Model):
    article_url = models.CharField(max_length = 200)
    article_title = models.CharField(max_length = 200)
    article_pub_date = models.DateTimeField('Published date')
    
    def __str__(self):
        return self.article_title