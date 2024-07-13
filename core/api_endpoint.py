from django.urls import path
from .api_views import SignIn , Logout, UpdateUser, SearchUsers, UserFriends, ProfileData, AuthUser ,UserData , IsTwoEnabled, SignUp, Language
from .qr_code import twofa , twofa_process
from .s42_auth_view import auth_42_api, auth_42_api_callback
urlpatterns = [
    path('signin/', SignIn.as_view(), name='signin'),
    path('logout/', Logout.as_view(), name='logout'),
    path('signup/', SignUp.as_view(), name="signup"),
    
    path("signin/auth_42_api/", auth_42_api, name="auth_42_api"),
    path("signin/auth_42_api_callback/", auth_42_api_callback, name="auth_42_api"),

    path("signin/twofa/", twofa.as_view(), name="twofa"),
    path("signin/twofa_process/", twofa_process.as_view(), name="twofa_process"),
    path('istwofa/', IsTwoEnabled.as_view(), name='twofa'),

    path('userid/<int:id>/', UserData.as_view(), name="userdata"),

    path('friends/', UserFriends.as_view(), name='logout'),
    path('friends/<int:id>/', UserFriends.as_view()),

    path("search/", SearchUsers.as_view(), name="search"),
    path('auth/', AuthUser.as_view(), name="auth"),

    path("update/language/", Language.as_view(), name="language"),
    path('update/', UpdateUser.as_view(), name="update"),
    
    path('profile/', ProfileData.as_view(), name='ooo'),
    
]