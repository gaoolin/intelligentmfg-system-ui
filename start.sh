#!/bin/sh

# 启动 crond 服务
crond

# 启动 nginx
nginx -g 'daemon off;'
