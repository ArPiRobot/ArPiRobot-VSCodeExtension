#!/bin/bash

DIR="$(realpath "$(dirname "${BASH_SOURCE[0]}")")"
cd $DIR

chmod +x robot
sudo LD_LIBRARY_PATH=.:$LD_LIBRARY_PATH ./robot