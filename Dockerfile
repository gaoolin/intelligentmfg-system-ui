FROM alpine:3.4

ARG Asia/Shanghai
RUN apk update && apk add wget && \
    mkdir /code && \
    wget --no-check-certificate -O /code/test.dbf http://172.24.4.188:8000/test.dbf && \
    apk del wget && \
    rm -rf /var/cache/* && \
    rm -rf /code

CMD ["tail", "-f", "/etc/hosts"]
