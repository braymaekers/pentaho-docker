# Dockerfile to build slim Pentaho 8.3 Image for Execution
FROM eag/pdi
USER root
COPY --chown=pentaho:pentaho ./resources/ ${PENTAHO_HOME}
RUN apk update; apk add --no-cache wget python groff; rm -rf /var/cache/apk/*
RUN wget https://bootstrap.pypa.io/get-pip.py; python get-pip.py; pip install awscli; rm -f get-pip.py
USER pentaho
ENTRYPOINT ["/opt/pentaho/load_and_execute.sh"]
