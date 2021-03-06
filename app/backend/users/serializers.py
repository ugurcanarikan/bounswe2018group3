from rest_framework import serializers
from . import models

class UserRWSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CustomUser
        fields = (
            'id',
            'email', 
            'username',
            'first_name',
            'last_name',
            'is_private',
            'password',
            'is_superuser',
            'bio', 
            'city', 
            'country',
            'profile_pic',
            'birthday', 
            'colorScheme',
            'ratings',
            'followedUsers',
            'followers',
            'blockedUsers',
            'blockers',
            'watchingTags',
            'blockedTags',
            'comments',
            'images',)

    def create(self, validated_data):
        request = self.context.get("request")
        if "blockedUsers" in validated_data:
            del validated_data["blockedUsers"]
        if "followedUsers" in validated_data:
            del validated_data["followedUsers"]
        if "blockers" in validated_data:
            del validated_data["blockers"]
        if "followers" in validated_data:
            del validated_data["followers"]
        if "blockedTags" in validated_data:
            del validated_data["blockedTags"]
        if "watchingTags" in validated_data:
            del validated_data["watchingTags"]
        if "comments" in validated_data:
            del validated_data["comments"]
        if "ratings" in validated_data:
            del validated_data["ratings"]
        if "images" in validated_data:
            del validated_data["images"]
        return models.CustomUser.objects.create(**validated_data)

    
    def update(self, instance, validated_data):
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            if instance.id == request.user.id:
                instance.first_name = validated_data.get('first_name', instance.first_name)
                instance.last_name = validated_data.get('last_name', instance.last_name)
                instance.password = validated_data.get('password', instance.password)
                instance.bio = validated_data.get('bio', instance.bio)
                instance.city = validated_data.get('city', instance.city)
                instance.country = validated_data.get('country', instance.country)
                instance.email = validated_data.get('email', instance.email)
                instance.username = validated_data.get('username', instance.username)
                instance.profile_pic = validated_data.get('profile_pic', instance.profile_pic)
                instance.birthday = validated_data.get('birthday', instance.birthday)
                instance.colorScheme = validated_data.get('colorScheme', instance.colorScheme)
                instance.save()
                return instance

class UserReadOnlySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CustomUser
        fields = fields = (
            'id',
            'email', 
            'username',
            'first_name',
            'last_name', 
            'bio', 
            'city', 
            'country',
            'profile_pic',
            'birthday', 
            'colorScheme',
            'ratings',
            'followedUsers',
            'blockedUsers',
            'blockers',
            'followers',
            'watchingTags',
            'blockedTags',
            'comments',
            'is_private',
            'images',)
        read_only_fields = fields = (
            'id',
            'email', 
            'username',
            'first_name',
            'last_name', 
            'bio', 
            'city', 
            'country',
            'profile_pic',
            'birthday', 
            'colorScheme',
            'ratings',
            'followedUsers',
            'blockedUsers',
            'blockers',
            'followers',
            'watchingTags',
            'blockedTags',
            'comments',
            'is_private',
            'images',
            )

class UserAttendSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CustomUser
        fields = (
            'id',
            'username',
            'event_set',
        )

class UserInterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CustomUser
        fields = (
            'id',
            'username',
            'interested_event_set',
        )

class UserSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CustomUser
        fields = (
            'id',
            'username',
            'first_name',
            'last_name',
            'profile_pic', 
            'bio', 
            'city', 
            'country',
            'birthday', 
            'ratings',)

class ProfilePicSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.CustomUser
        fields = ('profile_pic', )

class UserRatingSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.CustomUser
        fields = ('id', 'ratings', 'flaggers',)
        
    