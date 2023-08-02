#!/bin/bash
DB=$(grep "POSTGRES_NAME" .env.local | head -1 | cut -d "=" -f 2)
HOST=$(grep "POSTGRES_HOST" .env.local | cut -d "=" -f 2)
PORT=$(grep "POSTGRES_PORT" .env.local | cut -d "=" -f 2)
USER=$(grep "POSTGRES_USER" .env.local | cut -d "=" -f 2)
PASSWORD=$(grep "POSTGRES_PASSWORD" .env.local | cut -d "=" -f 2)
PGPASSWORD=$PASSWORD psql -p "$PORT" -h "$HOST" -U "$USER" -d postgres -c "drop database $DB" -c "create database $DB"

rm -rf seeding/results;
