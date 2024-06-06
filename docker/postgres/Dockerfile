FROM postgres:13.15-bullseye

COPY script.sh /docker-entrypoint-initdb.d/
RUN rm -rf /var/lib/postgresql/data
RUN mkdir /var/lib/postgresql/data
ENV DB_NAME=db
ENV POSTGRES_USER=yoyahya
ENV POSTGRES_PASSWORD=yoyahya
