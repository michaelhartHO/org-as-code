#!/bin/bash

sudo apt-get update

git config --global alias.st status


echo "alias ll='ls -la'" >> ~/.bashrc
echo "alias ls='ls -F --color=auto --show-control-chars'"  >> ~/.bashrc

echo "alias gs='git status'" >> ~/.bashrc
echo "alias gp='git pull'" >> ~/.bashrc
