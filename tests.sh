#!/bin/bash

RESET_ENVIRONMENT=$1
RESET_DB=$2
TEST_PARAMETER=$3

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
    sleep 2
    


    echo -e "\033[1;32mStarting other services...\033[0m"
fi

if [ "$TEST_PARAMETER" = "methods" ]; then
    echo -e "\033[1;32mStarting Docker containers for contract tests...\033[0m"
    COMPOSE_PROFILES="mongo-nass,mongo-express,auth-api,dummy-api" docker compose up --build -d

    # Wait for services to start and MongoDB to be ready
    echo -e "\033[1;32mWaiting for services to start...\033[0m"
    sleep 2

    # Run tests inside the auth-api container
    echo -e "\033[1;32mRunning methods tests inside auth-api container...\033[0m"
    docker exec auth-api-1 sh -c "cd /app && npm run methods-test"

    # Keep container running to view logs if needed
    echo -e "\033[1;32mTests completed. Container still running. Press Ctrl+C to stop.\033[0m"
    docker logs -f auth-api-1

    sleep 10


    # After tests, bring down the containers
    echo -e "\033[1;32mBringing down Docker containers after tests...\033[0m"
    COMPOSE_PROFILES="mongo-nass,mongo-express,auth-api,dummy-api" docker compose down

    sleep 10

    # Close immediately after tests
    exit 0
else
    echo -e "\033[1;32mStarting Docker containers for no-test...\033[0m"
    COMPOSE_PROFILES="mongo-nass,mongo-express,auth-api,dummy-api" docker compose up --build -d
fi