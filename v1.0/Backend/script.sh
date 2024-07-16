#!/bin/bash

# sleep 20


openssl req -x509 -nodes -days 365 -newkey rsa:4096 -keyout /etc/ssl/private_daphne.pem -out /etc/ssl/public_daphne.pem  -subj "/CN=pingpong"

python3 manage.py makemigrations core && python3 manage.py migrate core && python3 manage.py makemigrations && python3 manage.py migrate

daphne -e ssl:443:privateKey=/etc/ssl/private_daphne.pem:certKey=/etc/ssl/public_daphne.pem ft_transcendence.asgi:application
# while true; do
#   # Your command here
#   echo "Running command"
#   sleep 10 # Interval between command executions
# done