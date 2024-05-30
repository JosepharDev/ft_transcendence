FROM postgres:13.15-bullseye

COPY script.sql /docker-entrypoint-initdb.d/
ENV DB_NAME=db
ENV POSTGRES_USER=yoyahya
ENV POSTGRES_PASSWORD=yoyahya
