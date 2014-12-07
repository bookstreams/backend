FROM node
MAINTAINER Paolo Scanferla <paolo.scanferla@mondora.com>
WORKDIR /
RUN curl https://install.meteor.com/ | sh
RUN mkdir /api.bookstreams.org
ADD ./ /api.bookstreams.org/
RUN cd /api.bookstreams.org && meteor bundle /bundle.tgz
RUN tar xvzf /bundle.tgz
RUN cd /bundle/programs/server && npm install
ENTRYPOINT ["node", "/bundle/main.js"]
