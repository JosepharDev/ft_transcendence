#!/bin/bash
# Connect to PostgreSQL and execute SQL commands
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$DB_NAME" <<-EOSQL
    -- Create the user if it doesn't exist
    DO $$ 
    BEGIN
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = 'yoyahya') THEN
            CREATE USER yoyahya WITH PASSWORD 'yoyahya';
        END IF;
    END $$;

    -- Check if the database exists
    DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1
            FROM pg_database
            WHERE datname = 'db'
        ) THEN
            -- Create the database
            CREATE DATABASE db;
        END IF;
    END $$;

    -- Grant privileges to the user
    GRANT ALL PRIVILEGES ON DATABASE db TO yoyahya;
EOSQL

service postgresql start