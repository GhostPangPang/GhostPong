#!/bin/bash
DB=$(grep "TEST_DB_NAME" .env | cut -d "=" -f 2)
HOST=$(grep "DB_HOST" .env | cut -d "=" -f 2)
PORT=$(grep "DB_PORT" .env | cut -d "=" -f 2)
USER=$(grep "DB_USER" .env | cut -d "=" -f 2)
psql -p $PORT -h $HOST -d postgres -U $USER -c "drop database $DB" -c "create database $DB"

rm -rf seeding/results;
