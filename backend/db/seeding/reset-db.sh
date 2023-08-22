#!/bin/bash
DB=$(grep "POSTGRES_DB" .env.development | head -1 | cut -d "=" -f 2)
HOST=$(grep "POSTGRES_HOST" .env.development | cut -d "=" -f 2)
PORT=$(grep "POSTGRES_PORT" .env.development | cut -d "=" -f 2)
USER=$(grep "POSTGRES_USER" .env.development | cut -d "=" -f 2)
PASSWORD=$(grep "POSTGRES_PASSWORD" .env.development | cut -d "=" -f 2)
PGPASSWORD=$PASSWORD psql -p "$PORT" -h "$HOST" -U "$USER" -d postgres -c "drop database $DB" -c "create database $DB"

rm -rf seeding/results;
