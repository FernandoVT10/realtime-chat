#!/bin/bash

cp ../frontend/.env.example ../frontend/.env
cp ../backend/.env.example ../backend/.env

docker compose -f ../docker-compose.yml build
