exec openssl req -x509 -nodes -days 365 -newkey rsa:4096 -keyout /usr/src/private_daphne.pem -out /usr/src/public_daphne.pem  -subj "/CN=pingpong"

exec python3 manage.py makemigrations && python3 manage.py migrate && python3 manage.py loaddata ss.json