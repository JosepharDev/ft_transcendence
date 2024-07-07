from django.urls import path
from .profile_view import SignIn , Logout, UpdateUser, SearchUsers, UserFriends, ProfileData,\
 Spa, Pong, AuthUser ,UserData , Toto, Enable2fa, IsTwoEnabled, SignUp # UsersList, UserHistory, 
from .qr_code import twofa , twofa_process
from .s42_auth_view import auth_42_api, auth_42_api_callback
urlpatterns = [
    path('signin/', SignIn.as_view(), name='signin'),
    path('logout/', Logout.as_view(), name='logout'),
    path('signup/', SignUp.as_view(), name="signin"),

    # path('users/', UsersList.as_view(), name='logout'),
    path('userid/<int:id>/', UserData.as_view(), name="userdata"),

    path('friends/', UserFriends.as_view(), name='logout'),
    path('friends/<int:id>/', UserFriends.as_view()),

    # path('hismatch/<int:id>/', UserHistory.as_view(), name="history"),
    path("search/", SearchUsers.as_view(), name="search"),
    path("spa/", Spa.as_view(), name="search"),
    path("pong/", Pong.as_view(), name="search"),
    path('auth/', AuthUser.as_view(), name="auth"),
    path("multiple/", Toto.as_view(), name="search"),

    path('update/', UpdateUser.as_view(), name="update"),
    
    path("signin/auth_42_api/", auth_42_api, name="auth_42_api"),
    path("signin/auth_42_api_callback/", auth_42_api_callback, name="auth_42_api"),

    path("signin/twofa/", twofa.as_view(), name="twofa"),
    path("enable2fa/", Enable2fa.as_view(), name="searssch"),
    path("signin/twofa_process/", twofa_process.as_view(), name="twofa_process"),


    #zakaria added this
    path('istwofa/', IsTwoEnabled.as_view(), name='twofa'),
    path('profile/', ProfileData.as_view(), name='ooo'),
    
]