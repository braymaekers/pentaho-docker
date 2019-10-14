FROM centos:centos7
MAINTAINER Morgan Senechal

ENV POSTGRES_DB db
ENV POSTGRES_USER user
ENV POSTGRES_PASSWORD password

RUN yum -y update; yum clean all
RUN yum -y install sudo epel-release; yum clean all
RUN yum -y install postgresql-server postgresql postgresql-contrib supervisor pwgen; yum clean all

ADD ./postgresql-setup.sh /usr/bin/postgresql-setup.sh
ADD ./supervisord.conf /etc/supervisord.conf
ADD ./start_postgres.sh /start_postgres.sh

RUN sed -i 's/.*requiretty$/#Defaults requiretty/' /etc/sudoers
RUN chmod a+x /usr/bin/postgresql-setup
RUN chmod a+x /start_postgres.sh

RUN sh /usr/bin/postgresql-setup.sh initdb
ADD ./postgresql.conf /var/lib/pgsql/data/postgresql.conf
RUN chown -v postgres.postgres /var/lib/pgsql/data/postgresql.conf
RUN echo "host    all             all             0.0.0.0/0               md5" >> /var/lib/pgsql/data/pg_hba.conf

EXPOSE 5432
ENTRYPOINT ["sh", "-c", "/start_postgres.sh"]
