#!/bin/bash


RESET_ENVIRONMENT=$1
RESET_DB=$2




if [ "$RESET_ENVIRONMENT" = "true" ]; then
    echo -e "\033[1;32mCleaning up existing Docker containers and volumes...\033[0m"
    rm -rf ./backend/auth-data
    docker volume rm $(docker volume ls -q)
    docker system prune -a -f --volumes
    COMPOSE_PROFILES="auth-api,mongo-express,test-services,test-global,dummy-api" docker compose down -v
    echo -e "\033[1;32mStarting MongoDB...\033[0m"
    COMPOSE_PROFILES="mongo-nass" docker compose up -d mongo-nass


else
    echo -e "\033[1;32mStopping and removing existing containers, volumes, and networks...\033[0m"
    COMPOSE_PROFILES="auth-api,mongo-express,test-services,test-global,dummy-api" docker compose down
fi

if [ "$RESET_DB" = "true" ]; then
    echo -e "\033[1;32mResetting database...\033[0m"
    COMPOSE_PROFILES="mongo-nass" docker compose down -v
    echo -e "\033[1;32mStarting MongoDB...\033[0m"
    COMPOSE_PROFILES="mongo-nass" docker compose up -d mongo-nass
    # Wait for MongoDB to be ready
    sleep 5

    # Initialize database manually
    echo -e "\033[1;32mInitializing database...\033[0m"
    docker exec -i mongo-nass mongosh -u admin -p secret --authenticationDatabase admin < ./mongo-init/init.js

    echo -e "\033[1;32mStarting other services...\033[0m"
fi


echo -e "\033[1;32mStarting Docker containers for no-test...\033[0m"
COMPOSE_PROFILES="mongo-nass,auth-api,mongo-express,dummy-api" docker compose up --build -d


echo -e "\033[1;32mAll services are up and running.\033[0m"
echo -e "\033[1;32mStarting Naflows Authentication Secure System's Frontend\033[0m"
cd ./frontend || exit
npm run dev
