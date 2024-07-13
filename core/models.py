from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator,  MinLengthValidator
from django.core.exceptions import ValidationError

def validate_input(value):
    if value.strip() == '':
        raise ValidationError("You must provide more than just whitespace.")

class User(AbstractUser):
    class GameStatus(models.TextChoices):
        IN_GAME = "in game", "In Game"
        WAITING = "waiting", "Waiting"
        NO_GAME = "no game", "No Game"

    class Status(models.TextChoices):
        ONLINE = "online", "Online"
        OFFLINE = "offline", "Offline"
    
    class language(models.TextChoices):
        fr = "fr"
        eng = "en"
        sp = "es"
        

    id = models.AutoField(unique=True, primary_key=True, blank=False)
    remote_id = models.IntegerField(blank=True, null=True)
    username = models.CharField(max_length=100, unique=True, blank=False, validators=[RegexValidator(r'^[0-9a-zA-Z]*$', 'Only alphanumeric characters are allowed.')])
    password = models.CharField(max_length=100, blank=True)
    nickname = models.CharField(max_length=100, blank=True, validators=[RegexValidator(r'^[0-9a-zA-Z]*$', 'Only alphanumeric characters are allowed.')])
    is_2fa = models.BooleanField(default=False)
    remote = models.BooleanField(default=False)
    otp_secret = models.CharField(max_length=100, blank=True)
    wins = models.IntegerField(default=0)
    loses = models.IntegerField(default=0)
    profile_status = models.CharField(max_length=20, choices=Status.choices, default=Status.OFFLINE)
    game_status = models.CharField(max_length=20, choices=GameStatus.choices, default=GameStatus.NO_GAME)
    status_count = models.IntegerField(default=0)
    avatar = models.ImageField(upload_to="profile_images", default="blank-profile-picture.png")
    lang = models.CharField(max_length=20, choices=language.choices, default=language.eng)
    game_type = models.CharField(max_length=1, default="N")
    current_room = models.CharField(max_length=30, blank=True)
    tournament_wins = models.IntegerField(default=0)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['password']


    def __str__(self):
        return self.username


class Match(models.Model):
    match_id = models.AutoField(primary_key=True)
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
    history_id = models.AutoField(primary_key=True)
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