from django.urls import path
from .profile_view import signin, signup, logout, UsersList, SearchUsers, UserFriends, UserHistory
urlpatterns = [
    path('signup/', signup.as_view(), name="signup"),
    path('signin/', signin.as_view(), name='signin'),
    path('logout/', logout.as_view(), name='logout'),
    path('users/', UsersList.as_view(), name='logout'),
    path('friends/', UserFriends.as_view(), name='logout'),
    path('friends/<int:id>/', UserFriends.as_view()),
    path('hismatch/<int:id>/', UserHistory.as_view(), name="history"),
    path("search/", SearchUsers.as_view(), name="search"),


    # path('profile/update/', update.as_view(), name="update"),


]