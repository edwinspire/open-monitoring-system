process.env.PORT = 8182;

process.env.PG_USER = 'postgres';
process.env.PG_PWD = 'pg4321';
process.env.PG_HOST = '192.168.251.174';
process.env.PG_DB = 'openmonitoringsystem';

process.env.SMPT_HOST = 'mail.localhost.com';
process.env.SMPT_PORT = 465;
process.env.SMPT_IGNORETLS = false;
process.env.SMPT_SECURE = true;
process.env.SMPT_AUTH_USER = 'user';
process.env.SMPT_AUTH_PWD = 'password';
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
