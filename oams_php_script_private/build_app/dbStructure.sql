--
-- PostgreSQL database dump
--

-- Dumped from database version 9.4.6
-- Dumped by pg_dump version 9.4.6
-- Started on 2016-03-20 07:15:50 ECT

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- TOC entry 3949 (class 1262 OID 89876)
-- Name: oms; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE oms WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'es_EC.UTF-8' LC_CTYPE = 'es_EC.UTF-8';


ALTER DATABASE oms OWNER TO postgres;

\connect oms

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- TOC entry 3950 (class 1262 OID 89876)
-- Dependencies: 3949
-- Name: oms; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE oms IS 'Open Alarm Management System';


--
-- TOC entry 2 (class 3079 OID 11861)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 3953 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- TOC entry 1 (class 3079 OID 89877)
-- Name: adminpack; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;


--
-- TOC entry 3954 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION adminpack; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION adminpack IS 'administrative functions for PostgreSQL';


SET search_path = public, pg_catalog;

--
-- TOC entry 303 (class 1255 OID 89889)
-- Name: accounts_insert_update(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION accounts_insert_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
/*
INSERT INTO accounts(
            idcontact, ts, enabled, first_name, last_name, birthday, identification, 
            ididtype, postal_code, gender, geox, geoy, note, address, address_ref, 
            idaccountstate, idaccounttype, start_date, end_date, account, 
            is_admin, admin_start, admin_end, admin_username, admin_pwd, 
            admin_sessionid, admin_ip, admin_level)
    VALUES (?, ?, ?, ?, ?, ?, ?, 
            ?, ?, ?, ?, ?, ?, ?, ?, 
            ?, ?, ?, ?, ?, 
            ?, ?, ?, ?, ?, 
            ?, ?, ?);
            */

-- Si la fecha de fin es NULL se la setea a la fecha de inicio + 10 años
IF NEW.end_date < NEW.start_date OR NEW.end_date IS NULL THEN  
NEW.end_date := NEW.start_date+ interval '15 year';
END IF;  

-- Cuando se inserta o actualiza un registro se verifica que no haya un numero de cuenta igual, caso contrario devuelve uno disponible
CASE 
    WHEN TG_OP = 'INSERT' THEN
        NEW.account := fun_account_auto_account(NEW.account, NEW.iddivision);

    WHEN TG_OP = 'UPDATE' AND EXISTS(SELECT idcontact FROM accounts WHERE idcontact != NEW.idcontact AND account = NEW.account AND iddivision = NEW.iddivision) THEN
        NEW.account := fun_account_auto_account(NEW.account, NEW.iddivision);
    ELSE
      --  msg := 'other value than one or two';
END CASE;

--NEW.note := TG_WHEN;

-- setea end_date = a start_date si la fecha end_date es menor que start_date
IF NEW.end_date < NEW.start_date THEN  
NEW.end_date := NEW.start_date;
END IF;    


	
RETURN NEW;
END;$$;


ALTER FUNCTION public.accounts_insert_update() OWNER TO postgres;

--
-- TOC entry 3955 (class 0 OID 0)
-- Dependencies: 303
-- Name: FUNCTION accounts_insert_update(); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION accounts_insert_update() IS 'Realiza validacion de datos antes de insertar en la tabla.';


--
-- TOC entry 304 (class 1255 OID 89890)
-- Name: admins_insert_update(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION admins_insert_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN


--  Creamos un username si no es proporcionado
IF NEW.admin_username IS NULL OR LENGTH(NEW.admin_username) < 1 THEN
--NEW.admin_username :=  NEW.identification; 

SELECT identification INTO NEW.admin_username FROM contacts WHERE idcontact = NEW.idcontact;
END IF;

-- creamos una clave igual al md5 del user_name si no es proporcionada.
IF NEW.admin_pwd IS NULL OR LENGTH(NEW.admin_pwd) < 1 THEN
 NEW.admin_pwd := md5(NEW.admin_username::TEXT); 
END IF;

/*
-- Clave como md5
IF TG_OP = 'UPDATE' THEN
NEW.admin_pwd := md5(NEW.admin_pwd::TEXT);
END IF;
*/

-- setea end_date = a start_date si la fecha end_date es menor que start_date
IF NEW.admin_end < NEW.admin_start OR NEW.admin_end IS NULL THEN  
NEW.admin_end := NEW.admin_start+ interval '1 year';
END IF;  

RETURN NEW;
END;
$$;


ALTER FUNCTION public.admins_insert_update() OWNER TO postgres;

--
-- TOC entry 305 (class 1255 OID 89891)
-- Name: admins_update_admin_pwd(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION admins_update_admin_pwd() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN

-- creamos una clave igual al md5 del numero de identificacion si no es proporcionada.
IF NEW.admin_pwd IS NULL OR LENGTH(NEW.admin_pwd) < 1 THEN
NEW.admin_pwd := md5(NEW.identification::TEXT);
END IF;

-- Clave como md5
IF TG_OP = 'UPDATE' THEN
NEW.admin_pwd := md5(NEW.admin_pwd::TEXT);
END IF;


RETURN NEW;
END;$$;


ALTER FUNCTION public.admins_update_admin_pwd() OWNER TO postgres;

--
-- TOC entry 311 (class 1255 OID 89892)
-- Name: contacts_insert_update(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION contacts_insert_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN

-- Si no se ha ingresado el campo identification se crea uno automaticamente
IF NEW.identification IS NULL THEN
NEW.identification :=  md5(extract(epoch FROM now())::TEXT);
END IF;
/*
IF NEW.is_admin IS TRUE THEN

--  Creamos un username si no es proporcionado
IF NEW.admin_username IS NULL OR LENGTH(NEW.admin_username) < 1 THEN
NEW.admin_username :=  NEW.identification;
END IF;


-- creamos una clave igual al md5 del numero de identificacion si no es proporcionada.
IF NEW.admin_pwd IS NULL OR LENGTH(NEW.admin_pwd) < 1 THEN
NEW.admin_pwd := md5(NEW.identification::TEXT);
END IF;

-- Clave como md5
IF TG_OP = 'UPDATE' THEN
NEW.admin_pwd := md5(NEW.admin_pwd::TEXT);
END IF;


-- setea end_date = a start_date si la fecha end_date es menor que start_date
IF NEW.admin_end < NEW.admin_start OR NEW.admin_end IS NULL THEN  
NEW.admin_end := NEW.admin_start+ interval '1 year';
END IF;  

END IF;
*/

/*
INSERT INTO contacts(
            idcontact, ts, enabled, first_name, last_name, birthday, identification, 
            ididtype, postal_code, gender, geox, geoy, note, address, address_ref, 
            is_admin, admin_start, admin_end, admin_username, admin_pwd, 
            admin_sessionid, admin_ip, admin_level)
    VALUES (?, ?, ?, ?, ?, ?, ?, 
            ?, ?, ?, ?, ?, ?, ?, ?, 
            ?, ?, ?, ?, ?, 
            ?, ?, ?);
            */
--NEW.ts := now();

RETURN NEW;
END;
$$;


ALTER FUNCTION public.contacts_insert_update() OWNER TO postgres;

--
-- TOC entry 306 (class 1255 OID 89893)
-- Name: contacts_update_admin_pwd(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION contacts_update_admin_pwd() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN

-- creamos una clave igual al md5 del numero de identificacion si no es proporcionada.
IF NEW.admin_pwd IS NULL OR LENGTH(NEW.admin_pwd) < 1 THEN
NEW.admin_pwd := md5(NEW.identification::TEXT);
END IF;

-- Clave como md5
IF TG_OP = 'UPDATE' THEN
NEW.admin_pwd := md5(NEW.admin_pwd::TEXT);
END IF;


RETURN NEW;
END;$$;


ALTER FUNCTION public.contacts_update_admin_pwd() OWNER TO postgres;

--
-- TOC entry 3956 (class 0 OID 0)
-- Dependencies: 306
-- Name: FUNCTION contacts_update_admin_pwd(); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION contacts_update_admin_pwd() IS 'Devuelve el md5 de la clave ingresada cuando se actualiza.';


--
-- TOC entry 307 (class 1255 OID 89894)
-- Name: equipment_insert_update(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION equipment_insert_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN

IF NEW.serial_number IS NULL OR  LENGTH(NEW.serial_number) < 1 THEN
NEW.serial_number :=  md5(extract(epoch FROM now())::TEXT||random()::TEXT);
END IF;

IF NEW.code_ref IS NULL OR  LENGTH(NEW.code_ref) < 1 THEN
NEW.code_ref :=  NEW.serial_number;
END IF;

/*
IF NOT EXISTS(SELECT idcontact FROM accounts WHERE idcontact = NEW.idaccount LIMIT 1) THEN
NEW.idaccount :=  NULL;
END IF;
*/


RAISE NOTICE '1) *** idequipment (%) idaccount (%) -> %', NEW.idequipment, NEW.idaccount, TG_TABLE_NAME;

/*
INSERT INTO equipments(
            idequipment, ts, equipment, mark, model, serial_number, description, 
            installation_date, uninstall_date, working, note, code_ref, idaccount)
    VALUES (?, ?, ?, ?, ?, ?, ?, 
            ?, ?, ?, ?, ?, ?);

            */
--NEW.ts := now();

RETURN NEW;
END;
$$;


ALTER FUNCTION public.equipment_insert_update() OWNER TO postgres;

--
-- TOC entry 308 (class 1255 OID 89895)
-- Name: event_comments_after_insert(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION event_comments_after_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$DECLARE

table_part TEXT DEFAULT '';

begin

UPDATE events SET status = NEW.status WHERE idevent = NEW.idevent;

return NULL;
end;$$;


ALTER FUNCTION public.event_comments_after_insert() OWNER TO postgres;

--
-- TOC entry 309 (class 1255 OID 89896)
-- Name: event_comments_before_insert_redirect_partition(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION event_comments_before_insert_redirect_partition() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$DECLARE

table_part TEXT DEFAULT '';

begin

table_part := fun_create_table_partition(TG_TABLE_NAME, NOW():: timestamp without time zone);


IF NOT EXISTS(SELECT trigger_name  FROM information_schema.triggers
                     WHERE event_object_table = table_part
                     AND trigger_name = 'on_insert'
                     ) 
                     
                    THEN
                               
EXECUTE 'CREATE TRIGGER on_insert
  AFTER INSERT
  ON '||table_part||'
  FOR EACH ROW
  EXECUTE PROCEDURE event_comments_after_insert();';                               
                                                          
     END IF ;


-- No funcionan llaves foraneas con tablas heredadas
/*
IF NOT EXISTS(SELECT * FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY' AND table_name = table_part AND constraint_name = 'fk_'||table_part||'_idadmin') THEN

EXECUTE 'ALTER TABLE '||table_part||'
 ADD CONSTRAINT fk_'||table_part||'_idadmin FOREIGN KEY (idadmin) REFERENCES contacts (idcontact) ON UPDATE CASCADE ON DELETE SET NULL;';     

END IF;

*/


-- No funcionan llaves foraneas con tablas heredadas
/*
--ALTER TABLE event_comments_201512
--  ADD CONSTRAINT fk_event_comments_idadmin FOREIGN KEY (idadmin) REFERENCES contacts (idcontact) ON UPDATE CASCADE ON DELETE SET NULL;

IF NOT EXISTS(SELECT * FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY' AND table_name = table_part AND constraint_name = 'fk_'||table_part||'_idevent') THEN

EXECUTE 'ALTER TABLE '||table_part||'
 ADD CONSTRAINT fk_'||table_part||'_idevent FOREIGN KEY (idevent) REFERENCES events (idevent) ON UPDATE CASCADE ON DELETE CASCADE;';     

END IF;
*/


EXECUTE 'INSERT INTO ' || quote_ident(table_part) || ' SELECT ($1).*' USING NEW;

return NULL;
end;$_$;


ALTER FUNCTION public.event_comments_before_insert_redirect_partition() OWNER TO postgres;

--
-- TOC entry 310 (class 1255 OID 89897)
-- Name: events_before_insert_redirect_partition(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION events_before_insert_redirect_partition() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$DECLARE

table_part TEXT DEFAULT '1990';
et eventtypes%ROWTYPE;
--tbl TEXT DEFAULT 'events';
is_valid BOOLEAN DEFAULT false;
iaenabled BOOLEAN DEFAULT FALSE;
constraint_name_table TEXT DEFAULT '_dateevent_check';
dateevent_year INTEGER DEFAULT 1990;

BEGIN

table_part := fun_create_table_partition(TG_TABLE_NAME, NEW.dateevent:: timestamp without time zone);
constraint_name_table := table_part||'_dateevent_check';
dateevent_year := EXTRACT(YEAR FROM NEW.dateevent);
 -- SELECT fun_events_general_check_before_insert(table_part, NEW) INTO NEW;


IF NOT EXISTS(SELECT * FROM information_schema.table_constraints WHERE constraint_type = 'CHECK' AND table_name = table_part AND constraint_name = constraint_name_table
                     ) 
                     
                    THEN
                               
EXECUTE 'ALTER TABLE '||table_part::TEXT||'
  ADD CONSTRAINT '||constraint_name_table::TEXT||' CHECK (EXTRACT(YEAR FROM dateevent) = '||dateevent_year::TEXT||'::double precision);';
                                                          
     END IF ;


/*
select * from information_schema.table_constraints where constraint_type = 'CHECK'
*/


IF NOT EXISTS(SELECT trigger_name FROM information_schema.triggers
                     WHERE event_object_table = table_part
                     AND trigger_name = 'on_insert_event'
                     ) 
                     
                    THEN
                               
EXECUTE 'CREATE TRIGGER on_insert_event
  AFTER INSERT
  ON '||table_part::TEXT||'
  FOR EACH ROW
  EXECUTE PROCEDURE events_on_insert();';
                                                          
     END IF ;


IF NOT EXISTS(SELECT * FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY' AND table_name = table_part AND constraint_name = 'fk_'||table_part||'_idaccount') THEN

EXECUTE 'ALTER TABLE '||table_part||'
 ADD CONSTRAINT fk_'||table_part||'_idaccount FOREIGN KEY (idaccount) REFERENCES accounts (idcontact)  ON UPDATE CASCADE ON DELETE CASCADE;';     

END IF;


IF NOT EXISTS(SELECT * FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY' AND table_name = table_part AND constraint_name = 'fk_'||table_part||'_ideventtype') THEN

EXECUTE 'ALTER TABLE '||table_part||'
 ADD CONSTRAINT fk_'||table_part||'_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes (ideventtype)  ON UPDATE CASCADE ON DELETE SET NULL;';     

END IF;

IF NOT EXISTS(SELECT * FROM information_schema.table_constraints WHERE constraint_type = 'UNIQUE' AND table_name = table_part AND constraint_name = 'uniq_'||table_part||'_de_ide_idevt_zu') THEN

EXECUTE 'ALTER TABLE '||table_part||'
 ADD CONSTRAINT uniq_'||table_part||'_de_ide_idevt_zu UNIQUE(dateevent, idequipment, zu, ideventtype);';     

END IF;

/*
CREATE INDEX events_jobs_1990_idaccount_idx
  ON events_jobs_1990
  USING btree (idaccount);

*/


IF NOT EXISTS(SELECT * FROM pg_indexes WHERE tablename = table_part AND indexname = 'index_'||table_part||'_idaccount') THEN

EXECUTE '
CREATE INDEX index_'||table_part||'_idaccount
  ON '||table_part||' USING btree (idaccount);';     
  
END IF;

IF NOT EXISTS(SELECT * FROM pg_indexes WHERE tablename = table_part AND indexname = 'index_'||table_part||'_idequipment') THEN

EXECUTE '
CREATE INDEX index_'||table_part||'_idequipment
  ON '||table_part||' USING btree (idequipment);';     
  
END IF;

IF NOT EXISTS(SELECT * FROM pg_indexes WHERE tablename = table_part AND indexname = 'index_'||table_part||'_status') THEN

EXECUTE '
CREATE INDEX index_'||table_part||'_status
  ON '||table_part||' USING btree (status) WHERE status = 0;';     
  
END IF;


-- El unico dato para validar si el equipo o la cuenta son correctos es el idaccount o el idequipment
-- Por razones de optimizacion se eliminan las columnas code y account de la tabla events y sus heredadas
CASE

WHEN  NEW.idaccount IS NULL AND NEW.idequipment IS NULL THEN
RAISE NOTICE '1) El idaccount o el idequipment no pueden ser nulos';


WHEN  NEW.idaccount IS NULL AND NEW.idequipment > 0 THEN
SELECT COALESCE((SELECT idaccount FROM equipments WHERE idequipment = NEW.idequipment), -1000) INTO NEW.idaccount;

IF NEW.idaccount > 0 THEN
is_valid := TRUE;
ELSE
is_valid := FALSE;
NEW.idaccount := NULL;
-- Debemos insertar un evento que indique que se trata de insertar un evento de un idequipment sin asociar a un idaccount que no existe
RAISE NOTICE '2) **** idequipment (%) no tiene idaccount asociada o es incorrecta', NEW.idaccount;
END IF;

WHEN  NEW.idaccount > 0 THEN
is_valid := TRUE;
RAISE NOTICE '3) ***** idaccount (%)', NEW.idaccount;

ELSE
RAISE NOTICE '3) ***** No pasa nada (%)', NEW.idaccount;
is_valid := FALSE;
END CASE;


RAISE NOTICE '4) Vamos a la validacion de ideventtype y relacionados';


IF is_valid THEN

-- Obtenemos los datos del tipo de evento
SELECT * INTO et FROM eventtypes WHERE ideventtype = NEW.ideventtype;

-- Obtenemos los datos de la cuenta
SELECT enabled INTO iaenabled FROM accounts WHERE idcontact = NEW.idaccount;

CASE

	WHEN NOT iaenabled THEN
	NEW.status := 2;
	--NEW.note := 'This account is not enabled, of event has been marked to be closed automatically without operator assistance. Automatically closed by the system. Status '||NEW.status::text;

	WHEN et.expiration <= 0 THEN
	NEW.status := 2;
	--NEW.note := 'This type of event has been marked to be closed automatically without operator assistance. Automatically closed by the system. Status '||NEW.status::text;

--	WHEN et.autoclose_if_there_is_an_equal_even_noclosed_event < fun_event_time_last_eventtype_account_not_closed(NEW.idaccount, NEW.dateevent::timestamp without time zone, NEW.ideventtype, NEW.zu) THEN
--	NEW.status := 6;
--	NEW.note := 'This event was closed because no other previous event like unclosed. Status '||NEW.status::text||' fun_event_time_last_eventtype_account_not_closed = '||fun_event_time_last_eventtype_account_not_closed(NEW.idaccount, NEW.dateevent::timestamp without time zone, NEW.ideventtype, NEW.zu);

ELSE
RAISE NOTICE 'events_before_insert ???? ';
END CASE;

-------------------------------------------------------------------------------------------------------
-- Revisamos si el idadmin existe
IF NOT EXISTS(SELECT * FROM admins WHERE idadmin = NEW.idadmin) THEN
NEW.idadmin := NULL;
END IF;

-- Validamos ideventtype y relacionados
IF NEW.ideventtype IS NULL OR NEW.ideventtype < 1 THEN
RAISE NOTICE '5) IF NEW.ideventtype IS NULL OR NEW.ideventtype < 1';
NEW.ideventtype := 0;
END IF;

RAISE NOTICE '6) Hacemos un select del tipo de evento';


IF (NEW.description IS NULL OR LENGTH(NEW.description) < 1) AND et.label IS NOT NULL THEN
RAISE NOTICE '7) IF (NEW.description IS NULL OR LENGTH(NEW.description) < 1) AND et.label IS NOT NULL';
NEW.description := et.label;
END IF;

IF (NEW.priority IS NULL OR NEW.priority < 1) AND et.priority IS NOT NULL THEN
RAISE NOTICE '8) IF (NEW.priority IS NULL OR NEW.priority < 1) AND et.priority IS NOT NULL';
NEW.priority := et.priority;
END IF;

RAISE NOTICE '9) Finaliza las verificaciones, ahora va a insertar en la particion %', table_part;


EXECUTE 'INSERT INTO ' || quote_ident(table_part) || ' SELECT ($1).*' USING NEW;
END IF;





/*
table_part := fun_create_table_partition(TG_TABLE_NAME, NEW.dateevent:: timestamp without time zone);

PERFORM   fun_events_general_check_before_insert(table_part, NEW);


IF NEW.status != 8 THEN
EXECUTE 'INSERT INTO ' || quote_ident(table_part) || ' SELECT ($1).*' USING NEW;
END IF;
*/

return null;
END;$_$;


ALTER FUNCTION public.events_before_insert_redirect_partition() OWNER TO postgres;

--
-- TOC entry 3957 (class 0 OID 0)
-- Dependencies: 310
-- Name: FUNCTION events_before_insert_redirect_partition(); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION events_before_insert_redirect_partition() IS 'Antes de insertar redirecciona los eventos a la particion que le corresponde.';


--
-- TOC entry 359 (class 1255 OID 89899)
-- Name: events_on_insert(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION events_on_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$DECLARE

ilabel TEXT DEFAULT '';
ibody TEXT DEFAULT '';
iafn TEXT DEFAULT '';
ialn TEXT DEFAULT '';
iaccount TEXT DEFAULT '';
iaenabled BOOLEAN DEFAULT TRUE;
isessionid TEXT DEFAULT '';

et eventtypes%ROWTYPE;
array_ideventtypes_closed_for_this_ideventtype integer[];
idevent_for_close_on_restore int DEFAULT 0;

BEGIN

RAISE NOTICE '>>> 1) Inicia Trigger events_on_insert';

RAISE NOTICE '>>> 2)';

-- Obtenemos los datos del tipo de evento
-- SELECT autoclose_if_there_is_an_equal_even_noclosed_event, expiration, treatment, notify_closable, label, notify_all_users, notify_timeout, notify_snd, notify_img INTO iautoclose_if_there_is_an_equal_even_noclosed_event, iexpiration, itreatment, inotify_closable, ilabel, inotify_all_users, inotify_timeout, inotify_snd, inotify_img FROM eventtypes WHERE ideventtype = NEW.ideventtype;
SELECT * INTO et FROM eventtypes WHERE ideventtype = NEW.ideventtype;

RAISE NOTICE '>>>> 3)';

-- Obtenemos los datos de la cuenta
SELECT account, first_name, last_name, enabled INTO iaccount, iafn, ialn, iaenabled FROM accounts WHERE idcontact = NEW.idaccount;

RAISE NOTICE '>>> 4)';

IF et.notify_all_users THEN
isessionid := 'all';
ELSE
-- Obtenemos el sessionid segun el idadmin
SELECT admin_sessionid INTO isessionid FROM contacts WHERE idcontact = NEW.idadmin; 
END IF;

RAISE NOTICE '>>>> 5)';

IF iaenabled AND NEW.priority < 21 THEN
RAISE NOTICE '>>> 6)';
-- Mostramos la notificacion solo si la prioridad es menor o = que 20
ilabel := ialn||' '||iafn||' ['||iaccount||']</br>'||et.label||'</br>';
--PERFORM  fun_edit_notification(NEW.priority, et.notify_timeout, et.notify_closable, et.notify_img, et.notify_snd, ilabel, '<b>'||NEW.dateevent||'</b></br>'||NEW.description, isessionid);
INSERT INTO notification_area(
            urgency, timeout, closable, img, snd, title, body, 
            sessionid)
    VALUES (NEW.priority, et.notify_timeout, et.notify_closable, et.notify_img, et.notify_snd, ilabel, '<b>'||NEW.dateevent||'</b></br>'||NEW.description, 
            isessionid);

END IF;


/*

-- Auto cerramos los eventos se se haya programado para ser cerrados por la llegada de este evento
-- 1. Obtenemos la lista de los ideventtypes que serán cerrados por el ideventtype de este evento
IF et.enable_auto_close_on_event_defined THEN
RAISE NOTICE '>>> 7) SELECT idevent FROM events WHERE ideventtype = ANY(%) AND status = 0 AND idaccount = % AND zu = % AND idevent != %',  et.auto_close_on_event_defined, NEW.idaccount, NEW.zu, NEW.idevent;
FOR idevent_for_close_on_restore IN SELECT idevent FROM events WHERE ideventtype = ANY(et.auto_close_on_event_defined) 
AND status = 0 AND idaccount = NEW.idaccount AND zu = NEW.zu AND idevent != NEW.idevent AND idequipment = NEW.idequipment LOOP


-- TG_TABLE_NAME
-- EXECUTE 'UPDATE '||TG_TABLE_NAME||' SET status = 7 WHERE idevent = '||idevent_for_close_on_restore||';';

--UPDATE events SET status = 7 WHERE idevent = idevent_for_close_on_restore;

RAISE NOTICE '>>> 8) Se cierra automaticamente el evento % por restauracion', idevent_for_close_on_restore;

INSERT INTO event_comments(
            comment_event, 
            idevent, status)
    VALUES ('Event closed for restoring or status changed event - idevent '||NEW.idevent, idevent_for_close_on_restore, 7);

    END LOOP;

END IF;



-- Auto cerramos los eventos se se haya programado para ser cerrados por la llegada de este evento
-- 1. Obtenemos la lista de los ideventtypes que serán cerrados por el ideventtype de este evento
IF et.enable_auto_close_on_event_defined THEN
RAISE NOTICE '>>> 7) SELECT idevent FROM events WHERE ideventtype = ANY(%) AND status = 0 AND idaccount = % AND zu = % AND idevent != %',  et.auto_close_on_event_defined, NEW.idaccount, NEW.zu, NEW.idevent;
FOR idevent_for_close_on_restore IN SELECT idevent FROM events WHERE ideventtype = ANY(et.auto_close_on_event_defined) 
AND status = 0 AND idaccount = NEW.idaccount AND zu = NEW.zu AND idevent != NEW.idevent  LOOP


-- TG_TABLE_NAME
-- EXECUTE 'UPDATE '||TG_TABLE_NAME||' SET status = 7 WHERE idevent = '||idevent_for_close_on_restore||';';

--UPDATE events SET status = 7 WHERE idevent = idevent_for_close_on_restore;

RAISE NOTICE '>>> 8) Se cierra automaticamente el evento % por restauracion', idevent_for_close_on_restore;

INSERT INTO event_comments(
            comment_event, 
            idevent, status)
    VALUES ('Event closed for restoring or status changed event - idevent '||NEW.idevent, idevent_for_close_on_restore, 7);

    END LOOP;

END IF;

*/

RAISE NOTICE '>>> 9) TERMINA EVENTS_ON_INSERT';

RETURN null;
END;$$;


ALTER FUNCTION public.events_on_insert() OWNER TO postgres;

--
-- TOC entry 3958 (class 0 OID 0)
-- Dependencies: 359
-- Name: FUNCTION events_on_insert(); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION events_on_insert() IS 'Envia la notificacion al navegador cuando un evento es insertado en la tabla';


--
-- TOC entry 312 (class 1255 OID 89900)
-- Name: fun_account_auto_account(text, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_account_auto_account(iaccount text DEFAULT 'oams'::text, idivision integer DEFAULT 0) RETURNS text
    LANGUAGE plpgsql
    AS $$DECLARE

r TEXT DEFAULT 'oams';
i INTEGER DEFAULT 0;

BEGIN

IF iaccount IS NULL OR LENGTH(iaccount) < 1 THEN
iaccount := 'oams';
END IF;

r := iaccount;
RAISE NOTICE 'Asignado r(%)', r;
-- Chequeamo que el numero de la cuenta no se repita, si lo hace buscamos el siguiente numero disponible
WHILE EXISTS(SELECT * FROM accounts WHERE account = r AND iddivision = idivision) AND i < 10 LOOP
    r := iaccount||'('||i::text||')';
RAISE NOTICE 'Asignado rx(%)', r;
i := i+1;
END LOOP;



/*
SELECT idcontact, ts, enabled, first_name, last_name, birthday, identification, 
       ididtype, postal_code, gender, geox, geoy, note, address, address_ref, 
       idaccountstate, idaccounttype, start_date, end_date, account
  FROM accounts;

*/

/*
-- Chequeamo que el numero de la cuenta no se repita, si lo hace buscamos el siguiente numero disponible
WHILE usaga.fun_account_search_number(iaccount) > 0 LOOP
    inaccount := initialaccount||'('||i::text||')';
i := i+1;
END LOOP;
*/
RAISE NOTICE 'Asignado rs(%)', r;

RETURN  r;
END;$$;


ALTER FUNCTION public.fun_account_auto_account(iaccount text, idivision integer) OWNER TO postgres;

--
-- TOC entry 313 (class 1255 OID 89901)
-- Name: fun_check_sessionid_idadmin(text, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_check_sessionid_idadmin(iusername text, isessionid text, iip text) RETURNS integer
    LANGUAGE plpgsql
    AS $$DECLARE

--Now timestamp without time zone default now();
R INTEGER DEFAULT 1;

BEGIN
/*
R := COALESCE((SELECT idcontact FROM contacts WHERE admin_username = iusername AND admin_sessionid = isessionid AND is_admin = true LIMIT 1), -200);

IF R < 1 THEN
--PERFORM fun_event_insert_by_ideventtype(now()::timestamp without time zone, 0, 0, 0, 1004, 'Unauthorized user '||iusername::text, 0);
INSERT INTO events(
            status, idaccount, ideventtype, description)
    VALUES (0, 0, 1004, 'Unauthorized user '||iusername::text||' from IP '||iip::text);

END IF;
*/

RETURN R;
END;$$;


ALTER FUNCTION public.fun_check_sessionid_idadmin(iusername text, isessionid text, iip text) OWNER TO postgres;

--
-- TOC entry 316 (class 1255 OID 89903)
-- Name: fun_create_table_partition(text, timestamp without time zone); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_create_table_partition(inherts_table text, idatetimeevent timestamp without time zone) RETURNS text
    LANGUAGE plpgsql
    AS $$DECLARE

part TEXT DEFAULT '19000101';

BEGIN

part := inherts_table||'_'||fun_sufix_name_by_date(idatetimeevent)::TEXT;

IF NOT EXISTS(SELECT table_name FROM information_schema.tables WHERE  table_schema = 'public' AND table_name = part LIMIT 1) THEN

EXECUTE 'CREATE TABLE IF NOT EXISTS public.'||part::TEXT||'(
   LIKE public.'||inherts_table||' INCLUDING DEFAULTS INCLUDING CONSTRAINTS INCLUDING INDEXES INCLUDING STORAGE INCLUDING COMMENTS
) 
INHERITS ('||inherts_table||')
WITH (
  OIDS = FALSE,
  autovacuum_enabled=true,
  toast.autovacuum_enabled=true
);';


-- Trigger: on_changed_table on events

-- DROP TRIGGER on_changed_table ON events;

EXECUTE 'CREATE TRIGGER on_changed_table
  AFTER INSERT OR UPDATE OR DELETE
  ON '||part::TEXT||'
  FOR EACH ROW
  EXECUTE PROCEDURE on_changed_table();';

-- Trigger: on_insert_event on events

-- DROP TRIGGER on_insert_event ON events;
/*
EXECUTE 'CREATE TRIGGER on_insert_event
  AFTER INSERT
  ON '||part::TEXT||'
  FOR EACH ROW
  EXECUTE PROCEDURE events_on_insert();';
  */

-- Trigger: on_update_row on events

-- DROP TRIGGER on_update_row ON events;

EXECUTE 'CREATE TRIGGER on_update_row
  BEFORE UPDATE
  ON '||part::TEXT||'
  FOR EACH ROW
  EXECUTE PROCEDURE on_update_row_update_ts();';

END IF;


RETURN part;
END;$$;


ALTER FUNCTION public.fun_create_table_partition(inherts_table text, idatetimeevent timestamp without time zone) OWNER TO postgres;

--
-- TOC entry 314 (class 1255 OID 89904)
-- Name: fun_edit_accounts(integer, boolean, text, text, timestamp without time zone, text, integer, text, integer, real, real, text, text, text, integer, integer, timestamp without time zone, timestamp without time zone, text, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_edit_accounts(id integer, ienabled boolean, ifirst_name text, ilast_name text, ibirthday timestamp without time zone, iidentification text, iididtype integer, ipostal_code text, igender integer, igeox real, igeoy real, inote text, iaddress text, iaddress_ref text, iidaccountstate integer, iidaccounttype integer, istart_date timestamp without time zone, iend_date timestamp without time zone, iaccount text, iidadmin integer, OUT fun_return integer, OUT fun_msg text) RETURNS record
    LANGUAGE plpgsql
    AS $$DECLARE

BEGIN

fun_return := -100;
fun_msg := 'Error desconocido';

CASE

	WHEN id = 0  THEN
	BEGIN

-- Verificamos que no se repita el abonado
	iaccount := fun_account_auto_account(iaccount);

-- Ingresamos un nuevo registro
INSERT INTO accounts(
            enabled, first_name, last_name, birthday, identification, 
            ididtype, postal_code, gender, geox, geoy, note, address, address_ref, 
            idaccountstate, idaccounttype, start_date, end_date, account)
    VALUES (ienabled, ifirst_name, ilast_name, ibirthday, iidentification, 
            iididtype, ipostal_code, igender, igeox, igeoy, inote, iaddress, iaddress_ref, 
            iidaccountstate, iidaccounttype, istart_date, iend_date, iaccount)
 RETURNING idcontact INTO fun_return;
fun_msg := 'Nuevo registro insertado';
EXCEPTION WHEN unique_violation THEN
 -- do nothing
 fun_return := -2;
 fun_msg := 'Registro tiene campos que deben ser unicos'||iaccount||' '||last_name||' '||first_name;
END;
	WHEN id > 0  THEN
BEGIN	
-- Actualizamos
UPDATE accounts
   SET enabled=ienabled, first_name=ifirst_name, last_name=ilast_name, birthday=ibirthday, 
       identification=iidentification, ididtype=iididtype, postal_code=ipostal_code, gender=igender, geox=igeox, 
       geoy=igeoy, note=inote, address=iaddress, address_ref=iaddress_ref, idaccountstate=iidaccountstate, idaccounttype=iidaccounttype, 
       start_date=istart_date, end_date=iend_date, account=iaccount
 WHERE idcontact = id;
 fun_return = id;
 fun_msg := 'Registro Actualizado';
 EXCEPTION WHEN unique_violation THEN
 -- do nothing
 fun_return := -3;
 fun_msg := 'Registro tiene campos que deben ser unicos id='||id::TEXT||' '||iaccount||' '||ilast_name||' '||ifirst_name;
END;

	WHEN id < 0  THEN
-- Eliminamos
DELETE FROM accounts
 WHERE idcontact=id;
 fun_return := 0;
 fun_msg := 'Registro Eliminado';

 END CASE;


RETURN;
END;$$;


ALTER FUNCTION public.fun_edit_accounts(id integer, ienabled boolean, ifirst_name text, ilast_name text, ibirthday timestamp without time zone, iidentification text, iididtype integer, ipostal_code text, igender integer, igeox real, igeoy real, inote text, iaddress text, iaddress_ref text, iidaccountstate integer, iidaccounttype integer, istart_date timestamp without time zone, iend_date timestamp without time zone, iaccount text, iidadmin integer, OUT fun_return integer, OUT fun_msg text) OWNER TO postgres;

--
-- TOC entry 3959 (class 0 OID 0)
-- Dependencies: 314
-- Name: FUNCTION fun_edit_accounts(id integer, ienabled boolean, ifirst_name text, ilast_name text, ibirthday timestamp without time zone, iidentification text, iididtype integer, ipostal_code text, igender integer, igeox real, igeoy real, inote text, iaddress text, iaddress_ref text, iidaccountstate integer, iidaccounttype integer, istart_date timestamp without time zone, iend_date timestamp without time zone, iaccount text, iidadmin integer, OUT fun_return integer, OUT fun_msg text); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION fun_edit_accounts(id integer, ienabled boolean, ifirst_name text, ilast_name text, ibirthday timestamp without time zone, iidentification text, iididtype integer, ipostal_code text, igender integer, igeox real, igeoy real, inote text, iaddress text, iaddress_ref text, iidaccountstate integer, iidaccounttype integer, istart_date timestamp without time zone, iend_date timestamp without time zone, iaccount text, iidadmin integer, OUT fun_return integer, OUT fun_msg text) IS 'Aun hay partes que estan usando esta funcion que ya no se deberia usar.';


--
-- TOC entry 317 (class 1255 OID 89905)
-- Name: fun_edit_contacts(integer, boolean, text, text, timestamp without time zone, text, integer, text, integer[], integer, real, real, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_edit_contacts(id integer, ienabled boolean, ifirst_name text, ilast_name text, ibirthday timestamp without time zone, iidentification text, iididtype integer, ipostal_code text, igroups integer[], igender integer, igeox real, igeoy real, inote text, OUT fun_return integer, OUT fun_msg text) RETURNS record
    LANGUAGE plpgsql
    AS $$DECLARE

BEGIN

fun_return := -100;
fun_msg := 'Error desconocido';

CASE

	WHEN id = 0  THEN
-- Ingresamos un nuevo registro
INSERT INTO contacts(
            enabled, first_name, last_name, birthday, identification, 
            ididtype, postal_code, groups, gender, geox, geoy, note)
    VALUES (ienabled, ifirst_name, ilast_name, ibirthday, iidentification, 
            iididtype, ipostal_code, igroups, igender, igeox, igeoy, inote) RETURNING idcontact INTO fun_return;
fun_msg := 'Nuevo registro insertado';

	WHEN id > 0  THEN
-- Actualizamos
UPDATE contacts
   SET enabled=ienabled, first_name=ifirst_name, last_name=ilast_name, birthday=ibirthday, 
       identification=iidentification, ididtype=iididtype, postal_code=ipostal_code, groups=igroups, gender=igender, 
       geox=igeox, geoy=igeoy, note=inote
 WHERE idcontact=id;
 fun_return = id;
 fun_msg := 'Registro Actualizado';

	WHEN id < 0  THEN
-- Eliminamos
DELETE FROM contacts
 WHERE idcontact=id;
 fun_return := 0;
 fun_msg := 'Registro Eliminado';

 END CASE;


RETURN;
END;$$;


ALTER FUNCTION public.fun_edit_contacts(id integer, ienabled boolean, ifirst_name text, ilast_name text, ibirthday timestamp without time zone, iidentification text, iididtype integer, ipostal_code text, igroups integer[], igender integer, igeox real, igeoy real, inote text, OUT fun_return integer, OUT fun_msg text) OWNER TO postgres;

--
-- TOC entry 318 (class 1255 OID 89906)
-- Name: fun_edit_event_comments(integer, integer, timestamp without time zone, integer, text, integer, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_edit_event_comments(id integer, iidadmin integer, istart timestamp without time zone, iseconds integer, icomment_event text, istatus integer, iidevent bigint, OUT fun_return integer, OUT fun_msg text) RETURNS record
    LANGUAGE plpgsql
    AS $$DECLARE

BEGIN

fun_return := -100;
fun_msg := 'Error desconocido';

CASE

	WHEN id = 0  THEN
-- Ingresamos un nuevo registro
INSERT INTO event_comments(
            idadmin, start, seconds, comment_event, status, 
            idevent)
    VALUES (iidadmin, istart, iseconds, icomment_event, istatus, 
            iidevent) RETURNING ideventcomment INTO fun_return;
fun_msg := 'Nuevo registro insertado';

	WHEN id > 0  THEN
-- Actualizamos
UPDATE event_comments
   SET idadmin=iidadmin, start=istart, seconds=iseconds, comment_event=icomment_event, 
       status=istatus, idevent=iidevent
 WHERE  ideventcomment=id;
 fun_return = id;
 fun_msg := 'Registro Actualizado';

	WHEN id < 0  THEN
-- Eliminamos
 DELETE FROM event_comments
 WHERE  ideventcomment=id;
 fun_return := 0;
 fun_msg := 'Registro Eliminado';

 END CASE;


RETURN;
END;$$;


ALTER FUNCTION public.fun_edit_event_comments(id integer, iidadmin integer, istart timestamp without time zone, iseconds integer, icomment_event text, istatus integer, iidevent bigint, OUT fun_return integer, OUT fun_msg text) OWNER TO postgres;

--
-- TOC entry 319 (class 1255 OID 89907)
-- Name: fun_edit_events(integer, timestamp without time zone, integer, integer, text, integer, integer, integer, text, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_edit_events(id integer, idateevent timestamp without time zone, istatus integer, iidaccount integer, icode text, izu integer, ipriority integer, iideventtype integer, idescription text, iidadmin integer, OUT fun_return integer, OUT fun_msg text) RETURNS record
    LANGUAGE plpgsql
    AS $$DECLARE
itreatment BOOLEAN DEFAULT FALSE;


BEGIN

fun_return := -100;
fun_msg := 'Error desconocido';

IF NOT EXISTS(SELECT ideventtype FROM eventtypes WHERE ideventtype = iideventtype) THEN
-- Verificamos si existe el ideventtype, caso contrario le asignamos como 0 (desconocido)
iideventtype := 0;
END IF;

IF ipriority < 1 THEN
-- Si la prioridad es menor que 1 buscamos en el tipo de evento y le asignamos la prioridad que le corresponde
SELECT priority INTO ipriority FROM eventtypes WHERE ideventtype = iideventtype;
END IF;

IF length(idescription) < 2 THEN
-- Buscamos en la tabla tipos de eventos para setear la descripcion
SELECT label INTO idescription FROM eventtypes WHERE ideventtype = iideventtype;
END IF;

IF length(icode) < 2 THEN
-- Buscamos en la tabla el codigo del evento si no ha sido ingresado
SELECT code INTO icode FROM eventtypes WHERE ideventtype = iideventtype;
END IF;

IF NOT EXISTS(SELECT idcontact FROM accounts WHERE idcontact = iidaccount) THEN
-- Verificamos que el abonado exista si no existe lo seteamos a 0
idescription := idescription||' [Warning: idcontact '||iidaccount||' no exist in table accounts]';
iidaccount := 0;
END IF;

CASE

	WHEN id = 0 THEN

	BEGIN
-- Ingresamos un nuevo registro
INSERT INTO events(
            dateevent, idaccount, code, zu, 
            priority, ideventtype, description, idadmin)
    VALUES (idateevent, iidaccount, icode, izu, 
            ipriority, iideventtype, idescription, iidadmin) RETURNING idevent INTO fun_return;
fun_msg := 'Nuevo registro insertado';
EXCEPTION WHEN unique_violation THEN
 -- do nothing
 fun_return := -2;
 fun_msg := 'Evento duplicado';
END;



	WHEN id > 0 THEN
-- Actualizamos (Esto no deberia estar habilitado por seguridad)
UPDATE events
   SET dateevent=idateevent, idaccount=iidaccount, 
       code=icode, zu=izu, priority=ipriority, ideventtype=iideventtype, description=idescription, idadmin=iidadmin
 WHERE idevent=id;
 fun_return = id;
 fun_msg := 'Registro Actualizado';

	WHEN id < 0 THEN
-- Eliminamos (Esto no deberia estar habilitado por seguridad)
DELETE FROM events
 WHERE idevent=id;
 fun_return := 0;
 fun_msg := 'Registro Eliminado';

 END CASE;


RETURN;
END;$$;


ALTER FUNCTION public.fun_edit_events(id integer, idateevent timestamp without time zone, istatus integer, iidaccount integer, icode text, izu integer, ipriority integer, iideventtype integer, idescription text, iidadmin integer, OUT fun_return integer, OUT fun_msg text) OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 174 (class 1259 OID 89908)
-- Name: events; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events (
    idevent bigint NOT NULL,
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0 NOT NULL,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0 NOT NULL,
    idequipment bigint
)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events OWNER TO postgres;

--
-- TOC entry 3960 (class 0 OID 0)
-- Dependencies: 174
-- Name: TABLE events; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE events IS 'Las notificaciones de los ecentos solo se muestran al usuario si su proiridad es <= 20';


--
-- TOC entry 3961 (class 0 OID 0)
-- Dependencies: 174
-- Name: COLUMN events.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 3962 (class 0 OID 0)
-- Dependencies: 174
-- Name: COLUMN events.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.

No se lo pone como llave foranea para no tener que crearlas en cada tabla heredada mas bien se hace la comprobacion antes de insertar en la tabla y de no existir se pone a null';


--
-- TOC entry 3963 (class 0 OID 0)
-- Dependencies: 174
-- Name: COLUMN events.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 320 (class 1255 OID 89920)
-- Name: fun_event_before_insert_check_and_redirect_partition(events, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_event_before_insert_check_and_redirect_partition(INOUT ievents events, table_name text) RETURNS events
    LANGUAGE plpgsql
    AS $$DECLARE


table_part TEXT DEFAULT '19900101';
et eventtypes%ROWTYPE;
--tbl TEXT DEFAULT 'events';
is_valid BOOLEAN DEFAULT false;
iaenabled BOOLEAN DEFAULT FALSE;

BEGIN

--table_part := fun_create_table_partition(table_name, ievents.dateevent:: timestamp without time zone);

end;
$$;


ALTER FUNCTION public.fun_event_before_insert_check_and_redirect_partition(INOUT ievents events, table_name text) OWNER TO postgres;

--
-- TOC entry 3964 (class 0 OID 0)
-- Dependencies: 320
-- Name: FUNCTION fun_event_before_insert_check_and_redirect_partition(INOUT ievents events, table_name text); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION fun_event_before_insert_check_and_redirect_partition(INOUT ievents events, table_name text) IS 'Esta funcion es generica y corre en un trigger que se dispara antes de insertar en la tabla events';


--
-- TOC entry 321 (class 1255 OID 89921)
-- Name: fun_event_comment_insert_selected(integer[], integer, text, integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_event_comment_insert_selected(iidevents integer[], iseconds integer, icomment text, istatus integer, iidadmin integer, OUT fun_return bigint, OUT fun_msg text) RETURNS record
    LANGUAGE plpgsql
    AS $$DECLARE

i INTEGER DEFAULT 0;
iidevent INTEGER;

BEGIN

fun_return := -100;
fun_msg := 'Comentario agregado a varios eventos';


   FOREACH iidevent IN ARRAY iidevents
   LOOP
      --RAISE NOTICE 'another_func(%,%)',m[1], m[2];
INSERT INTO event_comments(
            idadmin, seconds, comment_event, status, 
            idevent)
    VALUES (iidadmin, iseconds, icomment, istatus, 
            iidevent);

	i := i+1;
   END LOOP;


fun_return := i;
fun_msg := 'Comentario agregado a '||i::TEXT||' eventos';

RETURN;
END;$$;


ALTER FUNCTION public.fun_event_comment_insert_selected(iidevents integer[], iseconds integer, icomment text, istatus integer, iidadmin integer, OUT fun_return bigint, OUT fun_msg text) OWNER TO postgres;

--
-- TOC entry 322 (class 1255 OID 89922)
-- Name: fun_event_comments_table_create_partition(timestamp without time zone); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_event_comments_table_create_partition(idatetimeevent timestamp without time zone) RETURNS boolean
    LANGUAGE plpgsql
    AS $$DECLARE

r BOOLEAN DEFAULT TRUE;
dia TEXT DEFAULT '19000101';

BEGIN

dia := 'event_comments_'||fun_sufix_name_by_date(idatetimeevent);

IF NOT EXISTS(SELECT table_name FROM information_schema.tables WHERE table_catalog = 'open_ams' AND table_schema = 'public' AND table_name = dia LIMIT 1) THEN

EXECUTE 'CREATE TABLE IF NOT EXISTS public.'||dia::TEXT||'(
   LIKE public.event_comments INCLUDING DEFAULTS INCLUDING CONSTRAINTS INCLUDING INDEXES INCLUDING STORAGE
) 
INHERITS (event_comments)
WITH (
  OIDS = FALSE,
  autovacuum_enabled=true,
  toast.autovacuum_enabled=true
);';

/*

CREATE TABLE public.events_comments_dia
(
   LIKE public.event_comments INCLUDING DEFAULTS INCLUDING CONSTRAINTS INCLUDING INDEXES INCLUDING STORAGE
) 
INHERITS (event_comments)
WITH (
  OIDS = FALSE
)
;

*/

-- Trigger: on_changed_table on event_comments

-- DROP TRIGGER on_changed_table ON event_comments;

EXECUTE  'CREATE TRIGGER on_changed_table
  AFTER INSERT OR UPDATE OR DELETE
  ON '||dia::TEXT||'
  FOR EACH ROW
  EXECUTE PROCEDURE on_changed_table();';

-- Trigger: on_insert on event_comments

-- DROP TRIGGER on_insert ON event_comments;

EXECUTE 'CREATE TRIGGER on_insert
  BEFORE INSERT
  ON '||dia::TEXT||'
  FOR EACH ROW
  EXECUTE PROCEDURE event_comments_on_insert();';

-- Trigger: on_update_row on event_comments

-- DROP TRIGGER on_update_row ON event_comments;

EXECUTE 'CREATE TRIGGER on_update_row
  BEFORE UPDATE
  ON '||dia::TEXT||'
  FOR EACH ROW
  EXECUTE PROCEDURE on_update_row_update_ts();';


END IF;

RETURN r;
END;$$;


ALTER FUNCTION public.fun_event_comments_table_create_partition(idatetimeevent timestamp without time zone) OWNER TO postgres;

--
-- TOC entry 315 (class 1255 OID 89923)
-- Name: fun_event_insert(timestamp without time zone, integer, integer, text, integer, integer, integer, text, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_event_insert(idateevent timestamp without time zone, istatus integer, iidaccount integer, icode text, izu integer, ipriority integer, iideventtype integer, idescription text, iidadmin integer, OUT fun_return integer, OUT fun_msg text) RETURNS record
    LANGUAGE plpgsql
    AS $$DECLARE

BEGIN

fun_return := -100;
fun_msg := 'Error desconocido';

IF NOT EXISTS(SELECT idevent FROM eventtypes WHERE ideventtype = iideventtype) THEN
-- Verificamos si existe el ideventtype, caso contrario le asignamos como 0 (desconocido)
iideventtype := 0;
END IF;


SELECT * FROM fun_edit_events(0, idateevent, istatus, iidaccount, icode, izu, ipriority, iideventtype, idescription, iidadmin) INTO fun_return, fun_msg;

RETURN;
END;$$;


ALTER FUNCTION public.fun_event_insert(idateevent timestamp without time zone, istatus integer, iidaccount integer, icode text, izu integer, ipriority integer, iideventtype integer, idescription text, iidadmin integer, OUT fun_return integer, OUT fun_msg text) OWNER TO postgres;

--
-- TOC entry 323 (class 1255 OID 89924)
-- Name: fun_event_insert_by_ideventtype(timestamp without time zone, integer, integer, integer, integer, text, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_event_insert_by_ideventtype(idateevent timestamp without time zone, iidaccount integer, izu integer, ipriority integer, iideventtype integer, idescription text, iidadmin integer, OUT fun_return integer, OUT fun_msg text) RETURNS record
    LANGUAGE plpgsql
    AS $$DECLARE

istatus INTEGER DEFAULT 0;

BEGIN

fun_return := -100;
fun_msg := 'Error desconocido';

/*
IF NOT EXISTS(SELECT * FROM eventtypes WHERE ideventtype = iideventtype) THEN
-- Verificamos si existe el ideventtype, caso contrario le asignamos como 0 (desconocido)
iideventtype := 0;
END IF;
*/

-- Insertamos
SELECT * FROM fun_edit_events(0, idateevent, istatus, iidaccount, '', izu, ipriority, iideventtype, idescription, iidadmin) INTO fun_return, fun_msg;

RETURN;
END;$$;


ALTER FUNCTION public.fun_event_insert_by_ideventtype(idateevent timestamp without time zone, iidaccount integer, izu integer, ipriority integer, iideventtype integer, idescription text, iidadmin integer, OUT fun_return integer, OUT fun_msg text) OWNER TO postgres;

--
-- TOC entry 3965 (class 0 OID 0)
-- Dependencies: 323
-- Name: FUNCTION fun_event_insert_by_ideventtype(idateevent timestamp without time zone, iidaccount integer, izu integer, ipriority integer, iideventtype integer, idescription text, iidadmin integer, OUT fun_return integer, OUT fun_msg text); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION fun_event_insert_by_ideventtype(idateevent timestamp without time zone, iidaccount integer, izu integer, ipriority integer, iideventtype integer, idescription text, iidadmin integer, OUT fun_return integer, OUT fun_msg text) IS 'Inserta un evento usando como parametros principales el ideventtype para buscar los datos de ese evento y el account para obtener el idcontact de la tabla accounts.';


--
-- TOC entry 324 (class 1255 OID 89925)
-- Name: fun_event_insert_by_ideventtype_account(timestamp without time zone, text, integer, integer, integer, text, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_event_insert_by_ideventtype_account(idateevent timestamp without time zone, iaccount text, izu integer, ipriority integer, iideventtype integer, idescription text, iidadmin integer, OUT fun_return integer, OUT fun_msg text) RETURNS record
    LANGUAGE plpgsql
    AS $$DECLARE

iidaccount INTEGER DEFAULT 1;

BEGIN
iidaccount := fun_get_idaccount_by_account(iaccount);
-- Insertamos
SELECT * FROM fun_event_insert_by_ideventtype(idateevent, iidaccount, izu, ipriority, iideventtype, idescription, iidadmin) INTO fun_return, fun_msg;

RETURN;
END;$$;


ALTER FUNCTION public.fun_event_insert_by_ideventtype_account(idateevent timestamp without time zone, iaccount text, izu integer, ipriority integer, iideventtype integer, idescription text, iidadmin integer, OUT fun_return integer, OUT fun_msg text) OWNER TO postgres;

--
-- TOC entry 325 (class 1255 OID 89926)
-- Name: fun_event_insert_diskspace(bigint, text, real); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_event_insert_diskspace(iidequipment bigint, idrive text, isize real, OUT ofun_return integer, OUT ofun_msg text) RETURNS record
    LANGUAGE plpgsql
    AS $_$DECLARE

min_space INTEGER DEFAULT 20000;
idescrip TEXT DEFAULT '';
iideventtype INTEGER DEFAULT 0;
iidaccount INTEGER DEFAULT 0;
last_size REAL DEFAULT -100;
row_network_device view_account_network_devices%ROWTYPE;

BEGIN

SELECT * INTO row_network_device FROM view_account_network_devices WHERE idequipment = iidequipment;

idescrip := '<b>Abonado:</b> '||row_network_device.account||'</br> <b>Equipo:</b> '||row_network_device.equipment||'</br> <b>IP:</b> '||row_network_device.ip||'</br> ';

--iidaccount := fun_get_idaccount_by_account(iaccount);


last_size := COALESCE((SELECT drive_size FROM events_diskspace WHERE idequipment = iidequipment  AND drive =  idrive ORDER BY idevent DESC LIMIT 1), -200);
--RAISE  'DESPUES: %', timeofday();

IF last_size <> isize THEN
--IF (SELECT drive_size FROM events_diskspace WHERE account = iaccount AND drive = idrive ORDER BY idevent DESC LIMIT 1) <> isize OR NOT EXISTS(SELECT drive_size FROM events_diskspace WHERE account = iaccount AND drive = idrive LIMIT 1) THEN

--//insert_event($linkpg, $date->format('Y-m-d H:i:s'), $oficina, 52, "<b>Drive:</b> ".$row_db[0]." </br><b>Size:</b> ".$row_db[1]." MB. </br>Disk space lower than ".$limit."

CASE

	WHEN idrive = 'D' OR idrive = 'E' THEN
IF isize > min_space THEN
iideventtype := 62;
idescrip := idescrip||'<b>Drive:</b> '||idrive||' </br><b>Size:</b> '||isize||' MB';
ELSE
iideventtype := 52;
idescrip := idescrip||'<b>Drive:</b> '||idrive||' </br><b>Size:</b> '||isize||' MB. </br>Disk space lower than '||min_space||' MB.';
END IF;

ELSE

IF isize > 10000 THEN
iideventtype := 62;
idescrip := idescrip||'<b>Drive:</b> '||idrive||' </br><b>Size:</b> '||isize||' MB';
ELSE
iideventtype := 52;
idescrip := idescrip||'<b>Drive:</b> '||idrive||' </br><b>Size:</b> '||isize||' MB. </br>Disk space lower than '||10000::text||' MB.';
END IF;

END CASE;


 INSERT INTO events_diskspace (ideventtype, description, idaccount, drive, drive_free, zu, idequipment) VALUES (iideventtype, idescrip, row_network_device.idcontact, idrive, isize, ascii(idrive), iidequipment) RETURNING idevent INTO ofun_return;



END IF;



RETURN;
END;$_$;


ALTER FUNCTION public.fun_event_insert_diskspace(iidequipment bigint, idrive text, isize real, OUT ofun_return integer, OUT ofun_msg text) OWNER TO postgres;

--
-- TOC entry 326 (class 1255 OID 89927)
-- Name: fun_event_status_get_label(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_event_status_get_label(istatus integer) RETURNS text
    LANGUAGE plpgsql
    AS $$DECLARE
r TEXT DEFAULT 'Unknown';
BEGIN

CASE

	WHEN istatus = 0  THEN
-- Abierto
		r := 'Open';
	WHEN istatus = 1  THEN
-- Cerrado
		r := 'Close';
	WHEN istatus = 2  THEN
-- Cerrado automaticamente por el sistema
		r := 'Close (System)';
	WHEN istatus = 3  THEN
-- Pendiente
		r := 'Pending';
	WHEN istatus = 4  THEN
-- Reabierto		
		r := 'Reopen';
	WHEN istatus = 5  THEN	
		r := 'Expired';
	WHEN istatus = 6  THEN	
		r := 'Close (Like other previous event without closing)';
	WHEN istatus = 7  THEN						
		r := 'Close (For Restore)';
	WHEN istatus = 8  THEN						
		r := 'Close (Invalid account)';		
	ELSE
		r := 'yyy';
 END CASE;


RETURN r;
END;$$;


ALTER FUNCTION public.fun_event_status_get_label(istatus integer) OWNER TO postgres;

--
-- TOC entry 327 (class 1255 OID 89928)
-- Name: fun_event_time_last_eventtype_account_not_closed(integer, timestamp without time zone, integer, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_event_time_last_eventtype_account_not_closed(iidaccount integer, idateevent timestamp without time zone, iideventtype integer, izu bigint) RETURNS integer
    LANGUAGE plpgsql
    AS $$DECLARE

-- Tiempo en minutos
itime integer default -1; 
ilastdateevent timestamp without time zone DEFAULT now();

BEGIN
RAISE NOTICE '1) Inicia fun_event_time_last_eventtype_account_not_closed';
RAISE NOTICE '2) Datos iideventtype % / iidaccount % / izu %', iideventtype::text, iidaccount::text, izu::text;


--dateevent timestamp without time zone DEFAULT now()
ilastdateevent := COALESCE((SELECT dateevent FROM events WHERE ideventtype = iideventtype AND idaccount = iidaccount AND zu = izu AND status IN(0, 4, 5) ORDER BY idevent DESC LIMIT 1), '2099-01-01 00:00'::timestamp without time zone);

RAISE NOTICE 'ilastdateevent(%)', ilastdateevent;
RAISE NOTICE 'idateevent(%)', idateevent;
RAISE NOTICE 'seg(%)', EXTRACT(epoch FROM age(ilastdateevent, idateevent));

itime := (EXTRACT(epoch FROM age(idateevent, ilastdateevent))/60)::INTEGER;


RETURN itime;
END;$$;


ALTER FUNCTION public.fun_event_time_last_eventtype_account_not_closed(iidaccount integer, idateevent timestamp without time zone, iideventtype integer, izu bigint) OWNER TO postgres;

--
-- TOC entry 328 (class 1255 OID 89929)
-- Name: fun_events_general_check_before_insert(text, events); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_events_general_check_before_insert(itable_name text, INOUT ievents events) RETURNS events
    LANGUAGE plpgsql
    AS $_$DECLARE

et eventtypes%ROWTYPE;
is_valid BOOLEAN DEFAULT false;
iaenabled BOOLEAN DEFAULT FALSE;

BEGIN


IF NOT EXISTS(SELECT trigger_name FROM information_schema.triggers
                     WHERE event_object_table = itable_name
                     AND trigger_name = 'on_insert_event'
                     ) 
                     
                    THEN
                               
EXECUTE 'CREATE TRIGGER on_insert_event
  AFTER INSERT
  ON '||itable_name::TEXT||'
  FOR EACH ROW
  EXECUTE PROCEDURE events_on_insert();';
                                                          
     END IF ;


IF NOT EXISTS(SELECT * FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY' AND table_name = itable_name AND constraint_name = 'fk_'||itable_name||'_idaccount') THEN

EXECUTE 'ALTER TABLE '||table_part||'
 ADD CONSTRAINT fk_'||table_part||'_idaccount FOREIGN KEY (idaccount) REFERENCES accounts (idcontact)  ON UPDATE CASCADE ON DELETE CASCADE;';     

END IF;


IF NOT EXISTS(SELECT * FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY' AND table_name = itable_name AND constraint_name = 'fk_'||itable_name||'_ideventtype') THEN

EXECUTE 'ALTER TABLE '||itable_name||'
 ADD CONSTRAINT fk_'||itable_name||'_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes (ideventtype)  ON UPDATE CASCADE ON DELETE SET NULL;';     

END IF;



-- El unico dato para validar si el equipo o la cuenta son correctos es el idaccount o el idequipment
-- Por razones de optimizacion se eliminan las columnas code y account de la tabla events y sus heredadas
CASE

WHEN  ievents.idaccount IS NULL AND ievents.idequipment IS NULL THEN
RAISE NOTICE '1) El idaccount o el idequipment no pueden ser nulos';
ievents.status := 8;
--ievents.note := 'Close event: idaccount and idequipment are null';

WHEN  ievents.idaccount IS NULL AND ievents.idequipment > 0 THEN
SELECT COALESCE((SELECT idaccount FROM equipments WHERE idequipment = ievents.idequipment), -1000) INTO ievents.idaccount;

IF ievents.idaccount > 0 THEN
is_valid := TRUE;
ELSE
is_valid := FALSE;
ievents.status := 8;
--ievents.note := 'Close event: idequipment '||ievents.idequipment::text||' is not linked to idaccount';
ievents.idaccount := NULL;
-- Debemos insertar un evento que indique que se trata de insertar un evento de un idequipment sin asociar a un idaccount que no existe
RAISE NOTICE '2) **** idequipment (%) no tiene idaccount asociada o es incorrecta', ievents.idaccount;
END IF;

WHEN  ievents.idaccount > 0 THEN
is_valid := TRUE;
RAISE NOTICE '3) ***** idaccount (%)', ievents.idaccount;

ELSE
RAISE NOTICE '3) ***** No pasa nada (%)', ievents.idaccount;
is_valid := FALSE;
ievents.status := 8;
--ievents.note := 'Close event: unknow';
END CASE;


RAISE NOTICE '4) Vamos a la validacion de ideventtype y relacionados';


IF ievents.status != 8 THEN

-- Obtenemos los datos del tipo de evento
SELECT * INTO et FROM eventtypes WHERE ideventtype = ievents.ideventtype;

-- Obtenemos los datos de la cuenta
SELECT enabled INTO iaenabled FROM accounts WHERE idcontact = ievents.idaccount;

CASE

	WHEN NOT iaenabled THEN
	ievents.status := 2;
--	ievents.note := 'This account is not enabled, of event has been marked to be closed automatically without operator assistance. Automatically closed by the system. Status '||ievents.status::text;

	WHEN et.expiration <= 0 THEN
	ievents.status := 2;
--	ievents.note := 'This type of event has been marked to be closed automatically without operator assistance. Automatically closed by the system. Status '||ievents.status::text;

	WHEN et.autoclose_if_there_is_an_equal_even_noclosed_event < fun_event_time_last_eventtype_account_not_closed(ievents.idaccount, ievents.dateevent::timestamp without time zone, ievents.ideventtype, ievents.zu) THEN
	ievents.status := 6;
--	ievents.note := 'This event was closed because no other previous event like unclosed. Status '||ievents.status::text||' fun_event_time_last_eventtype_account_not_closed = '||fun_event_time_last_eventtype_account_not_closed(ievents.idaccount, ievents.dateevent::timestamp without time zone, ievents.ideventtype, ievents.zu);

ELSE
RAISE NOTICE 'events_before_insert ???? ';
END CASE;




-------------------------------------------------------------------------------------------------------
-- Revisamos si el idadmin existe
IF NOT EXISTS(SELECT * FROM contacts WHERE idcontact = ievents.idadmin AND is_admin = TRUE) THEN
ievents.idadmin := NULL;
END IF;

-- Validamos ideventtype y relacionados
IF ievents.ideventtype IS NULL OR ievents.ideventtype < 1 THEN
RAISE NOTICE '5) IF NEW.ideventtype IS NULL OR NEW.ideventtype < 1';
ievents.ideventtype := 0;
END IF;

RAISE NOTICE '6) Hacemos un select del tipo de evento';


IF (ievents.description IS NULL OR LENGTH(ievents.description) < 1) AND et.label IS NOT NULL THEN
RAISE NOTICE '7) IF (NEW.description IS NULL OR LENGTH(NEW.description) < 1) AND et.label IS NOT NULL';
ievents.description := et.label;
END IF;

IF (ievents.priority IS NULL OR ievents.priority < 1) AND et.priority IS NOT NULL THEN
RAISE NOTICE '8) IF (NEW.priority IS NULL OR NEW.priority < 1) AND et.priority IS NOT NULL';
ievents.priority := et.priority;
END IF;

RAISE NOTICE '9) Finaliza las verificaciones, ahora va a insertar en la particion %', itable_name;


-- EXECUTE 'INSERT INTO ' || quote_ident(table_part) || ' SELECT ($1).*' USING NEW;
END IF;

RETURN;

END;$_$;


ALTER FUNCTION public.fun_events_general_check_before_insert(itable_name text, INOUT ievents events) OWNER TO postgres;

--
-- TOC entry 329 (class 1255 OID 89931)
-- Name: fun_farma_event_insert_jobs(bigint, timestamp without time zone, bigint, integer, integer, bigint, text, boolean, text, timestamp without time zone, integer, timestamp without time zone); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_farma_event_insert_jobs(iidequipment bigint, idateevent timestamp without time zone, iidaccount bigint, last_run_outcome integer, job_current_execution_status integer, izu bigint, ijob_name text, ijob_enabled boolean, ijob_description text, ijob_date_create timestamp without time zone, ijob_run_duration integer, ijob_next_run timestamp without time zone, OUT ofun_return integer, OUT ofun_msg text) RETURNS record
    LANGUAGE plpgsql
    AS $_$DECLARE

row_network_device view_account_network_devices%ROWTYPE;
descrip TEXT DEFAULT '';
descrip_current_status TEXT DEFAULT '';
iideventtype_current_status BIGINT DEFAULT -1;
iideventtype_last_run_outcome BIGINT DEFAULT -1;

BEGIN

SELECT * INTO row_network_device FROM view_account_network_devices WHERE idequipment = iidequipment;

descrip := '<b>Equipo:</b> '||row_network_device.equipment||'</br> <b>IP:</b> '||row_network_device.ip::TEXT||'</br> '|| '<b>JOB: '||ijob_name||'</b> </br> <b>Description:</b> '||ijob_description||'</br> <b>Next Run:</b> '||ijob_next_run::TEXT||'</br>';
--descrip_current_status := equip;

CASE

WHEN job_current_execution_status = 0 THEN
iideventtype_current_status := 67;
descrip_current_status := descrip||' [Are not idle or suspended]';

WHEN job_current_execution_status = 1 THEN
iideventtype_current_status := 69;
descrip_current_status := descrip||' [Executing]';

WHEN job_current_execution_status = 2 THEN
iideventtype_current_status := 70;
descrip_current_status := descrip||' [Waiting for thread]';

WHEN job_current_execution_status = 3 THEN
iideventtype_current_status := 71;
descrip_current_status := descrip||' [Between retries]';

WHEN job_current_execution_status = 4 THEN
iideventtype_current_status := 72;
descrip_current_status := descrip||' [Idle]';

WHEN job_current_execution_status = 5 THEN
iideventtype_current_status := 73;
descrip_current_status := descrip||' [Suspended]';

WHEN job_current_execution_status = 7 THEN
iideventtype_current_status := 74;
descrip_current_status := descrip||' [Performing completion actions]';


ELSE
iideventtype_current_status := 75;
descrip_current_status := descrip||' [???]';
END CASE;

BEGIN
-- Inserta el estado actual del JOB
INSERT INTO events(ideventtype, description, idaccount, zu) VALUES (iideventtype_current_status, descrip_current_status, iidaccount, izu);

  EXCEPTION WHEN unique_violation THEN
            -- do nothing, and loop to try the UPDATE again


END;

descrip := '<b>Equipo:</b> '||row_network_device.equipment||'</br> <b>IP:</b> '||row_network_device.ip::TEXT||'</br> '|| '<b>JOB: '||ijob_name||'</b>  </br> <b>Description:</b> '||ijob_description||'</br> <b>Next Run:</b> '||ijob_next_run::TEXT||'</br>';

CASE

WHEN last_run_outcome = 0 THEN
iideventtype_last_run_outcome := 29;
descrip := descrip||' <b>[Failed]</b>';

WHEN last_run_outcome = 1 THEN
iideventtype_last_run_outcome := 30;
descrip := descrip||' <b>[Succeeded]</b>';

WHEN last_run_outcome = 3 THEN
iideventtype_last_run_outcome := 31;
descrip := descrip||' <b>[Canceled]</b>';

WHEN last_run_outcome = 5 THEN
iideventtype_last_run_outcome := 32;
descrip := descrip||' <b>[Unknown]</b>';


ELSE
iideventtype_last_run_outcome := 0;
descrip := descrip||' <b>[???]</b>';

END CASE;



/*
switch($row["last_run_outcome"]){

	case 0:
		$ideventtype = 29;
		$description_event = $description_event." <b>[Failed]</b> ";
		$jobs_fail++;
	break;
	case 1:
		$ideventtype = 30;
		$description_event = $description_event." [Succeeded] ";
	break;
	case 3:
		$ideventtype = 31;
		$description_event = $description_event." [Canceled] ";
	break;
	case 5:
		$ideventtype = 32;
		$description_event = $description_event." [Unknown] ";
	break;
	default:
		$ideventtype = 0;
		$description_event = $description_event." [???] ";
	break;
}
*/

BEGIN

INSERT INTO events_jobs(
            dateevent, ideventtype, description, idaccount, 
            zu, job_name, job_enabled, job_description, job_date_create, 
            job_run_duration, job_run_status, job_next_run)
    VALUES (idateevent, iideventtype_last_run_outcome, descrip, iidaccount, 
            izu, ijob_name, ijob_enabled, ijob_description, ijob_date_create, 
            ijob_run_duration, last_run_outcome, ijob_next_run);


  EXCEPTION WHEN unique_violation THEN
            -- do nothing, and loop to try the UPDATE again
            END;

RETURN;
END;$_$;


ALTER FUNCTION public.fun_farma_event_insert_jobs(iidequipment bigint, idateevent timestamp without time zone, iidaccount bigint, last_run_outcome integer, job_current_execution_status integer, izu bigint, ijob_name text, ijob_enabled boolean, ijob_description text, ijob_date_create timestamp without time zone, ijob_run_duration integer, ijob_next_run timestamp without time zone, OUT ofun_return integer, OUT ofun_msg text) OWNER TO postgres;

--
-- TOC entry 330 (class 1255 OID 89932)
-- Name: fun_farma_event_insert_lista_precios(text, text, text, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_farma_event_insert_lista_precios(ioficina text, ilista_principal text, ilista_activa text, icantidad_productos integer) RETURNS boolean
    LANGUAGE plpgsql
    AS $$DECLARE  

Retorno boolean DEFAULT false;
iideventtype INTEGER DEFAULT 0;
idescription TEXT DEFAULT '----';
iidaccount INTEGER DEFAULT 0;
temp_descrip TEXT DEFAULT '-----';

BEGIN

iidaccount := fun_get_idaccount_by_account(ioficina, 1);

-- Revisa si la lista de precios es 0
IF icantidad_productos < 100 THEN
iideventtype := 54;
idescription := 'La lista de precios activa: <b>'||ilista_activa||'</b> tiene  <b>'||icantidad_productos::TEXT||'</b> productos.';
PERFORM fun_event_insert_by_ideventtype(now()::timestamp without time zone, iidaccount, 0, 0, iideventtype, idescription, 0);
END IF;

-- Revisa si la lista activa es igual a la lista principal
IF ilista_principal != ilista_activa THEN
iideventtype := 57;
idescription := 'La lista principal <b>['||ilista_principal||']</b> no es igual a la lista activa <b>['||ilista_activa||']</b>';
PERFORM fun_event_insert_by_ideventtype(now()::timestamp without time zone, iidaccount, 0, 0, iideventtype, idescription, 0);
END IF;


-- Revisa si la lista activa de productos ha cambiado
iideventtype := 55;
idescription := 'La lista activa de productos a cambiado a <b>'||ilista_activa||'</b>';
--SELECT description INTO temp_descrip FROM events WHERE ideventtype = iideventtype AND idaccount = iidaccount ORDER BY idevent DESC LIMIT 1;
temp_descrip:= COALESCE((SELECT description FROM events WHERE ideventtype = iideventtype AND idaccount = iidaccount ORDER BY idevent DESC LIMIT 1), '');
IF idescription != temp_descrip THEN
PERFORM fun_event_insert_by_ideventtype(now()::timestamp without time zone, iidaccount, 0, 0, iideventtype, idescription, 0);
END IF;

-- Revisa si la lista principal ha cambiado
iideventtype := 56;
idescription := 'La lista principal de productos a cambiado a <b>'||ilista_principal||'</b>';
temp_descrip:= COALESCE((SELECT description FROM events WHERE ideventtype = iideventtype AND idaccount = iidaccount ORDER BY idevent DESC LIMIT 1), '');
--SELECT description INTO temp_descrip FROM events WHERE ideventtype = iideventtype AND idaccount = iidaccount ORDER BY idevent DESC LIMIT 1;
IF idescription != temp_descrip THEN
PERFORM fun_event_insert_by_ideventtype(now()::timestamp without time zone, iidaccount, 0, 0, iideventtype, idescription, 0);
END IF;



RETURN Retorno; 
END;$$;


ALTER FUNCTION public.fun_farma_event_insert_lista_precios(ioficina text, ilista_principal text, ilista_activa text, icantidad_productos integer) OWNER TO postgres;

--
-- TOC entry 331 (class 1255 OID 89933)
-- Name: fun_farma_event_insert_sqlserver_uptime(bigint, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_farma_event_insert_sqlserver_uptime(iidaccount bigint, iuptime integer) RETURNS bigint
    LANGUAGE plpgsql
    AS $$DECLARE

--R INTEGER DEFAULT 0;
last_uptime REAL DEFAULT -100.1;
limit_uptime REAL DEFAULT 14.0; 
iideventtype BIGINT DEFAULT 0;
idescrip TEXT DEFAULT '';
days_uptime REAL DEFAULT -1.1;


BEGIN

last_uptime := COALESCE((SELECT uptime FROM events_device_uptime WHERE idaccount = iidaccount ORDER BY idevent DESC LIMIT 1), -1);

days_uptime := round((iuptime / 1440.0), 1);

--idescrip :=  '<b>Servidor encendido</b>  desde hace <b>'||iuptime::text||' minutos. o sea '||days_uptime::text||' dias</b> ';
idescrip :=  '<b>Servidor encendido</b>  desde hace <b>'||days_uptime::text||' días</b> ';

CASE 

WHEN days_uptime >= limit_uptime THEN
iideventtype := 59;

WHEN days_uptime < limit_uptime THEN
iideventtype := 58;

ELSE

END CASE;



IF (last_uptime != days_uptime) AND iideventtype > 0 THEN
INSERT INTO events_device_uptime(
            ideventtype, description, idaccount, uptime)
    VALUES (iideventtype, idescrip, iidaccount, days_uptime);
END IF;

--END IF;

RETURN iidaccount;
END;$$;


ALTER FUNCTION public.fun_farma_event_insert_sqlserver_uptime(iidaccount bigint, iuptime integer) OWNER TO postgres;

--
-- TOC entry 3966 (class 0 OID 0)
-- Dependencies: 331
-- Name: FUNCTION fun_farma_event_insert_sqlserver_uptime(iidaccount bigint, iuptime integer); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION fun_farma_event_insert_sqlserver_uptime(iidaccount bigint, iuptime integer) IS 'El parametro de entrada es en minutos';


--
-- TOC entry 332 (class 1255 OID 89934)
-- Name: fun_farma_event_insert_statusdb_account(bigint, bigint, text, bigint, integer, text, real, real); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_farma_event_insert_statusdb_account(iidequipment bigint, iidaccount bigint, inamedb text, izu bigint, istatus integer, istate_des text, idbfilesize real, idblogsize real, OUT ofun_return integer, OUT ofun_msg text) RETURNS record
    LANGUAGE plpgsql
    AS $$DECLARE

--iidaccount INTEGER DEFAULT 1;
iideventtype INTEGER DEFAULT 0;
--idescrip_logsize TEXT DEFAULT '';
--idescrip_dbsize TEXT DEFAULT '';
idescrip TEXT DEFAULT '';
--duplicado BOOLEAN DEFAULT FALSE;
max_size_log INTEGER DEFAULT 2000;
max_size_db INTEGER DEFAULT 15000;
row_network_device view_account_network_devices%ROWTYPE;
equip TEXT DEFAULT '';

BEGIN

 SELECT * INTO row_network_device FROM view_account_network_devices WHERE idequipment = iidequipment;

equip := '<b>Equipo:</b> '||row_network_device.equipment||'</br> <b>IP:</b> '||row_network_device.ip||'</br> ';



-- // BLOQUE DE ESTADOS //--
idescrip  := equip||'<b>Data Base:</b> '||inamedb||'</br><b> Status:</b> '||istate_des;
CASE

WHEN istatus = 0 THEN
-- ONLINE 
iideventtype := 34;

WHEN istatus = 1 THEN
-- RESTORING 
iideventtype := 35;

WHEN istatus = 2 THEN
-- RECOVERING
iideventtype := 36;

WHEN istatus = 3 THEN
-- RECOVERING PENDING
iideventtype := 38;

WHEN istatus = 4 THEN
-- SUSPECT
iideventtype := 33;

WHEN istatus = 5 THEN
-- EMERGENCY
iideventtype := 44;

WHEN istatus = 6 THEN
-- OFFLINE
iideventtype := 45;

WHEN istatus = 7 THEN
-- COPYING
iideventtype := 46;

ELSE

END CASE;



INSERT INTO events(
            ideventtype, description, idaccount, zu)
    VALUES (iideventtype, idescrip, iidaccount, izu);




-- // BLOQUE DE TAMAÑO LOGS //--
-- limite establecido para los logs
IF idblogsize > max_size_log THEN
iideventtype := 47;
idescrip  := equip||'<b>Data Base:</b> '||inamedb||'</br><b> Log Size:</b> '||idblogsize::text||' MB </br>Exceeds the maximum size set to '||max_size_log||' MB';
ELSE
iideventtype := 61;
idescrip  := equip||'<b>Data Base:</b> '||inamedb||'</br><b> Log Size:</b> '||idblogsize::text||' MB';
END IF;


INSERT INTO events_dbsizes(
            ideventtype, description, idaccount, zu,
            db_name, db_size, db_type)
    VALUES (iideventtype, idescrip, iidaccount, izu,
            inamedb, idblogsize, 1);








IF idbfilesize > max_size_db THEN
iideventtype := 48;
idescrip  := equip||'<b>Data Base:</b> '||inamedb||'</br><b> Size:</b> '||idbfilesize::text||' MB </br>Exceeds the maximum size set to '||max_size_db||' MB';
ELSE
iideventtype := 60;
idescrip  := equip||'<b>Data Base:</b> '||inamedb||'</br><b> Size:</b> '||idbfilesize::text||' MB';
END IF;


INSERT INTO events_dbsizes(
            ideventtype, description, idaccount, zu,
            db_name, db_size, db_type)
    VALUES (iideventtype, idescrip, iidaccount, izu,
            inamedb, idbfilesize, 0);





RETURN;
END;$$;


ALTER FUNCTION public.fun_farma_event_insert_statusdb_account(iidequipment bigint, iidaccount bigint, inamedb text, izu bigint, istatus integer, istate_des text, idbfilesize real, idblogsize real, OUT ofun_return integer, OUT ofun_msg text) OWNER TO postgres;

--
-- TOC entry 333 (class 1255 OID 89935)
-- Name: fun_farma_import_accounts(text, text, text, text, text, timestamp without time zone, timestamp without time zone, text, text, text, text, text, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_farma_import_accounts(istatus text, franquicia text, ilast_name text, iaddress text, iaddress_ref text, istart_date timestamp without time zone, iend_date timestamp without time zone, iaccount text, idb_user text, idb_pwd text, telf1 text, telf2 text, iemail text, cedula_sup_operativo text, OUT fun_return integer, OUT fun_msg text) RETURNS record
    LANGUAGE plpgsql
    AS $$DECLARE
id BIGINT DEFAULT 0;
ienabled BOOLEAN DEFAULT TRUE;
idldf INTEGER DEFAULT 0;
ifirst_name text default '';
iidaccounttype INTEGER DEFAULT 0;

ifname text default '';
ilname text default '';

BEGIN

fun_return := -100;
fun_msg := 'Error desconocido';
id := fun_get_idaccount_by_account(iaccount, 1);
idldf := COALESCE((SELECT idcontact FROM contacts WHERE identification = cedula_sup_operativo LIMIT 1), 0);

CASE
WHEN position('MEDI ' in ilast_name) = 1 THEN
ifname := substring(ilast_name from 6 for 100);
ilname := 'MEDI';

WHEN position('ECO ' in ilast_name) = 1 THEN
ifname := substring(ilast_name from 5 for 100);
ilname := 'ECO';

WHEN position('PAF ' in ilast_name) = 1 THEN
ifname := substring(ilast_name from 5 for 100);
ilname := 'PAF';

ELSE

ifname := ' *';
ilname := ilast_name;

END CASE;

IF istatus != 'A' THEN
ienabled := FALSE;
END IF;

IF franquicia = 'N' THEN
iidaccounttype := 3;
ELSE
iidaccounttype := 4;
END IF;

RAISE NOTICE 'Account (%) con ID (%)', iaccount, id;

-- Para este caso ilast_name se lo utiliza como nombre y * como apellido

CASE

	WHEN id <= 1 THEN
	BEGIN

-- Verificamos que no se repita el abonado
	iaccount := fun_account_auto_account(iaccount);

-- Ingresamos un nuevo registro
INSERT INTO accounts(
            enabled, first_name, last_name, birthday, identification, 
            address, address_ref, 
            start_date, end_date, account, idaccounttype, iddivision)
    VALUES (ienabled,  ilname, ifname, istart_date, iaccount, 
            iaddress, iaddress_ref, 
            istart_date, iend_date, iaccount, iidaccounttype, 1)
 RETURNING idcontact INTO fun_return;
fun_msg := 'Nuevo registro insertado';

IF fun_return > 0 THEN

PERFORM fun_farma_import_accounts_insertphone(fun_return, telf1);
PERFORM fun_farma_import_accounts_insertphone(fun_return, telf2);
PERFORM fun_farma_import_accounts_insertemail(fun_return, iemail);

DELETE FROM account_contacts WHERE appointment = 'Farma_LDF' AND idaccount = fun_return;
IF idldf > 0 THEN
INSERT INTO account_contacts (idaccount, idcontact, appointment, priority) VALUES (fun_return, idldf, 'Farma_LDF', 2);
END IF;

END IF;

fun_msg := fun_return;

EXCEPTION WHEN unique_violation THEN
 -- do nothing
 fun_return := -2;
 fun_msg := 'Registro tiene campos que deben ser unicos'||iaccount||' '||ilast_name||' '||iaccount;
END;


	WHEN id > 1  THEN
BEGIN	
-- Actualizamos
RAISE NOTICE 'Account (%) con ID (%) para actualizar cuenta', iaccount, id;
UPDATE accounts
   SET iddivision = 1, first_name=ifname, last_name=ilname, birthday=istart_date, 
       identification=iaccount, address=iaddress, address_ref=iaddress_ref, start_date=istart_date, end_date=iend_date, account=iaccount, idaccounttype = iidaccounttype
 WHERE idcontact = id;
 fun_return := id;
 fun_msg := 'Registro Actualizado';
RAISE NOTICE 'Account (%) con ID (%) para actualizar telefonos', iaccount, id;

PERFORM fun_farma_import_accounts_insertphone(id, telf1);
PERFORM fun_farma_import_accounts_insertphone(id, telf2);
PERFORM fun_farma_import_accounts_insertemail(id, iemail);

RAISE NOTICE 'Account (%) con ID (%) para actualizar - Eliminamos el LDF', iaccount, id;
DELETE FROM account_contacts WHERE appointment = 'Farma_LDF' AND idaccount = id;

RAISE NOTICE 'Account (%) con ID (%) para actualizar ldf', iaccount, id;
IF idldf > 0 THEN
INSERT INTO account_contacts (idaccount, idcontact, appointment, priority) VALUES (id, idldf, 'Farma_LDF', 2);
END IF;

/*
RAISE NOTICE 'Account (%) con ID (%) para actualizar datos del servidor (% => %)', iaccount, id, idb_user, idb_pwd;
-- Actualizamos los datos del servidor
UPDATE network_devices
   SET username=idb_user, pwd=idb_pwd WHERE idaccount=id AND equipment='Server' AND mark='Farma01';
        IF NOT found THEN

IF id > 0 THEN
RAISE NOTICE 'Account (%) con ID (%) para actualizar / Datos del servidor no encontrados, se inserta.', iaccount, id;        
INSERT INTO network_devices(
            equipment, mark, description, 
            username, pwd, idaccount)
    VALUES ('Server', 'Farma01', 'Servidor de farmacia Nueva '||id::text, 
            idb_user, idb_pwd, fun_return);
END IF;
        END IF;
*/
 /*
-- Actualizamos los datos del gateway
UPDATE network_devices
   SET note = 'No modificar esta nota' WHERE idaccount=fun_return AND equipment='Gateway';
        IF NOT found THEN
IF fun_return > 0 THEN
INSERT INTO network_devices(
            equipment, description, idaccount, note)
    VALUES ('Gateway', 'Gateway de farmacia '||fun_return::text, 
            fun_return, 'No modificar o borrar esta nota');
END IF;
        END IF;
*/

fun_msg := id;

 EXCEPTION WHEN unique_violation THEN
 -- do nothing
 fun_return := -3;
 fun_msg := 'Registro tiene campos que deben ser unicos id='||id::TEXT||' '||iaccount||' '||ilast_name||;
 
END;




	WHEN id < 0  THEN
-- Eliminamos
/*DELETE FROM accounts
 WHERE idcontact=id;
 fun_return := 0;
 fun_msg := 'Registro Eliminado';*/

ELSE

 END CASE;


RETURN;
END;$$;


ALTER FUNCTION public.fun_farma_import_accounts(istatus text, franquicia text, ilast_name text, iaddress text, iaddress_ref text, istart_date timestamp without time zone, iend_date timestamp without time zone, iaccount text, idb_user text, idb_pwd text, telf1 text, telf2 text, iemail text, cedula_sup_operativo text, OUT fun_return integer, OUT fun_msg text) OWNER TO postgres;

--
-- TOC entry 334 (class 1255 OID 89937)
-- Name: fun_farma_import_accounts_insertemail(bigint, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_farma_import_accounts_insertemail(iidcontact bigint, iemail text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$BEGIN

INSERT INTO emails (idcontact, email) VALUES (iidcontact, iemail);
RETURN true;
 EXCEPTION WHEN unique_violation THEN
 -- do nothing
 --fun_msg := 'El numero '||inumber::TEXT||' ya existe para el contacto '||idcontact::text;

RETURN false;
END;
$$;


ALTER FUNCTION public.fun_farma_import_accounts_insertemail(iidcontact bigint, iemail text) OWNER TO postgres;

--
-- TOC entry 335 (class 1255 OID 89938)
-- Name: fun_farma_import_accounts_insertphone(bigint, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_farma_import_accounts_insertphone(iidcontact bigint, inumber text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$BEGIN

INSERT INTO phones (idcontact, number) VALUES (iidcontact, inumber);
return true;
 EXCEPTION WHEN unique_violation THEN
 -- do nothing
 --fun_msg := 'El numero '||inumber::TEXT||' ya existe para el contacto '||idcontact::text;

RETURN false;
END;
$$;


ALTER FUNCTION public.fun_farma_import_accounts_insertphone(iidcontact bigint, inumber text) OWNER TO postgres;

--
-- TOC entry 3967 (class 0 OID 0)
-- Dependencies: 335
-- Name: FUNCTION fun_farma_import_accounts_insertphone(iidcontact bigint, inumber text); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION fun_farma_import_accounts_insertphone(iidcontact bigint, inumber text) IS 'Funcion de apoyo para importar datos de telefonos de la cuenta';


--
-- TOC entry 336 (class 1255 OID 89939)
-- Name: fun_farma_import_asig_personal_farma(text, text, text, text, boolean, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_farma_import_asig_personal_farma(cedula text, nombrecorto text, pwd text, perfil_referencia text, estado boolean, oficina text, OUT fun_return integer, OUT fun_msg text) RETURNS record
    LANGUAGE plpgsql
    AS $$DECLARE

iidaccount INTEGER;
iidcontact INTEGER;
ipriority INTEGER DEFAULT 5;


BEGIN

fun_return := -100;
fun_msg := 'Error desconocido';


-- Buscamos el idcontact segun la cedula
SELECT idcontact INTO iidcontact FROM contacts WHERE identification = cedula;

IF perfil_referencia LIKE 'PVAdm%' THEN
ipriority := 3;
END IF;


-- Buscamos el idaccount segun la oficina
--iidaccount := fun_get_idaccount_by_account(oficina);
--iidaccount := fun_get_idaccount_by_account(oficina, 1);
iidaccount := fun_get_idaccount_by_account(oficina, 1);

IF iidaccount IS NOT NULL AND iidcontact IS NOT NULL THEN

INSERT INTO account_users(
            idaccount, idcontact, appointment, note, account_user, account_pwd, date_end, enabled, priority)
    VALUES (iidaccount, iidcontact, 'farma_'||perfil_referencia::TEXT, 'Usuario asignado por Farmaenlace, no modificar el appointment', nombrecorto, pwd, '2050-01-01 00:00', estado, ipriority) RETURNING idaccountuser INTO fun_return;

 fun_msg := 'Registro insertado';
ELSE

fun_return := -1;
 fun_msg := 'El registro no pudo ser insertado, idaccount e idcontact no pueden ser nulos';
END IF;


 



RETURN;
END;$$;


ALTER FUNCTION public.fun_farma_import_asig_personal_farma(cedula text, nombrecorto text, pwd text, perfil_referencia text, estado boolean, oficina text, OUT fun_return integer, OUT fun_msg text) OWNER TO postgres;

--
-- TOC entry 337 (class 1255 OID 89940)
-- Name: fun_farma_import_nomina(text, text, timestamp without time zone, text, integer, text, text, text, text, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_farma_import_nomina(ifirst_name text, ilast_name text, ibirthday timestamp without time zone, iidentification text, igender integer, inote text, iaddress text, iaddress_ref text, itelf1 text, itelf2 text, iemail text, OUT fun_return integer, OUT fun_msg text) RETURNS record
    LANGUAGE plpgsql
    AS $$DECLARE


BEGIN

fun_return := -100;
fun_msg := 'Error desconocido';

UPDATE contacts
   SET first_name=ifirst_name, last_name=ilast_name, birthday=ibirthday, 
       gender=igender, note=inote, address=iaddress, address_ref=iaddress_ref WHERE identification=iidentification;

fun_return := 999;
fun_msg := 'Registro actualizado';

        IF NOT found THEN
INSERT INTO contacts(
            first_name, last_name, birthday, identification, 
            gender,  note, address, address_ref)
    VALUES (ifirst_name, ilast_name, ibirthday, iidentification, 
            igender,  inote, iaddress, iaddress_ref) RETURNING idcontact INTO fun_return;
--fun_return := -100;
fun_msg := 'Nuevo registro insertado';
ELSE

fun_return := (SELECT idcontact FROM contacts WHERE identification=iidentification AND first_name=ifirst_name AND last_name=ilast_name LIMIT 1);

        END IF;

PERFORM fun_farma_import_nomina_telf(fun_return, itelf1);
PERFORM fun_farma_import_nomina_telf(fun_return, itelf2);
PERFORM fun_farma_import_nomina_email(fun_return, iemail);
 
 EXCEPTION WHEN unique_violation THEN
 -- do nothing
 fun_return := -3;
 fun_msg := 'Registro tiene campos que deben ser unicos id='||iidentification::TEXT;

RETURN;
END;$$;


ALTER FUNCTION public.fun_farma_import_nomina(ifirst_name text, ilast_name text, ibirthday timestamp without time zone, iidentification text, igender integer, inote text, iaddress text, iaddress_ref text, itelf1 text, itelf2 text, iemail text, OUT fun_return integer, OUT fun_msg text) OWNER TO postgres;

--
-- TOC entry 338 (class 1255 OID 89941)
-- Name: fun_farma_import_nomina_email(integer, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_farma_import_nomina_email(iidcontact integer, iemail text, OUT fun_return integer, OUT fun_msg text) RETURNS record
    LANGUAGE plpgsql
    AS $$DECLARE

iidemail INTEGER DEFAULT 0;

BEGIN

fun_return := -100;
fun_msg := 'Error desconocido';

SELECT idemail INTO iidemail FROM emails WHERE email = iemail;

-- 
UPDATE emails
   SET idcontact=iidcontact WHERE idemail = iidemail;

fun_return := 999;
fun_msg := 'Registro actualizado';

        IF NOT found THEN
INSERT INTO emails(
            idcontact, email)
    VALUES (iidcontact, iemail) RETURNING idemail INTO fun_return;
--fun_return := -100;
fun_msg := 'Nuevo registro insertado';
        END IF;
 

RETURN;
END;$$;


ALTER FUNCTION public.fun_farma_import_nomina_email(iidcontact integer, iemail text, OUT fun_return integer, OUT fun_msg text) OWNER TO postgres;

--
-- TOC entry 339 (class 1255 OID 89942)
-- Name: fun_farma_import_nomina_telf(integer, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_farma_import_nomina_telf(iidcontact integer, itelf text, OUT fun_return integer, OUT fun_msg text) RETURNS record
    LANGUAGE plpgsql
    AS $$DECLARE

iidphone INTEGER DEFAULT 0;

BEGIN

fun_return := -100;
fun_msg := 'Error desconocido';

SELECT idphone INTO iidphone FROM phones WHERE "number" = itelf;

-- 
UPDATE phones
   SET idcontact=iidcontact WHERE idphone = iidphone;

fun_return := 999;
fun_msg := 'Registro actualizado';

        IF NOT found THEN
INSERT INTO phones(
            idcontact, "number")
    VALUES (iidcontact, itelf) RETURNING idphone INTO fun_return;
--fun_return := -100;
fun_msg := 'Nuevo registro insertado';
        END IF;
 

RETURN;
END;$$;


ALTER FUNCTION public.fun_farma_import_nomina_telf(iidcontact integer, itelf text, OUT fun_return integer, OUT fun_msg text) OWNER TO postgres;

--
-- TOC entry 340 (class 1255 OID 89943)
-- Name: fun_farma_import_tec(text, text, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_farma_import_tec(ifirst_name text, ilast_name text, iidentification text, itype text, OUT fun_return integer, OUT fun_msg text) RETURNS record
    LANGUAGE plpgsql
    AS $$DECLARE
isadmin BOOLEAN DEFAULT false;

BEGIN

fun_return := -100;
fun_msg := 'Error desconocido';

IF LENGTH(itype) > 0 THEN
isadmin  := true;
END IF;

UPDATE contacts SET first_name=ifirst_name, last_name=ilast_name,  is_admin=isadmin WHERE identification=iidentification;

fun_return := 999;
fun_msg := 'Registro actualizado';

        IF NOT found THEN
INSERT INTO contacts(
            first_name, last_name, identification, 
            is_admin, admin_end, admin_username, admin_pwd)
    VALUES (ifirst_name, ilast_name, iidentification, 
            isadmin, '2050-01-01 23:59'::timestamp without time zone, iidentification, md5(iidentification)) RETURNING idcontact INTO fun_return;
--fun_return := -100;
fun_msg := 'Nuevo registro insertado';
        END IF;
 
 EXCEPTION WHEN unique_violation THEN
 -- do nothing
 fun_return := -3;
 fun_msg := 'Registro tiene campos que deben ser unicos id='||iidentification::TEXT;

RETURN;
END;$$;


ALTER FUNCTION public.fun_farma_import_tec(ifirst_name text, ilast_name text, iidentification text, itype text, OUT fun_return integer, OUT fun_msg text) OWNER TO postgres;

--
-- TOC entry 341 (class 1255 OID 89944)
-- Name: fun_farma_import_tec_asig(text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_farma_import_tec_asig(iidentification text, ioficina text, OUT fun_return integer, OUT fun_msg text) RETURNS record
    LANGUAGE plpgsql
    AS $$DECLARE

idtec INTEGER DEFAULT 0;
idofi INTEGER DEFAULT 0;

BEGIN

fun_return := -100;
fun_msg := 'Error desconocido';

SELECT  idcontact INTO idtec FROM view_admins WHERE identification = iidentification;
SELECT  idcontact INTO idofi FROM accounts WHERE account = ioficina AND iddivision = 1;

IF idtec > 0 AND idofi > 0 THEN

--assigned
--DELETE FROM account_contacts WHERE idaccount = idofi AND appointment = 'Técnico Responsable';

INSERT INTO account_contacts(
            idaccount, idcontact, appointment, priority, 
            note)
    VALUES (idofi, idtec, 'Técnico Responsable', 1, 
            'Importado desde el servidor 159 [EasyGestionEmpresarial].[dbo].[SP_PAR_AsignacionFarmacias]') RETURNING idaccountuser INTO fun_return;
 

 --fun_return := -3;
 fun_msg := 'Registro insertado';

END IF;



RETURN;
END;$$;


ALTER FUNCTION public.fun_farma_import_tec_asig(iidentification text, ioficina text, OUT fun_return integer, OUT fun_msg text) OWNER TO postgres;

--
-- TOC entry 342 (class 1255 OID 89945)
-- Name: fun_farma_update_lista_precios_farmacias(integer, text, text, integer, text, text, integer, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_farma_update_lista_precios_farmacias(iidaccount integer, iprincipal text, iactiva text, iproductos integer, i159principal text, i159activa text, i159productos integer, iprovincia text, OUT fun_return integer, OUT fun_msg text) RETURNS record
    LANGUAGE plpgsql
    AS $$DECLARE

istatus TEXT DEFAULT 'INDEFINIDO';
isincro TEXT DEFAULT 'INDEFINIDO';
iip INET;

BEGIN

fun_return := -100;
fun_msg := 'Error desconocido';

IF (iprincipal = iactiva)  AND  iproductos > 0 THEN
istatus := 'OK';
ELSE
istatus := 'ERROR';
END IF;

IF iprincipal = i159principal AND iactiva = i159activa  THEN
--IF EXISTS(SELECT * FROM farma_lista_precios_farmacias WHERE idaccount=iidaccount AND srv159_activa = activa AND productos = srv159_productos AND srv159_principal = principal)  THEN
isincro := 'OK';
ELSE
isincro := 'ERROR';
END IF;

select ip INTO iip from view_account_network_devices where idcontact = iidaccount AND  equipment ILIKE '%SQL%' LIMIT 1;

RAISE NOTICE '(%) (%) ', iprincipal, iactiva;
RAISE NOTICE '(%) (%) ', i159principal, i159activa;


--
UPDATE farma_lista_precios_farmacias
SET principal=iprincipal, 
activa=iactiva, 
productos=iproductos,
srv159_principal=i159principal, 
srv159_activa=i159activa, 
srv159_productos=i159productos, 

status = istatus,
sincronizado = isincro, 
ip = iip::text, 
provincia = iprovincia,
ts_lista_farmacia = now(),   
ts_lista_srv159 = now()
 WHERE idaccount=iidaccount;

RAISE NOTICE '(%) (%) ', iprincipal, iactiva;
RAISE NOTICE '(%) (%) ', i159principal, i159activa;

fun_return := 1;
fun_msg := 'Registro actualizado';

        IF NOT found THEN
/*
INSERT INTO farma_lista_precios_farmacias(
            idaccount, principal, activa, productos, status, sincronizado, ts_lista_farmacia, ip)
    VALUES (iidaccount, iprincipal, iactiva, iproductos, istatus, isincro, now(), iip::text) RETURNING idlista_precios INTO fun_return;
*/
INSERT INTO farma_lista_precios_farmacias(
            idaccount, principal, activa, productos, status, 
            ts, ts_lista_farmacia, srv159_activa, srv159_productos, srv159_principal, 
            ts_lista_srv159, sincronizado, provincia, ip)
    VALUES (iidaccount, iprincipal, iactiva, iproductos, istatus, 
           now(), now(), i159activa, i159productos, i159principal, 
            now(), isincro, iprovincia, iip);
fun_msg := 'Nuevo registro insertado';
        END IF;
 

RETURN;
END;$$;


ALTER FUNCTION public.fun_farma_update_lista_precios_farmacias(iidaccount integer, iprincipal text, iactiva text, iproductos integer, i159principal text, i159activa text, i159productos integer, iprovincia text, OUT fun_return integer, OUT fun_msg text) OWNER TO postgres;

--
-- TOC entry 343 (class 1255 OID 89946)
-- Name: fun_farma_update_lista_precios_srv159(text, text, text, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_farma_update_lista_precios_srv159(account text, iprincipal text, iactiva text, iproductos integer, OUT fun_return integer, OUT fun_msg text) RETURNS record
    LANGUAGE plpgsql
    AS $$DECLARE

istatus TEXT DEFAULT 'INDEFINIDO';

BEGIN

fun_return := -100;
fun_msg := 'Error desconocido';

IF (iprincipal = iactiva)  AND  iproductos > 0 THEN
istatus := 'OK';
ELSE
istatus := 'ERROR';
END IF;

-- 
UPDATE farma_lista_precios_farmacias
   SET principal=iprincipal, activa=iactiva, productos=iproductos, status = istatus
 WHERE idaccount=iidaccount;

fun_return := 1;
fun_msg := 'Registro actualizado';

        IF NOT found THEN
INSERT INTO farma_lista_precios_farmacias(
            idaccount, principal, activa, productos, status)
    VALUES (iidaccount, iprincipal, iactiva, iproductos, istatus) RETURNING idlista_precios INTO fun_return;
--fun_return := -100;
fun_msg := 'Nuevo registro insertado';
        END IF;
 

RETURN;
END;$$;


ALTER FUNCTION public.fun_farma_update_lista_precios_srv159(account text, iprincipal text, iactiva text, iproductos integer, OUT fun_return integer, OUT fun_msg text) OWNER TO postgres;

--
-- TOC entry 345 (class 1255 OID 89947)
-- Name: fun_firts_load(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_firts_load(OUT fun_return integer, OUT fun_msg text) RETURNS record
    LANGUAGE plpgsql
    AS $$DECLARE

BEGIN

fun_return := 0;
fun_msg := 'Carga inicial completada';

-- Insertamos el registro 0 si no existe
IF NOT EXISTS(SELECT * FROM identification_types WHERE ididtype = 0) THEN
INSERT INTO identification_types(
            ididtype, enabled, name, note)
    VALUES (0, true, 'Undefined', 'Valor inicial del sistema (No modificar)');
END IF;

-- Insertamos el registro 0 si no existe
IF NOT EXISTS(SELECT * FROM account_types WHERE idaccounttype = 0) THEN
INSERT INTO account_types(
            idaccounttype, type, note)
    VALUES (0, 'Undefined', 'Valor inicial del sistema (No modificar)');

END IF;

-- Insertamos el registro 0 si no existe
IF NOT EXISTS(SELECT * FROM account_states WHERE idaccountstate = 0) THEN
INSERT INTO account_states(
            idaccountstate, state, note)
    VALUES (0, 'Undefined', 'Valor inicial del sistema (No modificar)');
END IF;


-- Insertamos el registro 0 si no existe
IF NOT EXISTS(SELECT * FROM groups WHERE idgroup = 0) THEN
INSERT INTO groups(
            idgroup, enabled, name, description, note)
    VALUES (0, true, 'None', 'Ningun grupo establecido', 'Valor inicial del sistema (No modificar)');
END IF;


-- Insertamos el registro -1 si no existe
IF NOT EXISTS(SELECT * FROM groups WHERE idgroup = -1) THEN
INSERT INTO groups(
            idgroup, enabled, name, description, note)
    VALUES (-1, true, 'oams_admin', 'Admins', 'Grupo de Administradores');
END IF;


-- Insertamos el registro 0 si no existe
IF NOT EXISTS(SELECT * FROM phone_types WHERE idphonetype = 0) THEN
INSERT INTO phone_types(
            idphonetype, type)
    VALUES (0, 'Undefined');
END IF;

-- Insertamos el registro 0 si no existe
IF NOT EXISTS(SELECT * FROM eventtypes WHERE ideventtype = 0) THEN
INSERT INTO eventtypes(
            ideventtype, name, priority, treatment, manual, date_editable, note, label, code)
    VALUES (0, 'unknown', 50, true, false, false, 'Valor inicial del sistema (No modificar)', 'Evento Desconocido', 'oams-0');
END IF;

----------------------------------------------------------------------
-- Insertamos el registro 1000 si no existe
IF NOT EXISTS(SELECT * FROM eventtypes WHERE ideventtype = 1000) THEN
INSERT INTO eventtypes(
            ideventtype, name, priority, treatment, manual, date_editable, note, label, code)
    VALUES (1000, 'login', 100, false, false, false, 'Evento del sistema, no modificar', 'User Login', 'oams-1000');
END IF;

-- Insertamos el registro 1001 si no existe
IF NOT EXISTS(SELECT * FROM eventtypes WHERE ideventtype = 1001) THEN
INSERT INTO eventtypes(
            ideventtype, name, priority, treatment, manual, date_editable, note, label, code)
    VALUES (1001, 'logout', 100, false, false, false, 'Evento del sistema, no modificar', 'User Logout', 'oams-1001');
END IF;

-- Insertamos el registro 1002 si no existe
IF NOT EXISTS(SELECT * FROM eventtypes WHERE ideventtype = 1002) THEN
INSERT INTO eventtypes(
            ideventtype, name, priority, treatment, manual, date_editable, note, label, code)
    VALUES (1002, 'login fail', 20, false, false, false, 'Evento del sistema, no modificar', 'Login fail', 'oams-1002');
END IF;

-- Insertamos el registro 1003 si no existe
IF NOT EXISTS(SELECT * FROM eventtypes WHERE ideventtype = 1003) THEN
INSERT INTO eventtypes(
            ideventtype, name, priority, treatment, manual, date_editable, note, label, code)
    VALUES (1003, 'account_unknown', 20, false, false, false, 'Evento del sistema, no modificar', '"account_unknown"', 'oams-1003');
END IF;


-- Insertamos el registro 1003 si no existe
IF NOT EXISTS(SELECT * FROM eventtypes WHERE ideventtype = 1004) THEN
INSERT INTO eventtypes(
            ideventtype, name, priority, treatment, manual, date_editable, note, label, code)
    VALUES (1004, 'Unauthorized', 10, false, false, false, 'Evento del sistema, no modificar', '"System Unauthorized Access"', 'oams-1004');
END IF;

---------------------------------------------------------------
-- Insertamos el abonado 0 si no existe
IF NOT EXISTS(SELECT * FROM accounts WHERE idcontact = 0) THEN
INSERT INTO accounts(
            idcontact, enabled, first_name, last_name, birthday, identification, 
            ididtype, postal_code, gender, geox, geoy, note, address, address_ref, 
            idaccountstate, idaccounttype, start_date, end_date, account)
    VALUES (0, true, 'AMS', 'Open', now(), md5('oams'), 
            0, '0000', 0, 0, 0, '', '', '', 
            0, 0, now(), '2099-01-01 00:00', 'System');
END IF;

-- Insertamos el abonado 1 si no existe
IF NOT EXISTS(SELECT * FROM accounts WHERE idcontact = 1) THEN
INSERT INTO accounts(
            idcontact, enabled, first_name, last_name, birthday, identification, 
            ididtype, postal_code, gender, geox, geoy, note, address, address_ref, 
            idaccountstate, idaccounttype, start_date, end_date, account)
    VALUES (1, true, 'undefined', 'account', now(), md5('oams-undefined'), 
            0, '00000', 0, 0, 0, '', '', '', 
            0, 0, now(), '2099-01-01 00:00', 'undefined');
END IF;


-----------------------------------------------------------------
-- Insertamos el registro 0 si no existe
IF NOT EXISTS(SELECT * FROM providers WHERE idprovider = 0) THEN
INSERT INTO providers(
            idprovider, provider)
    VALUES (0, 'Undefined');
END IF;

----------------------------------------------------------------
-- Insertamos el registro 0 si no existe (Default) 
IF NOT EXISTS(SELECT * FROM contacts WHERE idcontact = -1) THEN
INSERT INTO contacts(
            idcontact, enabled, first_name, last_name, identification, 
            is_admin, admin_start, admin_end, admin_username, admin_pwd, 
            admin_level)
    VALUES (-1, true, 'Alarm Management System', 'Open', 'oams', 
            true, now(), '2050-01-01 00:00:00', 'admin', 'admin', 
            0);
END IF;



RETURN;
END;$$;


ALTER FUNCTION public.fun_firts_load(OUT fun_return integer, OUT fun_msg text) OWNER TO postgres;

--
-- TOC entry 346 (class 1255 OID 89948)
-- Name: fun_get_idaccount_by_account(text, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_get_idaccount_by_account(iaccount text, iiddivision bigint) RETURNS integer
    LANGUAGE plpgsql
    AS $$DECLARE

R INTEGER DEFAULT 1;

BEGIN

R := COALESCE((SELECT idcontact FROM accounts WHERE account = iaccount AND iddivision = iiddivision ORDER BY idcontact  DESC LIMIT 1), 1);

IF R < 2 THEN
-- Verificamos si existe el account, caso contrario le asignamos como 0 (desconocido)
--PERFORM fun_event_insert_by_ideventtype(now()::timestamp without time zone, R, 0, 0, 1003, 'Account '||iaccount||' no found', 0);
INSERT INTO events( ideventtype, description)
    VALUES (1003, 'Account '||iaccount||' no found');

--R := 1;
END IF;

RETURN R;
END;$$;


ALTER FUNCTION public.fun_get_idaccount_by_account(iaccount text, iiddivision bigint) OWNER TO postgres;

--
-- TOC entry 360 (class 1255 OID 89949)
-- Name: fun_login(text, text, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_login(iusername text, ipwd text, iuseragent text, iip text, OUT login boolean, OUT username text, OUT sessionid text, OUT fullname text, OUT idadmin bigint, OUT msg text) RETURNS record
    LANGUAGE plpgsql
    AS $$DECLARE

--Now timestamp without time zone default now();
idcontact_admin bigint DEFAULT -100;

BEGIN

idcontact_admin := -500;
login := false;
fullname := 'anonymous';
msg := 'Error desconocido';
username := 'anonymous';
sessionid := 'abcdefghijklmnopqrstuvwxyz0123456789';

CASE

WHEN NOT EXISTS(SELECT * FROM admins WHERE admin_username = iusername) THEN 
msg := '- Intento de acceso con el usuario '||iusername||' no existe o no esta habilitado como administrador.</br> [IP: '||iip||'] [Navegador: '||iuseragent||']';
INSERT INTO events(
            idaccount, ideventtype, description)
    VALUES (0, 1002, msg);


WHEN NOT EXISTS(SELECT * FROM admins WHERE admin_username = iusername AND admin_pwd = md5(ipwd)) THEN
msg := '- Intento de acceso con el usuario '||iusername||' - Usuario o clave incorrecta. [IP: '||iip||'] [Navegador: '||iuseragent||']';
INSERT INTO events(
            idaccount, ideventtype, description)
    VALUES (0, 1002, msg);

WHEN NOT EXISTS(SELECT * FROM admins WHERE admin_username = iusername AND admin_pwd = md5(ipwd) AND (now() BETWEEN admin_start AND admin_end)) THEN
msg := '- Intento de acceso del usuario '||iusername||' fuera del rango de fechas autorizadas para él. [IP: '||iip||'] [Navegador: '||iuseragent||']';
INSERT INTO events(
            idaccount, ideventtype, description)
    VALUES (0, 1002, msg);

WHEN EXISTS(SELECT * FROM admins WHERE admin_username = iusername AND admin_pwd = md5(ipwd)) THEN
-- Actualizamos el ssessionid en la tabla
UPDATE admins SET admin_sessionid = md5(iusername||'+'||iip||'+'||iuseragent||'+'||(extract(epoch FROM now())::TEXT)), admin_ip = iip WHERE admin_username = iusername AND admin_pwd = md5(ipwd) RETURNING admins.idadmin, admins.idcontact INTO idadmin, idcontact_admin;
-- Insertamos en el log del sistema el ingreso
msg := '- Acceso al sistema. Usuario: '||iusername||'. [IP: '||iip||'] [Navegador: '||iuseragent||']';


INSERT INTO events(
            idaccount, ideventtype, description)
    VALUES (0, 1000, msg);

SELECT admin_username, admin_sessionid INTO username, sessionid FROM admins WHERE idcontact = idcontact_admin;
SELECT (last_name||' '||first_name) as n INTO fullname FROM contacts WHERE idcontact = idcontact_admin;

login := true;


ELSE

msg := '- Ninguna validacion ha sido realizada para el usuario '||iusername||' no existe o no esta habilitado. [IP: '||iip||'] [Navegador: '||iuseragent||']';

INSERT INTO events(
            idaccount, ideventtype, description)
    VALUES (0, 1002, msg);

END CASE;



RETURN;
END;$$;


ALTER FUNCTION public.fun_login(iusername text, ipwd text, iuseragent text, iip text, OUT login boolean, OUT username text, OUT sessionid text, OUT fullname text, OUT idadmin bigint, OUT msg text) OWNER TO postgres;

--
-- TOC entry 358 (class 1255 OID 94492)
-- Name: fun_logout(bigint, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_logout(iidadmin bigint, isessionid text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$DECLARE

--Now timestamp without time zone default now();
R boolean DEFAULT FALSE;

BEGIN

UPDATE admins SET admin_sessionid = md5(to_char(current_timestamp, 'YYYY-MM/DD*HH24:MI:SS')) WHERE idadmin = iidadmin AND admin_sessionid = isessionid;
R := TRUE;
RETURN R;
END;$$;


ALTER FUNCTION public.fun_logout(iidadmin bigint, isessionid text) OWNER TO postgres;

--
-- TOC entry 347 (class 1255 OID 89951)
-- Name: fun_notification_insert_by_idadmin(integer, integer, boolean, text, text, text, text, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_notification_insert_by_idadmin(inurgency integer, intimeout integer, incloseable boolean, inimg text, insnd text, intitle text, inbody text, iidadmin integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$DECLARE

isessionid text default 'all';

BEGIN

isessionid := COALESCE((SELECT sessionid FROM admin WHERE idadmin = iidadmin limit 1), 'all');

RETURN fun_edit_notification(inurgency, intimeout, incloseable, inimg, insnd, intitle, inbody, isessionid);
END;$$;


ALTER FUNCTION public.fun_notification_insert_by_idadmin(inurgency integer, intimeout integer, incloseable boolean, inimg text, insnd text, intitle text, inbody text, iidadmin integer) OWNER TO postgres;

--
-- TOC entry 348 (class 1255 OID 89952)
-- Name: fun_oams_mapper(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_oams_mapper() RETURNS integer
    LANGUAGE plpgsql
    AS $$DECLARE

fun_return INTEGER DEFAULT 0;
cursor1 CURSOR FOR SELECT table_name, column_name, data_type, column_default from information_schema.columns where table_name NOT LIKE '%_20%' AND table_name NOT LIKE '%_19%' AND table_catalog = 'open_ams'  and table_schema = 'public' ORDER BY table_name, column_name, data_type;
    cursor1_row RECORD;

BEGIN


    FOR cursor1_row IN cursor1 LOOP
    
UPDATE oams_table_columns
   SET data_type=cursor1_row.data_type, column_default=cursor1_row.column_default
 WHERE table_name=cursor1_row.table_name AND column_name=cursor1_row.column_name;
        IF NOT found THEN
INSERT INTO oams_table_columns(
            table_name, column_name, data_type, column_default, 
            column_label)
    VALUES (cursor1_row.table_name, cursor1_row.column_name, cursor1_row.data_type, cursor1_row.column_default, 
            cursor1_row.column_name);
        END IF;


    END LOOP;

    

RETURN fun_return;
END;$$;


ALTER FUNCTION public.fun_oams_mapper() OWNER TO postgres;

--
-- TOC entry 349 (class 1255 OID 89953)
-- Name: fun_quick_create_account(integer, integer, text, text, text, text, integer, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_quick_create_account(iidaccountstate integer, iidaccounttype integer, iaccount text, ifirst_name text, ilast_name text, iidentification text, iididtype integer, iaddress text, iaddress_ref text, OUT fun_return integer, OUT fun_msg text) RETURNS record
    LANGUAGE plpgsql
    AS $$DECLARE

--iidcontact INTEGER DEFAULT 0;
--iidaccount INTEGER DEFAULT 0;

BEGIN
fun_msg := 'Ninguna accion realizada';
fun_return := 0;
  CASE

	WHEN EXISTS(SELECT * FROM accounts WHERE identification = iidentification AND ididtype = iididtype) THEN
		fun_msg := 'El numero de identificación ya existe';
	WHEN EXISTS(SELECT * FROM accounts WHERE first_name = ifirst_name AND last_name = ilast_name) THEN 
		fun_msg := 'Un abonado o contacto ya existe con esos nombres';
  ELSE

INSERT INTO accounts(
            first_name, last_name, identification, 
            ididtype, address, address_ref, 
            idaccountstate, idaccounttype, account)
    VALUES (ifirst_name, ilast_name, iidentification, 
            iididtype, iaddress, iaddress_ref, 
            iidaccountstate, iidaccounttype, iaccount) RETURNING idcontact INTO fun_return;

IF fun_return > 0 THEN
fun_msg := 'El abonado ha sido creado';
END IF;

  END CASE;          

RETURN;
END;$$;


ALTER FUNCTION public.fun_quick_create_account(iidaccountstate integer, iidaccounttype integer, iaccount text, ifirst_name text, ilast_name text, iidentification text, iididtype integer, iaddress text, iaddress_ref text, OUT fun_return integer, OUT fun_msg text) OWNER TO postgres;

--
-- TOC entry 344 (class 1255 OID 89954)
-- Name: fun_receiver_raid_reports(text, timestamp without time zone, text, text, text, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_receiver_raid_reports(ioficina text, ireceivetime timestamp without time zone, ihostname text, iproducttype text, idescription text, iline_file integer, OUT fun_return integer, OUT fun_msg text) RETURNS record
    LANGUAGE plpgsql
    AS $$DECLARE

descript text default '';
idaccount INTEGER DEFAULT 1;
ideventtype INTEGER DEFAULT 0;

BEGIN

-- Determinamos el ideventtype segun el texto de la descripcion
CASE

WHEN idescription LIKE 'Logical drive%goes critical%'  THEN
 ideventtype := 4;

WHEN idescription LIKE 'Port%unplugged%'  THEN
 ideventtype := 5;

wHEN idescription LIKE 'Port%down%'  THEN
 ideventtype := 6;
 
wHEN idescription LIKE 'Rebuild on logical drive%completed%'  THEN
 ideventtype := 11; 

wHEN idescription LIKE 'Rebuild on logical drive%started%'  THEN
 ideventtype := 12;

wHEN idescription LIKE 'Redundancy Check on logical drive%completed%'  THEN
 ideventtype := 13; 

wHEN idescription LIKE 'S.M.A.R.T threshold exceeded%'  THEN
 ideventtype := 14;

wHEN idescription LIKE 'Synchronization is requested to perform on the logical drive%that has never been initialized%'  THEN
 ideventtype := 17;

wHEN idescription LIKE 'Synchronization on logical drive%completed%'  THEN
 ideventtype := 18;

wHEN idescription LIKE '%disk error%'  THEN
 ideventtype := 19;

wHEN idescription LIKE '%timeout on port%'  THEN
 ideventtype := 20;

wHEN idescription LIKE '%Unknown Event%'  THEN
 ideventtype := 21;

END CASE;

SELECT account INTO ioficina FROM view_account_network_devices WHERE ip = ihostname::inet;

idaccount := fun_get_idaccount_by_account(ioficina::TEXT, 1);
descript := '<b>IP:</b> '||ihostname||'</br><b> Product Type:</b> '||iproducttype||'</br> '||idescription; 
--fun_event_insert_by_ideventtype(IN idateevent timestamp without time zone, IN iidaccount integer, IN izu integer, IN ipriority integer, IN iideventtype integer, IN idescription text, IN iidadmin integer, OUT fun_return integer, OUT fun_msg text)
--SELECT * FROM fun_event_insert_by_ideventtype(ireceivetime, idaccount, 0, 0, ideventtype, descript, 0) INTO fun_return, fun_msg;  
INSERT INTO events_raid(
            dateevent, idaccount, ideventtype, description, hostname, line_file)
    VALUES (ireceivetime, idaccount, ideventtype, descript, ihostname::inet, iline_file);

RETURN;
END;$$;


ALTER FUNCTION public.fun_receiver_raid_reports(ioficina text, ireceivetime timestamp without time zone, ihostname text, iproducttype text, idescription text, iline_file integer, OUT fun_return integer, OUT fun_msg text) OWNER TO postgres;

--
-- TOC entry 350 (class 1255 OID 89955)
-- Name: fun_remove_notifications_old(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_remove_notifications_old() RETURNS boolean
    LANGUAGE plpgsql
    AS $$BEGIN
DELETE FROM notification_area 
WHERE EXTRACT(EPOCH FROM (now() - ts) / 60) > 2;
RETURN TRUE;
END;
$$;


ALTER FUNCTION public.fun_remove_notifications_old() OWNER TO postgres;

--
-- TOC entry 351 (class 1255 OID 89956)
-- Name: fun_set_expired_events(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_set_expired_events() RETURNS integer
    LANGUAGE plpgsql
    AS $$DECLARE

fun_return INTEGER DEFAULT 0;
cursor1 CURSOR FOR select * from (select idevent, dateevent, ideventtype, (extract(epoch from age(now(), dateevent))/60) AS minutes_event, (select expiration from eventtypes where ideventtype = ev.ideventtype) as limit_expiration
 from events ev where status IN(0) ) as v WHERE minutes_event >=  limit_expiration;
    cursor1_row RECORD;

BEGIN


    FOR cursor1_row IN cursor1 LOOP
            -- if cursor1_row.minutes_event >=  cursor1_row.limit_expiration then
        --  PERFORM fun_edit_event_comments(0, 0, now()::timestamp without time zone, 1, 'Event expired. Automatically closed by the system.'::text, 5, cursor1_row.idevent::bigint);   
INSERT INTO event_comments(
            idadmin, start, seconds, comment_event, status, idevent)
    VALUES (0, now(), 1, 'Event expired. Automatically closed by the system.', 5, cursor1_row.idevent::bigint);
fun_return := fun_return+1;
  --     end if;  
    END LOOP;

    

RETURN fun_return;
END;$$;


ALTER FUNCTION public.fun_set_expired_events() OWNER TO postgres;

--
-- TOC entry 352 (class 1255 OID 89957)
-- Name: fun_sufix_name_by_date(timestamp without time zone); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_sufix_name_by_date(idate timestamp without time zone DEFAULT now()) RETURNS text
    LANGUAGE plpgsql
    AS $$DECLARE

r TEXT DEFAULT '19900101';

BEGIN
--r := to_char(idate, 'YYYYMMDD')::TEXT;
--r := to_char(idate, 'YYYYMM')::TEXT;
r := to_char(idate, 'YYYY')::TEXT;

return r;
END;$$;


ALTER FUNCTION public.fun_sufix_name_by_date(idate timestamp without time zone) OWNER TO postgres;

--
-- TOC entry 3968 (class 0 OID 0)
-- Dependencies: 352
-- Name: FUNCTION fun_sufix_name_by_date(idate timestamp without time zone); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION fun_sufix_name_by_date(idate timestamp without time zone) IS 'Devuelva el sufijo del nombre de las tablas segun la fecha ingresada como parametro.';


--
-- TOC entry 361 (class 1255 OID 89958)
-- Name: fun_udc_mapper(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_udc_mapper() RETURNS integer
    LANGUAGE plpgsql
    AS $$DECLARE

fun_return INTEGER DEFAULT 0;
cursor1 CURSOR FOR SELECT table_name, column_name, data_type, column_default from information_schema.columns where table_name NOT LIKE '%_20%' AND table_name NOT LIKE '%_19%' AND table_schema = 'public' ORDER BY table_name, column_name, data_type;
    cursor1_row RECORD;

BEGIN


    FOR cursor1_row IN cursor1 LOOP
    
UPDATE udc_tables_columns
   SET data_type=cursor1_row.data_type, column_default=cursor1_row.column_default
 WHERE table_name=cursor1_row.table_name AND column_name=cursor1_row.column_name;
        IF NOT found THEN
INSERT INTO udc_tables_columns(
            table_name, column_name, data_type, column_default, 
            column_label)
    VALUES (cursor1_row.table_name, cursor1_row.column_name, cursor1_row.data_type, cursor1_row.column_default, 
            cursor1_row.column_name);
        END IF;


    END LOOP;

    

RETURN fun_return;
END;$$;


ALTER FUNCTION public.fun_udc_mapper() OWNER TO postgres;

--
-- TOC entry 353 (class 1255 OID 89959)
-- Name: fun_view_contact_groups_they_belong(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_view_contact_groups_they_belong(iidcontact bigint, OUT idcontact bigint, OUT idgroup bigint, OUT ts timestamp without time zone, OUT ismember boolean, OUT enabled boolean, OUT name text, OUT description text, OUT note text) RETURNS SETOF record
    LANGUAGE plpgsql
    AS $$
DECLARE myrow groups%ROWTYPE;
BEGIN
   FOR myrow IN SELECT * FROM groups where groups.idgroup > 0
   LOOP
idgroup :=  myrow.idgroup;
ts:= myrow.ts;


--IF EXISTS(SELECT * FROM contacts_groups WHERE idcontact = iidcontact AND contacts_groups.idgroup = myrow.idgroup) THEN
--SELECT * FROM contacts WHERE idcontact = 0 AND 0 = ANY (groups)
IF EXISTS(SELECT * FROM contacts WHERE contacts.idcontact = iidcontact AND myrow.idgroup = ANY(groups)) THEN
ismember:=true;
ELSE
ismember:=false;
END IF;
idcontact := iidcontact;
enabled:= myrow.enabled;
name:= myrow.name;
description:=myrow.description;
note:=myrow.note;
   RETURN NEXT;
   END LOOP;
   RETURN;
END;
$$;


ALTER FUNCTION public.fun_view_contact_groups_they_belong(iidcontact bigint, OUT idcontact bigint, OUT idgroup bigint, OUT ts timestamp without time zone, OUT ismember boolean, OUT enabled boolean, OUT name text, OUT description text, OUT note text) OWNER TO postgres;

--
-- TOC entry 354 (class 1255 OID 89960)
-- Name: fun_view_farma_lista_precios(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_view_farma_lista_precios(OUT idaccount bigint, OUT account text, OUT ts_farmacia timestamp without time zone, OUT ts_server159 timestamp without time zone, OUT account_name text, OUT address text, OUT tecnico text, OUT note text, OUT srv159_principal text, OUT srv159_activa text, OUT srv159_productos integer, OUT principal text, OUT activa text, OUT productos integer, OUT estado text, OUT sincronizado text, OUT provincia text, OUT ip text) RETURNS SETOF record
    LANGUAGE plpgsql
    AS $$
DECLARE myrow accounts%ROWTYPE;
DECLARE mylista farma_lista_precios_farmacias%ROWTYPE;
BEGIN
   FOR myrow IN SELECT * FROM accounts where accounts.enabled = true
   LOOP
--idgroup :=  myrow.idgroup;
SELECT * INTO mylista FROM farma_lista_precios_farmacias WHERE farma_lista_precios_farmacias.idaccount = myrow.idcontact;
SELECT contact_name INTO tecnico FROM view_accounts_oams_assigned WHERE view_accounts_oams_assigned.idaccount = myrow.idcontact;


idaccount := myrow.idcontact;
account := myrow.account;
account_name:= myrow.last_name||' '||myrow.first_name;
address:=myrow.address;
note:=myrow.note;
--tecnico := '???';


srv159_principal := mylista.srv159_principal;
srv159_activa := mylista.srv159_activa;
srv159_productos := mylista.srv159_productos;

ip := mylista.ip;
provincia := mylista.provincia;


principal := mylista.principal;
activa := mylista.activa;
productos := mylista.productos;
estado := mylista.status;
sincronizado := mylista.sincronizado;

ts_farmacia:= mylista.ts_lista_farmacia;
ts_server159:= mylista.ts_lista_srv159;

   RETURN NEXT;
   END LOOP;
   RETURN;
END;
$$;


ALTER FUNCTION public.fun_view_farma_lista_precios(OUT idaccount bigint, OUT account text, OUT ts_farmacia timestamp without time zone, OUT ts_server159 timestamp without time zone, OUT account_name text, OUT address text, OUT tecnico text, OUT note text, OUT srv159_principal text, OUT srv159_activa text, OUT srv159_productos integer, OUT principal text, OUT activa text, OUT productos integer, OUT estado text, OUT sincronizado text, OUT provincia text, OUT ip text) OWNER TO postgres;

--
-- TOC entry 355 (class 1255 OID 89961)
-- Name: notifications_before_insert(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION notifications_before_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN

/*
UPDATE sys_table_ts SET ts = now() WHERE table_name = TG_TABLE_NAME;
        IF NOT found THEN
INSERT INTO sys_table_ts (table_name) VALUES (TG_TABLE_NAME);
        END IF;
*/


IF NEW.timeout < 5 THEN
NEW.timeout := 5;
END IF;

IF NEW.img IS NULL OR LENGTH(NEW.img) < 4 THEN
NEW.img := '/notifications_media/img/dialog-error.png';
END IF;

IF NEW.snd IS NULL OR LENGTH(NEW.snd) < 4 THEN
NEW.snd := '/notifications_media/snd/snd00.mp3';
END IF;

IF NEW.title IS NULL OR LENGTH(NEW.title) < 3 THEN
NEW.title := 'Notification';
END IF;

IF NEW.body IS NULL OR  LENGTH(NEW.body) < 3 THEN
NEW.body := 'Empty notification message';
END IF;

RETURN NEW;
END;$$;


ALTER FUNCTION public.notifications_before_insert() OWNER TO postgres;

--
-- TOC entry 3969 (class 0 OID 0)
-- Dependencies: 355
-- Name: FUNCTION notifications_before_insert(); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION notifications_before_insert() IS 'Acciones y comprobaciones antes de insertar el registro de notificacion';


--
-- TOC entry 356 (class 1255 OID 89962)
-- Name: on_changed_table(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION on_changed_table() RETURNS trigger
    LANGUAGE plpgsql
    AS $$DECLARE


BEGIN

RAISE NOTICE '1) Inicia Trigger on_changed_table';

UPDATE sys_table_ts SET ts = now() WHERE table_name = TG_TABLE_NAME;
RAISE NOTICE '2) Se ha actualizado';

        IF NOT found THEN
RAISE NOTICE '3) Registro no encontrado, se crea uno nuevo';
INSERT INTO sys_table_ts (table_name) VALUES (TG_TABLE_NAME);
        END IF;

RAISE NOTICE '4) Termina on_changed_table';


BEGIN

IF TG_TABLE_NAME ILIKE 'events_%' THEN

UPDATE sys_table_ts SET ts = now() WHERE table_name = 'events';
RAISE NOTICE '2) Se ha actualizado';

        IF NOT found THEN
RAISE NOTICE '3) Registro no encontrado, se crea uno nuevo';
INSERT INTO sys_table_ts (table_name) VALUES ('events');
        END IF;

END IF;



END;


RETURN NULL;
END;$$;


ALTER FUNCTION public.on_changed_table() OWNER TO postgres;

--
-- TOC entry 3970 (class 0 OID 0)
-- Dependencies: 356
-- Name: FUNCTION on_changed_table(); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION on_changed_table() IS 'Debe ser disparado despues de que la tabla ha sufrido cambios.';


--
-- TOC entry 357 (class 1255 OID 89963)
-- Name: on_update_row_update_ts(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION on_update_row_update_ts() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN

RAISE NOTICE '1) on_update_row_update_ts';

   NEW.ts = now(); 
   RETURN NEW;
END;
$$;


ALTER FUNCTION public.on_update_row_update_ts() OWNER TO postgres;

--
-- TOC entry 3971 (class 0 OID 0)
-- Dependencies: 357
-- Name: FUNCTION on_update_row_update_ts(); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION on_update_row_update_ts() IS 'Debe ser disparado antes de actualizar un registro de una tabla para que el campo ts sea actualizado.';


--
-- TOC entry 175 (class 1259 OID 89964)
-- Name: account_contacts; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE account_contacts (
    idaccountuser bigint NOT NULL,
    ts timestamp without time zone DEFAULT now(),
    idaccount integer,
    idcontact integer,
    appointment text,
    priority integer DEFAULT 5,
    note text
);


ALTER TABLE account_contacts OWNER TO postgres;

--
-- TOC entry 3972 (class 0 OID 0)
-- Dependencies: 175
-- Name: TABLE account_contacts; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE account_contacts IS 'Usuarios de un abonado (cliente).
No hay como usar idacount como llave foranea porque es una tabla heredada, hay que hacer la comprobacion manualmente.';


--
-- TOC entry 3973 (class 0 OID 0)
-- Dependencies: 175
-- Name: COLUMN account_contacts.idaccount; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN account_contacts.idaccount IS 'ID de la cuenta';


--
-- TOC entry 3974 (class 0 OID 0)
-- Dependencies: 175
-- Name: COLUMN account_contacts.idcontact; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN account_contacts.idcontact IS 'ID asociado de la lista de contactos';


--
-- TOC entry 176 (class 1259 OID 89972)
-- Name: account_states; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE account_states (
    idaccountstate bigint NOT NULL,
    ts timestamp without time zone DEFAULT now(),
    state text,
    note text
);


ALTER TABLE account_states OWNER TO postgres;

--
-- TOC entry 3975 (class 0 OID 0)
-- Dependencies: 176
-- Name: TABLE account_states; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE account_states IS 'Lista de posibles estados de un abonado';


--
-- TOC entry 177 (class 1259 OID 89979)
-- Name: account_state_idaccountstate_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE account_state_idaccountstate_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE account_state_idaccountstate_seq OWNER TO postgres;

--
-- TOC entry 3976 (class 0 OID 0)
-- Dependencies: 177
-- Name: account_state_idaccountstate_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE account_state_idaccountstate_seq OWNED BY account_states.idaccountstate;


--
-- TOC entry 178 (class 1259 OID 89981)
-- Name: account_types; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE account_types (
    idaccounttype bigint NOT NULL,
    ts timestamp without time zone DEFAULT now(),
    type text,
    note text
);


ALTER TABLE account_types OWNER TO postgres;

--
-- TOC entry 179 (class 1259 OID 89988)
-- Name: account_types_idaccounttype_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE account_types_idaccounttype_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE account_types_idaccounttype_seq OWNER TO postgres;

--
-- TOC entry 3977 (class 0 OID 0)
-- Dependencies: 179
-- Name: account_types_idaccounttype_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE account_types_idaccounttype_seq OWNED BY account_types.idaccounttype;


--
-- TOC entry 180 (class 1259 OID 89990)
-- Name: account_users_idaccountuser_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE account_users_idaccountuser_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE account_users_idaccountuser_seq OWNER TO postgres;

--
-- TOC entry 3978 (class 0 OID 0)
-- Dependencies: 180
-- Name: account_users_idaccountuser_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE account_users_idaccountuser_seq OWNED BY account_contacts.idaccountuser;


--
-- TOC entry 283 (class 1259 OID 93483)
-- Name: account_users; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE account_users (
    idaccountuser bigint DEFAULT nextval('account_users_idaccountuser_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    idaccount integer,
    idcontact integer,
    appointment text,
    priority integer DEFAULT 5,
    note text,
    account_user text,
    account_pwd text,
    date_start timestamp without time zone DEFAULT now(),
    date_end timestamp without time zone,
    enabled boolean DEFAULT true NOT NULL,
    "user" integer DEFAULT 0
)
INHERITS (account_contacts);


ALTER TABLE account_users OWNER TO postgres;

--
-- TOC entry 181 (class 1259 OID 90004)
-- Name: contacts; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE contacts (
    idcontact bigint NOT NULL,
    ts timestamp without time zone DEFAULT now(),
    enabled boolean DEFAULT true,
    first_name text NOT NULL,
    last_name text,
    birthday timestamp without time zone,
    identification text NOT NULL,
    ididtype integer DEFAULT 0,
    postal_code text,
    gender integer DEFAULT 0,
    geox double precision DEFAULT 0,
    geoy double precision DEFAULT 0,
    note text,
    address text,
    address_ref text,
    groups integer[]
)
WITH (toast.autovacuum_enabled='true');


ALTER TABLE contacts OWNER TO postgres;

--
-- TOC entry 3979 (class 0 OID 0)
-- Dependencies: 181
-- Name: COLUMN contacts.enabled; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.enabled IS 'Indica si el contacto esta habilitado o no.
Por ejemplo si el contacto debe usarse o no para otras areas de la aplicacion.';


--
-- TOC entry 3980 (class 0 OID 0)
-- Dependencies: 181
-- Name: COLUMN contacts.first_name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.first_name IS 'Nombre del contacto.
Este campo es oblogatorio y no puede ser nulo.
';


--
-- TOC entry 3981 (class 0 OID 0)
-- Dependencies: 181
-- Name: COLUMN contacts.last_name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.last_name IS 'Apellido del contacto.
Este valor puede ser nulo aunque no se recomienda.';


--
-- TOC entry 3982 (class 0 OID 0)
-- Dependencies: 181
-- Name: COLUMN contacts.identification; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.identification IS 'Este campo es importante, obligatorio y unico entre todos los registros.
Es un identificador unico entre el resto de contactos.
';


--
-- TOC entry 3983 (class 0 OID 0)
-- Dependencies: 181
-- Name: COLUMN contacts.ididtype; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.ididtype IS 'Tipo de identificacion (Ej.: Cedula, RUC, etc)';


--
-- TOC entry 3984 (class 0 OID 0)
-- Dependencies: 181
-- Name: COLUMN contacts.postal_code; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.postal_code IS 'Codigo Postal';


--
-- TOC entry 3985 (class 0 OID 0)
-- Dependencies: 181
-- Name: COLUMN contacts.gender; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.gender IS 'Genero:
0 - No establecido
1 - Hombre
2 - Mujer';


--
-- TOC entry 3986 (class 0 OID 0)
-- Dependencies: 181
-- Name: COLUMN contacts.geox; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.geox IS 'Geolocalizacion X';


--
-- TOC entry 3987 (class 0 OID 0)
-- Dependencies: 181
-- Name: COLUMN contacts.geoy; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.geoy IS 'Geolocalizacion Y';


--
-- TOC entry 3988 (class 0 OID 0)
-- Dependencies: 181
-- Name: COLUMN contacts.address; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.address IS 'Direccion del contacto';


--
-- TOC entry 3989 (class 0 OID 0)
-- Dependencies: 181
-- Name: COLUMN contacts.address_ref; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.address_ref IS 'Puntos referenciales para ubucacion del contacto';


--
-- TOC entry 3990 (class 0 OID 0)
-- Dependencies: 181
-- Name: COLUMN contacts.groups; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.groups IS 'Id de los grupos a los que pertenece este abonado';


--
-- TOC entry 182 (class 1259 OID 90016)
-- Name: contacts_idcontact_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE contacts_idcontact_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contacts_idcontact_seq OWNER TO postgres;

--
-- TOC entry 3991 (class 0 OID 0)
-- Dependencies: 182
-- Name: contacts_idcontact_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE contacts_idcontact_seq OWNED BY contacts.idcontact;


--
-- TOC entry 183 (class 1259 OID 90018)
-- Name: accounts; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE accounts (
    idcontact bigint DEFAULT nextval('contacts_idcontact_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    enabled boolean DEFAULT true,
    first_name text,
    last_name text,
    birthday timestamp without time zone,
    identification text,
    ididtype integer DEFAULT 0,
    postal_code text,
    gender integer DEFAULT 0,
    geox double precision DEFAULT 0,
    geoy double precision DEFAULT 0,
    note text,
    address text,
    address_ref text,
    idaccountstate integer DEFAULT 0,
    idaccounttype integer DEFAULT 0,
    start_date timestamp without time zone DEFAULT now(),
    end_date timestamp without time zone,
    account text NOT NULL,
    iddivision integer
)
INHERITS (contacts)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE accounts OWNER TO postgres;

--
-- TOC entry 184 (class 1259 OID 90034)
-- Name: admins; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE admins (
    idadmin bigint NOT NULL,
    ts timestamp without time zone DEFAULT now(),
    idcontact bigint NOT NULL,
    enabled boolean DEFAULT true,
    admin_start timestamp without time zone DEFAULT now() NOT NULL,
    admin_end timestamp without time zone DEFAULT now() NOT NULL,
    admin_username text,
    admin_pwd text,
    admin_sessionid text,
    admin_ip text,
    admin_level integer DEFAULT 0 NOT NULL,
    admin_role integer[],
    admin_locked_date timestamp without time zone DEFAULT now(),
    admin_failed_access_attempts smallint DEFAULT 0
)
WITH (toast.autovacuum_enabled='true');


ALTER TABLE admins OWNER TO postgres;

--
-- TOC entry 185 (class 1259 OID 90047)
-- Name: admins_idadmin_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE admins_idadmin_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE admins_idadmin_seq OWNER TO postgres;

--
-- TOC entry 3992 (class 0 OID 0)
-- Dependencies: 185
-- Name: admins_idadmin_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE admins_idadmin_seq OWNED BY admins.idadmin;


--
-- TOC entry 186 (class 1259 OID 90049)
-- Name: admins_idcontact_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE admins_idcontact_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE admins_idcontact_seq OWNER TO postgres;

--
-- TOC entry 3993 (class 0 OID 0)
-- Dependencies: 186
-- Name: admins_idcontact_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE admins_idcontact_seq OWNED BY admins.idcontact;


--
-- TOC entry 187 (class 1259 OID 90051)
-- Name: attachments; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE attachments (
    idattachment bigint NOT NULL,
    ts timestamp without time zone DEFAULT now(),
    file text NOT NULL,
    md5 text NOT NULL
);


ALTER TABLE attachments OWNER TO postgres;

--
-- TOC entry 188 (class 1259 OID 90058)
-- Name: attachments_idattachment_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE attachments_idattachment_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE attachments_idattachment_seq OWNER TO postgres;

--
-- TOC entry 3994 (class 0 OID 0)
-- Dependencies: 188
-- Name: attachments_idattachment_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE attachments_idattachment_seq OWNED BY attachments.idattachment;


--
-- TOC entry 189 (class 1259 OID 90060)
-- Name: divisions; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE divisions (
    iddivision bigint NOT NULL,
    name text,
    description text,
    enabled boolean DEFAULT true NOT NULL,
    notes text,
    ts timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE divisions OWNER TO postgres;

--
-- TOC entry 3995 (class 0 OID 0)
-- Dependencies: 189
-- Name: TABLE divisions; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE divisions IS 'Division, area, grupo empresarial, etc';


--
-- TOC entry 190 (class 1259 OID 90068)
-- Name: division_iddivision_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE division_iddivision_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE division_iddivision_seq OWNER TO postgres;

--
-- TOC entry 3996 (class 0 OID 0)
-- Dependencies: 190
-- Name: division_iddivision_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE division_iddivision_seq OWNED BY divisions.iddivision;


--
-- TOC entry 191 (class 1259 OID 90070)
-- Name: emails; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE emails (
    idemail bigint NOT NULL,
    ts timestamp without time zone DEFAULT now(),
    idcontact bigint DEFAULT 0 NOT NULL,
    email text NOT NULL,
    note text,
    priority integer DEFAULT 1 NOT NULL,
    notify_if_administrator boolean DEFAULT true
);


ALTER TABLE emails OWNER TO postgres;

--
-- TOC entry 3997 (class 0 OID 0)
-- Dependencies: 191
-- Name: COLUMN emails.notify_if_administrator; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN emails.notify_if_administrator IS 'Habilita envio de email de notificacion a esta direccion de corre cuando el email corresponde a un usuario administrador del sistema';


--
-- TOC entry 192 (class 1259 OID 90080)
-- Name: emails_idemail_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE emails_idemail_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE emails_idemail_seq OWNER TO postgres;

--
-- TOC entry 3998 (class 0 OID 0)
-- Dependencies: 192
-- Name: emails_idemail_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE emails_idemail_seq OWNED BY emails.idemail;


--
-- TOC entry 193 (class 1259 OID 90082)
-- Name: equipments; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE equipments (
    idequipment bigint NOT NULL,
    ts timestamp without time zone DEFAULT now(),
    equipment text NOT NULL,
    mark text,
    model text,
    serial_number text NOT NULL,
    description text,
    installation_date timestamp without time zone DEFAULT now(),
    uninstall_date timestamp without time zone,
    note text,
    code_ref text,
    idaccount integer,
    operability smallint DEFAULT 100,
    idprovider integer,
    agreement_code_provider text
);


ALTER TABLE equipments OWNER TO postgres;

--
-- TOC entry 3999 (class 0 OID 0)
-- Dependencies: 193
-- Name: COLUMN equipments.serial_number; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN equipments.serial_number IS 'Numero de serie que viene en el producto';


--
-- TOC entry 4000 (class 0 OID 0)
-- Dependencies: 193
-- Name: COLUMN equipments.code_ref; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN equipments.code_ref IS 'Codigo para uso interno';


--
-- TOC entry 4001 (class 0 OID 0)
-- Dependencies: 193
-- Name: COLUMN equipments.operability; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN equipments.operability IS 'Porcentage de operatividad del equipo';


--
-- TOC entry 4002 (class 0 OID 0)
-- Dependencies: 193
-- Name: COLUMN equipments.agreement_code_provider; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN equipments.agreement_code_provider IS 'Numero de contrato, numero o codigo con que el proveedor nos conoce.';


--
-- TOC entry 194 (class 1259 OID 90091)
-- Name: equipments_idequipment_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE equipments_idequipment_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE equipments_idequipment_seq OWNER TO postgres;

--
-- TOC entry 4003 (class 0 OID 0)
-- Dependencies: 194
-- Name: equipments_idequipment_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE equipments_idequipment_seq OWNED BY equipments.idequipment;


--
-- TOC entry 195 (class 1259 OID 90093)
-- Name: event_comments_attachments; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE event_comments_attachments (
    ideventcommentattach bigint NOT NULL,
    ts timestamp without time zone DEFAULT now(),
    idevent bigint,
    idattachment integer
);


ALTER TABLE event_comments_attachments OWNER TO postgres;

--
-- TOC entry 196 (class 1259 OID 90097)
-- Name: event_attachments_ideventattach_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE event_attachments_ideventattach_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE event_attachments_ideventattach_seq OWNER TO postgres;

--
-- TOC entry 4004 (class 0 OID 0)
-- Dependencies: 196
-- Name: event_attachments_ideventattach_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE event_attachments_ideventattach_seq OWNED BY event_comments_attachments.ideventcommentattach;


--
-- TOC entry 197 (class 1259 OID 90099)
-- Name: event_comments; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE event_comments (
    ideventcomment bigint NOT NULL,
    ts timestamp without time zone DEFAULT now(),
    idadmin integer,
    start timestamp without time zone DEFAULT now(),
    seconds integer DEFAULT 0,
    comment_event text,
    status smallint DEFAULT 0,
    idevent bigint
)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE event_comments OWNER TO postgres;

--
-- TOC entry 4005 (class 0 OID 0)
-- Dependencies: 197
-- Name: COLUMN event_comments.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN event_comments.status IS 'Este campo es necesario para actualiza la tabla events cuando un comentario es ingresado.';


--
-- TOC entry 198 (class 1259 OID 90109)
-- Name: event_comments_ideventcomment_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE event_comments_ideventcomment_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE event_comments_ideventcomment_seq OWNER TO postgres;

--
-- TOC entry 4006 (class 0 OID 0)
-- Dependencies: 198
-- Name: event_comments_ideventcomment_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE event_comments_ideventcomment_seq OWNED BY event_comments.ideventcomment;


--
-- TOC entry 284 (class 1259 OID 93495)
-- Name: event_comments_201512; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE event_comments_201512 (
    ideventcomment bigint DEFAULT nextval('event_comments_ideventcomment_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    idadmin integer,
    start timestamp without time zone DEFAULT now(),
    seconds integer DEFAULT 0,
    comment_event text,
    status smallint DEFAULT 0,
    idevent bigint
)
INHERITS (event_comments)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE event_comments_201512 OWNER TO postgres;

--
-- TOC entry 4007 (class 0 OID 0)
-- Dependencies: 284
-- Name: COLUMN event_comments_201512.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN event_comments_201512.status IS 'Es estado del comentario sirve para definir el estado del evento en cuestion ';


--
-- TOC entry 285 (class 1259 OID 93506)
-- Name: event_comments_2016; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE event_comments_2016 (
    ideventcomment bigint DEFAULT nextval('event_comments_ideventcomment_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    idadmin integer,
    start timestamp without time zone DEFAULT now(),
    seconds integer DEFAULT 0,
    comment_event text,
    status smallint DEFAULT 0,
    idevent bigint
)
INHERITS (event_comments)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE event_comments_2016 OWNER TO postgres;

--
-- TOC entry 4008 (class 0 OID 0)
-- Dependencies: 285
-- Name: COLUMN event_comments_2016.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN event_comments_2016.status IS 'Este campo es necesario para actualiza la tabla events cuando un comentario es ingresado.';


--
-- TOC entry 286 (class 1259 OID 93517)
-- Name: event_comments_201601; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE event_comments_201601 (
    ideventcomment bigint DEFAULT nextval('event_comments_ideventcomment_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    idadmin integer,
    start timestamp without time zone DEFAULT now(),
    seconds integer DEFAULT 0,
    comment_event text,
    status smallint DEFAULT 0,
    idevent bigint
)
INHERITS (event_comments)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE event_comments_201601 OWNER TO postgres;

--
-- TOC entry 4009 (class 0 OID 0)
-- Dependencies: 286
-- Name: COLUMN event_comments_201601.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN event_comments_201601.status IS 'Eliminar este campo';


--
-- TOC entry 287 (class 1259 OID 93528)
-- Name: event_comments_201602; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE event_comments_201602 (
    ideventcomment bigint DEFAULT nextval('event_comments_ideventcomment_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    idadmin integer,
    start timestamp without time zone DEFAULT now(),
    seconds integer DEFAULT 0,
    comment_event text,
    status smallint DEFAULT 0,
    idevent bigint
)
INHERITS (event_comments)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE event_comments_201602 OWNER TO postgres;

--
-- TOC entry 4010 (class 0 OID 0)
-- Dependencies: 287
-- Name: COLUMN event_comments_201602.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN event_comments_201602.status IS 'Este campo es necesario para actualiza la tabla events cuando un comentario es ingresado.';


--
-- TOC entry 288 (class 1259 OID 93539)
-- Name: event_comments_201603; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE event_comments_201603 (
    ideventcomment bigint DEFAULT nextval('event_comments_ideventcomment_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    idadmin integer,
    start timestamp without time zone DEFAULT now(),
    seconds integer DEFAULT 0,
    comment_event text,
    status smallint DEFAULT 0,
    idevent bigint
)
INHERITS (event_comments)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE event_comments_201603 OWNER TO postgres;

--
-- TOC entry 4011 (class 0 OID 0)
-- Dependencies: 288
-- Name: COLUMN event_comments_201603.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN event_comments_201603.status IS 'Este campo es necesario para actualiza la tabla events cuando un comentario es ingresado.';


--
-- TOC entry 199 (class 1259 OID 90166)
-- Name: events_idevent_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE events_idevent_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE events_idevent_seq OWNER TO postgres;

--
-- TOC entry 4012 (class 0 OID 0)
-- Dependencies: 199
-- Name: events_idevent_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE events_idevent_seq OWNED BY events.idevent;


--
-- TOC entry 200 (class 1259 OID 90168)
-- Name: events_201512; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_201512 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    idequipment bigint,
    note text
)
INHERITS (events)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_201512 OWNER TO postgres;

--
-- TOC entry 4013 (class 0 OID 0)
-- Dependencies: 200
-- Name: COLUMN events_201512.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_201512.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4014 (class 0 OID 0)
-- Dependencies: 200
-- Name: COLUMN events_201512.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_201512.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4015 (class 0 OID 0)
-- Dependencies: 200
-- Name: COLUMN events_201512.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_201512.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 201 (class 1259 OID 90181)
-- Name: events_2016; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_2016 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    idequipment bigint,
    CONSTRAINT events_2016_dateevent_check CHECK ((date_part('year'::text, dateevent) = (2016)::double precision))
)
INHERITS (events)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_2016 OWNER TO postgres;

--
-- TOC entry 4016 (class 0 OID 0)
-- Dependencies: 201
-- Name: COLUMN events_2016.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_2016.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4017 (class 0 OID 0)
-- Dependencies: 201
-- Name: COLUMN events_2016.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_2016.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.

No se lo pone como llave foranea para no tener que crearlas en cada tabla heredada mas bien se hace la comprobacion antes de insertar en la tabla y de no existir se pone a null';


--
-- TOC entry 4018 (class 0 OID 0)
-- Dependencies: 201
-- Name: COLUMN events_2016.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_2016.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 202 (class 1259 OID 90195)
-- Name: events_201601; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_201601 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    idequipment bigint,
    note text
)
INHERITS (events)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_201601 OWNER TO postgres;

--
-- TOC entry 4019 (class 0 OID 0)
-- Dependencies: 202
-- Name: COLUMN events_201601.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_201601.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4020 (class 0 OID 0)
-- Dependencies: 202
-- Name: COLUMN events_201601.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_201601.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.

No se lo pone como llave foranea para no tener que crearlas en cada tabla heredada mas bien se hace la comprobacion antes de insertar en la tabla y de no existir se pone a null';


--
-- TOC entry 4021 (class 0 OID 0)
-- Dependencies: 202
-- Name: COLUMN events_201601.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_201601.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 203 (class 1259 OID 90208)
-- Name: events_201602; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_201602 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    idequipment bigint,
    note text
)
INHERITS (events)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_201602 OWNER TO postgres;

--
-- TOC entry 4022 (class 0 OID 0)
-- Dependencies: 203
-- Name: COLUMN events_201602.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_201602.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4023 (class 0 OID 0)
-- Dependencies: 203
-- Name: COLUMN events_201602.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_201602.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.

No se lo pone como llave foranea para no tener que crearlas en cada tabla heredada mas bien se hace la comprobacion antes de insertar en la tabla y de no existir se pone a null';


--
-- TOC entry 4024 (class 0 OID 0)
-- Dependencies: 203
-- Name: COLUMN events_201602.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_201602.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 204 (class 1259 OID 90221)
-- Name: events_201603; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_201603 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    idequipment bigint,
    note text
)
INHERITS (events)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_201603 OWNER TO postgres;

--
-- TOC entry 4025 (class 0 OID 0)
-- Dependencies: 204
-- Name: COLUMN events_201603.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_201603.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4026 (class 0 OID 0)
-- Dependencies: 204
-- Name: COLUMN events_201603.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_201603.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.

No se lo pone como llave foranea para no tener que crearlas en cada tabla heredada mas bien se hace la comprobacion antes de insertar en la tabla y de no existir se pone a null';


--
-- TOC entry 4027 (class 0 OID 0)
-- Dependencies: 204
-- Name: COLUMN events_201603.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_201603.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 205 (class 1259 OID 90234)
-- Name: events_dbsizes; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_dbsizes (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    db_name text,
    db_size real,
    db_type smallint
)
INHERITS (events)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_dbsizes OWNER TO postgres;

--
-- TOC entry 4028 (class 0 OID 0)
-- Dependencies: 205
-- Name: TABLE events_dbsizes; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE events_dbsizes IS 'Aqui no debe crearse el check de fecha ya que ese check se lo crea en cada tabla hija';


--
-- TOC entry 4029 (class 0 OID 0)
-- Dependencies: 205
-- Name: COLUMN events_dbsizes.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_dbsizes.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4030 (class 0 OID 0)
-- Dependencies: 205
-- Name: COLUMN events_dbsizes.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_dbsizes.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4031 (class 0 OID 0)
-- Dependencies: 205
-- Name: COLUMN events_dbsizes.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_dbsizes.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 206 (class 1259 OID 90247)
-- Name: events_dbsizes_201512; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_dbsizes_201512 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    idequipment bigint,
    db_name text,
    db_size real,
    db_type smallint,
    note text
)
INHERITS (events_dbsizes)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_dbsizes_201512 OWNER TO postgres;

--
-- TOC entry 4032 (class 0 OID 0)
-- Dependencies: 206
-- Name: COLUMN events_dbsizes_201512.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_dbsizes_201512.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4033 (class 0 OID 0)
-- Dependencies: 206
-- Name: COLUMN events_dbsizes_201512.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_dbsizes_201512.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4034 (class 0 OID 0)
-- Dependencies: 206
-- Name: COLUMN events_dbsizes_201512.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_dbsizes_201512.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 207 (class 1259 OID 90260)
-- Name: events_dbsizes_2016; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_dbsizes_2016 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    idequipment bigint,
    db_name text,
    db_size real,
    db_type smallint,
    CONSTRAINT events_dbsizes_2016_dateevent_check CHECK ((date_part('year'::text, dateevent) = (2016)::double precision))
)
INHERITS (events_dbsizes)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_dbsizes_2016 OWNER TO postgres;

--
-- TOC entry 4035 (class 0 OID 0)
-- Dependencies: 207
-- Name: COLUMN events_dbsizes_2016.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_dbsizes_2016.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4036 (class 0 OID 0)
-- Dependencies: 207
-- Name: COLUMN events_dbsizes_2016.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_dbsizes_2016.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4037 (class 0 OID 0)
-- Dependencies: 207
-- Name: COLUMN events_dbsizes_2016.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_dbsizes_2016.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 208 (class 1259 OID 90274)
-- Name: events_dbsizes_201601; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_dbsizes_201601 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    idequipment bigint,
    db_name text,
    db_size real,
    db_type smallint,
    note text
)
INHERITS (events_dbsizes)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_dbsizes_201601 OWNER TO postgres;

--
-- TOC entry 4038 (class 0 OID 0)
-- Dependencies: 208
-- Name: COLUMN events_dbsizes_201601.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_dbsizes_201601.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4039 (class 0 OID 0)
-- Dependencies: 208
-- Name: COLUMN events_dbsizes_201601.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_dbsizes_201601.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4040 (class 0 OID 0)
-- Dependencies: 208
-- Name: COLUMN events_dbsizes_201601.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_dbsizes_201601.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 209 (class 1259 OID 90287)
-- Name: events_dbsizes_201602; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_dbsizes_201602 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    idequipment bigint,
    db_name text,
    db_size real,
    db_type smallint,
    note text
)
INHERITS (events_dbsizes)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_dbsizes_201602 OWNER TO postgres;

--
-- TOC entry 4041 (class 0 OID 0)
-- Dependencies: 209
-- Name: COLUMN events_dbsizes_201602.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_dbsizes_201602.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4042 (class 0 OID 0)
-- Dependencies: 209
-- Name: COLUMN events_dbsizes_201602.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_dbsizes_201602.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4043 (class 0 OID 0)
-- Dependencies: 209
-- Name: COLUMN events_dbsizes_201602.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_dbsizes_201602.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 210 (class 1259 OID 90300)
-- Name: events_dbsizes_201603; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_dbsizes_201603 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    idequipment bigint,
    db_name text,
    db_size real,
    db_type smallint,
    note text
)
INHERITS (events_dbsizes)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_dbsizes_201603 OWNER TO postgres;

--
-- TOC entry 4044 (class 0 OID 0)
-- Dependencies: 210
-- Name: COLUMN events_dbsizes_201603.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_dbsizes_201603.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4045 (class 0 OID 0)
-- Dependencies: 210
-- Name: COLUMN events_dbsizes_201603.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_dbsizes_201603.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4046 (class 0 OID 0)
-- Dependencies: 210
-- Name: COLUMN events_dbsizes_201603.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_dbsizes_201603.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 211 (class 1259 OID 90313)
-- Name: events_device_uptime; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_device_uptime (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    uptime real DEFAULT (-1)
)
INHERITS (events)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_device_uptime OWNER TO postgres;

--
-- TOC entry 4047 (class 0 OID 0)
-- Dependencies: 211
-- Name: COLUMN events_device_uptime.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_device_uptime.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4048 (class 0 OID 0)
-- Dependencies: 211
-- Name: COLUMN events_device_uptime.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_device_uptime.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4049 (class 0 OID 0)
-- Dependencies: 211
-- Name: COLUMN events_device_uptime.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_device_uptime.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 212 (class 1259 OID 90327)
-- Name: events_device_uptime_201512; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_device_uptime_201512 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    idequipment bigint,
    uptime real DEFAULT (-1),
    note text
)
INHERITS (events_device_uptime)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_device_uptime_201512 OWNER TO postgres;

--
-- TOC entry 4050 (class 0 OID 0)
-- Dependencies: 212
-- Name: COLUMN events_device_uptime_201512.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_device_uptime_201512.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4051 (class 0 OID 0)
-- Dependencies: 212
-- Name: COLUMN events_device_uptime_201512.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_device_uptime_201512.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4052 (class 0 OID 0)
-- Dependencies: 212
-- Name: COLUMN events_device_uptime_201512.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_device_uptime_201512.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 213 (class 1259 OID 90341)
-- Name: events_device_uptime_2016; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_device_uptime_2016 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    idequipment bigint,
    uptime real DEFAULT (-1),
    CONSTRAINT events_device_uptime_2016_dateevent_check CHECK ((date_part('year'::text, dateevent) = (2016)::double precision))
)
INHERITS (events_device_uptime)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_device_uptime_2016 OWNER TO postgres;

--
-- TOC entry 4053 (class 0 OID 0)
-- Dependencies: 213
-- Name: COLUMN events_device_uptime_2016.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_device_uptime_2016.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4054 (class 0 OID 0)
-- Dependencies: 213
-- Name: COLUMN events_device_uptime_2016.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_device_uptime_2016.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4055 (class 0 OID 0)
-- Dependencies: 213
-- Name: COLUMN events_device_uptime_2016.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_device_uptime_2016.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 214 (class 1259 OID 90356)
-- Name: events_device_uptime_201601; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_device_uptime_201601 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    idequipment bigint,
    uptime real DEFAULT (-1),
    note text
)
INHERITS (events_device_uptime)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_device_uptime_201601 OWNER TO postgres;

--
-- TOC entry 4056 (class 0 OID 0)
-- Dependencies: 214
-- Name: COLUMN events_device_uptime_201601.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_device_uptime_201601.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4057 (class 0 OID 0)
-- Dependencies: 214
-- Name: COLUMN events_device_uptime_201601.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_device_uptime_201601.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4058 (class 0 OID 0)
-- Dependencies: 214
-- Name: COLUMN events_device_uptime_201601.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_device_uptime_201601.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 215 (class 1259 OID 90370)
-- Name: events_device_uptime_201602; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_device_uptime_201602 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    idequipment bigint,
    uptime real DEFAULT (-1),
    note text
)
INHERITS (events_device_uptime)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_device_uptime_201602 OWNER TO postgres;

--
-- TOC entry 4059 (class 0 OID 0)
-- Dependencies: 215
-- Name: COLUMN events_device_uptime_201602.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_device_uptime_201602.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4060 (class 0 OID 0)
-- Dependencies: 215
-- Name: COLUMN events_device_uptime_201602.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_device_uptime_201602.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4061 (class 0 OID 0)
-- Dependencies: 215
-- Name: COLUMN events_device_uptime_201602.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_device_uptime_201602.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 216 (class 1259 OID 90384)
-- Name: events_device_uptime_201603; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_device_uptime_201603 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    idequipment bigint,
    uptime real DEFAULT (-1),
    note text
)
INHERITS (events_device_uptime)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_device_uptime_201603 OWNER TO postgres;

--
-- TOC entry 4062 (class 0 OID 0)
-- Dependencies: 216
-- Name: COLUMN events_device_uptime_201603.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_device_uptime_201603.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4063 (class 0 OID 0)
-- Dependencies: 216
-- Name: COLUMN events_device_uptime_201603.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_device_uptime_201603.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4064 (class 0 OID 0)
-- Dependencies: 216
-- Name: COLUMN events_device_uptime_201603.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_device_uptime_201603.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 217 (class 1259 OID 90398)
-- Name: events_diskspace; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_diskspace (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    drive character(2),
    drive_size real DEFAULT (-1),
    drive_free real DEFAULT (-1),
    CONSTRAINT events_diskspace_check_ideventtype CHECK (((ideventtype = 62) OR (ideventtype = 52)))
)
INHERITS (events)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_diskspace OWNER TO postgres;

--
-- TOC entry 4065 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN events_diskspace.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_diskspace.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4066 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN events_diskspace.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_diskspace.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4067 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN events_diskspace.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_diskspace.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 218 (class 1259 OID 90414)
-- Name: events_diskspace_201512; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_diskspace_201512 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    idequipment bigint,
    drive character(2),
    drive_size real DEFAULT (-1),
    drive_free real DEFAULT (-1)
)
INHERITS (events_diskspace)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_diskspace_201512 OWNER TO postgres;

--
-- TOC entry 4068 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN events_diskspace_201512.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_diskspace_201512.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4069 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN events_diskspace_201512.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_diskspace_201512.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4070 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN events_diskspace_201512.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_diskspace_201512.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 219 (class 1259 OID 90430)
-- Name: events_diskspace_2016; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_diskspace_2016 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    idequipment bigint,
    drive character(2),
    drive_size real DEFAULT (-1),
    drive_free real DEFAULT (-1),
    CONSTRAINT events_diskspace_2016_dateevent_check CHECK ((date_part('year'::text, dateevent) = (2016)::double precision))
)
INHERITS (events_diskspace)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_diskspace_2016 OWNER TO postgres;

--
-- TOC entry 4071 (class 0 OID 0)
-- Dependencies: 219
-- Name: COLUMN events_diskspace_2016.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_diskspace_2016.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4072 (class 0 OID 0)
-- Dependencies: 219
-- Name: COLUMN events_diskspace_2016.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_diskspace_2016.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4073 (class 0 OID 0)
-- Dependencies: 219
-- Name: COLUMN events_diskspace_2016.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_diskspace_2016.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 220 (class 1259 OID 90447)
-- Name: events_diskspace_201601; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_diskspace_201601 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    idequipment bigint,
    drive character(2),
    drive_size real DEFAULT (-1),
    drive_free real DEFAULT (-1)
)
INHERITS (events_diskspace)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_diskspace_201601 OWNER TO postgres;

--
-- TOC entry 4074 (class 0 OID 0)
-- Dependencies: 220
-- Name: COLUMN events_diskspace_201601.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_diskspace_201601.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4075 (class 0 OID 0)
-- Dependencies: 220
-- Name: COLUMN events_diskspace_201601.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_diskspace_201601.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4076 (class 0 OID 0)
-- Dependencies: 220
-- Name: COLUMN events_diskspace_201601.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_diskspace_201601.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 221 (class 1259 OID 90463)
-- Name: events_diskspace_201602; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_diskspace_201602 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    idequipment bigint,
    drive character(2),
    drive_size real DEFAULT (-1),
    drive_free real DEFAULT (-1),
    note text
)
INHERITS (events_diskspace)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_diskspace_201602 OWNER TO postgres;

--
-- TOC entry 4077 (class 0 OID 0)
-- Dependencies: 221
-- Name: COLUMN events_diskspace_201602.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_diskspace_201602.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4078 (class 0 OID 0)
-- Dependencies: 221
-- Name: COLUMN events_diskspace_201602.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_diskspace_201602.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4079 (class 0 OID 0)
-- Dependencies: 221
-- Name: COLUMN events_diskspace_201602.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_diskspace_201602.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 222 (class 1259 OID 90479)
-- Name: events_diskspace_201603; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_diskspace_201603 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    idequipment bigint,
    drive character(2),
    drive_size real DEFAULT (-1),
    drive_free real DEFAULT (-1)
)
INHERITS (events_diskspace)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_diskspace_201603 OWNER TO postgres;

--
-- TOC entry 4080 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN events_diskspace_201603.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_diskspace_201603.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4081 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN events_diskspace_201603.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_diskspace_201603.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4082 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN events_diskspace_201603.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_diskspace_201603.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 223 (class 1259 OID 90495)
-- Name: events_jobs; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_jobs (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    job_name text,
    job_enabled boolean DEFAULT true,
    job_description text,
    job_date_create timestamp without time zone,
    job_run_duration integer DEFAULT (-1),
    job_run_status smallint DEFAULT (-10),
    job_next_run timestamp without time zone
)
INHERITS (events)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_jobs OWNER TO postgres;

--
-- TOC entry 4083 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN events_jobs.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4084 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN events_jobs.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4085 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN events_jobs.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 224 (class 1259 OID 90511)
-- Name: events_jobs_1990; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_jobs_1990 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    idequipment bigint,
    job_name text,
    job_enabled boolean DEFAULT true,
    job_description text,
    job_date_create timestamp without time zone,
    job_run_duration integer DEFAULT (-1),
    job_run_status smallint DEFAULT (-10),
    job_next_run timestamp without time zone,
    CONSTRAINT events_jobs_1990_dateevent_check CHECK ((date_part('year'::text, dateevent) = (1990)::double precision))
)
INHERITS (events_jobs)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_jobs_1990 OWNER TO postgres;

--
-- TOC entry 4086 (class 0 OID 0)
-- Dependencies: 224
-- Name: COLUMN events_jobs_1990.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_1990.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4087 (class 0 OID 0)
-- Dependencies: 224
-- Name: COLUMN events_jobs_1990.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_1990.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4088 (class 0 OID 0)
-- Dependencies: 224
-- Name: COLUMN events_jobs_1990.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_1990.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 225 (class 1259 OID 90528)
-- Name: events_jobs_199001; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_jobs_199001 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    job_name text,
    job_enabled boolean DEFAULT true,
    job_description text,
    job_date_create timestamp without time zone,
    job_run_duration integer DEFAULT (-1),
    job_run_status smallint DEFAULT (-10),
    job_next_run timestamp without time zone,
    note text
)
INHERITS (events_jobs)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_jobs_199001 OWNER TO postgres;

--
-- TOC entry 4089 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN events_jobs_199001.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_199001.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4090 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN events_jobs_199001.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_199001.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4091 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN events_jobs_199001.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_199001.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 226 (class 1259 OID 90544)
-- Name: events_jobs_201407; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_jobs_201407 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    job_name text,
    job_enabled boolean DEFAULT true,
    job_description text,
    job_date_create timestamp without time zone,
    job_run_duration integer DEFAULT (-1),
    job_run_status smallint DEFAULT (-10),
    job_next_run timestamp without time zone,
    note text
)
INHERITS (events_jobs)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_jobs_201407 OWNER TO postgres;

--
-- TOC entry 4092 (class 0 OID 0)
-- Dependencies: 226
-- Name: COLUMN events_jobs_201407.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201407.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4093 (class 0 OID 0)
-- Dependencies: 226
-- Name: COLUMN events_jobs_201407.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201407.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4094 (class 0 OID 0)
-- Dependencies: 226
-- Name: COLUMN events_jobs_201407.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201407.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 227 (class 1259 OID 90560)
-- Name: events_jobs_201411; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_jobs_201411 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    job_name text,
    job_enabled boolean DEFAULT true,
    job_description text,
    job_date_create timestamp without time zone,
    job_run_duration integer DEFAULT (-1),
    job_run_status smallint DEFAULT (-10),
    job_next_run timestamp without time zone
)
INHERITS (events_jobs)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_jobs_201411 OWNER TO postgres;

--
-- TOC entry 4095 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN events_jobs_201411.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201411.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4096 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN events_jobs_201411.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201411.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4097 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN events_jobs_201411.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201411.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 228 (class 1259 OID 90576)
-- Name: events_jobs_201412; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_jobs_201412 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    job_name text,
    job_enabled boolean DEFAULT true,
    job_description text,
    job_date_create timestamp without time zone,
    job_run_duration integer DEFAULT (-1),
    job_run_status smallint DEFAULT (-10),
    job_next_run timestamp without time zone,
    note text
)
INHERITS (events_jobs)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_jobs_201412 OWNER TO postgres;

--
-- TOC entry 4098 (class 0 OID 0)
-- Dependencies: 228
-- Name: COLUMN events_jobs_201412.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201412.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4099 (class 0 OID 0)
-- Dependencies: 228
-- Name: COLUMN events_jobs_201412.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201412.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4100 (class 0 OID 0)
-- Dependencies: 228
-- Name: COLUMN events_jobs_201412.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201412.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 229 (class 1259 OID 90592)
-- Name: events_jobs_2015; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_jobs_2015 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    idequipment bigint,
    job_name text,
    job_enabled boolean DEFAULT true,
    job_description text,
    job_date_create timestamp without time zone,
    job_run_duration integer DEFAULT (-1),
    job_run_status smallint DEFAULT (-10),
    job_next_run timestamp without time zone,
    CONSTRAINT events_jobs_2015_dateevent_check CHECK ((date_part('year'::text, dateevent) = (2015)::double precision))
)
INHERITS (events_jobs)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_jobs_2015 OWNER TO postgres;

--
-- TOC entry 4101 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN events_jobs_2015.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_2015.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4102 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN events_jobs_2015.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_2015.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4103 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN events_jobs_2015.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_2015.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 230 (class 1259 OID 90609)
-- Name: events_jobs_201503; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_jobs_201503 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    job_name text,
    job_enabled boolean DEFAULT true,
    job_description text,
    job_date_create timestamp without time zone,
    job_run_duration integer DEFAULT (-1),
    job_run_status smallint DEFAULT (-10),
    job_next_run timestamp without time zone,
    note text
)
INHERITS (events_jobs)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_jobs_201503 OWNER TO postgres;

--
-- TOC entry 4104 (class 0 OID 0)
-- Dependencies: 230
-- Name: COLUMN events_jobs_201503.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201503.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4105 (class 0 OID 0)
-- Dependencies: 230
-- Name: COLUMN events_jobs_201503.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201503.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4106 (class 0 OID 0)
-- Dependencies: 230
-- Name: COLUMN events_jobs_201503.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201503.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 231 (class 1259 OID 90625)
-- Name: events_jobs_201504; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_jobs_201504 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    job_name text,
    job_enabled boolean DEFAULT true,
    job_description text,
    job_date_create timestamp without time zone,
    job_run_duration integer DEFAULT (-1),
    job_run_status smallint DEFAULT (-10),
    job_next_run timestamp without time zone,
    note text
)
INHERITS (events_jobs)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_jobs_201504 OWNER TO postgres;

--
-- TOC entry 4107 (class 0 OID 0)
-- Dependencies: 231
-- Name: COLUMN events_jobs_201504.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201504.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4108 (class 0 OID 0)
-- Dependencies: 231
-- Name: COLUMN events_jobs_201504.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201504.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4109 (class 0 OID 0)
-- Dependencies: 231
-- Name: COLUMN events_jobs_201504.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201504.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 232 (class 1259 OID 90641)
-- Name: events_jobs_201505; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_jobs_201505 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    job_name text,
    job_enabled boolean DEFAULT true,
    job_description text,
    job_date_create timestamp without time zone,
    job_run_duration integer DEFAULT (-1),
    job_run_status smallint DEFAULT (-10),
    job_next_run timestamp without time zone,
    note text
)
INHERITS (events_jobs)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_jobs_201505 OWNER TO postgres;

--
-- TOC entry 4110 (class 0 OID 0)
-- Dependencies: 232
-- Name: COLUMN events_jobs_201505.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201505.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4111 (class 0 OID 0)
-- Dependencies: 232
-- Name: COLUMN events_jobs_201505.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201505.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4112 (class 0 OID 0)
-- Dependencies: 232
-- Name: COLUMN events_jobs_201505.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201505.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 233 (class 1259 OID 90657)
-- Name: events_jobs_201506; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_jobs_201506 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    job_name text,
    job_enabled boolean DEFAULT true,
    job_description text,
    job_date_create timestamp without time zone,
    job_run_duration integer DEFAULT (-1),
    job_run_status smallint DEFAULT (-10),
    job_next_run timestamp without time zone
)
INHERITS (events_jobs)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_jobs_201506 OWNER TO postgres;

--
-- TOC entry 4113 (class 0 OID 0)
-- Dependencies: 233
-- Name: COLUMN events_jobs_201506.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201506.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4114 (class 0 OID 0)
-- Dependencies: 233
-- Name: COLUMN events_jobs_201506.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201506.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4115 (class 0 OID 0)
-- Dependencies: 233
-- Name: COLUMN events_jobs_201506.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201506.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 234 (class 1259 OID 90673)
-- Name: events_jobs_201507; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_jobs_201507 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    job_name text,
    job_enabled boolean DEFAULT true,
    job_description text,
    job_date_create timestamp without time zone,
    job_run_duration integer DEFAULT (-1),
    job_run_status smallint DEFAULT (-10),
    job_next_run timestamp without time zone
)
INHERITS (events_jobs)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_jobs_201507 OWNER TO postgres;

--
-- TOC entry 4116 (class 0 OID 0)
-- Dependencies: 234
-- Name: COLUMN events_jobs_201507.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201507.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4117 (class 0 OID 0)
-- Dependencies: 234
-- Name: COLUMN events_jobs_201507.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201507.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4118 (class 0 OID 0)
-- Dependencies: 234
-- Name: COLUMN events_jobs_201507.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201507.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 235 (class 1259 OID 90689)
-- Name: events_jobs_201508; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_jobs_201508 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    job_name text,
    job_enabled boolean DEFAULT true,
    job_description text,
    job_date_create timestamp without time zone,
    job_run_duration integer DEFAULT (-1),
    job_run_status smallint DEFAULT (-10),
    job_next_run timestamp without time zone
)
INHERITS (events_jobs)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_jobs_201508 OWNER TO postgres;

--
-- TOC entry 4119 (class 0 OID 0)
-- Dependencies: 235
-- Name: COLUMN events_jobs_201508.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201508.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4120 (class 0 OID 0)
-- Dependencies: 235
-- Name: COLUMN events_jobs_201508.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201508.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4121 (class 0 OID 0)
-- Dependencies: 235
-- Name: COLUMN events_jobs_201508.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201508.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 236 (class 1259 OID 90705)
-- Name: events_jobs_201509; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_jobs_201509 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    job_name text,
    job_enabled boolean DEFAULT true,
    job_description text,
    job_date_create timestamp without time zone,
    job_run_duration integer DEFAULT (-1),
    job_run_status smallint DEFAULT (-10),
    job_next_run timestamp without time zone
)
INHERITS (events_jobs)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_jobs_201509 OWNER TO postgres;

--
-- TOC entry 4122 (class 0 OID 0)
-- Dependencies: 236
-- Name: COLUMN events_jobs_201509.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201509.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4123 (class 0 OID 0)
-- Dependencies: 236
-- Name: COLUMN events_jobs_201509.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201509.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4124 (class 0 OID 0)
-- Dependencies: 236
-- Name: COLUMN events_jobs_201509.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201509.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 237 (class 1259 OID 90721)
-- Name: events_jobs_201510; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_jobs_201510 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    job_name text,
    job_enabled boolean DEFAULT true,
    job_description text,
    job_date_create timestamp without time zone,
    job_run_duration integer DEFAULT (-1),
    job_run_status smallint DEFAULT (-10),
    job_next_run timestamp without time zone,
    note text
)
INHERITS (events_jobs)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_jobs_201510 OWNER TO postgres;

--
-- TOC entry 4125 (class 0 OID 0)
-- Dependencies: 237
-- Name: COLUMN events_jobs_201510.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201510.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4126 (class 0 OID 0)
-- Dependencies: 237
-- Name: COLUMN events_jobs_201510.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201510.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4127 (class 0 OID 0)
-- Dependencies: 237
-- Name: COLUMN events_jobs_201510.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201510.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 238 (class 1259 OID 90737)
-- Name: events_jobs_201511; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_jobs_201511 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    job_name text,
    job_enabled boolean DEFAULT true,
    job_description text,
    job_date_create timestamp without time zone,
    job_run_duration integer DEFAULT (-1),
    job_run_status smallint DEFAULT (-10),
    job_next_run timestamp without time zone
)
INHERITS (events_jobs)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_jobs_201511 OWNER TO postgres;

--
-- TOC entry 4128 (class 0 OID 0)
-- Dependencies: 238
-- Name: COLUMN events_jobs_201511.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201511.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4129 (class 0 OID 0)
-- Dependencies: 238
-- Name: COLUMN events_jobs_201511.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201511.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4130 (class 0 OID 0)
-- Dependencies: 238
-- Name: COLUMN events_jobs_201511.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201511.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 239 (class 1259 OID 90753)
-- Name: events_jobs_201512; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_jobs_201512 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    idequipment bigint,
    job_name text,
    job_enabled boolean DEFAULT true,
    job_description text,
    job_date_create timestamp without time zone,
    job_run_duration integer DEFAULT (-1),
    job_run_status smallint DEFAULT (-10),
    job_next_run timestamp without time zone,
    note text
)
INHERITS (events_jobs)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_jobs_201512 OWNER TO postgres;

--
-- TOC entry 4131 (class 0 OID 0)
-- Dependencies: 239
-- Name: COLUMN events_jobs_201512.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201512.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4132 (class 0 OID 0)
-- Dependencies: 239
-- Name: COLUMN events_jobs_201512.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201512.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4133 (class 0 OID 0)
-- Dependencies: 239
-- Name: COLUMN events_jobs_201512.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201512.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 240 (class 1259 OID 90769)
-- Name: events_jobs_2016; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_jobs_2016 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    idequipment bigint,
    job_name text,
    job_enabled boolean DEFAULT true,
    job_description text,
    job_date_create timestamp without time zone,
    job_run_duration integer DEFAULT (-1),
    job_run_status smallint DEFAULT (-10),
    job_next_run timestamp without time zone,
    CONSTRAINT events_jobs_2016_dateevent_check CHECK ((date_part('year'::text, dateevent) = (2016)::double precision))
)
INHERITS (events_jobs)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_jobs_2016 OWNER TO postgres;

--
-- TOC entry 4134 (class 0 OID 0)
-- Dependencies: 240
-- Name: COLUMN events_jobs_2016.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_2016.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4135 (class 0 OID 0)
-- Dependencies: 240
-- Name: COLUMN events_jobs_2016.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_2016.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4136 (class 0 OID 0)
-- Dependencies: 240
-- Name: COLUMN events_jobs_2016.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_2016.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 241 (class 1259 OID 90786)
-- Name: events_jobs_201601; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_jobs_201601 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    idequipment bigint,
    job_name text,
    job_enabled boolean DEFAULT true,
    job_description text,
    job_date_create timestamp without time zone,
    job_run_duration integer DEFAULT (-1),
    job_run_status smallint DEFAULT (-10),
    job_next_run timestamp without time zone
)
INHERITS (events_jobs)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_jobs_201601 OWNER TO postgres;

--
-- TOC entry 4137 (class 0 OID 0)
-- Dependencies: 241
-- Name: COLUMN events_jobs_201601.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201601.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4138 (class 0 OID 0)
-- Dependencies: 241
-- Name: COLUMN events_jobs_201601.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201601.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4139 (class 0 OID 0)
-- Dependencies: 241
-- Name: COLUMN events_jobs_201601.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201601.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 242 (class 1259 OID 90802)
-- Name: events_jobs_201602; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_jobs_201602 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    idequipment bigint,
    job_name text,
    job_enabled boolean DEFAULT true,
    job_description text,
    job_date_create timestamp without time zone,
    job_run_duration integer DEFAULT (-1),
    job_run_status smallint DEFAULT (-10),
    job_next_run timestamp without time zone
)
INHERITS (events_jobs)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_jobs_201602 OWNER TO postgres;

--
-- TOC entry 4140 (class 0 OID 0)
-- Dependencies: 242
-- Name: COLUMN events_jobs_201602.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201602.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4141 (class 0 OID 0)
-- Dependencies: 242
-- Name: COLUMN events_jobs_201602.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201602.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4142 (class 0 OID 0)
-- Dependencies: 242
-- Name: COLUMN events_jobs_201602.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201602.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 243 (class 1259 OID 90818)
-- Name: events_jobs_201603; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_jobs_201603 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    idequipment bigint,
    job_name text,
    job_enabled boolean DEFAULT true,
    job_description text,
    job_date_create timestamp without time zone,
    job_run_duration integer DEFAULT (-1),
    job_run_status smallint DEFAULT (-10),
    job_next_run timestamp without time zone
)
INHERITS (events_jobs)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_jobs_201603 OWNER TO postgres;

--
-- TOC entry 4143 (class 0 OID 0)
-- Dependencies: 243
-- Name: COLUMN events_jobs_201603.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201603.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4144 (class 0 OID 0)
-- Dependencies: 243
-- Name: COLUMN events_jobs_201603.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201603.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4145 (class 0 OID 0)
-- Dependencies: 243
-- Name: COLUMN events_jobs_201603.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_201603.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 244 (class 1259 OID 90834)
-- Name: events_raid; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_raid (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    hostname inet,
    line_file integer DEFAULT 0
)
INHERITS (events);


ALTER TABLE events_raid OWNER TO postgres;

--
-- TOC entry 4146 (class 0 OID 0)
-- Dependencies: 244
-- Name: TABLE events_raid; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE events_raid IS 'Importa los reportes de Servidores RAID (AMD) recibidor por email desde el archivo de icedove.';


--
-- TOC entry 4147 (class 0 OID 0)
-- Dependencies: 244
-- Name: COLUMN events_raid.line_file; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_raid.line_file IS 'Ultima linea que leyo el sistema desde el archivo de email de icedove.';


--
-- TOC entry 245 (class 1259 OID 90848)
-- Name: events_raid_201511; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_raid_201511 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    hostname inet,
    line_file integer DEFAULT 0,
    note text
)
INHERITS (events_raid)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_raid_201511 OWNER TO postgres;

--
-- TOC entry 4148 (class 0 OID 0)
-- Dependencies: 245
-- Name: COLUMN events_raid_201511.line_file; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_raid_201511.line_file IS 'Ultima linea que leyo el sistema desde el archivo de email de icedove.';


--
-- TOC entry 246 (class 1259 OID 90862)
-- Name: eventtypes; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE eventtypes (
    ideventtype bigint NOT NULL,
    ts timestamp without time zone DEFAULT now(),
    name text NOT NULL,
    priority integer DEFAULT 100,
    treatment boolean DEFAULT false,
    manual boolean DEFAULT false,
    date_editable boolean DEFAULT false,
    notify_timeout integer DEFAULT 10,
    notify_closable boolean DEFAULT true,
    notify_img text DEFAULT '/notifications_media/img/dialog-error.png'::text,
    notify_snd text,
    note text,
    label text,
    code text NOT NULL,
    notify_all_users boolean DEFAULT true NOT NULL,
    expiration integer DEFAULT 525600 NOT NULL,
    auto_close_on_event_defined integer[],
    enable_auto_close_on_event_defined boolean DEFAULT false NOT NULL,
    eventtype_groups integer[]
);


ALTER TABLE eventtypes OWNER TO postgres;

--
-- TOC entry 4149 (class 0 OID 0)
-- Dependencies: 246
-- Name: TABLE eventtypes; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE eventtypes IS 'Tipos de eventos definidos para el sistema.
A partir del evento 1000 son definidos internamente por oams y no deben ser utilizados por el usuario.';


--
-- TOC entry 4150 (class 0 OID 0)
-- Dependencies: 246
-- Name: COLUMN eventtypes.name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.name IS 'Nombre del evento';


--
-- TOC entry 4151 (class 0 OID 0)
-- Dependencies: 246
-- Name: COLUMN eventtypes.treatment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.treatment IS 'Requiere tratamiento por parte del operador';


--
-- TOC entry 4152 (class 0 OID 0)
-- Dependencies: 246
-- Name: COLUMN eventtypes.manual; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.manual IS 'Puede ser creado el evento manualmente, la mayoria de los eventos deberian ser creados solo por un software y no generados a mano por razones de seguridad.';


--
-- TOC entry 4153 (class 0 OID 0)
-- Dependencies: 246
-- Name: COLUMN eventtypes.date_editable; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.date_editable IS 'Las fechas de los eventos NO deberian ser editables por razones de seguridda, a exepcion de las tareas que si podrian ser modificadas. ';


--
-- TOC entry 4154 (class 0 OID 0)
-- Dependencies: 246
-- Name: COLUMN eventtypes.notify_timeout; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.notify_timeout IS 'Tiempo que la notificacion sera visible para el usuario';


--
-- TOC entry 4155 (class 0 OID 0)
-- Dependencies: 246
-- Name: COLUMN eventtypes.notify_closable; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.notify_closable IS 'La notificacion puede ser cerrada por el usuario antes de que se cierre automaticamente una vez trascurrido el timeout.';


--
-- TOC entry 4156 (class 0 OID 0)
-- Dependencies: 246
-- Name: COLUMN eventtypes.notify_img; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.notify_img IS 'Imagen a ser  mostrada en la notificacion';


--
-- TOC entry 4157 (class 0 OID 0)
-- Dependencies: 246
-- Name: COLUMN eventtypes.notify_snd; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.notify_snd IS 'Sonido a ser escuchado cuando la notificacion es mostrada.';


--
-- TOC entry 4158 (class 0 OID 0)
-- Dependencies: 246
-- Name: COLUMN eventtypes.label; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.label IS 'Etiqueta que se mostrara en la interface grafica';


--
-- TOC entry 4159 (class 0 OID 0)
-- Dependencies: 246
-- Name: COLUMN eventtypes.code; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.code IS 'Codigo de alarma';


--
-- TOC entry 4160 (class 0 OID 0)
-- Dependencies: 246
-- Name: COLUMN eventtypes.notify_all_users; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.notify_all_users IS 'Muestra la notificacion de este evento a todos los usuarios  o solo al usuario que lo genera.';


--
-- TOC entry 4161 (class 0 OID 0)
-- Dependencies: 246
-- Name: COLUMN eventtypes.expiration; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.expiration IS 'Tiempo en que el evento permanece en espera de sewr atendido antes de ser cerrado automaticamente por el sistema, en minutos.
De fabrica 525600 = 365 dias.
Se puede usar este campo para auto cerrar los eventos que no requieren tratamiento por parte del operador seteando en valor a 0.';


--
-- TOC entry 4162 (class 0 OID 0)
-- Dependencies: 246
-- Name: COLUMN eventtypes.auto_close_on_event_defined; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.auto_close_on_event_defined IS 'Cierra el evento automaticamente si llega un evento con idevent listado en esta matriz.';


--
-- TOC entry 4163 (class 0 OID 0)
-- Dependencies: 246
-- Name: COLUMN eventtypes.eventtype_groups; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.eventtype_groups IS 'Para formar grupos de eventos.';


--
-- TOC entry 247 (class 1259 OID 90879)
-- Name: eventtypes_ideventtype_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE eventtypes_ideventtype_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE eventtypes_ideventtype_seq OWNER TO postgres;

--
-- TOC entry 4164 (class 0 OID 0)
-- Dependencies: 247
-- Name: eventtypes_ideventtype_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE eventtypes_ideventtype_seq OWNED BY eventtypes.ideventtype;


--
-- TOC entry 248 (class 1259 OID 90881)
-- Name: farma_lista_precios_farmacias; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE farma_lista_precios_farmacias (
    idlista_precios bigint NOT NULL,
    idaccount integer,
    principal text,
    activa text,
    productos integer DEFAULT (-1),
    status text,
    ts timestamp without time zone,
    ts_lista_farmacia timestamp without time zone DEFAULT now(),
    srv159_activa text,
    srv159_productos integer DEFAULT (-1),
    srv159_principal text,
    ts_lista_srv159 timestamp without time zone DEFAULT now(),
    sincronizado text DEFAULT false,
    provincia text,
    ip text
);


ALTER TABLE farma_lista_precios_farmacias OWNER TO postgres;

--
-- TOC entry 4165 (class 0 OID 0)
-- Dependencies: 248
-- Name: TABLE farma_lista_precios_farmacias; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE farma_lista_precios_farmacias IS 'Tabla con la lista de precios de actuales de las farmacias';


--
-- TOC entry 249 (class 1259 OID 90892)
-- Name: farma_lista_precios_farmacias_idlista_precios_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE farma_lista_precios_farmacias_idlista_precios_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE farma_lista_precios_farmacias_idlista_precios_seq OWNER TO postgres;

--
-- TOC entry 4166 (class 0 OID 0)
-- Dependencies: 249
-- Name: farma_lista_precios_farmacias_idlista_precios_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE farma_lista_precios_farmacias_idlista_precios_seq OWNED BY farma_lista_precios_farmacias.idlista_precios;


--
-- TOC entry 250 (class 1259 OID 90894)
-- Name: groups; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE groups (
    idgroup bigint NOT NULL,
    ts timestamp without time zone DEFAULT now(),
    enabled boolean DEFAULT true,
    name text NOT NULL,
    description text,
    note text,
    iddivision bigint
);


ALTER TABLE groups OWNER TO postgres;

--
-- TOC entry 4167 (class 0 OID 0)
-- Dependencies: 250
-- Name: TABLE groups; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE groups IS 'Grupos';


--
-- TOC entry 251 (class 1259 OID 90902)
-- Name: groups_idgrupo_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE groups_idgrupo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE groups_idgrupo_seq OWNER TO postgres;

--
-- TOC entry 4168 (class 0 OID 0)
-- Dependencies: 251
-- Name: groups_idgrupo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE groups_idgrupo_seq OWNED BY groups.idgroup;


--
-- TOC entry 252 (class 1259 OID 90904)
-- Name: gui_tables_columns; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE gui_tables_columns (
    table_name text NOT NULL,
    column_name text NOT NULL,
    data_type text NOT NULL,
    column_default text,
    column_label text NOT NULL,
    column_width text,
    ts timestamp without time zone DEFAULT now()
);


ALTER TABLE gui_tables_columns OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 90911)
-- Name: identification_types; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE identification_types (
    ididtype bigint NOT NULL,
    ts timestamp without time zone DEFAULT now(),
    enabled boolean DEFAULT true,
    name text NOT NULL,
    note text
);


ALTER TABLE identification_types OWNER TO postgres;

--
-- TOC entry 254 (class 1259 OID 90919)
-- Name: identification_type_ididtype_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE identification_type_ididtype_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE identification_type_ididtype_seq OWNER TO postgres;

--
-- TOC entry 4169 (class 0 OID 0)
-- Dependencies: 254
-- Name: identification_type_ididtype_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE identification_type_ididtype_seq OWNED BY identification_types.ididtype;


--
-- TOC entry 255 (class 1259 OID 90921)
-- Name: interface_words; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE interface_words (
    idword bigint NOT NULL,
    word text NOT NULL,
    notes text,
    ts timestamp without time zone DEFAULT now(),
    traslation text
);


ALTER TABLE interface_words OWNER TO postgres;

--
-- TOC entry 4170 (class 0 OID 0)
-- Dependencies: 255
-- Name: TABLE interface_words; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE interface_words IS 'Lista de palabras o frases comunes usadas en la interface grafica que pueden ser usadas para traduccion a diferentes idiomas';


--
-- TOC entry 4171 (class 0 OID 0)
-- Dependencies: 255
-- Name: COLUMN interface_words.word; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN interface_words.word IS 'Palabras usadas en la interface grafica';


--
-- TOC entry 256 (class 1259 OID 90928)
-- Name: interface_words_idwords_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE interface_words_idwords_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE interface_words_idwords_seq OWNER TO postgres;

--
-- TOC entry 4172 (class 0 OID 0)
-- Dependencies: 256
-- Name: interface_words_idwords_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE interface_words_idwords_seq OWNED BY interface_words.idword;


--
-- TOC entry 257 (class 1259 OID 90930)
-- Name: network_devices; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE network_devices (
    idequipment bigint DEFAULT nextval('equipments_idequipment_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    equipment text,
    mark text,
    model text,
    serial_number text,
    description text,
    installation_date timestamp without time zone DEFAULT now(),
    uninstall_date timestamp without time zone,
    note text,
    code_ref text,
    idaccount integer,
    operability smallint DEFAULT 100,
    idprovider integer,
    agreement_code_provider text,
    ip inet,
    mac macaddr,
    network_access_method text,
    connection_speed real DEFAULT (-100),
    username text,
    pwd text,
    port smallint,
    monitored boolean DEFAULT true NOT NULL
)
INHERITS (equipments);


ALTER TABLE network_devices OWNER TO postgres;

--
-- TOC entry 4173 (class 0 OID 0)
-- Dependencies: 257
-- Name: TABLE network_devices; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE network_devices IS 'Equipos que funcionan en red o estan conectados a una red y disponen de direccion IP.';


--
-- TOC entry 4174 (class 0 OID 0)
-- Dependencies: 257
-- Name: COLUMN network_devices.ip; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN network_devices.ip IS 'Direccion IP';


--
-- TOC entry 4175 (class 0 OID 0)
-- Dependencies: 257
-- Name: COLUMN network_devices.mac; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN network_devices.mac IS 'MAC';


--
-- TOC entry 258 (class 1259 OID 90942)
-- Name: notification_area; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE notification_area (
    idnotify bigint NOT NULL,
    ts timestamp without time zone DEFAULT now(),
    urgency integer DEFAULT 10,
    timeout integer DEFAULT 15,
    closable boolean DEFAULT false,
    img text,
    snd text,
    title text,
    body text,
    sessionid text DEFAULT 'all'::text
)
WITH (autovacuum_enabled='true');


ALTER TABLE notification_area OWNER TO postgres;

--
-- TOC entry 4176 (class 0 OID 0)
-- Dependencies: 258
-- Name: COLUMN notification_area.sessionid; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN notification_area.sessionid IS 'Numero de referencia del usuario al que se va a mostrar las notificaciones, si este campo es igual a ''all'' se mostrara a todos los usuarios conectados.';


--
-- TOC entry 259 (class 1259 OID 90953)
-- Name: notification_area_idnotify_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE notification_area_idnotify_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE notification_area_idnotify_seq OWNER TO postgres;

--
-- TOC entry 4177 (class 0 OID 0)
-- Dependencies: 259
-- Name: notification_area_idnotify_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE notification_area_idnotify_seq OWNED BY notification_area.idnotify;


--
-- TOC entry 260 (class 1259 OID 90955)
-- Name: oams_table_columns; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE oams_table_columns (
    table_name text NOT NULL,
    column_name text NOT NULL,
    data_type text NOT NULL,
    column_default text,
    column_label text NOT NULL,
    column_width text,
    ts timestamp without time zone DEFAULT now(),
    idword bigint
);


ALTER TABLE oams_table_columns OWNER TO postgres;

--
-- TOC entry 4178 (class 0 OID 0)
-- Dependencies: 260
-- Name: TABLE oams_table_columns; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE oams_table_columns IS 'Propiedades de los Campos de las tables del sistema, definidas por el sistema y por el usuario';


--
-- TOC entry 4179 (class 0 OID 0)
-- Dependencies: 260
-- Name: COLUMN oams_table_columns.table_name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN oams_table_columns.table_name IS 'id table column';


--
-- TOC entry 4180 (class 0 OID 0)
-- Dependencies: 260
-- Name: COLUMN oams_table_columns.column_label; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN oams_table_columns.column_label IS 'Etiqueta definida por el usuario.
Si  es null se usa el nombre de la columna';


--
-- TOC entry 261 (class 1259 OID 90962)
-- Name: phone_providers; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE phone_providers (
    idprovider bigint NOT NULL,
    ts timestamp without time zone DEFAULT now(),
    enable boolean DEFAULT true,
    provider text NOT NULL
);


ALTER TABLE phone_providers OWNER TO postgres;

--
-- TOC entry 262 (class 1259 OID 90970)
-- Name: phone_types; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE phone_types (
    idphonetype bigint NOT NULL,
    ts timestamp without time zone DEFAULT now(),
    type text NOT NULL
);


ALTER TABLE phone_types OWNER TO postgres;

--
-- TOC entry 263 (class 1259 OID 90977)
-- Name: phone_type_idphonetype_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE phone_type_idphonetype_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE phone_type_idphonetype_seq OWNER TO postgres;

--
-- TOC entry 4181 (class 0 OID 0)
-- Dependencies: 263
-- Name: phone_type_idphonetype_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE phone_type_idphonetype_seq OWNED BY phone_types.idphonetype;


--
-- TOC entry 264 (class 1259 OID 90979)
-- Name: phones; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE phones (
    idphone bigint NOT NULL,
    ts timestamp without time zone DEFAULT now(),
    enabled boolean DEFAULT true,
    idcontact integer DEFAULT 0 NOT NULL,
    idprovider integer DEFAULT 0,
    idphonetype integer DEFAULT 0,
    number text NOT NULL,
    ext text,
    note text
);


ALTER TABLE phones OWNER TO postgres;

--
-- TOC entry 4182 (class 0 OID 0)
-- Dependencies: 264
-- Name: COLUMN phones.idcontact; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN phones.idcontact IS 'Validar si existe este contacto hay que hacerlo manualmente ya que hay una tabla heredada accounts.';


--
-- TOC entry 265 (class 1259 OID 90990)
-- Name: phones_idphone_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE phones_idphone_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE phones_idphone_seq OWNER TO postgres;

--
-- TOC entry 4183 (class 0 OID 0)
-- Dependencies: 265
-- Name: phones_idphone_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE phones_idphone_seq OWNED BY phones.idphone;


--
-- TOC entry 266 (class 1259 OID 90992)
-- Name: providers; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE providers (
    idcontact bigint DEFAULT nextval('contacts_idcontact_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    enabled boolean DEFAULT true,
    first_name text,
    last_name text,
    birthday timestamp without time zone,
    identification text,
    ididtype integer DEFAULT 0,
    postal_code text,
    gender integer DEFAULT 0,
    geox double precision DEFAULT 0,
    geoy double precision DEFAULT 0,
    note text,
    address text,
    address_ref text,
    groups integer[],
    is_admin boolean DEFAULT false NOT NULL,
    admin_start timestamp without time zone DEFAULT now() NOT NULL,
    admin_end timestamp without time zone DEFAULT now() NOT NULL,
    admin_username text,
    admin_pwd text,
    admin_sessionid text,
    admin_ip text,
    admin_level integer DEFAULT 0 NOT NULL,
    product_or_service text NOT NULL
)
INHERITS (contacts);


ALTER TABLE providers OWNER TO postgres;

--
-- TOC entry 4184 (class 0 OID 0)
-- Dependencies: 266
-- Name: TABLE providers; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE providers IS 'Lista de proveedores de productos y servicios';


--
-- TOC entry 267 (class 1259 OID 91009)
-- Name: providers_idprovider_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE providers_idprovider_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE providers_idprovider_seq OWNER TO postgres;

--
-- TOC entry 4185 (class 0 OID 0)
-- Dependencies: 267
-- Name: providers_idprovider_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE providers_idprovider_seq OWNED BY phone_providers.idprovider;


--
-- TOC entry 268 (class 1259 OID 91011)
-- Name: sys_table_ts; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE sys_table_ts (
    table_name text NOT NULL,
    ts timestamp without time zone DEFAULT now(),
    tsz timestamp with time zone DEFAULT now()
);


ALTER TABLE sys_table_ts OWNER TO postgres;

--
-- TOC entry 4186 (class 0 OID 0)
-- Dependencies: 268
-- Name: TABLE sys_table_ts; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE sys_table_ts IS 'Esta tabla contiene el timestamp de la ultima actualizacion de las tablas.';


--
-- TOC entry 4187 (class 0 OID 0)
-- Dependencies: 268
-- Name: COLUMN sys_table_ts.table_name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN sys_table_ts.table_name IS 'Nombre de la tabla de la base de datos.';


--
-- TOC entry 269 (class 1259 OID 91019)
-- Name: test2; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE test2 (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    priority integer DEFAULT (-1),
    ideventtype integer,
    description text,
    idadmin integer,
    last_comment timestamp without time zone,
    zu bigint DEFAULT 0,
    idequipment bigint,
    job_name text,
    job_enabled boolean DEFAULT true,
    job_description text,
    job_date_create timestamp without time zone,
    job_run_duration integer DEFAULT (-1),
    job_run_status smallint DEFAULT (-10),
    job_next_run timestamp without time zone
)
INHERITS (events_jobs);


ALTER TABLE test2 OWNER TO postgres;

--
-- TOC entry 4188 (class 0 OID 0)
-- Dependencies: 269
-- Name: COLUMN test2.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN test2.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 4189 (class 0 OID 0)
-- Dependencies: 269
-- Name: COLUMN test2.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN test2.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 4190 (class 0 OID 0)
-- Dependencies: 269
-- Name: COLUMN test2.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN test2.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 270 (class 1259 OID 91035)
-- Name: udc_tables_columns; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE udc_tables_columns (
    table_name text NOT NULL,
    column_name text NOT NULL,
    data_type text NOT NULL,
    column_default text,
    column_label text NOT NULL,
    column_width text,
    ts timestamp without time zone DEFAULT now(),
    column_decorator text,
    column_class text
);


ALTER TABLE udc_tables_columns OWNER TO postgres;

--
-- TOC entry 271 (class 1259 OID 91042)
-- Name: view_account_contacts; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW view_account_contacts AS
 SELECT account_contacts.idaccountuser,
    account_contacts.ts,
    account_contacts.idaccount,
    accounts.enabled,
    accounts.account,
    ((accounts.last_name || ' '::text) || accounts.first_name) AS account_name,
    accounts.geox,
    accounts.geoy,
    ((((((('http://www.openstreetmap.org/?mlat='::text || accounts.geox) || '&mlon='::text) || accounts.geoy) || '#map=19/'::text) || accounts.geox) || '/'::text) || accounts.geoy) AS geolink,
    accounts.address,
    accounts.address_ref,
    account_contacts.idcontact,
    contacts.first_name,
    contacts.last_name,
    ((contacts.last_name || ' '::text) || contacts.first_name) AS contact_name,
    contacts.birthday,
    contacts.identification,
    account_contacts.appointment,
    account_contacts.priority,
    account_contacts.note
   FROM contacts,
    account_contacts,
    accounts
  WHERE ((account_contacts.idcontact = contacts.idcontact) AND (accounts.idcontact = account_contacts.idaccount));


ALTER TABLE view_account_contacts OWNER TO postgres;

--
-- TOC entry 272 (class 1259 OID 91047)
-- Name: view_account_network_devices; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW view_account_network_devices AS
 SELECT accounts.idcontact,
    accounts.enabled,
    accounts.first_name,
    accounts.last_name,
    accounts.account,
    accounts.idaccountstate,
    accounts.idaccounttype,
    accounts.iddivision,
    accounts.geox,
    accounts.geoy,
    accounts.identification,
    network_devices.idequipment,
    network_devices.equipment,
    network_devices.mark,
    network_devices.model,
    network_devices.serial_number,
    network_devices.description,
    network_devices.ip,
    network_devices.code_ref,
    network_devices.mac,
    network_devices.username,
    network_devices.pwd,
    network_devices.port,
    network_devices.monitored
   FROM accounts,
    network_devices
  WHERE (accounts.idcontact = network_devices.idaccount);


ALTER TABLE view_account_network_devices OWNER TO postgres;

--
-- TOC entry 289 (class 1259 OID 93550)
-- Name: view_account_users; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW view_account_users AS
 SELECT accounts.idcontact AS idaccount,
    accounts.account,
    accounts.enabled,
    ((accounts.last_name || ' '::text) || accounts.first_name) AS account_name,
    accounts.identification AS account_identification,
    account_users.idaccountuser,
    account_users.idcontact,
    ((contacts.last_name || ' '::text) || contacts.first_name) AS user_name,
    contacts.identification,
    account_users.appointment,
    account_users.priority,
    account_users.account_user,
    account_users.account_pwd
   FROM accounts,
    account_users,
    contacts
  WHERE ((accounts.idcontact = account_users.idaccount) AND (account_users.idcontact = contacts.idcontact));


ALTER TABLE view_account_users OWNER TO postgres;

--
-- TOC entry 273 (class 1259 OID 91056)
-- Name: view_accounts; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW view_accounts AS
 SELECT accounts.idcontact,
    accounts.ts,
    accounts.enabled,
    ((accounts.last_name || ' '::text) || accounts.first_name) AS account_name,
    accounts.birthday,
    accounts.identification,
    accounts.ididtype,
    identification_types.name AS identification_type,
    accounts.iddivision,
    divisions.name AS account_division,
    accounts.postal_code,
    accounts.gender,
    accounts.geox,
    accounts.geoy,
    accounts.address,
    accounts.address_ref,
    accounts.idaccountstate,
    accounts.idaccounttype,
    account_types.type AS account_type,
    accounts.start_date,
    accounts.end_date,
    accounts.account,
    accounts.note
   FROM (((accounts
     JOIN divisions ON ((accounts.iddivision = divisions.iddivision)))
     JOIN account_types ON ((accounts.idaccounttype = account_types.idaccounttype)))
     JOIN identification_types ON ((accounts.ididtype = identification_types.ididtype)));


ALTER TABLE view_accounts OWNER TO postgres;

--
-- TOC entry 274 (class 1259 OID 91061)
-- Name: view_accounts_oams_assigned; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW view_accounts_oams_assigned AS
 SELECT view_account_contacts.idaccountuser,
    view_account_contacts.ts,
    view_account_contacts.idaccount,
    view_account_contacts.account,
    view_account_contacts.enabled,
    view_account_contacts.account_name,
    view_account_contacts.geox,
    view_account_contacts.geoy,
    view_account_contacts.geolink,
    view_account_contacts.address,
    view_account_contacts.address_ref,
    view_account_contacts.idcontact,
    view_account_contacts.first_name,
    view_account_contacts.last_name,
    view_account_contacts.contact_name,
    view_account_contacts.birthday,
    view_account_contacts.identification,
    view_account_contacts.appointment,
    view_account_contacts.priority,
    view_account_contacts.note
   FROM view_account_contacts
  WHERE (view_account_contacts.appointment = 'Técnico Responsable'::text);


ALTER TABLE view_accounts_oams_assigned OWNER TO postgres;

--
-- TOC entry 290 (class 1259 OID 93554)
-- Name: view_accounts_users_pwd; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW view_accounts_users_pwd AS
 SELECT accounts.idcontact AS idaccount,
    accounts.enabled AS enabled_account,
    account_users.enabled AS enabled_user,
    accounts.first_name,
    accounts.last_name,
    accounts.identification,
    accounts.account,
    account_users.idcontact,
    account_users.account_user,
    account_users.account_pwd,
    account_users.appointment
   FROM accounts,
    account_users
  WHERE (accounts.idcontact = account_users.idaccount);


ALTER TABLE view_accounts_users_pwd OWNER TO postgres;

--
-- TOC entry 275 (class 1259 OID 91069)
-- Name: view_admins; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW view_admins AS
 SELECT contacts.idcontact,
    ((contacts.last_name || ' '::text) || contacts.last_name) AS contact_name,
    contacts.birthday,
    contacts.identification,
    contacts.ididtype,
    contacts.gender,
    contacts.address,
    contacts.groups,
    admins.idadmin,
    admins.enabled,
    admins.admin_start,
    admins.admin_end,
    admins.admin_username,
    admins.admin_pwd,
    admins.admin_sessionid,
    admins.admin_ip,
    admins.admin_level,
    admins.admin_role,
    admins.admin_locked_date,
    admins.admin_failed_access_attempts
   FROM admins,
    contacts
  WHERE (contacts.idcontact = admins.idcontact);


ALTER TABLE view_admins OWNER TO postgres;

--
-- TOC entry 276 (class 1259 OID 91074)
-- Name: view_contact_groups_they_belong; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW view_contact_groups_they_belong AS
 SELECT fun_view_contact_groups_they_belong.idcontact,
    fun_view_contact_groups_they_belong.idgroup,
    fun_view_contact_groups_they_belong.ts,
    fun_view_contact_groups_they_belong.ismember,
    fun_view_contact_groups_they_belong.enabled,
    fun_view_contact_groups_they_belong.name,
    fun_view_contact_groups_they_belong.description,
    fun_view_contact_groups_they_belong.note
   FROM fun_view_contact_groups_they_belong((0)::bigint) fun_view_contact_groups_they_belong(idcontact, idgroup, ts, ismember, enabled, name, description, note);


ALTER TABLE view_contact_groups_they_belong OWNER TO postgres;

--
-- TOC entry 277 (class 1259 OID 91078)
-- Name: view_contacts; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW view_contacts AS
 SELECT contacts.idcontact,
    contacts.ts,
    contacts.enabled,
    ((contacts.last_name || ' '::text) || contacts.first_name) AS contact_name,
    contacts.birthday,
    contacts.identification,
    contacts.ididtype,
    contacts.postal_code,
    contacts.gender,
    contacts.geox,
    contacts.geoy,
    contacts.address,
    contacts.address_ref,
    contacts.groups,
    contacts.note
   FROM contacts;


ALTER TABLE view_contacts OWNER TO postgres;

--
-- TOC entry 278 (class 1259 OID 91082)
-- Name: view_equipments; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW view_equipments AS
 SELECT accounts.idcontact,
    accounts.enabled,
    accounts.account,
    ((accounts.last_name || ' '::text) || accounts.first_name) AS account_name,
    accounts.idaccounttype,
    ( SELECT account_types.type
           FROM account_types
          WHERE (account_types.idaccounttype = accounts.idaccounttype)) AS accounttype,
    accounts.identification,
    equipments.code_ref,
    equipments.equipment,
    equipments.mark,
    equipments.model,
    equipments.serial_number,
    equipments.description,
    equipments.installation_date,
    equipments.uninstall_date,
    equipments.operability,
    equipments.note,
    ( SELECT string_agg(( SELECT ((contacts.last_name || ' '::text) || contacts.first_name) AS n
                   FROM contacts
                  WHERE (contacts.idcontact = account_contacts.idcontact)), ', '::text) AS string_agg
           FROM account_contacts
          WHERE ((account_contacts.idaccount = accounts.idcontact) AND (account_contacts.appointment = 'Técnico Responsable'::text))) AS oams_assigned,
    accounts.idaccountstate,
    equipments.idequipment,
    equipments.idprovider,
    equipments.agreement_code_provider
   FROM accounts,
    equipments
  WHERE (accounts.idcontact = equipments.idaccount);


ALTER TABLE view_equipments OWNER TO postgres;

--
-- TOC entry 279 (class 1259 OID 91087)
-- Name: view_events_monitor; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW view_events_monitor AS
 SELECT events.idevent,
    events.dateevent,
    events.status,
    fun_event_status_get_label(events.status) AS status_label,
    events.idaccount,
    events.zu,
    events.priority,
    events.ideventtype,
    events.description,
    events.last_comment,
    ((accounts.last_name || ' '::text) || accounts.first_name) AS account_name,
    accounts.account,
    eventtypes.label,
    ( SELECT string_agg(( SELECT ((contacts.last_name || ' '::text) || contacts.first_name) AS n
                   FROM contacts
                  WHERE (contacts.idcontact = account_contacts.idcontact)), ', '::text) AS string_agg
           FROM account_contacts
          WHERE ((account_contacts.idaccount = events.idaccount) AND (account_contacts.appointment = 'Técnico Responsable'::text))) AS oams_assigned
   FROM events,
    accounts,
    eventtypes
  WHERE (((events.status = 0) AND (events.idaccount = accounts.idcontact)) AND (events.ideventtype = eventtypes.ideventtype))
  ORDER BY events.dateevent DESC, events.idevent DESC;


ALTER TABLE view_events_monitor OWNER TO postgres;

--
-- TOC entry 280 (class 1259 OID 91092)
-- Name: view_events_with_eventtypes_detail; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW view_events_with_eventtypes_detail AS
 SELECT events.idevent,
    events.dateevent,
    events.status,
    events.zu,
    events.idaccount,
    events.ideventtype,
    eventtypes.enable_auto_close_on_event_defined,
    eventtypes.auto_close_on_event_defined
   FROM events,
    eventtypes
  WHERE (((eventtypes.ideventtype = events.ideventtype) AND (events.status = 0)) AND (eventtypes.enable_auto_close_on_event_defined = true));


ALTER TABLE view_events_with_eventtypes_detail OWNER TO postgres;

--
-- TOC entry 281 (class 1259 OID 91096)
-- Name: view_farma_lista_precios; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW view_farma_lista_precios AS
 SELECT fun_view_farma_lista_precios.idaccount,
    fun_view_farma_lista_precios.account,
    fun_view_farma_lista_precios.ts_farmacia,
    fun_view_farma_lista_precios.ts_server159,
    fun_view_farma_lista_precios.account_name,
    fun_view_farma_lista_precios.address,
    fun_view_farma_lista_precios.tecnico,
    fun_view_farma_lista_precios.note,
    fun_view_farma_lista_precios.srv159_principal,
    fun_view_farma_lista_precios.srv159_activa,
    fun_view_farma_lista_precios.srv159_productos,
    fun_view_farma_lista_precios.principal,
    fun_view_farma_lista_precios.activa,
    fun_view_farma_lista_precios.productos,
    fun_view_farma_lista_precios.estado,
    fun_view_farma_lista_precios.sincronizado,
    fun_view_farma_lista_precios.provincia,
    fun_view_farma_lista_precios.ip
   FROM fun_view_farma_lista_precios() fun_view_farma_lista_precios(idaccount, account, ts_farmacia, ts_server159, account_name, address, tecnico, note, srv159_principal, srv159_activa, srv159_productos, principal, activa, productos, estado, sincronizado, provincia, ip);


ALTER TABLE view_farma_lista_precios OWNER TO postgres;

--
-- TOC entry 282 (class 1259 OID 91100)
-- Name: view_table_events_father; Type: MATERIALIZED VIEW; Schema: public; Owner: postgres; Tablespace: 
--

CREATE MATERIALIZED VIEW view_table_events_father AS
 SELECT DISTINCT ON (columns.table_name) columns.table_name
   FROM information_schema.columns
  WHERE (((((columns.table_name)::text ~~ 'events%'::text) AND (NOT ((columns.table_name)::text ~ '.[0-9]'::text))) AND ((columns.table_catalog)::text = 'open_ams'::text)) AND ((columns.table_schema)::text = 'public'::text))
  ORDER BY columns.table_name, columns.column_name, columns.data_type
  WITH NO DATA;


ALTER TABLE view_table_events_father OWNER TO postgres;

--
-- TOC entry 4191 (class 0 OID 0)
-- Dependencies: 282
-- Name: MATERIALIZED VIEW view_table_events_father; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON MATERIALIZED VIEW view_table_events_father IS 'Tablas padres de eventos';


--
-- TOC entry 2451 (class 2604 OID 93558)
-- Name: idaccountuser; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY account_contacts ALTER COLUMN idaccountuser SET DEFAULT nextval('account_users_idaccountuser_seq'::regclass);


--
-- TOC entry 2454 (class 2604 OID 93559)
-- Name: idaccountstate; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY account_states ALTER COLUMN idaccountstate SET DEFAULT nextval('account_state_idaccountstate_seq'::regclass);


--
-- TOC entry 2456 (class 2604 OID 93560)
-- Name: idaccounttype; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY account_types ALTER COLUMN idaccounttype SET DEFAULT nextval('account_types_idaccounttype_seq'::regclass);


--
-- TOC entry 2482 (class 2604 OID 93561)
-- Name: idadmin; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY admins ALTER COLUMN idadmin SET DEFAULT nextval('admins_idadmin_seq'::regclass);


--
-- TOC entry 2483 (class 2604 OID 93562)
-- Name: idcontact; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY admins ALTER COLUMN idcontact SET DEFAULT nextval('admins_idcontact_seq'::regclass);


--
-- TOC entry 2484 (class 2604 OID 93563)
-- Name: idattachment; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY attachments ALTER COLUMN idattachment SET DEFAULT nextval('attachments_idattachment_seq'::regclass);


--
-- TOC entry 2464 (class 2604 OID 93564)
-- Name: idcontact; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY contacts ALTER COLUMN idcontact SET DEFAULT nextval('contacts_idcontact_seq'::regclass);


--
-- TOC entry 2486 (class 2604 OID 93565)
-- Name: iddivision; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY divisions ALTER COLUMN iddivision SET DEFAULT nextval('division_iddivision_seq'::regclass);


--
-- TOC entry 2489 (class 2604 OID 93566)
-- Name: idemail; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY emails ALTER COLUMN idemail SET DEFAULT nextval('emails_idemail_seq'::regclass);


--
-- TOC entry 2494 (class 2604 OID 93567)
-- Name: idequipment; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY equipments ALTER COLUMN idequipment SET DEFAULT nextval('equipments_idequipment_seq'::regclass);


--
-- TOC entry 2500 (class 2604 OID 93568)
-- Name: ideventcomment; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY event_comments ALTER COLUMN ideventcomment SET DEFAULT nextval('event_comments_ideventcomment_seq'::regclass);


--
-- TOC entry 2498 (class 2604 OID 93569)
-- Name: ideventcommentattach; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY event_comments_attachments ALTER COLUMN ideventcommentattach SET DEFAULT nextval('event_attachments_ideventattach_seq'::regclass);


--
-- TOC entry 2450 (class 2604 OID 93570)
-- Name: idevent; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events ALTER COLUMN idevent SET DEFAULT nextval('events_idevent_seq'::regclass);


--
-- TOC entry 2934 (class 2604 OID 93571)
-- Name: ideventtype; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY eventtypes ALTER COLUMN ideventtype SET DEFAULT nextval('eventtypes_ideventtype_seq'::regclass);


--
-- TOC entry 2940 (class 2604 OID 93572)
-- Name: idlista_precios; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY farma_lista_precios_farmacias ALTER COLUMN idlista_precios SET DEFAULT nextval('farma_lista_precios_farmacias_idlista_precios_seq'::regclass);


--
-- TOC entry 2941 (class 2604 OID 93573)
-- Name: idgroup; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY groups ALTER COLUMN idgroup SET DEFAULT nextval('groups_idgrupo_seq'::regclass);


--
-- TOC entry 2945 (class 2604 OID 93574)
-- Name: ididtype; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY identification_types ALTER COLUMN ididtype SET DEFAULT nextval('identification_type_ididtype_seq'::regclass);


--
-- TOC entry 2948 (class 2604 OID 93575)
-- Name: idword; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY interface_words ALTER COLUMN idword SET DEFAULT nextval('interface_words_idwords_seq'::regclass);


--
-- TOC entry 2961 (class 2604 OID 93576)
-- Name: idnotify; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY notification_area ALTER COLUMN idnotify SET DEFAULT nextval('notification_area_idnotify_seq'::regclass);


--
-- TOC entry 2963 (class 2604 OID 93577)
-- Name: idprovider; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY phone_providers ALTER COLUMN idprovider SET DEFAULT nextval('providers_idprovider_seq'::regclass);


--
-- TOC entry 2966 (class 2604 OID 93578)
-- Name: idphonetype; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY phone_types ALTER COLUMN idphonetype SET DEFAULT nextval('phone_type_idphonetype_seq'::regclass);


--
-- TOC entry 2973 (class 2604 OID 93579)
-- Name: idphone; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY phones ALTER COLUMN idphone SET DEFAULT nextval('phones_idphone_seq'::regclass);


--
-- TOC entry 3510 (class 2606 OID 93581)
-- Name: account_users_idaccount_idcontact_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY account_users
    ADD CONSTRAINT account_users_idaccount_idcontact_key UNIQUE (idaccount, idcontact);


--
-- TOC entry 3512 (class 2606 OID 93583)
-- Name: account_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY account_users
    ADD CONSTRAINT account_users_pkey PRIMARY KEY (idaccountuser);


--
-- TOC entry 3054 (class 2606 OID 93585)
-- Name: accounts__pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY accounts
    ADD CONSTRAINT accounts__pkey PRIMARY KEY (idcontact);


--
-- TOC entry 3515 (class 2606 OID 93587)
-- Name: event_comments_201512_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY event_comments_201512
    ADD CONSTRAINT event_comments_201512_pkey PRIMARY KEY (ideventcomment);


--
-- TOC entry 3521 (class 2606 OID 93589)
-- Name: event_comments_201601_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY event_comments_201601
    ADD CONSTRAINT event_comments_201601_pkey PRIMARY KEY (ideventcomment);


--
-- TOC entry 3524 (class 2606 OID 93591)
-- Name: event_comments_201602_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY event_comments_201602
    ADD CONSTRAINT event_comments_201602_pkey PRIMARY KEY (ideventcomment);


--
-- TOC entry 3527 (class 2606 OID 93593)
-- Name: event_comments_201603_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY event_comments_201603
    ADD CONSTRAINT event_comments_201603_pkey PRIMARY KEY (ideventcomment);


--
-- TOC entry 3518 (class 2606 OID 93595)
-- Name: event_comments_2016_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY event_comments_2016
    ADD CONSTRAINT event_comments_2016_pkey PRIMARY KEY (ideventcomment);


--
-- TOC entry 3083 (class 2606 OID 93597)
-- Name: events_201512_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_201512
    ADD CONSTRAINT events_201512_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3096 (class 2606 OID 91769)
-- Name: events_201601_dateevent_idequipment_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_201601
    ADD CONSTRAINT events_201601_dateevent_idequipment_ideventtype_zu_key UNIQUE (dateevent, idequipment, ideventtype, zu);


--
-- TOC entry 3098 (class 2606 OID 93599)
-- Name: events_201601_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_201601
    ADD CONSTRAINT events_201601_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3100 (class 2606 OID 91777)
-- Name: events_201602_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_201602
    ADD CONSTRAINT events_201602_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3103 (class 2606 OID 91781)
-- Name: events_201603_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_201603
    ADD CONSTRAINT events_201603_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3087 (class 2606 OID 91786)
-- Name: events_2016_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_2016
    ADD CONSTRAINT events_2016_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idequipment, ideventtype, zu);


--
-- TOC entry 3089 (class 2606 OID 93601)
-- Name: events_2016_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_2016
    ADD CONSTRAINT events_2016_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3111 (class 2606 OID 91790)
-- Name: events_dbsizes_201512_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_dbsizes_201512
    ADD CONSTRAINT events_dbsizes_201512_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3114 (class 2606 OID 91792)
-- Name: events_dbsizes_201512_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_dbsizes_201512
    ADD CONSTRAINT events_dbsizes_201512_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3130 (class 2606 OID 91794)
-- Name: events_dbsizes_201601_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_dbsizes_201601
    ADD CONSTRAINT events_dbsizes_201601_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3133 (class 2606 OID 91800)
-- Name: events_dbsizes_201601_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_dbsizes_201601
    ADD CONSTRAINT events_dbsizes_201601_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3137 (class 2606 OID 91802)
-- Name: events_dbsizes_201602_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_dbsizes_201602
    ADD CONSTRAINT events_dbsizes_201602_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3140 (class 2606 OID 91804)
-- Name: events_dbsizes_201602_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_dbsizes_201602
    ADD CONSTRAINT events_dbsizes_201602_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3144 (class 2606 OID 91806)
-- Name: events_dbsizes_201603_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_dbsizes_201603
    ADD CONSTRAINT events_dbsizes_201603_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3147 (class 2606 OID 91808)
-- Name: events_dbsizes_201603_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_dbsizes_201603
    ADD CONSTRAINT events_dbsizes_201603_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3118 (class 2606 OID 91810)
-- Name: events_dbsizes_2016_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_dbsizes_2016
    ADD CONSTRAINT events_dbsizes_2016_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3121 (class 2606 OID 91812)
-- Name: events_dbsizes_2016_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_dbsizes_2016
    ADD CONSTRAINT events_dbsizes_2016_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3106 (class 2606 OID 91814)
-- Name: events_dbsizes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_dbsizes
    ADD CONSTRAINT events_dbsizes_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3158 (class 2606 OID 91816)
-- Name: events_device_uptime_201512_dateevent_idaccount_ideventtype_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_device_uptime_201512
    ADD CONSTRAINT events_device_uptime_201512_dateevent_idaccount_ideventtype_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3161 (class 2606 OID 91818)
-- Name: events_device_uptime_201512_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_device_uptime_201512
    ADD CONSTRAINT events_device_uptime_201512_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3177 (class 2606 OID 91820)
-- Name: events_device_uptime_201601_dateevent_idaccount_ideventtype_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_device_uptime_201601
    ADD CONSTRAINT events_device_uptime_201601_dateevent_idaccount_ideventtype_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3180 (class 2606 OID 91822)
-- Name: events_device_uptime_201601_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_device_uptime_201601
    ADD CONSTRAINT events_device_uptime_201601_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3184 (class 2606 OID 91824)
-- Name: events_device_uptime_201602_dateevent_idaccount_ideventtype_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_device_uptime_201602
    ADD CONSTRAINT events_device_uptime_201602_dateevent_idaccount_ideventtype_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3187 (class 2606 OID 91826)
-- Name: events_device_uptime_201602_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_device_uptime_201602
    ADD CONSTRAINT events_device_uptime_201602_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3191 (class 2606 OID 91828)
-- Name: events_device_uptime_201603_dateevent_idaccount_ideventtype_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_device_uptime_201603
    ADD CONSTRAINT events_device_uptime_201603_dateevent_idaccount_ideventtype_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3194 (class 2606 OID 91830)
-- Name: events_device_uptime_201603_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_device_uptime_201603
    ADD CONSTRAINT events_device_uptime_201603_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3165 (class 2606 OID 91832)
-- Name: events_device_uptime_2016_dateevent_idaccount_ideventtype_z_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_device_uptime_2016
    ADD CONSTRAINT events_device_uptime_2016_dateevent_idaccount_ideventtype_z_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3168 (class 2606 OID 91834)
-- Name: events_device_uptime_2016_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_device_uptime_2016
    ADD CONSTRAINT events_device_uptime_2016_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3205 (class 2606 OID 91836)
-- Name: events_diskspace_201512_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_diskspace_201512
    ADD CONSTRAINT events_diskspace_201512_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3208 (class 2606 OID 91838)
-- Name: events_diskspace_201512_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_diskspace_201512
    ADD CONSTRAINT events_diskspace_201512_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3224 (class 2606 OID 91840)
-- Name: events_diskspace_201601_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_diskspace_201601
    ADD CONSTRAINT events_diskspace_201601_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3227 (class 2606 OID 91842)
-- Name: events_diskspace_201601_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_diskspace_201601
    ADD CONSTRAINT events_diskspace_201601_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3231 (class 2606 OID 91848)
-- Name: events_diskspace_201602_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_diskspace_201602
    ADD CONSTRAINT events_diskspace_201602_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3234 (class 2606 OID 91851)
-- Name: events_diskspace_201602_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_diskspace_201602
    ADD CONSTRAINT events_diskspace_201602_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3240 (class 2606 OID 91854)
-- Name: events_diskspace_201603_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_diskspace_201603
    ADD CONSTRAINT events_diskspace_201603_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3243 (class 2606 OID 91856)
-- Name: events_diskspace_201603_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_diskspace_201603
    ADD CONSTRAINT events_diskspace_201603_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3212 (class 2606 OID 91858)
-- Name: events_diskspace_2016_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_diskspace_2016
    ADD CONSTRAINT events_diskspace_2016_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3215 (class 2606 OID 91860)
-- Name: events_diskspace_2016_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_diskspace_2016
    ADD CONSTRAINT events_diskspace_2016_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3198 (class 2606 OID 91862)
-- Name: events_diskspace_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_diskspace
    ADD CONSTRAINT events_diskspace_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3200 (class 2606 OID 91864)
-- Name: events_diskspace_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_diskspace
    ADD CONSTRAINT events_diskspace_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3269 (class 2606 OID 91866)
-- Name: events_jobs_199001_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_199001
    ADD CONSTRAINT events_jobs_199001_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3272 (class 2606 OID 91868)
-- Name: events_jobs_199001_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_199001
    ADD CONSTRAINT events_jobs_199001_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3257 (class 2606 OID 91870)
-- Name: events_jobs_1990_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_1990
    ADD CONSTRAINT events_jobs_1990_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3261 (class 2606 OID 91872)
-- Name: events_jobs_1990_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_1990
    ADD CONSTRAINT events_jobs_1990_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3277 (class 2606 OID 91874)
-- Name: events_jobs_201407_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_201407
    ADD CONSTRAINT events_jobs_201407_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3281 (class 2606 OID 91876)
-- Name: events_jobs_201407_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_201407
    ADD CONSTRAINT events_jobs_201407_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3285 (class 2606 OID 91878)
-- Name: events_jobs_201411_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_201411
    ADD CONSTRAINT events_jobs_201411_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3288 (class 2606 OID 91880)
-- Name: events_jobs_201411_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_201411
    ADD CONSTRAINT events_jobs_201411_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3293 (class 2606 OID 91882)
-- Name: events_jobs_201412_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_201412
    ADD CONSTRAINT events_jobs_201412_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3296 (class 2606 OID 91884)
-- Name: events_jobs_201412_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_201412
    ADD CONSTRAINT events_jobs_201412_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3308 (class 2606 OID 91886)
-- Name: events_jobs_201503_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_201503
    ADD CONSTRAINT events_jobs_201503_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3312 (class 2606 OID 91888)
-- Name: events_jobs_201503_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_201503
    ADD CONSTRAINT events_jobs_201503_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3316 (class 2606 OID 91890)
-- Name: events_jobs_201504_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_201504
    ADD CONSTRAINT events_jobs_201504_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3320 (class 2606 OID 91892)
-- Name: events_jobs_201504_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_201504
    ADD CONSTRAINT events_jobs_201504_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3324 (class 2606 OID 91894)
-- Name: events_jobs_201505_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_201505
    ADD CONSTRAINT events_jobs_201505_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3328 (class 2606 OID 91896)
-- Name: events_jobs_201505_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_201505
    ADD CONSTRAINT events_jobs_201505_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3333 (class 2606 OID 91898)
-- Name: events_jobs_201506_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_201506
    ADD CONSTRAINT events_jobs_201506_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3336 (class 2606 OID 91900)
-- Name: events_jobs_201506_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_201506
    ADD CONSTRAINT events_jobs_201506_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3341 (class 2606 OID 91902)
-- Name: events_jobs_201507_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_201507
    ADD CONSTRAINT events_jobs_201507_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3344 (class 2606 OID 91904)
-- Name: events_jobs_201507_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_201507
    ADD CONSTRAINT events_jobs_201507_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3349 (class 2606 OID 91906)
-- Name: events_jobs_201508_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_201508
    ADD CONSTRAINT events_jobs_201508_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3352 (class 2606 OID 91908)
-- Name: events_jobs_201508_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_201508
    ADD CONSTRAINT events_jobs_201508_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3357 (class 2606 OID 91910)
-- Name: events_jobs_201509_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_201509
    ADD CONSTRAINT events_jobs_201509_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3360 (class 2606 OID 91912)
-- Name: events_jobs_201509_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_201509
    ADD CONSTRAINT events_jobs_201509_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3365 (class 2606 OID 91914)
-- Name: events_jobs_201510_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_201510
    ADD CONSTRAINT events_jobs_201510_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3368 (class 2606 OID 91916)
-- Name: events_jobs_201510_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_201510
    ADD CONSTRAINT events_jobs_201510_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3372 (class 2606 OID 91918)
-- Name: events_jobs_201511_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_201511
    ADD CONSTRAINT events_jobs_201511_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3376 (class 2606 OID 91920)
-- Name: events_jobs_201511_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_201511
    ADD CONSTRAINT events_jobs_201511_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3380 (class 2606 OID 91922)
-- Name: events_jobs_201512_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_201512
    ADD CONSTRAINT events_jobs_201512_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3384 (class 2606 OID 91924)
-- Name: events_jobs_201512_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_201512
    ADD CONSTRAINT events_jobs_201512_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3300 (class 2606 OID 91926)
-- Name: events_jobs_2015_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_2015
    ADD CONSTRAINT events_jobs_2015_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3304 (class 2606 OID 91928)
-- Name: events_jobs_2015_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_2015
    ADD CONSTRAINT events_jobs_2015_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3401 (class 2606 OID 91930)
-- Name: events_jobs_201601_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_201601
    ADD CONSTRAINT events_jobs_201601_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3405 (class 2606 OID 91932)
-- Name: events_jobs_201601_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_201601
    ADD CONSTRAINT events_jobs_201601_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3409 (class 2606 OID 91934)
-- Name: events_jobs_201602_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_201602
    ADD CONSTRAINT events_jobs_201602_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3413 (class 2606 OID 91936)
-- Name: events_jobs_201602_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_201602
    ADD CONSTRAINT events_jobs_201602_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3417 (class 2606 OID 91938)
-- Name: events_jobs_201603_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_201603
    ADD CONSTRAINT events_jobs_201603_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3421 (class 2606 OID 91940)
-- Name: events_jobs_201603_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_201603
    ADD CONSTRAINT events_jobs_201603_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3388 (class 2606 OID 91942)
-- Name: events_jobs_2016_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_2016
    ADD CONSTRAINT events_jobs_2016_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3392 (class 2606 OID 91944)
-- Name: events_jobs_2016_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_2016
    ADD CONSTRAINT events_jobs_2016_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3249 (class 2606 OID 91946)
-- Name: events_jobs_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs
    ADD CONSTRAINT events_jobs_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3252 (class 2606 OID 91948)
-- Name: events_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs
    ADD CONSTRAINT events_jobs_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3433 (class 2606 OID 91950)
-- Name: events_raid_201511_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_raid_201511
    ADD CONSTRAINT events_raid_201511_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3437 (class 2606 OID 91952)
-- Name: events_raid_201511_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_raid_201511
    ADD CONSTRAINT events_raid_201511_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3425 (class 2606 OID 91954)
-- Name: events_raid_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_raid
    ADD CONSTRAINT events_raid_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3429 (class 2606 OID 91956)
-- Name: events_raid_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_raid
    ADD CONSTRAINT events_raid_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3152 (class 2606 OID 91958)
-- Name: events_sqlserver_uptime_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_device_uptime
    ADD CONSTRAINT events_sqlserver_uptime_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3154 (class 2606 OID 91960)
-- Name: events_sqlserver_uptime_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_device_uptime
    ADD CONSTRAINT events_sqlserver_uptime_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3470 (class 2606 OID 91962)
-- Name: network_devices_2_code_ref_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY network_devices
    ADD CONSTRAINT network_devices_2_code_ref_key UNIQUE (code_ref);


--
-- TOC entry 3472 (class 2606 OID 91964)
-- Name: network_devices_2_equipment_mark_serial_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY network_devices
    ADD CONSTRAINT network_devices_2_equipment_mark_serial_number_key UNIQUE (equipment, mark, serial_number);


--
-- TOC entry 3474 (class 2606 OID 91966)
-- Name: network_devices_2_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY network_devices
    ADD CONSTRAINT network_devices_2_pkey PRIMARY KEY (idequipment);


--
-- TOC entry 3042 (class 2606 OID 93603)
-- Name: pk_account_state_idaccountstate; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY account_states
    ADD CONSTRAINT pk_account_state_idaccountstate PRIMARY KEY (idaccountstate);


--
-- TOC entry 3046 (class 2606 OID 93605)
-- Name: pk_account_types_idaccounttype; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY account_types
    ADD CONSTRAINT pk_account_types_idaccounttype PRIMARY KEY (idaccounttype);


--
-- TOC entry 3038 (class 2606 OID 93607)
-- Name: pk_account_users_idaccounuser; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY account_contacts
    ADD CONSTRAINT pk_account_users_idaccounuser PRIMARY KEY (idaccountuser);


--
-- TOC entry 3059 (class 2606 OID 93609)
-- Name: pk_admin_idadmin; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY admins
    ADD CONSTRAINT pk_admin_idadmin PRIMARY KEY (idadmin);


--
-- TOC entry 3061 (class 2606 OID 91976)
-- Name: pk_attachments_idattachment; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY attachments
    ADD CONSTRAINT pk_attachments_idattachment PRIMARY KEY (idattachment);


--
-- TOC entry 3050 (class 2606 OID 93611)
-- Name: pk_contacts_idcontact; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY contacts
    ADD CONSTRAINT pk_contacts_idcontact PRIMARY KEY (idcontact);


--
-- TOC entry 3063 (class 2606 OID 93613)
-- Name: pk_division_iddivision; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY divisions
    ADD CONSTRAINT pk_division_iddivision PRIMARY KEY (iddivision);


--
-- TOC entry 3065 (class 2606 OID 93615)
-- Name: pk_email_idemail; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY emails
    ADD CONSTRAINT pk_email_idemail PRIMARY KEY (idemail);


--
-- TOC entry 3070 (class 2606 OID 93617)
-- Name: pk_equipments_idequipment; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY equipments
    ADD CONSTRAINT pk_equipments_idequipment PRIMARY KEY (idequipment);


--
-- TOC entry 3076 (class 2606 OID 91986)
-- Name: pk_event_attachments_ideventattach; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY event_comments_attachments
    ADD CONSTRAINT pk_event_attachments_ideventattach PRIMARY KEY (ideventcommentattach);


--
-- TOC entry 3081 (class 2606 OID 91988)
-- Name: pk_event_comments_ideventcomment; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY event_comments
    ADD CONSTRAINT pk_event_comments_ideventcomment PRIMARY KEY (ideventcomment);


--
-- TOC entry 3033 (class 2606 OID 91990)
-- Name: pk_events_idevent; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events
    ADD CONSTRAINT pk_events_idevent PRIMARY KEY (idevent);


--
-- TOC entry 3442 (class 2606 OID 91992)
-- Name: pk_eventtypes_ideventtype; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY eventtypes
    ADD CONSTRAINT pk_eventtypes_ideventtype PRIMARY KEY (ideventtype);


--
-- TOC entry 3451 (class 2606 OID 91994)
-- Name: pk_farma_lista_precios; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY farma_lista_precios_farmacias
    ADD CONSTRAINT pk_farma_lista_precios PRIMARY KEY (idlista_precios);


--
-- TOC entry 3455 (class 2606 OID 91996)
-- Name: pk_group_idgroup; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY groups
    ADD CONSTRAINT pk_group_idgroup PRIMARY KEY (idgroup);


--
-- TOC entry 3459 (class 2606 OID 91998)
-- Name: pk_guitc; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY gui_tables_columns
    ADD CONSTRAINT pk_guitc PRIMARY KEY (table_name, column_name);


--
-- TOC entry 3465 (class 2606 OID 92000)
-- Name: pk_id_interface_words; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY interface_words
    ADD CONSTRAINT pk_id_interface_words PRIMARY KEY (idword);


--
-- TOC entry 3461 (class 2606 OID 92002)
-- Name: pk_identification_type_ididtype; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY identification_types
    ADD CONSTRAINT pk_identification_type_ididtype PRIMARY KEY (ididtype);


--
-- TOC entry 3476 (class 2606 OID 92004)
-- Name: pk_notification_area_idnotify; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY notification_area
    ADD CONSTRAINT pk_notification_area_idnotify PRIMARY KEY (idnotify);


--
-- TOC entry 3478 (class 2606 OID 92006)
-- Name: pk_otc; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY oams_table_columns
    ADD CONSTRAINT pk_otc PRIMARY KEY (table_name, column_name);


--
-- TOC entry 3484 (class 2606 OID 92008)
-- Name: pk_phone_type_idphonetype; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY phone_types
    ADD CONSTRAINT pk_phone_type_idphonetype PRIMARY KEY (idphonetype);


--
-- TOC entry 3488 (class 2606 OID 92010)
-- Name: pk_phones_idphone; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY phones
    ADD CONSTRAINT pk_phones_idphone PRIMARY KEY (idphone);


--
-- TOC entry 3480 (class 2606 OID 92012)
-- Name: pk_providers_idprovider; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY phone_providers
    ADD CONSTRAINT pk_providers_idprovider PRIMARY KEY (idprovider);


--
-- TOC entry 3498 (class 2606 OID 92014)
-- Name: pk_tables_changed_name; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY sys_table_ts
    ADD CONSTRAINT pk_tables_changed_name PRIMARY KEY (table_name);


--
-- TOC entry 3508 (class 2606 OID 92016)
-- Name: pk_udctc; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY udc_tables_columns
    ADD CONSTRAINT pk_udctc PRIMARY KEY (table_name, column_name);


--
-- TOC entry 3492 (class 2606 OID 92018)
-- Name: providers_admin_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY providers
    ADD CONSTRAINT providers_admin_username_key UNIQUE (admin_username);


--
-- TOC entry 3494 (class 2606 OID 92020)
-- Name: providers_first_name_last_name_identification_ididtype_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY providers
    ADD CONSTRAINT providers_first_name_last_name_identification_ididtype_key UNIQUE (first_name, last_name, identification, ididtype);


--
-- TOC entry 3496 (class 2606 OID 92022)
-- Name: providers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY providers
    ADD CONSTRAINT providers_pkey PRIMARY KEY (idcontact);


--
-- TOC entry 3500 (class 2606 OID 92024)
-- Name: test2_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY test2
    ADD CONSTRAINT test2_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 3505 (class 2606 OID 92026)
-- Name: test2_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY test2
    ADD CONSTRAINT test2_pkey PRIMARY KEY (idevent);


--
-- TOC entry 3040 (class 2606 OID 93619)
-- Name: uniq_account_contacts_idcontact; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY account_contacts
    ADD CONSTRAINT uniq_account_contacts_idcontact UNIQUE (idaccount, idcontact);


--
-- TOC entry 3044 (class 2606 OID 93621)
-- Name: uniq_account_states_state; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY account_states
    ADD CONSTRAINT uniq_account_states_state UNIQUE (state);


--
-- TOC entry 3048 (class 2606 OID 93623)
-- Name: uniq_account_type_type; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY account_types
    ADD CONSTRAINT uniq_account_type_type UNIQUE (type);


--
-- TOC entry 3057 (class 2606 OID 93625)
-- Name: uniq_accounts_div_account_type_enabled; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY accounts
    ADD CONSTRAINT uniq_accounts_div_account_type_enabled UNIQUE (enabled, iddivision, account);


--
-- TOC entry 3052 (class 2606 OID 93627)
-- Name: uniq_contacts_fname_lname_identification_ididtype; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY contacts
    ADD CONSTRAINT uniq_contacts_fname_lname_identification_ididtype UNIQUE (first_name, last_name, identification, ididtype);


--
-- TOC entry 3067 (class 2606 OID 93629)
-- Name: uniq_email_idcontact_email; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY emails
    ADD CONSTRAINT uniq_email_idcontact_email UNIQUE (idcontact, email);


--
-- TOC entry 3072 (class 2606 OID 93631)
-- Name: uniq_equipments_cod_ref; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY equipments
    ADD CONSTRAINT uniq_equipments_cod_ref UNIQUE (code_ref);


--
-- TOC entry 3074 (class 2606 OID 93633)
-- Name: uniq_equipments_serial_number; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY equipments
    ADD CONSTRAINT uniq_equipments_serial_number UNIQUE (equipment, mark, serial_number);


--
-- TOC entry 3078 (class 2606 OID 92044)
-- Name: uniq_event_comments_attach; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY event_comments_attachments
    ADD CONSTRAINT uniq_event_comments_attach UNIQUE (idevent, idattachment);


--
-- TOC entry 3085 (class 2606 OID 92046)
-- Name: uniq_events_201512_dateevent_ideq_ideventtype; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_201512
    ADD CONSTRAINT uniq_events_201512_dateevent_ideq_ideventtype UNIQUE (dateevent, idequipment, zu, ideventtype);


--
-- TOC entry 3094 (class 2606 OID 92048)
-- Name: uniq_events_2016_de_ide_idevt_zu; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_2016
    ADD CONSTRAINT uniq_events_2016_de_ide_idevt_zu UNIQUE (dateevent, idequipment, zu, ideventtype);


--
-- TOC entry 3035 (class 2606 OID 92050)
-- Name: uniq_events_dateevent_ideq_ideventtype; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events
    ADD CONSTRAINT uniq_events_dateevent_ideq_ideventtype UNIQUE (dateevent, idequipment, zu, ideventtype);


--
-- TOC entry 3128 (class 2606 OID 92052)
-- Name: uniq_events_dbsizes_2016_de_ide_idevt_zu; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_dbsizes_2016
    ADD CONSTRAINT uniq_events_dbsizes_2016_de_ide_idevt_zu UNIQUE (dateevent, idequipment, zu, ideventtype);


--
-- TOC entry 3175 (class 2606 OID 92054)
-- Name: uniq_events_device_uptime_2016_de_ide_idevt_zu; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_device_uptime_2016
    ADD CONSTRAINT uniq_events_device_uptime_2016_de_ide_idevt_zu UNIQUE (dateevent, idequipment, zu, ideventtype);


--
-- TOC entry 3222 (class 2606 OID 92056)
-- Name: uniq_events_diskspace_2016_de_ide_idevt_zu; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_diskspace_2016
    ADD CONSTRAINT uniq_events_diskspace_2016_de_ide_idevt_zu UNIQUE (dateevent, idequipment, zu, ideventtype);


--
-- TOC entry 3267 (class 2606 OID 92058)
-- Name: uniq_events_jobs_1990_de_ide_idevt_zu; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_1990
    ADD CONSTRAINT uniq_events_jobs_1990_de_ide_idevt_zu UNIQUE (dateevent, idequipment, zu, ideventtype);


--
-- TOC entry 3399 (class 2606 OID 92060)
-- Name: uniq_events_jobs_2016_de_ide_idevt_zu; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_2016
    ADD CONSTRAINT uniq_events_jobs_2016_de_ide_idevt_zu UNIQUE (dateevent, idequipment, zu, ideventtype);


--
-- TOC entry 3444 (class 2606 OID 92062)
-- Name: uniq_eventtypes_code; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY eventtypes
    ADD CONSTRAINT uniq_eventtypes_code UNIQUE (code);


--
-- TOC entry 3446 (class 2606 OID 92064)
-- Name: uniq_eventtypes_label; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY eventtypes
    ADD CONSTRAINT uniq_eventtypes_label UNIQUE (label);


--
-- TOC entry 3448 (class 2606 OID 92066)
-- Name: uniq_eventtypes_name; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY eventtypes
    ADD CONSTRAINT uniq_eventtypes_name UNIQUE (name);


--
-- TOC entry 3453 (class 2606 OID 92068)
-- Name: uniq_farma_lista_precios_idaccount; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY farma_lista_precios_farmacias
    ADD CONSTRAINT uniq_farma_lista_precios_idaccount UNIQUE (idaccount);


--
-- TOC entry 3457 (class 2606 OID 92070)
-- Name: uniq_groups_iddivision; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY groups
    ADD CONSTRAINT uniq_groups_iddivision UNIQUE (name, iddivision);


--
-- TOC entry 3490 (class 2606 OID 92072)
-- Name: uniq_idcontact_phone_ext; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY phones
    ADD CONSTRAINT uniq_idcontact_phone_ext UNIQUE (idcontact, number, note);


--
-- TOC entry 3463 (class 2606 OID 92074)
-- Name: uniq_identification_types_name; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY identification_types
    ADD CONSTRAINT uniq_identification_types_name UNIQUE (name);


--
-- TOC entry 3467 (class 2606 OID 92076)
-- Name: uniq_interface_words_word; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY interface_words
    ADD CONSTRAINT uniq_interface_words_word UNIQUE (word);


--
-- TOC entry 3486 (class 2606 OID 92078)
-- Name: uniq_phone_types_type; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY phone_types
    ADD CONSTRAINT uniq_phone_types_type UNIQUE (type);


--
-- TOC entry 3482 (class 2606 OID 92080)
-- Name: uniq_providers_provider; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY phone_providers
    ADD CONSTRAINT uniq_providers_provider UNIQUE (provider);


--
-- TOC entry 3513 (class 1259 OID 93634)
-- Name: event_comments_201512_idevent_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX event_comments_201512_idevent_idx ON event_comments_201512 USING btree (idevent);


--
-- TOC entry 3519 (class 1259 OID 93635)
-- Name: event_comments_201601_idevent_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX event_comments_201601_idevent_idx ON event_comments_201601 USING btree (idevent);


--
-- TOC entry 3522 (class 1259 OID 93636)
-- Name: event_comments_201602_idevent_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX event_comments_201602_idevent_idx ON event_comments_201602 USING btree (idevent);


--
-- TOC entry 3525 (class 1259 OID 93637)
-- Name: event_comments_201603_idevent_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX event_comments_201603_idevent_idx ON event_comments_201603 USING btree (idevent);


--
-- TOC entry 3516 (class 1259 OID 93638)
-- Name: event_comments_2016_idevent_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX event_comments_2016_idevent_idx ON event_comments_2016 USING btree (idevent);


--
-- TOC entry 3101 (class 1259 OID 92086)
-- Name: events_201603_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_201603_idaccount_idx ON events_201603 USING btree (idaccount);


--
-- TOC entry 3104 (class 1259 OID 92087)
-- Name: events_201603_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_201603_status_idx ON events_201603 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3112 (class 1259 OID 92088)
-- Name: events_dbsizes_201512_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_dbsizes_201512_idaccount_idx ON events_dbsizes_201512 USING btree (idaccount);


--
-- TOC entry 3115 (class 1259 OID 92089)
-- Name: events_dbsizes_201512_status_idaccount_ideventtype_zu_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_dbsizes_201512_status_idaccount_ideventtype_zu_idx ON events_dbsizes_201512 USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 3116 (class 1259 OID 92090)
-- Name: events_dbsizes_201512_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_dbsizes_201512_status_idx ON events_dbsizes_201512 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3131 (class 1259 OID 92091)
-- Name: events_dbsizes_201601_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_dbsizes_201601_idaccount_idx ON events_dbsizes_201601 USING btree (idaccount);


--
-- TOC entry 3134 (class 1259 OID 92092)
-- Name: events_dbsizes_201601_status_idaccount_ideventtype_zu_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_dbsizes_201601_status_idaccount_ideventtype_zu_idx ON events_dbsizes_201601 USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 3135 (class 1259 OID 93639)
-- Name: events_dbsizes_201601_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_dbsizes_201601_status_idx ON events_dbsizes_201601 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3138 (class 1259 OID 93640)
-- Name: events_dbsizes_201602_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_dbsizes_201602_idaccount_idx ON events_dbsizes_201602 USING btree (idaccount);


--
-- TOC entry 3141 (class 1259 OID 93641)
-- Name: events_dbsizes_201602_status_idaccount_ideventtype_zu_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_dbsizes_201602_status_idaccount_ideventtype_zu_idx ON events_dbsizes_201602 USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 3142 (class 1259 OID 93642)
-- Name: events_dbsizes_201602_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_dbsizes_201602_status_idx ON events_dbsizes_201602 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3145 (class 1259 OID 93643)
-- Name: events_dbsizes_201603_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_dbsizes_201603_idaccount_idx ON events_dbsizes_201603 USING btree (idaccount);


--
-- TOC entry 3148 (class 1259 OID 93644)
-- Name: events_dbsizes_201603_status_idaccount_ideventtype_zu_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_dbsizes_201603_status_idaccount_ideventtype_zu_idx ON events_dbsizes_201603 USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 3149 (class 1259 OID 93645)
-- Name: events_dbsizes_201603_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_dbsizes_201603_status_idx ON events_dbsizes_201603 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3119 (class 1259 OID 93646)
-- Name: events_dbsizes_2016_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_dbsizes_2016_idaccount_idx ON events_dbsizes_2016 USING btree (idaccount);


--
-- TOC entry 3122 (class 1259 OID 93647)
-- Name: events_dbsizes_2016_status_idaccount_ideventtype_zu_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_dbsizes_2016_status_idaccount_ideventtype_zu_idx ON events_dbsizes_2016 USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 3123 (class 1259 OID 93648)
-- Name: events_dbsizes_2016_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_dbsizes_2016_status_idx ON events_dbsizes_2016 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3159 (class 1259 OID 93649)
-- Name: events_device_uptime_201512_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_device_uptime_201512_idaccount_idx ON events_device_uptime_201512 USING btree (idaccount);


--
-- TOC entry 3162 (class 1259 OID 93650)
-- Name: events_device_uptime_201512_status_idaccount_ideventtype_zu_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_device_uptime_201512_status_idaccount_ideventtype_zu_idx ON events_device_uptime_201512 USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 3163 (class 1259 OID 93651)
-- Name: events_device_uptime_201512_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_device_uptime_201512_status_idx ON events_device_uptime_201512 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3178 (class 1259 OID 93652)
-- Name: events_device_uptime_201601_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_device_uptime_201601_idaccount_idx ON events_device_uptime_201601 USING btree (idaccount);


--
-- TOC entry 3181 (class 1259 OID 93653)
-- Name: events_device_uptime_201601_status_idaccount_ideventtype_zu_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_device_uptime_201601_status_idaccount_ideventtype_zu_idx ON events_device_uptime_201601 USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 3182 (class 1259 OID 93654)
-- Name: events_device_uptime_201601_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_device_uptime_201601_status_idx ON events_device_uptime_201601 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3185 (class 1259 OID 93655)
-- Name: events_device_uptime_201602_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_device_uptime_201602_idaccount_idx ON events_device_uptime_201602 USING btree (idaccount);


--
-- TOC entry 3188 (class 1259 OID 93656)
-- Name: events_device_uptime_201602_status_idaccount_ideventtype_zu_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_device_uptime_201602_status_idaccount_ideventtype_zu_idx ON events_device_uptime_201602 USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 3189 (class 1259 OID 93657)
-- Name: events_device_uptime_201602_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_device_uptime_201602_status_idx ON events_device_uptime_201602 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3192 (class 1259 OID 93658)
-- Name: events_device_uptime_201603_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_device_uptime_201603_idaccount_idx ON events_device_uptime_201603 USING btree (idaccount);


--
-- TOC entry 3195 (class 1259 OID 93659)
-- Name: events_device_uptime_201603_status_idaccount_ideventtype_zu_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_device_uptime_201603_status_idaccount_ideventtype_zu_idx ON events_device_uptime_201603 USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 3196 (class 1259 OID 93660)
-- Name: events_device_uptime_201603_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_device_uptime_201603_status_idx ON events_device_uptime_201603 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3166 (class 1259 OID 93661)
-- Name: events_device_uptime_2016_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_device_uptime_2016_idaccount_idx ON events_device_uptime_2016 USING btree (idaccount);


--
-- TOC entry 3169 (class 1259 OID 93662)
-- Name: events_device_uptime_2016_status_idaccount_ideventtype_zu_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_device_uptime_2016_status_idaccount_ideventtype_zu_idx ON events_device_uptime_2016 USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 3170 (class 1259 OID 93663)
-- Name: events_device_uptime_2016_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_device_uptime_2016_status_idx ON events_device_uptime_2016 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3206 (class 1259 OID 93664)
-- Name: events_diskspace_201512_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_diskspace_201512_idaccount_idx ON events_diskspace_201512 USING btree (idaccount);


--
-- TOC entry 3209 (class 1259 OID 93665)
-- Name: events_diskspace_201512_status_idaccount_ideventtype_zu_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_diskspace_201512_status_idaccount_ideventtype_zu_idx ON events_diskspace_201512 USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 3210 (class 1259 OID 93666)
-- Name: events_diskspace_201512_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_diskspace_201512_status_idx ON events_diskspace_201512 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3225 (class 1259 OID 93667)
-- Name: events_diskspace_201601_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_diskspace_201601_idaccount_idx ON events_diskspace_201601 USING btree (idaccount);


--
-- TOC entry 3228 (class 1259 OID 93668)
-- Name: events_diskspace_201601_status_idaccount_ideventtype_zu_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_diskspace_201601_status_idaccount_ideventtype_zu_idx ON events_diskspace_201601 USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 3229 (class 1259 OID 93669)
-- Name: events_diskspace_201601_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_diskspace_201601_status_idx ON events_diskspace_201601 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3232 (class 1259 OID 93670)
-- Name: events_diskspace_201602_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_diskspace_201602_idaccount_idx ON events_diskspace_201602 USING btree (idaccount);


--
-- TOC entry 3235 (class 1259 OID 93671)
-- Name: events_diskspace_201602_status_idaccount_ideventtype_zu_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_diskspace_201602_status_idaccount_ideventtype_zu_idx ON events_diskspace_201602 USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 3236 (class 1259 OID 93672)
-- Name: events_diskspace_201602_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_diskspace_201602_status_idx ON events_diskspace_201602 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3241 (class 1259 OID 93673)
-- Name: events_diskspace_201603_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_diskspace_201603_idaccount_idx ON events_diskspace_201603 USING btree (idaccount);


--
-- TOC entry 3244 (class 1259 OID 93674)
-- Name: events_diskspace_201603_status_idaccount_ideventtype_zu_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_diskspace_201603_status_idaccount_ideventtype_zu_idx ON events_diskspace_201603 USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 3245 (class 1259 OID 93675)
-- Name: events_diskspace_201603_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_diskspace_201603_status_idx ON events_diskspace_201603 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3213 (class 1259 OID 93676)
-- Name: events_diskspace_2016_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_diskspace_2016_idaccount_idx ON events_diskspace_2016 USING btree (idaccount);


--
-- TOC entry 3216 (class 1259 OID 93677)
-- Name: events_diskspace_2016_status_idaccount_ideventtype_zu_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_diskspace_2016_status_idaccount_ideventtype_zu_idx ON events_diskspace_2016 USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 3217 (class 1259 OID 93678)
-- Name: events_diskspace_2016_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_diskspace_2016_status_idx ON events_diskspace_2016 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3150 (class 1259 OID 93679)
-- Name: events_index_ideventtype_idaccount_zu_status_edpt; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_index_ideventtype_idaccount_zu_status_edpt ON events_device_uptime USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 3283 (class 1259 OID 93680)
-- Name: events_index_ideventtype_idaccount_zu_status_ej_201411; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_index_ideventtype_idaccount_zu_status_ej_201411 ON events_jobs_201411 USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 3291 (class 1259 OID 93681)
-- Name: events_index_ideventtype_idaccount_zu_status_ej_201412; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_index_ideventtype_idaccount_zu_status_ej_201412 ON events_jobs_201412 USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 3331 (class 1259 OID 93682)
-- Name: events_index_ideventtype_idaccount_zu_status_ej_201506; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_index_ideventtype_idaccount_zu_status_ej_201506 ON events_jobs_201506 USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 3339 (class 1259 OID 93683)
-- Name: events_index_ideventtype_idaccount_zu_status_ej_201507; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_index_ideventtype_idaccount_zu_status_ej_201507 ON events_jobs_201507 USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 3347 (class 1259 OID 93684)
-- Name: events_index_ideventtype_idaccount_zu_status_ej_201508; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_index_ideventtype_idaccount_zu_status_ej_201508 ON events_jobs_201508 USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 3355 (class 1259 OID 93685)
-- Name: events_index_ideventtype_idaccount_zu_status_ej_201509; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_index_ideventtype_idaccount_zu_status_ej_201509 ON events_jobs_201509 USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 3363 (class 1259 OID 93686)
-- Name: events_index_ideventtype_idaccount_zu_status_ej_201510; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_index_ideventtype_idaccount_zu_status_ej_201510 ON events_jobs_201510 USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 3107 (class 1259 OID 93687)
-- Name: events_index_ideventtype_idaccount_zu_status_events_dbsizes; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_index_ideventtype_idaccount_zu_status_events_dbsizes ON events_dbsizes USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 3201 (class 1259 OID 93688)
-- Name: events_index_ideventtype_idaccount_zu_status_events_diskspace; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_index_ideventtype_idaccount_zu_status_events_diskspace ON events_diskspace USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 3270 (class 1259 OID 93689)
-- Name: events_jobs_199001_idaccount_ideventtype; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_199001_idaccount_ideventtype ON events_jobs_199001 USING btree (idaccount, ideventtype);


--
-- TOC entry 3273 (class 1259 OID 93690)
-- Name: events_jobs_199001_status_idaccount_ideventtype_zu_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_199001_status_idaccount_ideventtype_zu_idx ON events_jobs_199001 USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 3274 (class 1259 OID 93691)
-- Name: events_jobs_199001_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_199001_status_idx ON events_jobs_199001 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3258 (class 1259 OID 93692)
-- Name: events_jobs_1990_idaccount_ideventtype_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_1990_idaccount_ideventtype_idx ON events_jobs_1990 USING btree (idaccount, ideventtype);


--
-- TOC entry 3259 (class 1259 OID 93693)
-- Name: events_jobs_1990_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_1990_idaccount_idx ON events_jobs_1990 USING btree (idaccount);


--
-- TOC entry 3262 (class 1259 OID 93694)
-- Name: events_jobs_1990_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_1990_status_idx ON events_jobs_1990 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3278 (class 1259 OID 93695)
-- Name: events_jobs_201407_idaccount_ideventtype; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201407_idaccount_ideventtype ON events_jobs_201407 USING btree (idaccount, ideventtype);


--
-- TOC entry 3279 (class 1259 OID 93696)
-- Name: events_jobs_201407_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201407_idaccount_idx ON events_jobs_201407 USING btree (idaccount);


--
-- TOC entry 3282 (class 1259 OID 93697)
-- Name: events_jobs_201407_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201407_status_idx ON events_jobs_201407 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3286 (class 1259 OID 93698)
-- Name: events_jobs_201411_idaccount_ideventtype; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201411_idaccount_ideventtype ON events_jobs_201411 USING btree (idaccount, ideventtype);


--
-- TOC entry 3294 (class 1259 OID 93699)
-- Name: events_jobs_201412_idaccount_ideventtype; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201412_idaccount_ideventtype ON events_jobs_201412 USING btree (idaccount, ideventtype);


--
-- TOC entry 3297 (class 1259 OID 93700)
-- Name: events_jobs_201412_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201412_status_idx ON events_jobs_201412 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3309 (class 1259 OID 93701)
-- Name: events_jobs_201503_idaccount_ideventtype; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201503_idaccount_ideventtype ON events_jobs_201503 USING btree (idaccount, ideventtype);


--
-- TOC entry 3310 (class 1259 OID 93702)
-- Name: events_jobs_201503_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201503_idaccount_idx ON events_jobs_201503 USING btree (idaccount);


--
-- TOC entry 3313 (class 1259 OID 93703)
-- Name: events_jobs_201503_status_idaccount_ideventtype_zu_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201503_status_idaccount_ideventtype_zu_idx ON events_jobs_201503 USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 3314 (class 1259 OID 93704)
-- Name: events_jobs_201503_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201503_status_idx ON events_jobs_201503 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3317 (class 1259 OID 93705)
-- Name: events_jobs_201504_idaccount_ideventtype; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201504_idaccount_ideventtype ON events_jobs_201504 USING btree (idaccount, ideventtype);


--
-- TOC entry 3318 (class 1259 OID 93706)
-- Name: events_jobs_201504_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201504_idaccount_idx ON events_jobs_201504 USING btree (idaccount);


--
-- TOC entry 3321 (class 1259 OID 93707)
-- Name: events_jobs_201504_status_idaccount_ideventtype_zu_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201504_status_idaccount_ideventtype_zu_idx ON events_jobs_201504 USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 3322 (class 1259 OID 93708)
-- Name: events_jobs_201504_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201504_status_idx ON events_jobs_201504 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3325 (class 1259 OID 93709)
-- Name: events_jobs_201505_idaccount_ideventtype; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201505_idaccount_ideventtype ON events_jobs_201505 USING btree (idaccount, ideventtype);


--
-- TOC entry 3326 (class 1259 OID 93710)
-- Name: events_jobs_201505_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201505_idaccount_idx ON events_jobs_201505 USING btree (idaccount);


--
-- TOC entry 3329 (class 1259 OID 93711)
-- Name: events_jobs_201505_status_idaccount_ideventtype_zu_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201505_status_idaccount_ideventtype_zu_idx ON events_jobs_201505 USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 3330 (class 1259 OID 93712)
-- Name: events_jobs_201505_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201505_status_idx ON events_jobs_201505 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3334 (class 1259 OID 93713)
-- Name: events_jobs_201506_idaccount_ideventtype; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201506_idaccount_ideventtype ON events_jobs_201506 USING btree (idaccount, ideventtype);


--
-- TOC entry 3342 (class 1259 OID 93714)
-- Name: events_jobs_201507_idaccount_ideventtype; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201507_idaccount_ideventtype ON events_jobs_201507 USING btree (idaccount, ideventtype);


--
-- TOC entry 3350 (class 1259 OID 93715)
-- Name: events_jobs_201508_idaccount_ideventtype; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201508_idaccount_ideventtype ON events_jobs_201508 USING btree (idaccount, ideventtype);


--
-- TOC entry 3358 (class 1259 OID 93716)
-- Name: events_jobs_201509_idaccount_ideventtype; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201509_idaccount_ideventtype ON events_jobs_201509 USING btree (idaccount, ideventtype);


--
-- TOC entry 3366 (class 1259 OID 93717)
-- Name: events_jobs_201510_idaccount_ideventtype; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201510_idaccount_ideventtype ON events_jobs_201510 USING btree (idaccount, ideventtype);


--
-- TOC entry 3369 (class 1259 OID 93718)
-- Name: events_jobs_201510_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201510_status_idx ON events_jobs_201510 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3373 (class 1259 OID 93719)
-- Name: events_jobs_201511_idaccount_ideventtype; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201511_idaccount_ideventtype ON events_jobs_201511 USING btree (idaccount, ideventtype);


--
-- TOC entry 3374 (class 1259 OID 93720)
-- Name: events_jobs_201511_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201511_idaccount_idx ON events_jobs_201511 USING btree (idaccount);


--
-- TOC entry 3377 (class 1259 OID 93721)
-- Name: events_jobs_201511_status_idaccount_ideventtype_zu_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201511_status_idaccount_ideventtype_zu_idx ON events_jobs_201511 USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 3378 (class 1259 OID 93722)
-- Name: events_jobs_201511_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201511_status_idx ON events_jobs_201511 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3381 (class 1259 OID 93723)
-- Name: events_jobs_201512_idaccount_ideventtype_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201512_idaccount_ideventtype_idx ON events_jobs_201512 USING btree (idaccount, ideventtype);


--
-- TOC entry 3382 (class 1259 OID 93724)
-- Name: events_jobs_201512_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201512_idaccount_idx ON events_jobs_201512 USING btree (idaccount);


--
-- TOC entry 3385 (class 1259 OID 93725)
-- Name: events_jobs_201512_status_idaccount_ideventtype_zu_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201512_status_idaccount_ideventtype_zu_idx ON events_jobs_201512 USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 3386 (class 1259 OID 93726)
-- Name: events_jobs_201512_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201512_status_idx ON events_jobs_201512 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3301 (class 1259 OID 93727)
-- Name: events_jobs_2015_idaccount_ideventtype_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_2015_idaccount_ideventtype_idx ON events_jobs_2015 USING btree (idaccount, ideventtype);


--
-- TOC entry 3302 (class 1259 OID 93728)
-- Name: events_jobs_2015_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_2015_idaccount_idx ON events_jobs_2015 USING btree (idaccount);


--
-- TOC entry 3305 (class 1259 OID 93729)
-- Name: events_jobs_2015_status_idaccount_ideventtype_zu_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_2015_status_idaccount_ideventtype_zu_idx ON events_jobs_2015 USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 3306 (class 1259 OID 93730)
-- Name: events_jobs_2015_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_2015_status_idx ON events_jobs_2015 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3402 (class 1259 OID 93731)
-- Name: events_jobs_201601_idaccount_ideventtype_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201601_idaccount_ideventtype_idx ON events_jobs_201601 USING btree (idaccount, ideventtype);


--
-- TOC entry 3403 (class 1259 OID 93732)
-- Name: events_jobs_201601_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201601_idaccount_idx ON events_jobs_201601 USING btree (idaccount);


--
-- TOC entry 3406 (class 1259 OID 93733)
-- Name: events_jobs_201601_status_idaccount_ideventtype_zu_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201601_status_idaccount_ideventtype_zu_idx ON events_jobs_201601 USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 3407 (class 1259 OID 93734)
-- Name: events_jobs_201601_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201601_status_idx ON events_jobs_201601 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3410 (class 1259 OID 93735)
-- Name: events_jobs_201602_idaccount_ideventtype_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201602_idaccount_ideventtype_idx ON events_jobs_201602 USING btree (idaccount, ideventtype);


--
-- TOC entry 3411 (class 1259 OID 93736)
-- Name: events_jobs_201602_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201602_idaccount_idx ON events_jobs_201602 USING btree (idaccount);


--
-- TOC entry 3414 (class 1259 OID 93737)
-- Name: events_jobs_201602_status_idaccount_ideventtype_zu_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201602_status_idaccount_ideventtype_zu_idx ON events_jobs_201602 USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 3415 (class 1259 OID 93738)
-- Name: events_jobs_201602_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201602_status_idx ON events_jobs_201602 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3418 (class 1259 OID 93739)
-- Name: events_jobs_201603_idaccount_ideventtype_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201603_idaccount_ideventtype_idx ON events_jobs_201603 USING btree (idaccount, ideventtype);


--
-- TOC entry 3419 (class 1259 OID 93740)
-- Name: events_jobs_201603_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201603_idaccount_idx ON events_jobs_201603 USING btree (idaccount);


--
-- TOC entry 3422 (class 1259 OID 93741)
-- Name: events_jobs_201603_status_idaccount_ideventtype_zu_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201603_status_idaccount_ideventtype_zu_idx ON events_jobs_201603 USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 3423 (class 1259 OID 93742)
-- Name: events_jobs_201603_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_201603_status_idx ON events_jobs_201603 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3389 (class 1259 OID 93743)
-- Name: events_jobs_2016_idaccount_ideventtype_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_2016_idaccount_ideventtype_idx ON events_jobs_2016 USING btree (idaccount, ideventtype);


--
-- TOC entry 3390 (class 1259 OID 93744)
-- Name: events_jobs_2016_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_2016_idaccount_idx ON events_jobs_2016 USING btree (idaccount);


--
-- TOC entry 3393 (class 1259 OID 93745)
-- Name: events_jobs_2016_status_idaccount_ideventtype_zu_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_2016_status_idaccount_ideventtype_zu_idx ON events_jobs_2016 USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 3394 (class 1259 OID 93746)
-- Name: events_jobs_2016_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_2016_status_idx ON events_jobs_2016 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3250 (class 1259 OID 93747)
-- Name: events_jobs_idaccount_ideventtype; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_idaccount_ideventtype ON events_jobs USING btree (idaccount, ideventtype);


--
-- TOC entry 3434 (class 1259 OID 93748)
-- Name: events_raid_201511_idaccount_ideventtype_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_raid_201511_idaccount_ideventtype_idx ON events_raid_201511 USING btree (idaccount, ideventtype);


--
-- TOC entry 3435 (class 1259 OID 93749)
-- Name: events_raid_201511_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_raid_201511_idaccount_idx ON events_raid_201511 USING btree (idaccount);


--
-- TOC entry 3438 (class 1259 OID 93750)
-- Name: events_raid_201511_status_idaccount_ideventtype_zu_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_raid_201511_status_idaccount_ideventtype_zu_idx ON events_raid_201511 USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 3439 (class 1259 OID 93751)
-- Name: events_raid_201511_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_raid_201511_status_idx ON events_raid_201511 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3426 (class 1259 OID 93752)
-- Name: events_raid_idaccount_ideventtype_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_raid_idaccount_ideventtype_idx ON events_raid USING btree (idaccount, ideventtype);


--
-- TOC entry 3427 (class 1259 OID 93753)
-- Name: events_raid_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_raid_idaccount_idx ON events_raid USING btree (idaccount);


--
-- TOC entry 3430 (class 1259 OID 93754)
-- Name: events_raid_status_idaccount_ideventtype_zu_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_raid_status_idaccount_ideventtype_zu_idx ON events_raid USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 3431 (class 1259 OID 93755)
-- Name: events_raid_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_raid_status_idx ON events_raid USING btree (status) WHERE (status = 0);


--
-- TOC entry 3036 (class 1259 OID 93756)
-- Name: index_account_contacts_appointment; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_account_contacts_appointment ON account_contacts USING btree (appointment) WHERE (appointment = 'oams_assigned'::text);


--
-- TOC entry 3055 (class 1259 OID 93757)
-- Name: index_accounts_account; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_accounts_account ON accounts USING btree (account);


--
-- TOC entry 3079 (class 1259 OID 93758)
-- Name: index_ec_idevent; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_ec_idevent ON event_comments USING btree (idevent);


--
-- TOC entry 3108 (class 1259 OID 93759)
-- Name: index_edbs_idaccount; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_edbs_idaccount ON events_dbsizes USING btree (idaccount);


--
-- TOC entry 3202 (class 1259 OID 93760)
-- Name: index_eds_idaccount; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_eds_idaccount ON events_diskspace USING btree (idaccount);


--
-- TOC entry 3155 (class 1259 OID 93761)
-- Name: index_edu_idaccount; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_edu_idaccount ON events_device_uptime USING btree (idaccount);


--
-- TOC entry 3253 (class 1259 OID 93762)
-- Name: index_ej_idaccount; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_ej_idaccount ON events_jobs USING btree (idaccount);


--
-- TOC entry 3353 (class 1259 OID 93763)
-- Name: index_ej_idaccount201508; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_ej_idaccount201508 ON events_jobs_201508 USING btree (idaccount);


--
-- TOC entry 3275 (class 1259 OID 93764)
-- Name: index_ej_idaccount_199001; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_ej_idaccount_199001 ON events_jobs_199001 USING btree (idaccount);


--
-- TOC entry 3289 (class 1259 OID 93765)
-- Name: index_ej_idaccount_201411; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_ej_idaccount_201411 ON events_jobs_201411 USING btree (idaccount);


--
-- TOC entry 3298 (class 1259 OID 93766)
-- Name: index_ej_idaccount_201412; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_ej_idaccount_201412 ON events_jobs_201412 USING btree (idaccount);


--
-- TOC entry 3337 (class 1259 OID 93767)
-- Name: index_ej_idaccount_201506; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_ej_idaccount_201506 ON events_jobs_201506 USING btree (idaccount);


--
-- TOC entry 3345 (class 1259 OID 93768)
-- Name: index_ej_idaccount_201507; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_ej_idaccount_201507 ON events_jobs_201507 USING btree (idaccount);


--
-- TOC entry 3361 (class 1259 OID 93769)
-- Name: index_ej_idaccount_201509; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_ej_idaccount_201509 ON events_jobs_201509 USING btree (idaccount);


--
-- TOC entry 3370 (class 1259 OID 93770)
-- Name: index_ej_idaccount_201510; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_ej_idaccount_201510 ON events_jobs_201510 USING btree (idaccount);


--
-- TOC entry 3068 (class 1259 OID 93771)
-- Name: index_equipment_eq; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_equipment_eq ON equipments USING btree (equipment);


--
-- TOC entry 3090 (class 1259 OID 93772)
-- Name: index_events_2016_idaccount; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_2016_idaccount ON events_2016 USING btree (idaccount);


--
-- TOC entry 3091 (class 1259 OID 93773)
-- Name: index_events_2016_idequipment; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_2016_idequipment ON events_2016 USING btree (idequipment);


--
-- TOC entry 3092 (class 1259 OID 93774)
-- Name: index_events_2016_status; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_2016_status ON events_2016 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3124 (class 1259 OID 93775)
-- Name: index_events_dbsizes_2016_idaccount; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_dbsizes_2016_idaccount ON events_dbsizes_2016 USING btree (idaccount);


--
-- TOC entry 3125 (class 1259 OID 93776)
-- Name: index_events_dbsizes_2016_idequipment; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_dbsizes_2016_idequipment ON events_dbsizes_2016 USING btree (idequipment);


--
-- TOC entry 3126 (class 1259 OID 93777)
-- Name: index_events_dbsizes_2016_status; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_dbsizes_2016_status ON events_dbsizes_2016 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3109 (class 1259 OID 93778)
-- Name: index_events_dbsizes_status; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_dbsizes_status ON events_dbsizes USING btree (status) WHERE (status = 0);


--
-- TOC entry 3171 (class 1259 OID 93779)
-- Name: index_events_device_uptime_2016_idaccount; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_device_uptime_2016_idaccount ON events_device_uptime_2016 USING btree (idaccount);


--
-- TOC entry 3172 (class 1259 OID 93780)
-- Name: index_events_device_uptime_2016_idequipment; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_device_uptime_2016_idequipment ON events_device_uptime_2016 USING btree (idequipment);


--
-- TOC entry 3173 (class 1259 OID 93781)
-- Name: index_events_device_uptime_2016_status; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_device_uptime_2016_status ON events_device_uptime_2016 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3237 (class 1259 OID 93782)
-- Name: index_events_diskspace_201602_drive; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_diskspace_201602_drive ON events_diskspace_201602 USING btree (drive);


--
-- TOC entry 3246 (class 1259 OID 93783)
-- Name: index_events_diskspace_201603_drive; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_diskspace_201603_drive ON events_diskspace_201603 USING btree (drive);


--
-- TOC entry 3218 (class 1259 OID 93784)
-- Name: index_events_diskspace_2016_idaccount; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_diskspace_2016_idaccount ON events_diskspace_2016 USING btree (idaccount);


--
-- TOC entry 3219 (class 1259 OID 93785)
-- Name: index_events_diskspace_2016_idequipment; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_diskspace_2016_idequipment ON events_diskspace_2016 USING btree (idequipment);


--
-- TOC entry 3220 (class 1259 OID 93786)
-- Name: index_events_diskspace_2016_status; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_diskspace_2016_status ON events_diskspace_2016 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3203 (class 1259 OID 93787)
-- Name: index_events_diskspace_status; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_diskspace_status ON events_diskspace USING btree (status) WHERE (status = 0);


--
-- TOC entry 3156 (class 1259 OID 93788)
-- Name: index_events_dut; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_dut ON events_device_uptime USING btree (status) WHERE (status = 0);


--
-- TOC entry 3029 (class 1259 OID 93789)
-- Name: index_events_idaccount; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_idaccount ON events USING btree (idaccount);


--
-- TOC entry 3030 (class 1259 OID 93790)
-- Name: index_events_idequipment; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_idequipment ON events USING btree (idequipment);


--
-- TOC entry 3238 (class 1259 OID 93791)
-- Name: index_events_idequipment_a; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_idequipment_a ON events_diskspace_201602 USING btree (idequipment);


--
-- TOC entry 3247 (class 1259 OID 93792)
-- Name: index_events_idequipment_b; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_idequipment_b ON events_diskspace_201603 USING btree (idequipment);


--
-- TOC entry 3263 (class 1259 OID 93793)
-- Name: index_events_jobs_1990_idaccount; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_jobs_1990_idaccount ON events_jobs_1990 USING btree (idaccount);


--
-- TOC entry 3264 (class 1259 OID 93794)
-- Name: index_events_jobs_1990_idequipment; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_jobs_1990_idequipment ON events_jobs_1990 USING btree (idequipment);


--
-- TOC entry 3265 (class 1259 OID 93795)
-- Name: index_events_jobs_1990_status; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_jobs_1990_status ON events_jobs_1990 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3290 (class 1259 OID 93796)
-- Name: index_events_jobs_201411_status; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_jobs_201411_status ON events_jobs_201411 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3338 (class 1259 OID 93797)
-- Name: index_events_jobs_201506_status; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_jobs_201506_status ON events_jobs_201506 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3346 (class 1259 OID 93798)
-- Name: index_events_jobs_201507_status; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_jobs_201507_status ON events_jobs_201507 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3354 (class 1259 OID 93799)
-- Name: index_events_jobs_201508_status; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_jobs_201508_status ON events_jobs_201508 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3362 (class 1259 OID 93800)
-- Name: index_events_jobs_201509_status; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_jobs_201509_status ON events_jobs_201509 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3395 (class 1259 OID 93801)
-- Name: index_events_jobs_2016_idaccount; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_jobs_2016_idaccount ON events_jobs_2016 USING btree (idaccount);


--
-- TOC entry 3396 (class 1259 OID 93802)
-- Name: index_events_jobs_2016_idequipment; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_jobs_2016_idequipment ON events_jobs_2016 USING btree (idequipment);


--
-- TOC entry 3397 (class 1259 OID 93803)
-- Name: index_events_jobs_2016_status; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_jobs_2016_status ON events_jobs_2016 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3254 (class 1259 OID 93804)
-- Name: index_events_jobs_status; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_jobs_status ON events_jobs USING btree (status) WHERE (status = 0);


--
-- TOC entry 3031 (class 1259 OID 93805)
-- Name: index_events_status; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_status ON events USING btree (status) WHERE (status = 0);


--
-- TOC entry 3440 (class 1259 OID 93806)
-- Name: index_eventtypes; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_eventtypes ON eventtypes USING btree (code);


--
-- TOC entry 3449 (class 1259 OID 93807)
-- Name: index_farma_lista_precios_idaccount; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_farma_lista_precios_idaccount ON farma_lista_precios_farmacias USING btree (idaccount);


--
-- TOC entry 3468 (class 1259 OID 93808)
-- Name: index_network_devices_eq; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_network_devices_eq ON network_devices USING btree (equipment);


--
-- TOC entry 3501 (class 1259 OID 93809)
-- Name: test2_dateevent_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX test2_dateevent_idx ON test2 USING btree (dateevent);


--
-- TOC entry 3502 (class 1259 OID 93810)
-- Name: test2_idaccount_ideventtype_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX test2_idaccount_ideventtype_idx ON test2 USING btree (idaccount, ideventtype);


--
-- TOC entry 3503 (class 1259 OID 93811)
-- Name: test2_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX test2_idaccount_idx ON test2 USING btree (idaccount);


--
-- TOC entry 3506 (class 1259 OID 93812)
-- Name: test2_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX test2_status_idx ON test2 USING btree (status) WHERE (status = 0);


--
-- TOC entry 3255 (class 1259 OID 93813)
-- Name: test_prueba; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX test_prueba ON events_jobs USING btree (dateevent);


--
-- TOC entry 3626 (class 2620 OID 93814)
-- Name: 1_update_ts; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "1_update_ts" BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 4192 (class 0 OID 0)
-- Dependencies: 3626
-- Name: TRIGGER "1_update_ts" ON contacts; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER "1_update_ts" ON contacts IS 'Actualiza el ts cuando un registro es actualizado';


--
-- TOC entry 3629 (class 2620 OID 93815)
-- Name: 1_update_ts; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "1_update_ts" BEFORE UPDATE ON accounts FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 4193 (class 0 OID 0)
-- Dependencies: 3629
-- Name: TRIGGER "1_update_ts" ON accounts; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER "1_update_ts" ON accounts IS 'Actualiza el ts cuando un registro es actualizado';


--
-- TOC entry 3633 (class 2620 OID 93816)
-- Name: 1_update_ts; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "1_update_ts" BEFORE UPDATE ON admins FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 4194 (class 0 OID 0)
-- Dependencies: 3633
-- Name: TRIGGER "1_update_ts" ON admins; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER "1_update_ts" ON admins IS 'Actualiza el ts cuando un registro es actualizado';


--
-- TOC entry 3796 (class 2620 OID 93817)
-- Name: 1on_insert_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "1on_insert_update" BEFORE INSERT OR UPDATE ON network_devices FOR EACH ROW EXECUTE PROCEDURE equipment_insert_update();


--
-- TOC entry 3634 (class 2620 OID 93818)
-- Name: 2_on_insert_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "2_on_insert_update" BEFORE INSERT OR UPDATE ON admins FOR EACH ROW EXECUTE PROCEDURE admins_insert_update();


--
-- TOC entry 3627 (class 2620 OID 93819)
-- Name: 2_on_insert_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "2_on_insert_update" BEFORE INSERT OR UPDATE OF identification ON contacts FOR EACH ROW EXECUTE PROCEDURE contacts_insert_update();


--
-- TOC entry 3630 (class 2620 OID 93820)
-- Name: 2_on_insert_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "2_on_insert_update" BEFORE INSERT OR UPDATE OF identification ON accounts FOR EACH ROW EXECUTE PROCEDURE contacts_insert_update();


--
-- TOC entry 3631 (class 2620 OID 93821)
-- Name: 3_on_insert_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "3_on_insert_update" BEFORE INSERT OR UPDATE OF idaccounttype, account ON accounts FOR EACH ROW EXECUTE PROCEDURE accounts_insert_update();


--
-- TOC entry 3797 (class 2620 OID 93822)
-- Name: before_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER before_insert BEFORE INSERT ON notification_area FOR EACH ROW EXECUTE PROCEDURE notifications_before_insert();


--
-- TOC entry 3646 (class 2620 OID 93823)
-- Name: on_before_insert_comment; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_before_insert_comment BEFORE INSERT ON event_comments FOR EACH ROW EXECUTE PROCEDURE event_comments_before_insert_redirect_partition();


--
-- TOC entry 3616 (class 2620 OID 93824)
-- Name: on_before_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_before_insert_event BEFORE INSERT ON events FOR EACH ROW EXECUTE PROCEDURE events_before_insert_redirect_partition();


--
-- TOC entry 4195 (class 0 OID 0)
-- Dependencies: 3616
-- Name: TRIGGER on_before_insert_event ON events; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER on_before_insert_event ON events IS 'Se dispara cuando se trata de insertar un evento y se redirige a la tabla que le corresponde segun la particion.';


--
-- TOC entry 3717 (class 2620 OID 93825)
-- Name: on_before_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_before_insert_event BEFORE INSERT ON events_jobs FOR EACH ROW EXECUTE PROCEDURE events_before_insert_redirect_partition();


--
-- TOC entry 3663 (class 2620 OID 93826)
-- Name: on_before_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_before_insert_event BEFORE INSERT ON events_dbsizes FOR EACH ROW EXECUTE PROCEDURE events_before_insert_redirect_partition();


--
-- TOC entry 4196 (class 0 OID 0)
-- Dependencies: 3663
-- Name: TRIGGER on_before_insert_event ON events_dbsizes; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER on_before_insert_event ON events_dbsizes IS 'Se dispara cuando se trata de insertar un evento y se redirige a la tabla que le corresponde segun la particion.';


--
-- TOC entry 3699 (class 2620 OID 93827)
-- Name: on_before_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_before_insert_event BEFORE INSERT ON events_diskspace FOR EACH ROW EXECUTE PROCEDURE events_before_insert_redirect_partition();


--
-- TOC entry 3681 (class 2620 OID 93828)
-- Name: on_before_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_before_insert_event BEFORE INSERT ON events_device_uptime FOR EACH ROW EXECUTE PROCEDURE events_before_insert_redirect_partition();


--
-- TOC entry 4197 (class 0 OID 0)
-- Dependencies: 3681
-- Name: TRIGGER on_before_insert_event ON events_device_uptime; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER on_before_insert_event ON events_device_uptime IS 'Se dispara cuando se trata de insertar un evento y se redirige a la tabla que le corresponde segun la particion.';


--
-- TOC entry 3781 (class 2620 OID 93829)
-- Name: on_before_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_before_insert_event BEFORE INSERT ON events_raid FOR EACH ROW EXECUTE PROCEDURE events_before_insert_redirect_partition();


--
-- TOC entry 3622 (class 2620 OID 93830)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON account_states FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 4198 (class 0 OID 0)
-- Dependencies: 3622
-- Name: TRIGGER on_changed_table ON account_states; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER on_changed_table ON account_states IS 'Actualiza la tabla sys_table_ts cuando un cambio en la tabla actual es realizado. ';


--
-- TOC entry 3624 (class 2620 OID 93831)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON account_types FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3636 (class 2620 OID 93832)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON attachments FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3628 (class 2620 OID 93833)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON contacts FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3639 (class 2620 OID 93834)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON emails FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3647 (class 2620 OID 93835)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON event_comments FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3617 (class 2620 OID 93836)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3788 (class 2620 OID 93837)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON eventtypes FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3792 (class 2620 OID 93838)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON groups FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3794 (class 2620 OID 93839)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON identification_types FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3802 (class 2620 OID 93840)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON phone_types FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3804 (class 2620 OID 93841)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON phones FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3800 (class 2620 OID 93842)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON phone_providers FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3798 (class 2620 OID 93843)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON notification_area FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3641 (class 2620 OID 93844)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON equipments FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3620 (class 2620 OID 93845)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON account_contacts FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3644 (class 2620 OID 93846)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON event_comments_attachments FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3632 (class 2620 OID 93847)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON accounts FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3718 (class 2620 OID 93848)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_jobs FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3757 (class 2620 OID 93849)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_jobs_201509 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3754 (class 2620 OID 93850)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_jobs_201508 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3664 (class 2620 OID 93851)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_dbsizes FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3700 (class 2620 OID 93852)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_diskspace FOR EACH ROW EXECUTE PROCEDURE on_changed_table();

ALTER TABLE events_diskspace DISABLE TRIGGER on_changed_table;


--
-- TOC entry 3682 (class 2620 OID 93853)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_device_uptime FOR EACH ROW EXECUTE PROCEDURE on_changed_table();

ALTER TABLE events_device_uptime DISABLE TRIGGER on_changed_table;


--
-- TOC entry 3751 (class 2620 OID 93854)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_jobs_201507 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3730 (class 2620 OID 93855)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_jobs_201411 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3748 (class 2620 OID 93856)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_jobs_201506 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3733 (class 2620 OID 93857)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_jobs_201412 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3760 (class 2620 OID 93858)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_jobs_201510 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3724 (class 2620 OID 93859)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_jobs_199001 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3745 (class 2620 OID 93860)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_jobs_201505 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3739 (class 2620 OID 93861)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_jobs_201503 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3763 (class 2620 OID 93862)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_jobs_201511 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3742 (class 2620 OID 93863)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_jobs_201504 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3727 (class 2620 OID 93864)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_jobs_201407 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3782 (class 2620 OID 93865)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_raid FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3785 (class 2620 OID 93866)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_raid_201511 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3648 (class 2620 OID 93867)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_201512 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3702 (class 2620 OID 93868)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_diskspace_201512 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3666 (class 2620 OID 93869)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_dbsizes_201512 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3684 (class 2620 OID 93870)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_device_uptime_201512 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3766 (class 2620 OID 93871)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_jobs_201512 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3790 (class 2620 OID 93872)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON farma_lista_precios_farmacias FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3808 (class 2620 OID 93873)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON event_comments_201512 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3813 (class 2620 OID 93874)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON event_comments_201601 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3708 (class 2620 OID 93875)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_diskspace_201601 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3690 (class 2620 OID 93876)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_device_uptime_201601 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3654 (class 2620 OID 93877)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_201601 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3772 (class 2620 OID 93878)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_jobs_201601 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3672 (class 2620 OID 93879)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_dbsizes_201601 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3638 (class 2620 OID 93880)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON divisions FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3657 (class 2620 OID 93881)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_201602 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3711 (class 2620 OID 93882)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_diskspace_201602 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3775 (class 2620 OID 93883)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_jobs_201602 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3675 (class 2620 OID 93884)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_dbsizes_201602 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3816 (class 2620 OID 93885)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON event_comments_201602 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3693 (class 2620 OID 93886)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_device_uptime_201602 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3778 (class 2620 OID 93887)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_jobs_201603 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3806 (class 2620 OID 93888)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON account_users FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3714 (class 2620 OID 93889)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_diskspace_201603 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3660 (class 2620 OID 93890)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_201603 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3678 (class 2620 OID 93891)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_dbsizes_201603 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3696 (class 2620 OID 93892)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_device_uptime_201603 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3819 (class 2620 OID 93893)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON event_comments_201603 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3635 (class 2620 OID 93894)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON admins FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3651 (class 2620 OID 93895)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_2016 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3705 (class 2620 OID 93896)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_diskspace_2016 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3687 (class 2620 OID 93897)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_device_uptime_2016 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3769 (class 2620 OID 93898)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_jobs_2016 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3669 (class 2620 OID 93899)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_dbsizes_2016 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3810 (class 2620 OID 93900)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON event_comments_2016 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3721 (class 2620 OID 93901)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_jobs_1990 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3736 (class 2620 OID 93902)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_jobs_2015 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3814 (class 2620 OID 93903)
-- Name: on_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert AFTER INSERT ON event_comments_201601 FOR EACH ROW EXECUTE PROCEDURE event_comments_after_insert();


--
-- TOC entry 3817 (class 2620 OID 93904)
-- Name: on_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert AFTER INSERT ON event_comments_201602 FOR EACH ROW EXECUTE PROCEDURE event_comments_after_insert();


--
-- TOC entry 3820 (class 2620 OID 93905)
-- Name: on_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert AFTER INSERT ON event_comments_201603 FOR EACH ROW EXECUTE PROCEDURE event_comments_after_insert();


--
-- TOC entry 3811 (class 2620 OID 93906)
-- Name: on_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert AFTER INSERT ON event_comments_2016 FOR EACH ROW EXECUTE PROCEDURE event_comments_after_insert();


--
-- TOC entry 3618 (class 2620 OID 93907)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3719 (class 2620 OID 93908)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_jobs FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3758 (class 2620 OID 93909)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_jobs_201509 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3755 (class 2620 OID 93910)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_jobs_201508 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3752 (class 2620 OID 93911)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_jobs_201507 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3731 (class 2620 OID 93912)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_jobs_201411 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3749 (class 2620 OID 93913)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_jobs_201506 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3734 (class 2620 OID 93914)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_jobs_201412 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3761 (class 2620 OID 93915)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_jobs_201510 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3725 (class 2620 OID 93916)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_jobs_199001 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3746 (class 2620 OID 93917)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_jobs_201505 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3740 (class 2620 OID 93918)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_jobs_201503 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3764 (class 2620 OID 93919)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_jobs_201511 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3743 (class 2620 OID 93920)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_jobs_201504 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3728 (class 2620 OID 93921)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_jobs_201407 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3783 (class 2620 OID 93922)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_raid FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3786 (class 2620 OID 93923)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_raid_201511 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3649 (class 2620 OID 93924)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_201512 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3703 (class 2620 OID 93925)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_diskspace_201512 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3667 (class 2620 OID 93926)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_dbsizes_201512 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3685 (class 2620 OID 93927)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_device_uptime_201512 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3767 (class 2620 OID 93928)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_jobs_201512 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3709 (class 2620 OID 93929)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_diskspace_201601 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3691 (class 2620 OID 93930)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_device_uptime_201601 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3655 (class 2620 OID 93931)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_201601 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3773 (class 2620 OID 93932)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_jobs_201601 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3673 (class 2620 OID 93933)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_dbsizes_201601 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3658 (class 2620 OID 93934)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_201602 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3712 (class 2620 OID 93935)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_diskspace_201602 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3776 (class 2620 OID 93936)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_jobs_201602 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3676 (class 2620 OID 93937)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_dbsizes_201602 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3694 (class 2620 OID 93938)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_device_uptime_201602 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3779 (class 2620 OID 93939)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_jobs_201603 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3715 (class 2620 OID 93940)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_diskspace_201603 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3661 (class 2620 OID 93941)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_201603 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3679 (class 2620 OID 93942)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_dbsizes_201603 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3697 (class 2620 OID 93943)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_device_uptime_201603 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3652 (class 2620 OID 93944)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_2016 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3706 (class 2620 OID 93945)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_diskspace_2016 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3688 (class 2620 OID 93946)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_device_uptime_2016 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3770 (class 2620 OID 93947)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_jobs_2016 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3670 (class 2620 OID 93948)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_dbsizes_2016 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3722 (class 2620 OID 93949)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_jobs_1990 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3737 (class 2620 OID 93950)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_jobs_2015 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 3642 (class 2620 OID 93951)
-- Name: on_insert_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_update BEFORE INSERT OR UPDATE ON equipments FOR EACH ROW EXECUTE PROCEDURE equipment_insert_update();


--
-- TOC entry 4199 (class 0 OID 0)
-- Dependencies: 3642
-- Name: TRIGGER on_insert_update ON equipments; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER on_insert_update ON equipments IS 'Valida datos antes de insertar o actualkizar';


--
-- TOC entry 3623 (class 2620 OID 93952)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON account_states FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 4200 (class 0 OID 0)
-- Dependencies: 3623
-- Name: TRIGGER on_update_row ON account_states; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER on_update_row ON account_states IS 'Actualiza el ts cuando un campo es actualizado.';


--
-- TOC entry 3625 (class 2620 OID 93953)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON account_types FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3637 (class 2620 OID 93954)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON attachments FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3640 (class 2620 OID 93955)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON emails FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3789 (class 2620 OID 93956)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON eventtypes FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3793 (class 2620 OID 93957)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON groups FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3795 (class 2620 OID 93958)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON identification_types FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3803 (class 2620 OID 93959)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON phone_types FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3805 (class 2620 OID 93960)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON phones FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3801 (class 2620 OID 93961)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON phone_providers FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3799 (class 2620 OID 93962)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON notification_area FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3643 (class 2620 OID 93963)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON equipments FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3621 (class 2620 OID 93964)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON account_contacts FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3645 (class 2620 OID 93965)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON event_comments_attachments FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3619 (class 2620 OID 93966)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3720 (class 2620 OID 93967)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_jobs FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3759 (class 2620 OID 93968)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_jobs_201509 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3756 (class 2620 OID 93969)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_jobs_201508 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3665 (class 2620 OID 93970)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_dbsizes FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3701 (class 2620 OID 93971)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_diskspace FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();

ALTER TABLE events_diskspace DISABLE TRIGGER on_update_row;


--
-- TOC entry 3683 (class 2620 OID 93972)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_device_uptime FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();

ALTER TABLE events_device_uptime DISABLE TRIGGER on_update_row;


--
-- TOC entry 3753 (class 2620 OID 93973)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_jobs_201507 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3732 (class 2620 OID 93974)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_jobs_201411 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3750 (class 2620 OID 93975)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_jobs_201506 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3735 (class 2620 OID 93976)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_jobs_201412 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3762 (class 2620 OID 93977)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_jobs_201510 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3726 (class 2620 OID 93978)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_jobs_199001 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3747 (class 2620 OID 93979)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_jobs_201505 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3741 (class 2620 OID 93980)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_jobs_201503 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3765 (class 2620 OID 93981)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_jobs_201511 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3744 (class 2620 OID 93982)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_jobs_201504 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3729 (class 2620 OID 93983)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_jobs_201407 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3784 (class 2620 OID 93984)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_raid FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3787 (class 2620 OID 93985)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_raid_201511 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3791 (class 2620 OID 93986)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON farma_lista_precios_farmacias FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3650 (class 2620 OID 93987)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_201512 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3704 (class 2620 OID 93988)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_diskspace_201512 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3668 (class 2620 OID 93989)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_dbsizes_201512 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3686 (class 2620 OID 93990)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_device_uptime_201512 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3768 (class 2620 OID 93991)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_jobs_201512 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3809 (class 2620 OID 93992)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON event_comments_201512 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3815 (class 2620 OID 93993)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON event_comments_201601 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3710 (class 2620 OID 93994)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_diskspace_201601 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3692 (class 2620 OID 93995)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_device_uptime_201601 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3656 (class 2620 OID 93996)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_201601 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3774 (class 2620 OID 93997)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_jobs_201601 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3674 (class 2620 OID 93998)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_dbsizes_201601 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3659 (class 2620 OID 93999)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_201602 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3713 (class 2620 OID 94000)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_diskspace_201602 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3777 (class 2620 OID 94001)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_jobs_201602 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3677 (class 2620 OID 94002)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_dbsizes_201602 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3818 (class 2620 OID 94003)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON event_comments_201602 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3695 (class 2620 OID 94004)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_device_uptime_201602 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3780 (class 2620 OID 94005)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_jobs_201603 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3807 (class 2620 OID 94006)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON account_users FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3716 (class 2620 OID 94007)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_diskspace_201603 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3662 (class 2620 OID 94008)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_201603 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3680 (class 2620 OID 94009)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_dbsizes_201603 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3698 (class 2620 OID 94010)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_device_uptime_201603 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3821 (class 2620 OID 94011)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON event_comments_201603 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3653 (class 2620 OID 94012)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_2016 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3707 (class 2620 OID 94013)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_diskspace_2016 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3689 (class 2620 OID 94014)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_device_uptime_2016 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3771 (class 2620 OID 94015)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_jobs_2016 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3671 (class 2620 OID 94016)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_dbsizes_2016 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3812 (class 2620 OID 94017)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON event_comments_2016 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3723 (class 2620 OID 94018)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_jobs_1990 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3738 (class 2620 OID 94019)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_jobs_2015 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3530 (class 2606 OID 94020)
-- Name: fk_account_contacts_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY account_contacts
    ADD CONSTRAINT fk_account_contacts_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact);


--
-- TOC entry 3614 (class 2606 OID 94025)
-- Name: fk_account_user_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY account_users
    ADD CONSTRAINT fk_account_user_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3532 (class 2606 OID 94030)
-- Name: fk_accounts_iddivision; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY accounts
    ADD CONSTRAINT fk_accounts_iddivision FOREIGN KEY (iddivision) REFERENCES divisions(iddivision) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3533 (class 2606 OID 94035)
-- Name: fk_admins_idcontact_idcontact; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY admins
    ADD CONSTRAINT fk_admins_idcontact_idcontact FOREIGN KEY (idcontact) REFERENCES contacts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3531 (class 2606 OID 94040)
-- Name: fk_contacts_ididtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY contacts
    ADD CONSTRAINT fk_contacts_ididtype FOREIGN KEY (ididtype) REFERENCES identification_types(ididtype);


--
-- TOC entry 3534 (class 2606 OID 94045)
-- Name: fk_equipments_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY equipments
    ADD CONSTRAINT fk_equipments_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3615 (class 2606 OID 94050)
-- Name: fk_event_comments_201512_idadmin; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY event_comments_201512
    ADD CONSTRAINT fk_event_comments_201512_idadmin FOREIGN KEY (idadmin) REFERENCES contacts(idcontact) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3535 (class 2606 OID 94055)
-- Name: fk_event_comments_attach_idattach; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY event_comments_attachments
    ADD CONSTRAINT fk_event_comments_attach_idattach FOREIGN KEY (idattachment) REFERENCES attachments(idattachment) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3537 (class 2606 OID 94060)
-- Name: fk_events_201512_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_201512
    ADD CONSTRAINT fk_events_201512_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3538 (class 2606 OID 94065)
-- Name: fk_events_201512_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_201512
    ADD CONSTRAINT fk_events_201512_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3541 (class 2606 OID 94070)
-- Name: fk_events_201601_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_201601
    ADD CONSTRAINT fk_events_201601_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3542 (class 2606 OID 94075)
-- Name: fk_events_201601_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_201601
    ADD CONSTRAINT fk_events_201601_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3543 (class 2606 OID 94080)
-- Name: fk_events_201602_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_201602
    ADD CONSTRAINT fk_events_201602_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3544 (class 2606 OID 94085)
-- Name: fk_events_201602_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_201602
    ADD CONSTRAINT fk_events_201602_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3545 (class 2606 OID 94090)
-- Name: fk_events_201603_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_201603
    ADD CONSTRAINT fk_events_201603_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3546 (class 2606 OID 94095)
-- Name: fk_events_201603_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_201603
    ADD CONSTRAINT fk_events_201603_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3539 (class 2606 OID 94100)
-- Name: fk_events_2016_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_2016
    ADD CONSTRAINT fk_events_2016_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3540 (class 2606 OID 94105)
-- Name: fk_events_2016_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_2016
    ADD CONSTRAINT fk_events_2016_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3536 (class 2606 OID 94110)
-- Name: fk_events_comments_idadmin; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY event_comments
    ADD CONSTRAINT fk_events_comments_idadmin FOREIGN KEY (idadmin) REFERENCES contacts(idcontact) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3547 (class 2606 OID 94115)
-- Name: fk_events_dbsizes_201512_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_dbsizes_201512
    ADD CONSTRAINT fk_events_dbsizes_201512_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3548 (class 2606 OID 94120)
-- Name: fk_events_dbsizes_201512_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_dbsizes_201512
    ADD CONSTRAINT fk_events_dbsizes_201512_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3551 (class 2606 OID 94125)
-- Name: fk_events_dbsizes_201601_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_dbsizes_201601
    ADD CONSTRAINT fk_events_dbsizes_201601_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3552 (class 2606 OID 94130)
-- Name: fk_events_dbsizes_201601_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_dbsizes_201601
    ADD CONSTRAINT fk_events_dbsizes_201601_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3553 (class 2606 OID 94135)
-- Name: fk_events_dbsizes_201602_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_dbsizes_201602
    ADD CONSTRAINT fk_events_dbsizes_201602_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3554 (class 2606 OID 94140)
-- Name: fk_events_dbsizes_201602_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_dbsizes_201602
    ADD CONSTRAINT fk_events_dbsizes_201602_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3555 (class 2606 OID 94145)
-- Name: fk_events_dbsizes_201603_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_dbsizes_201603
    ADD CONSTRAINT fk_events_dbsizes_201603_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3556 (class 2606 OID 94150)
-- Name: fk_events_dbsizes_201603_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_dbsizes_201603
    ADD CONSTRAINT fk_events_dbsizes_201603_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3549 (class 2606 OID 94155)
-- Name: fk_events_dbsizes_2016_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_dbsizes_2016
    ADD CONSTRAINT fk_events_dbsizes_2016_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3550 (class 2606 OID 94160)
-- Name: fk_events_dbsizes_2016_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_dbsizes_2016
    ADD CONSTRAINT fk_events_dbsizes_2016_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3557 (class 2606 OID 94165)
-- Name: fk_events_device_uptime_201512_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_device_uptime_201512
    ADD CONSTRAINT fk_events_device_uptime_201512_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3558 (class 2606 OID 94170)
-- Name: fk_events_device_uptime_201512_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_device_uptime_201512
    ADD CONSTRAINT fk_events_device_uptime_201512_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3561 (class 2606 OID 94175)
-- Name: fk_events_device_uptime_201601_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_device_uptime_201601
    ADD CONSTRAINT fk_events_device_uptime_201601_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3562 (class 2606 OID 94180)
-- Name: fk_events_device_uptime_201601_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_device_uptime_201601
    ADD CONSTRAINT fk_events_device_uptime_201601_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3563 (class 2606 OID 94185)
-- Name: fk_events_device_uptime_201602_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_device_uptime_201602
    ADD CONSTRAINT fk_events_device_uptime_201602_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3564 (class 2606 OID 94190)
-- Name: fk_events_device_uptime_201602_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_device_uptime_201602
    ADD CONSTRAINT fk_events_device_uptime_201602_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3565 (class 2606 OID 94195)
-- Name: fk_events_device_uptime_201603_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_device_uptime_201603
    ADD CONSTRAINT fk_events_device_uptime_201603_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3566 (class 2606 OID 94200)
-- Name: fk_events_device_uptime_201603_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_device_uptime_201603
    ADD CONSTRAINT fk_events_device_uptime_201603_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3559 (class 2606 OID 94205)
-- Name: fk_events_device_uptime_2016_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_device_uptime_2016
    ADD CONSTRAINT fk_events_device_uptime_2016_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3560 (class 2606 OID 94210)
-- Name: fk_events_device_uptime_2016_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_device_uptime_2016
    ADD CONSTRAINT fk_events_device_uptime_2016_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3567 (class 2606 OID 94215)
-- Name: fk_events_diskspace_201512_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_diskspace_201512
    ADD CONSTRAINT fk_events_diskspace_201512_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3568 (class 2606 OID 94220)
-- Name: fk_events_diskspace_201512_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_diskspace_201512
    ADD CONSTRAINT fk_events_diskspace_201512_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3571 (class 2606 OID 94225)
-- Name: fk_events_diskspace_201601_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_diskspace_201601
    ADD CONSTRAINT fk_events_diskspace_201601_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3572 (class 2606 OID 94230)
-- Name: fk_events_diskspace_201601_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_diskspace_201601
    ADD CONSTRAINT fk_events_diskspace_201601_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3573 (class 2606 OID 94235)
-- Name: fk_events_diskspace_201602_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_diskspace_201602
    ADD CONSTRAINT fk_events_diskspace_201602_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3574 (class 2606 OID 94240)
-- Name: fk_events_diskspace_201602_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_diskspace_201602
    ADD CONSTRAINT fk_events_diskspace_201602_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3575 (class 2606 OID 94245)
-- Name: fk_events_diskspace_201603_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_diskspace_201603
    ADD CONSTRAINT fk_events_diskspace_201603_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3576 (class 2606 OID 94250)
-- Name: fk_events_diskspace_201603_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_diskspace_201603
    ADD CONSTRAINT fk_events_diskspace_201603_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3569 (class 2606 OID 94255)
-- Name: fk_events_diskspace_2016_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_diskspace_2016
    ADD CONSTRAINT fk_events_diskspace_2016_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3570 (class 2606 OID 94260)
-- Name: fk_events_diskspace_2016_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_diskspace_2016
    ADD CONSTRAINT fk_events_diskspace_2016_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3528 (class 2606 OID 94265)
-- Name: fk_events_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events
    ADD CONSTRAINT fk_events_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3529 (class 2606 OID 94270)
-- Name: fk_events_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events
    ADD CONSTRAINT fk_events_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3579 (class 2606 OID 94275)
-- Name: fk_events_jobs_199001_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs_199001
    ADD CONSTRAINT fk_events_jobs_199001_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3580 (class 2606 OID 94280)
-- Name: fk_events_jobs_199001_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs_199001
    ADD CONSTRAINT fk_events_jobs_199001_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3577 (class 2606 OID 94285)
-- Name: fk_events_jobs_1990_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs_1990
    ADD CONSTRAINT fk_events_jobs_1990_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3578 (class 2606 OID 94290)
-- Name: fk_events_jobs_1990_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs_1990
    ADD CONSTRAINT fk_events_jobs_1990_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3583 (class 2606 OID 94295)
-- Name: fk_events_jobs_201503_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs_201503
    ADD CONSTRAINT fk_events_jobs_201503_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3584 (class 2606 OID 94300)
-- Name: fk_events_jobs_201503_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs_201503
    ADD CONSTRAINT fk_events_jobs_201503_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3585 (class 2606 OID 94305)
-- Name: fk_events_jobs_201504_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs_201504
    ADD CONSTRAINT fk_events_jobs_201504_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3586 (class 2606 OID 94310)
-- Name: fk_events_jobs_201504_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs_201504
    ADD CONSTRAINT fk_events_jobs_201504_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3587 (class 2606 OID 94315)
-- Name: fk_events_jobs_201505_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs_201505
    ADD CONSTRAINT fk_events_jobs_201505_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3588 (class 2606 OID 94320)
-- Name: fk_events_jobs_201505_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs_201505
    ADD CONSTRAINT fk_events_jobs_201505_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3589 (class 2606 OID 94325)
-- Name: fk_events_jobs_201506_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs_201506
    ADD CONSTRAINT fk_events_jobs_201506_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3590 (class 2606 OID 94330)
-- Name: fk_events_jobs_201506_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs_201506
    ADD CONSTRAINT fk_events_jobs_201506_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3591 (class 2606 OID 94335)
-- Name: fk_events_jobs_201507_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs_201507
    ADD CONSTRAINT fk_events_jobs_201507_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3592 (class 2606 OID 94340)
-- Name: fk_events_jobs_201507_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs_201507
    ADD CONSTRAINT fk_events_jobs_201507_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3593 (class 2606 OID 94345)
-- Name: fk_events_jobs_201508_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs_201508
    ADD CONSTRAINT fk_events_jobs_201508_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3594 (class 2606 OID 94350)
-- Name: fk_events_jobs_201508_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs_201508
    ADD CONSTRAINT fk_events_jobs_201508_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3595 (class 2606 OID 94355)
-- Name: fk_events_jobs_201509_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs_201509
    ADD CONSTRAINT fk_events_jobs_201509_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3596 (class 2606 OID 94360)
-- Name: fk_events_jobs_201509_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs_201509
    ADD CONSTRAINT fk_events_jobs_201509_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3597 (class 2606 OID 94365)
-- Name: fk_events_jobs_201510_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs_201510
    ADD CONSTRAINT fk_events_jobs_201510_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3598 (class 2606 OID 94370)
-- Name: fk_events_jobs_201510_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs_201510
    ADD CONSTRAINT fk_events_jobs_201510_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3599 (class 2606 OID 94375)
-- Name: fk_events_jobs_201511_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs_201511
    ADD CONSTRAINT fk_events_jobs_201511_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3600 (class 2606 OID 94380)
-- Name: fk_events_jobs_201511_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs_201511
    ADD CONSTRAINT fk_events_jobs_201511_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3601 (class 2606 OID 94385)
-- Name: fk_events_jobs_201512_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs_201512
    ADD CONSTRAINT fk_events_jobs_201512_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3602 (class 2606 OID 94390)
-- Name: fk_events_jobs_201512_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs_201512
    ADD CONSTRAINT fk_events_jobs_201512_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3581 (class 2606 OID 94395)
-- Name: fk_events_jobs_2015_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs_2015
    ADD CONSTRAINT fk_events_jobs_2015_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3582 (class 2606 OID 94400)
-- Name: fk_events_jobs_2015_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs_2015
    ADD CONSTRAINT fk_events_jobs_2015_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3605 (class 2606 OID 94405)
-- Name: fk_events_jobs_201601_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs_201601
    ADD CONSTRAINT fk_events_jobs_201601_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3606 (class 2606 OID 94410)
-- Name: fk_events_jobs_201601_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs_201601
    ADD CONSTRAINT fk_events_jobs_201601_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3607 (class 2606 OID 94415)
-- Name: fk_events_jobs_201602_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs_201602
    ADD CONSTRAINT fk_events_jobs_201602_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3608 (class 2606 OID 94420)
-- Name: fk_events_jobs_201602_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs_201602
    ADD CONSTRAINT fk_events_jobs_201602_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3609 (class 2606 OID 94425)
-- Name: fk_events_jobs_201603_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs_201603
    ADD CONSTRAINT fk_events_jobs_201603_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3610 (class 2606 OID 94430)
-- Name: fk_events_jobs_201603_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs_201603
    ADD CONSTRAINT fk_events_jobs_201603_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3603 (class 2606 OID 94435)
-- Name: fk_events_jobs_2016_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs_2016
    ADD CONSTRAINT fk_events_jobs_2016_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3604 (class 2606 OID 94440)
-- Name: fk_events_jobs_2016_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs_2016
    ADD CONSTRAINT fk_events_jobs_2016_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3611 (class 2606 OID 94445)
-- Name: fk_groups_iddivision; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY groups
    ADD CONSTRAINT fk_groups_iddivision FOREIGN KEY (iddivision) REFERENCES divisions(iddivision) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3612 (class 2606 OID 94450)
-- Name: fk_phones_idphonetype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY phones
    ADD CONSTRAINT fk_phones_idphonetype FOREIGN KEY (idphonetype) REFERENCES phone_types(idphonetype) ON UPDATE CASCADE ON DELETE SET DEFAULT;


--
-- TOC entry 3613 (class 2606 OID 94455)
-- Name: fk_phones_idprovider; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY phones
    ADD CONSTRAINT fk_phones_idprovider FOREIGN KEY (idprovider) REFERENCES phone_providers(idprovider) ON UPDATE CASCADE ON DELETE SET DEFAULT;


--
-- TOC entry 3952 (class 0 OID 0)
-- Dependencies: 8
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2016-03-20 07:15:50 ECT

--
-- PostgreSQL database dump complete
--

