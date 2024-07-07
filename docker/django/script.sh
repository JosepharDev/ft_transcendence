#!/bin/bash

sleep 20


openssl req -x509 -nodes -days 365 -newkey rsa:4096 -keyout private_daphne.pem -out public_daphne.pem  -subj "/CN=pingpong"

python3 manage.py makemigrations core && python3 manage.py migrate core


daphne -e ssl:443:privateKey=private_daphne.pem:certKey=public_daphne.pem tests.asgi:application