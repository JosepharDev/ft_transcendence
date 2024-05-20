from django.urls import path
from .profile_view import signin, signup, logout, UsersList, UpdateUser, SearchUsers, UserFriends,\
 UserHistory, Spa, Pong, AuthUser ,UserData
from .s42_auth_view import auth_42_api, auth_42_api_callback
from .qr_code import twofa

urlpatterns = [
    path('signup/', signup.as_view(), name="signup"),
    path('signin/', signin.as_view(), name='signin'),
    path('logout/', logout.as_view(), name='logout'),
    path('users/', UsersList.as_view(), name='logout'),
    path('friends/', UserFriends.as_view(), name='logout'),
    path('friends/<int:id>/', UserFriends.as_view()),
    path('hismatch/<int:id>/', UserHistory.as_view(), name="history"),
    path("search/", SearchUsers.as_view(), name="search"),
    path("spa/", Spa.as_view(), name="search"),
    path("pong/", Pong.as_view(), name="search"),
    path("signin/auth_42_api/", auth_42_api, name="auth_42_api"),
    path("signin/auth_42_api_callback/", auth_42_api_callback, name="auth_42_api"),
    path("signin/twofa/", twofa.as_view(), name="twofa"),
    path('update/', UpdateUser.as_view(), name="update"),
    path('auth/', AuthUser.as_view(), name="auth"),
    path('userid/<int:id>/', UserData.as_view(), name="tt"),


]