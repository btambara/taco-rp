FROM alpine:latest

COPY . /FXServer/server-data
WORKDIR /FXServer/server

RUN apk update
RUN apk upgrade
RUN apk add bash xz libgcc libstdc++ 
RUN wget https://runtime.fivem.net/artifacts/fivem/build_proot_linux/master/6473-236a214bf1a4d3dd7c76cf0d0ae0d8f0dcd5f3e0/fx.tar.xz
RUN tar xf fx.tar.xz
RUN rm fx.tar.xz
RUN apk del xz
RUN chmod u+rx run.sh

WORKDIR /FXServer/server-data
ENTRYPOINT ["bash", "/FXServer/server/run.sh"]