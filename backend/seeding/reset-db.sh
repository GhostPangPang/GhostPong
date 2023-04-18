#!/bin/bash
DB=$(grep "TEST_DB_NAME" .env | cut -d "=" -f 2)
dropdb $DB -f 2>/dev/null; createdb $DB;
rm -rf seeding/results;
