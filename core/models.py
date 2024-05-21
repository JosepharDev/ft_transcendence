from django.db import models
from django.contrib.auth.models import AbstractUser, AbstractBaseUser
from django.contrib.auth import get_user_model

class User(AbstractUser):
    email = models.CharField(max_length=100)
    password = models.CharField(max_length=100, blank=True)
    wins = models.IntegerField(default=0)
    loses = models.IntegerField(default=0)
    status = models.CharField(max_length=20)
    status_count = models.IntegerField(default=0)
    avatar = models.ImageField(upload_to="profile_images", default="blank-profile-picture.png")
    nickname = models.CharField(max_length=100)
    # is_2fa = models.BooleanField(default=False)
    friends = models.ManyToManyField('User', blank=True)
    intra = models.BooleanField(default=False)
    REQUIRED_FIELDS = []



class Match(models.Model):
    match_id = models.IntegerField(primary_key=True)
    player1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="match_player1")
    player2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="match_player2")
    winner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="match_winner")
    loser = models.ForeignKey(User, on_delete=models.CASCADE, related_name="match_loser")
    plr1_count = models.IntegerField(default=0)
    plr2_count = models.IntegerField(default=0)
    match_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.player1.username} vs {self.player2.username} - {self.match_date}"
        # return f"{self.player1.nickname} vs {self.player2.nickname} - {self.match_date}"

class HistoryMatch(models.Model):
    history_id = models.IntegerField(primary_key=True)
    match = models.ForeignKey(Match, on_delete=models.CASCADE)
    player1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='history_player1')
    player2 = models.ForeignKey(User,  on_delete=models.CASCADE, related_name='history_player2')
    player1_count = models.IntegerField(default=0) # deleteable may be
    player2_count = models.IntegerField(default=0) # deleteable may be

    def __str__(self):
        return f"{self.player1.nickname} - {self.match}"

class Friend(models.Model):
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='from_user')
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='to_user')

# class HistoryMatch(models.model):
#     history_id = models.IntegerField(primary_key=True, unique=True)
#     match = models.ForeignKey(Match, on_delete=models.CASCADE)
#     player = models.ForeignKey(User, on_delete=models.CASCADE)
    

#     def __str__(self):
#         return f"{self.player.nickname} - {self.match} - Result: {self.result}"





"""
duplicate username in case of remorte authentication
use email as primary to lognin instead of username
intra will give you login as username
in register set first name and last name 
"""
"""
catch all the route in django
"""