#!/bin/bash
DB=$1;
if [ $1 -z ] ; then
  echo "Please provide a database name";
  read -p "Database name: " DB;
fi
dropdb $DB 2>/dev/null; createdb $DB;
