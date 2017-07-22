#!/bin/bash
#BASE_HOME=`pwd`;
#echo $BASE_HOME

if [ $# -eq 0 ];then
  TAG="test"
else
  TAG="$1"
fi
echo "deploying $TAG"

#docker
cd ..
docker build -t registry.cn-hangzhou.aliyuncs.com/isspu/h5-nginx:$TAG .
docker push registry.cn-hangzhou.aliyuncs.com/isspu/h5-nginx:$TAG
docker rmi registry.cn-hangzhou.aliyuncs.com/isspu/h5-nginx:$TAG
