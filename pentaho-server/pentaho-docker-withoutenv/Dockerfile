FROM centos:centos7
MAINTAINER Morgan Senechal

#Initialize the centos environment, install postgres client so we can execute sql statements (eg. creating hibernate DB), install Java 8
RUN yum -y update; yum clean all
RUN yum -y install sudo epel-release; yum clean all
RUN yum -y install postgresql postgresql-contrib supervisor pwgen; yum clean all
RUN yum -y install java-1.8.0-openjdk-devel

ENV PENTAHO_HOME /opt/pentaho

#CREATE DIRS AND PENTAHO USER
RUN mkdir -p ${PENTAHO_HOME}/server/config && mkdir ${PENTAHO_HOME}/.pentaho && useradd -s /bin/sh pentaho
RUN chown -R pentaho:pentaho ${PENTAHO_HOME}
#RUN mkdir /home/pentaho && chown -R pentaho:pentaho /home/pentaho

#CONFIG DIR
COPY config ${PENTAHO_HOME}/server/config
RUN chown -R pentaho:pentaho ${PENTAHO_HOME}/server/config

#SCRIPTS DIR
COPY scripts ${PENTAHO_HOME}/server/scripts
RUN chown -R pentaho:pentaho ${PENTAHO_HOME}/server/scripts && chmod -R +x ${PENTAHO_HOME}/server/scripts

#SWITCH TO PENTAHO USER (not root anymore)
USER pentaho

ENV PGPASSWORD password
ENV PENTAHO_JAVA_HOME $JAVA_HOME
ENV PENTAHO_HOME /opt/pentaho
ENV KETTLE_HOME ${PENTAHO_HOME}
ENV CATALINA_OPTS="-Djava.awt.headless=true -Xms4096m -Xmx6144m -XX:MaxPermSize=256m -Dsun.rmi.dgc.client.gcInterval=3600000 -Dsun.rmi.dgc.server.gcInterval=3600000"
ENV PENTAHO_SERVER ${PENTAHO_HOME}/server/pentaho-server

#POSTGRES_CONFIG
ENV PG_INIT Y
ENV PENTAHO_INIT Y
ENV PG_HOST postgresql
ENV PG_PORT 5432
ENV PG_HIBUSER hibuser
ENV PG_HIBUSER_PWD password
ENV PG_PENTAHOUSER pentaho_user
ENV PG_PENTAHOUSER_PWD password
ENV PG_JCRUSER jcr_user
ENV PG_JCRUSER_PWD password
ENV PG_DB pentaho #default DB to connect to
ENV DB_USER pentaho #user to connect to default DB

#CD TO SERVER DIR
WORKDIR ${PENTAHO_HOME}/server

COPY pentaho-server.tar ${PENTAHO_HOME}/server
RUN tar xf pentaho-server.tar
RUN rm -f pentaho-server.tar && rm ${PENTAHO_SERVER}/promptuser.sh

#Making the startup.sh executable as a service/run in the background when the user is disconnected from the container
RUN sed -i -e 's/\(exec ".*"\) start/\1 run/' ${PENTAHO_SERVER}/tomcat/bin/startup.sh

EXPOSE 8080
ENTRYPOINT ["sh", "-c", "$PENTAHO_HOME/server/scripts/run.sh"]
