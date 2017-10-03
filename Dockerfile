FROM node:4.5

MAINTAINER Clebersander Rech <cleber@gorillascode.com>

ADD . /meuml-app-web
WORKDIR /meuml-app-web

RUN npm -g install grunt-cli karma bower spa-http-server
RUN npm install
RUN bower install --allow-root
RUN grunt
RUN find . -maxdepth 1 ! -path . ! -name bin -exec rm -rf {} +

EXPOSE 8080

CMD ["http-server", "./bin", "-d", "false", "-s", "--push-state"]