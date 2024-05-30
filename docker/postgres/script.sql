-- Ensure the user 'yoyahya' exists
DO
$$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_catalog.pg_roles
        WHERE rolname = 'yoyahya') THEN

        CREATE USER yoyahya WITH PASSWORD 'yoyahya';
    END IF;
END
$$;

-- Ensure the database 'db' exists and grant privileges to 'yoyahya'
DO
$$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_database
        WHERE datname = 'db') THEN

        CREATE DATABASE db;
        GRANT ALL PRIVILEGES ON DATABASE db TO yoyahya;
    END IF;
END
$$;
