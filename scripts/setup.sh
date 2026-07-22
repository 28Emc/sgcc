#!/bin/bash

echo "=== SGCC Setup ==="

echo "Starting PostgreSQL..."
docker-compose up -d postgres

echo "Waiting for PostgreSQL to be ready..."
sleep 10

echo "Building backend..."
cd backend
./gradlew build

echo "Running database migrations..."
./gradlew flywayMigrate

echo "Building frontend..."
cd ../frontend
npm install
ng build

echo "=== Setup Complete ==="
