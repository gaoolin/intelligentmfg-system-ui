FROM nginx:1.22.0

# 将dist目录内容复制到nginx容器html内部
COPY dist /usr/share/nginx/html/

# 删除官方nginx镜像默认的配置
RUN rm -rf /etc/nginx/conf.d/default.conf

# 将nginx.conf(自己的nginx配置)添加到默认配置目录下
# 注意：nginx.conf需要与Dockerfile在同一目录
ADD ./nginx.conf /etc/nginx/conf.d/

# COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80