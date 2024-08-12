FROM registry.cn-shanghai.aliyuncs.com/kolenz/nginx:1.22.1-alpine

LABEL maintainer=gaoolin@gmail.com

# 创建 nginx 用户和组
RUN addgroup -S nginx && adduser -S -G nginx nginx

# 时区设置
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo 'Asia/Shanghai' >/etc/timezone

# 安装 logrotate 和 cronie
RUN apk add --no-cache logrotate cronie

# 创建日志目录并设置所有权
RUN mkdir -p /home/qtech/nginx && \
    chown -R nginx:nginx /home/qtech/nginx

# 将 dist 目录内容复制到 nginx 容器的 html 目录下
COPY dist /usr/share/nginx/html/

# 删除官方 nginx 镜像的默认配置
RUN rm -rf /etc/nginx/conf.d/default.conf

# 将 nginx 配置文件复制到容器中
COPY ./nginx.conf /etc/nginx/nginx.conf

# 添加 logrotate 配置文件
COPY ./logrotate.d/nginx /etc/logrotate.d/nginx

# 添加 cron 配置文件并设定任务
RUN echo "0 0 * * * /usr/sbin/logrotate /etc/logrotate.d/nginx" > /etc/crontabs/root && \
    echo "CRON_TZ=Asia/Shanghai" >> /etc/crontabs/root

# 启动 cron 服务和 nginx 服务
CMD ["/bin/sh", "-c", "crond && nginx -g 'daemon off;'"]

EXPOSE 80
