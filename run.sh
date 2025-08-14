#!/bin/bash
trap 'echo "Error occurred. Press enter to continue."; read' ERR


TEST_PARAMETER=$1

COMPOSE_PROFILES="mongo-nass,auth-api,mongo-express,test-contracts,test-global" docker compose down -v

if [ "$TEST_PARAMETER" = "no-test" ]; then
    COMPOSE_PROFILES="mongo-nass,auth-api,mongo-express" docker compose up -d
    
else
    if [ "$TEST_PARAMETER" = "global" ]; then
        COMPOSE_PROFILES="mongo-nass,auth-api,mongo-express,test-global" docker compose up -d
    elif [ "$TEST_PARAMETER" = "contracts" ]; then
        COMPOSE_PROFILES="mongo-nass,auth-api,mongo-express,test-contracts" docker compose up -d
    elif [ "$TEST_PARAMETER" = "all" ]; then
    
        COMPOSE_PROFILES="mongo-nass,auth-api,mongo-express,test-contracts,test-global" docker compose up -d
    else
        echo "Unknown test parameter. Please use 'no-test' or 'run-test'."
        bash
        
    fi
fi


# Prevent terminal from closing for debugging errors
read -p "Press enter to continue"
