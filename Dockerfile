FROM registry.cn-shanghai.aliyuncs.com/kolenz/nginx:1.22.1-alpine

LABEL maintainer=gaoolin@gmail.com

# 时区设置
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo 'Asia/Shanghai' >/etc/timezone

# 安装 logrotate
RUN apk add --no-cache logrotate

# 创建日志目录
RUN mkdir -p /home/qtech/nginx

# 设置日志目录的所有权
RUN chown -R nginx:nginx /home/qtech/nginx

# 将dist目录内容复制到nginx容器html内部
COPY dist /usr/share/nginx/html/

# 删除官方nginx镜像默认的配置
RUN rm -rf /etc/nginx/conf.d/default.conf

# 配置文件nginx.conf是要放在/etc/nginx/目录下, 而用于独立配置server的配置文件，需要放在/etc/nginx/conf.d/目录下
ADD ./nginx.conf /etc/nginx/nginx.conf

# 将独立配置server的配置文件添加到默认配置目录下
# 注意：nginx.conf需要与Dockerfile在同一目录
# ADD ./nginx-server.conf /etc/nginx/conf.d/

# COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80

# 添加 logrotate 配置文件
ADD ./logrotate.d/nginx /etc/logrotate.d/nginx

# 设置 cron 任务来定期运行 logrotate
RUN echo "0 0 * * * /usr/sbin/logrotate /etc/logrotate.d/nginx" > /etc/cron.daily/logrotate
RUN chmod +x /etc/cron.daily/logrotate

# 安装 cron 并设置启动时运行
RUN apk add --no-cache cronie && \
    echo "CRON_TZ=Asia/Shanghai" >> /etc/crontabs/root && \
    crontab /etc/cron.daily/logrotate && \
    rc-update add cron boot

# 启动 cron 服务
CMD ["cron", "-f"]
