from django.core import validators
from django.db import models
from users.models import CustomUser
from django.utils import timezone

class Event(models.Model):
    name = models.CharField(max_length=255)
    info = models.TextField(blank=True)
    location = models.TextField()
    loc_lattitude = models.DecimalField(max_digits=6, decimal_places=3, default=0)
    loc_longitude = models.DecimalField(max_digits=6, decimal_places=3, default=0)
    city = models.CharField(max_length=255, blank=True)
    country = models.CharField(max_length=255, blank=True)
    creator = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name='created_events')
    artist = models.CharField(max_length=255, blank=True)
    date = models.DateField(db_index=True) #default=timezone.localdate())
    time = models.TimeField(db_index=True) #default=timezone.localtime().time())
    price = models.DecimalField(max_digits=6, decimal_places=2)
    #tags = models.CharField(validators=[validators.int_list_validator],max_length=255,blank=True)
    #tags = models.ManyToManyField(Tag, related_name='event_set')
    #comments = models.CharField(validators=[validators.int_list_validator],max_length=255,blank=True)
    #rating = models.DecimalField(max_digits=3,decimal_places=2,default=0)
    #ratingNum = models.IntegerField(default=0)
    #attendants = models.CharField(validators=[validators.int_list_validator],max_length=255,blank=True)
    attendants = models.ManyToManyField(CustomUser, related_name='event_set', blank=True)
    interestants = models.ManyToManyField(CustomUser, related_name='interested_event_set', blank=True)
    flaggers = models.ManyToManyField(CustomUser, related_name='flagged_events', blank=True) # for flagging events as inappropriate

    def __str__(self):
        return self.name + " : " + self.info
