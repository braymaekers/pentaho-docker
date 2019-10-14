#!/bin/sh

PGVERSION=9.2.7

PGENGINE=/usr/bin

PREVMAJORVERSION=9.2

PREVPGENGINE=/usr/lib64/pgsql/postgresql-9.2/bin


SERVICE_NAME="$2"
if [ x"$SERVICE_NAME" = x ]; then
    SERVICE_NAME=postgresql
fi


PGDATA="/var/lib/pgsql/data"

PGPORT="5432"

PGLOG=/var/lib/pgsql/initdb.log

PGUPLOG=/var/lib/pgsql/pgupgrade.log

export PGDATA
export PGPORT

if [ -x /sbin/runuser ]; then
    SU=runuser
else
    SU=su
fi

script_result=0

perform_initdb(){
    if [ ! -e "$PGDATA" ]; then
        mkdir "$PGDATA" || return 1
        chown postgres:postgres "$PGDATA"
        chmod go-rwx "$PGDATA"
    fi
    [ -x /sbin/restorecon ] && /sbin/restorecon "$PGDATA"

    if [ ! -e "$PGLOG" -a ! -h "$PGLOG" ]; then
        touch "$PGLOG" || return 1
        chown postgres:postgres "$PGLOG"
        chmod go-rwx "$PGLOG"
        [ -x /sbin/restorecon ] && /sbin/restorecon "$PGLOG"
    fi

    $SU -l postgres -c "$PGENGINE/initdb --pgdata='$PGDATA' --auth='ident'" \
                    >> "$PGLOG" 2>&1 < /dev/null

    mkdir "$PGDATA/pg_log"
    chown postgres:postgres "$PGDATA/pg_log"
    chmod go-rwx "$PGDATA/pg_log"
    [ -x /sbin/restorecon ] && /sbin/restorecon "$PGDATA/pg_log"

    if [ -f "$PGDATA/PG_VERSION" ]; then
        return 0
    fi
    return 1
}

initdb(){
    if [ -f "$PGDATA/PG_VERSION" ]; then
        echo $"Data directory is not empty!"
        echo
        script_result=1
    else
        echo -n $"Initializing database ... "
        if perform_initdb; then
            echo $"OK"
        else
            echo $"failed, see $PGLOG"
            script_result=1
        fi
        echo
    fi
}

upgrade(){
    if [ ! -f "$PGDATA/PG_VERSION" -o \
         x`cat "$PGDATA/PG_VERSION"` != x"$PREVMAJORVERSION" ]
    then
        echo
        echo $"Cannot upgrade because the database in $PGDATA is not of"
        echo $"compatible previous version $PREVMAJORVERSION."
        echo
        exit 1
    fi
    if [ ! -x "$PGENGINE/pg_upgrade" ]; then
        echo
        echo $"Please install the postgresql-upgrade RPM."
        echo
        exit 5
    fi

    service "$SERVICE_NAME" stop

    rm -f "$PGUPLOG"
    touch "$PGUPLOG" || exit 1
    chown postgres:postgres "$PGUPLOG"
    chmod go-rwx "$PGUPLOG"
    [ -x /sbin/restorecon ] && /sbin/restorecon "$PGUPLOG"

    PGDATAOLD="${PGDATA}-old"
    rm -rf "$PGDATAOLD"
    mv "$PGDATA" "$PGDATAOLD" || exit 1

    HBA_CONF_BACKUP="$PGDATAOLD/pg_hba.conf.postgresql-setup.`date +%s`"
    HBA_CONF_BACKUP_EXISTS=0

    if [ ! -f $HBA_CONF_BACKUP ]; then
        mv "$PGDATAOLD/pg_hba.conf" "$HBA_CONF_BACKUP"
        HBA_CONF_BACKUP_EXISTS=1

        echo "local all postgres ident" > "$PGDATAOLD/pg_hba.conf"
    fi

    echo -n $"Upgrading database: "

    if perform_initdb; then
        $SU -l postgres -c "$PGENGINE/pg_upgrade \
                        '--old-bindir=$PREVPGENGINE' \
                        '--new-bindir=$PGENGINE' \
                        '--old-datadir=$PGDATAOLD' \
                        '--new-datadir=$PGDATA' \
                        --link \
                        '--old-port=$PGPORT' '--new-port=$PGPORT' \
                        --user=postgres" >> "$PGUPLOG" 2>&1 < /dev/null
        if [ $? -ne 0 ]; then
            script_result=1
        fi
    else
        script_result=1
    fi

    if [ x$HBA_CONF_BACKUP_EXISTS = x1 ]; then
        mv -f "$HBA_CONF_BACKUP" "$PGDATAOLD/pg_hba.conf"
    fi

    if [ $script_result -eq 0 ]; then
        echo $"OK"
        echo
        echo $"The configuration files was replaced by default configuration."
        echo $"The previous configuration and data are stored in folder"
        echo $PGDATAOLD.
    else
        rm -rf "$PGDATA"
        mv "$PGDATAOLD" "$PGDATA"
        echo $"failed"
    fi
    echo
    echo $"See $PGUPLOG for details."
}

case "$1" in
    initdb)
        initdb
        ;;
    upgrade)
        upgrade
        ;;
    *)
        echo $"Usage: $0 {initdb|upgrade} [ service_name ]"
        exit 2
esac

exit $script_result
