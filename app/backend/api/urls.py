from django.urls import include, path, re_path
from .views import FacebookLogin, ExampleView
from allauth.account.views import ConfirmEmailView
from allauth.account.views import confirm_email as allauthemailconfirmation
from rest_auth.registration.views import VerifyEmailView
from .views import CompleteView, VerificationSentView
from django.views.generic import TemplateView

from django.conf.urls.static import static

from . import views

urlpatterns = [
    path('users/', include('users.urls')),
    path('events/', include('events.urls')),
    path('rest-auth/registration/account-confirm-email/<str:key>/', allauthemailconfirmation, name='account_confirm_email'),
    path('rest-auth/registration/account-email-verification-sent/', VerificationSentView.as_view(), name='account_email_verification_sent'),
    path('rest-auth/registration/complete/', CompleteView.as_view(), name='account_confirm_complete'),
    path('rest-auth/registration/', include('rest_auth.registration.urls')),
    path('rest-auth/', include('rest_auth.urls')),
    path('rest-auth/facebook/', FacebookLogin.as_view(), name='fb_login'),
    path('rest-auth/ExampleView/', ExampleView.as_view()),
    
    path('userImage/', views.UserImagesView.as_view(), name='user-image'),
    path('userImage/<int:pk>', views.UserImageDetail.as_view(), name='userimage-detail'),

    # Comment-related views
    path('usercomments/', views.UserCommentCreateView.as_view()),
    path('eventcomments/', views.EventCommentCreateView.as_view()),
    path('usercomments/edit/<int:pk>', views.UserCommentEditView.as_view()),
    path('eventcomments/edit/<int:pk>', views.EventCommentEditView.as_view()),
    path('usercomments/<int:pk>', views.UserCommentRetrieveView.as_view()),
    path('eventcomments/<int:pk>', views.EventCommentRetrieveView.as_view()),
    path('usercomments/delete/<int:pk>', views.UserCommentDeleteView.as_view({'delete': 'delete'})),
    path('eventcomments/delete/<int:pk>', views.EventCommentDeleteView.as_view({'delete': 'delete'})),
    path('usercomments/search/', views.UserCommentSearchView.as_view()),
    path('eventcomments/search/', views.EventCommentSearchView.as_view()),

    # Tag-related views
    path('tags/', views.TagCreateView.as_view()), 
    path('tags/edit/<int:pk>', views.TagEditView.as_view()),
    path('tags/delete/<int:pk>', views.TagDeleteView.as_view({'delete': 'delete'})),
    path('tags/search/', views.TagSearchView.as_view()),
    path('tags/<int:pk>', views.TagRetrieveView.as_view()),
] + static("userImage/pic_folder/", document_root="./pic_folder")