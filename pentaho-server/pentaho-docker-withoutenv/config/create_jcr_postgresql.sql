--
-- note: this script assumes pg_hba.conf is configured correctly
--

-- \connect postgres postgres

drop database if exists jackrabbit;
drop user if exists $JCRUSERTOREPLACE;

CREATE USER $JCRUSERTOREPLACE PASSWORD '$JCRUSERPASSWORDTOREPLACE';

CREATE DATABASE jackrabbit WITH OWNER = $JCRUSERTOREPLACE ENCODING = 'SQL_ASCII' TABLESPACE = pg_default;

GRANT ALL PRIVILEGES ON DATABASE jackrabbit to $JCRUSERTOREPLACE;
