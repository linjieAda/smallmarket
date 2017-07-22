#!/bin/bash
#BASE_HOME=`pwd`;
#echo $BASE_HOME

# git
cd ..
cd ..
git pull

cd ./react/
yarn config set registry "https://registry.npm.taobao.org"
yarn install


# build vendor
manifest="./build/vendor/manifest.json"

if [ ! -f "$manifest" ]; then
  echo "building vendor"
  yarn run vendor
fi

# build
if [ $# -eq 0 ];then
  echo "building test"
  yarn run test
else
  echo "building deploy"
  yarn run deploy
fi
