#!/bin/sh

PG_HOST=$1
PG_PORT=$2
PG_HIBUSER=$3
PG_HIBUSER_PWD=$4
PG_PENTAHOUSER=$5
PG_PENTAHOUSER_PWD=$6
PG_JCRUSER=$7
PG_JCRUSER_PWD=$8
PENTAHO_HOME=$9

sed -i 's/$PGHOST/'"$PG_HOST"'/g' ${PENTAHO_HOME}/server/config/*.sql ${PENTAHO_HOME}/server/config/*.xml ${PENTAHO_HOME}/server/config/jackrabbit/*.xml ${PENTAHO_HOME}/server/config/hibernate/*.xml
sed -i 's/$PGPORT/'"$PG_PORT"'/g' ${PENTAHO_HOME}/server/config/*.sql ${PENTAHO_HOME}/server/config/*.xml ${PENTAHO_HOME}/server/config/jackrabbit/*.xml ${PENTAHO_HOME}/server/config/hibernate/*.xml
sed -i 's/$HIBUSERTOREPLACE/'"$PG_HIBUSER"'/g' ${PENTAHO_HOME}/server/config/*.sql ${PENTAHO_HOME}/server/config/*.xml ${PENTAHO_HOME}/server/config/jackrabbit/*.xml ${PENTAHO_HOME}/server/config/hibernate/*.xml
sed -i 's/$HIBPASSWORDTOREPLACE/'"$PG_HIBUSER_PWD"'/g' ${PENTAHO_HOME}/server/config/*.sql ${PENTAHO_HOME}/server/config/*.xml ${PENTAHO_HOME}/server/config/jackrabbit/*.xml ${PENTAHO_HOME}/server/config/hibernate/*.xml
sed -i 's/$PENTAHOUSERTOREPLACE/'"$PG_PENTAHOUSER"'/g' ${PENTAHO_HOME}/server/config/*.sql ${PENTAHO_HOME}/server/config/*.xml ${PENTAHO_HOME}/server/config/jackrabbit/*.xml ${PENTAHO_HOME}/server/config/hibernate/*.xml
sed -i 's/$PENTAHOUSERPASSWORDTOREPLACE/'"$PG_PENTAHOUSER_PWD"'/g' ${PENTAHO_HOME}/server/config/*.sql ${PENTAHO_HOME}/server/config/*.xml ${PENTAHO_HOME}/server/config/jackrabbit/*.xml ${PENTAHO_HOME}/server/config/hibernate/*.xml
sed -i 's/$JCRUSERTOREPLACE/'"$PG_JCRUSER"'/g' ${PENTAHO_HOME}/server/config/*.sql ${PENTAHO_HOME}/server/config/*.xml ${PENTAHO_HOME}/server/config/jackrabbit/*.xml ${PENTAHO_HOME}/server/config/hibernate/*.xml
sed -i 's/$JCRUSERPASSWORDTOREPLACE/'"$PG_JCRUSER_PWD"'/g' ${PENTAHO_HOME}/server/config/*.sql ${PENTAHO_HOME}/server/config/*.xml ${PENTAHO_HOME}/server/config/jackrabbit/*.xml ${PENTAHO_HOME}/server/config/hibernate/*.xml

cp -R config/jackrabbit pentaho-server/pentaho-solutions/system/
cp -R config/hibernate pentaho-server/pentaho-solutions/system/
cp -R config/quartz pentaho-server/pentaho-solutions/system/
cp config/context.xml pentaho-server/tomcat/webapps/pentaho/META-INF/