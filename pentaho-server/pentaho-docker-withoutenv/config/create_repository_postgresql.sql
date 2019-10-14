--
-- note: this script assumes pg_hba.conf is configured correctly
--

-- \connect postgres postgres

drop database if exists hibernate;
drop user if exists $HIBUSERTOREPLACE;

CREATE USER $HIBUSERTOREPLACE PASSWORD '$HIBPASSWORDTOREPLACE';

CREATE DATABASE hibernate WITH OWNER = $HIBUSERTOREPLACE ENCODING = 'SQL_ASCII' TABLESPACE = pg_default;

GRANT ALL PRIVILEGES ON DATABASE hibernate to $HIBUSERTOREPLACE;
