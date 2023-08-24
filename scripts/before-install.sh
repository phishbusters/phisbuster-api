#!/bin/bash

# Download node and npm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
. ~/.nvm/nvm.sh
nvm install lts/*

# create working directory
DIR="/home/ec2-user/phishbusters-api"
if [ -d "$DIR" ]; then
    echo "Directory {$DIR} exists."
else
    echo "Creating {$DIR} directory."
    mkdir ${DIR}
fi
