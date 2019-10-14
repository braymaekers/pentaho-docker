#!/bin/sh

echo "Init: env-variable "
echo "PG_HOST: " $PG_HOST
echo "PG_PORT: " $PG_PORT
echo "PG_HIBUSERV: " $PG_HIBUSER
echo "PG_HIBUSER_PWDV: " $PG_HIBUSER_PWD
echo "PENTAHO_HOME" $PENTAHO_HOME
echo "INIT PG:" $PG_INIT
echo "INIT PENTAHO:" $PENTAHO_INIT
echo "DB: " $PG_DB
echo "DB USERNAME: " $DB_USER 

sh $PENTAHO_HOME/server/scripts/pginit.sh $PG_HOST $PG_PORT $PG_HIBUSER $PG_HIBUSER_PWD $PG_PENTAHOUSER $PG_PENTAHOUSER_PWD $PG_JCRUSER $PG_JCRUSER_PWD $PENTAHO_HOME

if [ "$PG_INIT" == "Y" ]; then
   echo "Init Postgres......."
   echo "creating the database and table"
    psql -f /opt/pentaho/server/config/create_quartz_postgresql.sql -h $PG_HOST -d $PG_DB -U $DB_USER -w
    psql -f /opt/pentaho/server/config/create_repository_postgresql.sql -h $PG_HOST -d $PG_DB -U $DB_USER -w
    psql -f /opt/pentaho/server/config/create_jcr_postgresql.sql -h $PG_HOST -d $PG_DB -U $DB_USER -w
   export PG_INIT="N"
fi

if [ "$PENTAHO_INIT" == "Y" ]; then
   echo "Init Pentaho....."
   sh $PENTAHO_HOME/server/scripts/pentahoinit.sh
   export PENTAHO_INIT="N"
fi

sh ${PENTAHO_SERVER}/start-pentaho.sh