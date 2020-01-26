FROM node:10

WORKDIR /webroot

RUN apt-get install git                                            && \
    git clone https://github.com/phetsims/assert.git               && \ 
    git clone https://github.com/phetsims/axon.git                 && \
    git clone https://github.com/phetsims/babel.git                && \
    git clone https://github.com/phetsims/brand.git                && \
    git clone https://github.com/phetsims/chipper.git              && \
    git clone https://github.com/phetsims/dot.git                  && \
    git clone https://github.com/phetsims/joist.git                && \
    git clone https://github.com/phetsims/kite.git                 && \
    git clone https://github.com/phetsims/phet-core.git            && \
    git clone https://github.com/phetsims/phetcommon.git           && \
    git clone https://github.com/phetsims/phetmarks.git            && \
    git clone https://github.com/phetsims/query-string-machine.git && \
    git clone https://github.com/phetsims/scenery.git              && \
    git clone https://github.com/phetsims/scenery-phet.git         && \
    git clone https://github.com/phetsims/sherpa.git               && \
    git clone https://github.com/phetsims/sun.git                  && \
    git clone https://github.com/phetsims/tambo.git                && \
    git clone https://github.com/phetsims/tandem.git               && \
    git clone https://github.com/phetsims/utterance-queue.git      && \
    npm install -g http-server                                     && \
    npm install -g grunt-cli                                       && \
    mkdir gravity-and-orbits


ENTRYPOINT  ["//usr/local/bin/http-server"]


# TODO: 

# 
# docker build . --tag gravity:latest

# web exposes port 8080
# 
#  docker run -it -p 80:8080 --entrypoint=/bin/bash gravity
#  docker run -it -p 80:8080 -v `pwd`:/webroot/gravity-and-orbits gravity

#   git clone https://github.com/phetsims/gravity-and-orbits.git   && \
