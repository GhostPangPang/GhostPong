#!/bin/bash
DB=$(grep "DB_NAME" .env.local | head -1 | cut -d "=" -f 2)
HOST=$(grep "DB_HOST" .env.local | cut -d "=" -f 2)
PORT=$(grep "DB_PORT" .env.local | cut -d "=" -f 2)
USER=$(grep "DB_USER" .env.local | cut -d "=" -f 2)
PASSWORD=$(grep "DB_PASSWORD" .env.local | cut -d "=" -f 2)
PGPASSWORD=$PASSWORD psql -p "$PORT" -h "$HOST" -U "$USER" -d postgres -c "drop database $DB" -c "create database $DB"

rm -rf seeding/results;
