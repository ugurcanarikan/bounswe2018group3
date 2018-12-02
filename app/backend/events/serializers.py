from rest_framework import serializers
from . import models


#Read and write event models
class EventSerializerReadWrite(serializers.ModelSerializer):
    class Meta:
        model = models.Event
        fields = '__all__'

    def create(self, validated_data):
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            return models.Event.objects.create( creator=request.user ,**validated_data)
        
    def update(self, instance, validated_data):
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            if instance.creator == request.user:
                instance.name = validated_data.get('name', instance.name)
                instance.info = validated_data.get('info', instance.info)
                instance.location = validated_data.get('location', instance.location)
                instance.creator = validated_data.get('creator', instance.creator)
                instance.artist = validated_data.get('artist', instance.artist)
                instance.date = validated_data.get('date', instance.date)
                instance.time = validated_data.get('time', instance.time)
                instance.price = validated_data.get('price', instance.price)
                #instance.tags = validated_data.get('tags', instance.tags)
                #instance.comments = validated_data.get('comments', instance.comments)
                instance.rating = validated_data.get('rating', instance.rating)
                #instance.images = validated_data.get('images', instance.images)
                #instance.attendants = validated_data.get('attendants', instance.attendants)
                instance.save()
                return instance

#Read only event models
class EventSerializerReadOnly(serializers.ModelSerializer):
    class Meta:
        model = models.Event
        fields = ('name','info','images',)
        #read_only_fields = ('__all__', )

    def create(self, validated_data):
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            if "attendants" in validated_data:
                del validated_data["attendants"]
            return models.Event.objects.create(creator=request.user,**validated_data)