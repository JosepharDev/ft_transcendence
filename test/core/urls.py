from django.urls import path , include
from . import views
urlpatterns = [
    path('', include('core.profile_url')),

]

#''
#search/
#account/
#account/update
#account/signin
#account/signup
#account/logout
#game/
#tournament/
#history match endpoint


# only callable by ajax