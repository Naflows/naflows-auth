#!/bin/bash


TEST_PARAMETER=$1
RESET_ENVIRONMENT=$2

if [ "$RESET_ENVIRONMENT" = "true" ]; then
    rm -rf ./backend/auth-data
    docker volume rm $(docker volume ls -q)
    docker system prune -a -f --volumes
fi

COMPOSE_PROFILES="mongo-nass,auth-api,mongo-express,test-services,test-global,dummy-api" docker compose down -v


if [ "$TEST_PARAMETER" = "no-test" ]; then
    COMPOSE_PROFILES="mongo-nass,auth-api,mongo-express,dummy-api" docker compose up -d

else
    if [ "$TEST_PARAMETER" = "global" ]; then
        COMPOSE_PROFILES="mongo-nass,auth-api,mongo-express,test-global,dummy-api" docker compose up -d
    elif [ "$TEST_PARAMETER" = "contracts" ]; then
        COMPOSE_PROFILES="mongo-nass,auth-api,mongo-express,test-services,dummy-api" docker compose up -d
    elif [ "$TEST_PARAMETER" = "all" ]; then
        COMPOSE_PROFILES="mongo-nass,auth-api,mongo-express,test-services,test-global,dummy-api" docker compose up -d
    else
        echo "Unknown test parameter. Please use 'no-test' or 'run-test'."
        bash
        
    fi
fi


# Prevent terminal from closing for debugging errors
echo "Closing terminal in 20 seconds..."
sleep 20
