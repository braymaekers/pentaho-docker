# Dockerfile to build slim Pentaho 8.3 Image for Execution
FROM openjdk:8-alpine
ENV PENTAHO_VERSION=8.3
ENV PENTAHO_TAG=8.3.0.0-371-dist
ENV PENTAHO_HOME=/opt/pentaho
ENV PDI_HOME=/opt/pentaho/data-integration
ENV PENTAHO_JAVA_HOME=$JAVA_HOME
ENV SKIP_WEBKITGTK_CHECK=1
RUN apk update; apk add --no-cache bash curl bc procps; rm -rf /var/cache/apk/*
RUN mkdir ${PENTAHO_HOME}; adduser -D -s /bin/bash -h ${PENTAHO_HOME} pentaho; chown pentaho:pentaho ${PENTAHO_HOME}
COPY --chown=pentaho:pentaho ./resources/ ${PENTAHO_HOME}
USER pentaho
ENV PATH=$PATH:/opt/pentaho/data-integration
WORKDIR /opt/pentaho/data-integration
