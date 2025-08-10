#!/bin/bash
set -e


TEST_PARAMETER=$1


if [ "$TEST_PARAMETER" = "no-test" ]; then
    COMPOSE_PROFILES="mongo-nass,auth-api,mongo-express,test-global" docker compose down -v
    COMPOSE_PROFILES="mongo-nass,auth-api,mongo-express" docker compose up -d
else
    if [ "$TEST_PARAMETER" = "global" ]; then
        COMPOSE_PROFILES="mongo-nass,auth-api,mongo-express,test-global" docker compose down -v
        COMPOSE_PROFILES="mongo-nass,auth-api,mongo-express,test-global" docker compose up -d
    else
        echo "Unknown test parameter. Please use 'no-test' or 'run-test'."
        bash
    fi
fi


