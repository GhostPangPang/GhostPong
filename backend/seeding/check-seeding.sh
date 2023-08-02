#!/bin/bash
VOL=$(docker volume inspect 'db-local-data')

if [ $VOL != [] ]; then
  echo "DB volume already exists. Skip seeding."
  exit 0
fi


yarn seed
