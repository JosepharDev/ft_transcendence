from django.urls import path
from .api_views import SignIn , Logout, UpdateUser, SearchUsers, UserFriends, ProfileData, AuthUser ,UserData , IsTwoEnabled, SignUp, Language
from .qr_code import twofa , twofa_process
from .s42_auth_view import auth_42_api, auth_42_api_callback
urlpatterns = [
    path('signin/', SignIn.as_view()),
    path('logout/', Logout.as_view()),
    path('signup/', SignUp.as_view()),
    
    path("signin/auth_42_api/", auth_42_api),
    path("signin/auth_42_api_callback/", auth_42_api_callback),

    path("signin/twofa/", twofa.as_view()),
    path("signin/twofa_process/", twofa_process.as_view()),
    path('istwofa/', IsTwoEnabled.as_view()),

    path('userid/<int:id>/', UserData.as_view()),

    path('friends/', UserFriends.as_view()),
    path('friends/<int:id>/', UserFriends.as_view()),

    path("search/", SearchUsers.as_view()),
    path('auth/', AuthUser.as_view()),

    path("update/language/", Language.as_view()),
    
    path('update/', UpdateUser.as_view()),
    
    path('profile/', ProfileData.as_view()),
    
]