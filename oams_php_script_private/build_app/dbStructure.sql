--
-- PostgreSQL database dump
--

-- Dumped from database version 9.4.6
-- Dumped by pg_dump version 9.4.6
-- Started on 2016-03-30 13:38:18 ECT

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- TOC entry 3089 (class 1262 OID 89876)
-- Dependencies: 3088
-- Name: oms; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE oms IS 'Open Alarm Management System';


--
-- TOC entry 2 (class 3079 OID 11861)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 3092 (class 0 OID 0)
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
-- TOC entry 3093 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION adminpack; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION adminpack IS 'administrative functions for PostgreSQL';


SET search_path = public, pg_catalog;

--
-- TOC entry 332 (class 1255 OID 89889)
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

NEW.admins := ARRAY(SELECT DISTINCT UNNEST(NEW.admins::INTEGER[]) ORDER BY 1);
NEW.groups := ARRAY(SELECT DISTINCT UNNEST(NEW.groups::INTEGER[]) ORDER BY 1);

-- setea end_date = a start_date si la fecha end_date es menor que start_date
IF NEW.end_date < NEW.start_date THEN  
NEW.end_date := NEW.start_date;
END IF;    


	
RETURN NEW;
END;$$;


ALTER FUNCTION public.accounts_insert_update() OWNER TO postgres;

--
-- TOC entry 3094 (class 0 OID 0)
-- Dependencies: 332
-- Name: FUNCTION accounts_insert_update(); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION accounts_insert_update() IS 'Realiza validacion de datos antes de insertar en la tabla.';


--
-- TOC entry 276 (class 1255 OID 89890)
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
-- TOC entry 277 (class 1255 OID 89891)
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
-- TOC entry 283 (class 1255 OID 89892)
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
-- TOC entry 278 (class 1255 OID 89893)
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
-- TOC entry 3095 (class 0 OID 0)
-- Dependencies: 278
-- Name: FUNCTION contacts_update_admin_pwd(); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION contacts_update_admin_pwd() IS 'Devuelve el md5 de la clave ingresada cuando se actualiza.';


--
-- TOC entry 279 (class 1255 OID 89894)
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
-- TOC entry 280 (class 1255 OID 89895)
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
-- TOC entry 281 (class 1255 OID 89896)
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
-- TOC entry 282 (class 1255 OID 89897)
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
--NEW.idequipment := 0;
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
-- TOC entry 3096 (class 0 OID 0)
-- Dependencies: 282
-- Name: FUNCTION events_before_insert_redirect_partition(); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION events_before_insert_redirect_partition() IS 'Antes de insertar redirecciona los eventos a la particion que le corresponde.';


--
-- TOC entry 329 (class 1255 OID 89899)
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



RAISE NOTICE '>>> 9) TERMINA EVENTS_ON_INSERT';

RETURN null;
END;$$;


ALTER FUNCTION public.events_on_insert() OWNER TO postgres;

--
-- TOC entry 3097 (class 0 OID 0)
-- Dependencies: 329
-- Name: FUNCTION events_on_insert(); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION events_on_insert() IS 'Envia la notificacion al navegador cuando un evento es insertado en la tabla';


--
-- TOC entry 333 (class 1255 OID 97640)
-- Name: eventtypes_before_insert_update(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION eventtypes_before_insert_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN

NEW.auto_close_on_event_defined := ARRAY(SELECT DISTINCT UNNEST(NEW.auto_close_on_event_defined::INTEGER[]) ORDER BY 1);
--NEW.groups := ARRAY(SELECT DISTINCT UNNEST(NEW.groups::INTEGER[]) ORDER BY 1);


END;$$;


ALTER FUNCTION public.eventtypes_before_insert_update() OWNER TO postgres;

--
-- TOC entry 284 (class 1255 OID 89900)
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
-- TOC entry 285 (class 1255 OID 89901)
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
-- TOC entry 288 (class 1255 OID 89903)
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
-- TOC entry 286 (class 1255 OID 89904)
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
-- TOC entry 3098 (class 0 OID 0)
-- Dependencies: 286
-- Name: FUNCTION fun_edit_accounts(id integer, ienabled boolean, ifirst_name text, ilast_name text, ibirthday timestamp without time zone, iidentification text, iididtype integer, ipostal_code text, igender integer, igeox real, igeoy real, inote text, iaddress text, iaddress_ref text, iidaccountstate integer, iidaccounttype integer, istart_date timestamp without time zone, iend_date timestamp without time zone, iaccount text, iidadmin integer, OUT fun_return integer, OUT fun_msg text); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION fun_edit_accounts(id integer, ienabled boolean, ifirst_name text, ilast_name text, ibirthday timestamp without time zone, iidentification text, iididtype integer, ipostal_code text, igender integer, igeox real, igeoy real, inote text, iaddress text, iaddress_ref text, iidaccountstate integer, iidaccounttype integer, istart_date timestamp without time zone, iend_date timestamp without time zone, iaccount text, iidadmin integer, OUT fun_return integer, OUT fun_msg text) IS 'Aun hay partes que estan usando esta funcion que ya no se deberia usar.';


--
-- TOC entry 289 (class 1255 OID 89905)
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
-- TOC entry 290 (class 1255 OID 89906)
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
-- TOC entry 291 (class 1255 OID 89907)
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
-- TOC entry 178 (class 1259 OID 89908)
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
    idequipment bigint DEFAULT 0
)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events OWNER TO postgres;

--
-- TOC entry 3099 (class 0 OID 0)
-- Dependencies: 178
-- Name: TABLE events; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE events IS 'Las notificaciones de los ecentos solo se muestran al usuario si su proiridad es <= 20';


--
-- TOC entry 3100 (class 0 OID 0)
-- Dependencies: 178
-- Name: COLUMN events.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 3101 (class 0 OID 0)
-- Dependencies: 178
-- Name: COLUMN events.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.

No se lo pone como llave foranea para no tener que crearlas en cada tabla heredada mas bien se hace la comprobacion antes de insertar en la tabla y de no existir se pone a null';


--
-- TOC entry 3102 (class 0 OID 0)
-- Dependencies: 178
-- Name: COLUMN events.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 292 (class 1255 OID 89920)
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
-- TOC entry 3103 (class 0 OID 0)
-- Dependencies: 292
-- Name: FUNCTION fun_event_before_insert_check_and_redirect_partition(INOUT ievents events, table_name text); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION fun_event_before_insert_check_and_redirect_partition(INOUT ievents events, table_name text) IS 'Esta funcion es generica y corre en un trigger que se dispara antes de insertar en la tabla events';


--
-- TOC entry 293 (class 1255 OID 89921)
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
-- TOC entry 294 (class 1255 OID 89922)
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
-- TOC entry 287 (class 1255 OID 89923)
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
-- TOC entry 295 (class 1255 OID 89924)
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
-- TOC entry 3104 (class 0 OID 0)
-- Dependencies: 295
-- Name: FUNCTION fun_event_insert_by_ideventtype(idateevent timestamp without time zone, iidaccount integer, izu integer, ipriority integer, iideventtype integer, idescription text, iidadmin integer, OUT fun_return integer, OUT fun_msg text); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION fun_event_insert_by_ideventtype(idateevent timestamp without time zone, iidaccount integer, izu integer, ipriority integer, iideventtype integer, idescription text, iidadmin integer, OUT fun_return integer, OUT fun_msg text) IS 'Inserta un evento usando como parametros principales el ideventtype para buscar los datos de ese evento y el account para obtener el idcontact de la tabla accounts.';


--
-- TOC entry 296 (class 1255 OID 89925)
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
-- TOC entry 328 (class 1255 OID 89926)
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
-- TOC entry 297 (class 1255 OID 89927)
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
-- TOC entry 298 (class 1255 OID 89928)
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
-- TOC entry 299 (class 1255 OID 89929)
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
-- TOC entry 330 (class 1255 OID 89931)
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
INSERT INTO events(ideventtype, description, idaccount, zu, idequipment) VALUES (iideventtype_current_status, descrip_current_status, iidaccount, izu, iidequipment);

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
            dateevent, ideventtype, description, idaccount, idequipment,
            zu, job_name, job_enabled, job_description, job_date_create, 
            job_run_duration, job_run_status, job_next_run)
    VALUES (idateevent, iideventtype_last_run_outcome, descrip, iidaccount, iidequipment,
            izu, ijob_name, ijob_enabled, ijob_description, ijob_date_create, 
            ijob_run_duration, last_run_outcome, ijob_next_run);


  EXCEPTION WHEN unique_violation THEN
            -- do nothing, and loop to try the UPDATE again
            END;

RETURN;
END;$_$;


ALTER FUNCTION public.fun_farma_event_insert_jobs(iidequipment bigint, idateevent timestamp without time zone, iidaccount bigint, last_run_outcome integer, job_current_execution_status integer, izu bigint, ijob_name text, ijob_enabled boolean, ijob_description text, ijob_date_create timestamp without time zone, ijob_run_duration integer, ijob_next_run timestamp without time zone, OUT ofun_return integer, OUT ofun_msg text) OWNER TO postgres;

--
-- TOC entry 300 (class 1255 OID 89932)
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
-- TOC entry 301 (class 1255 OID 89933)
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
-- TOC entry 3105 (class 0 OID 0)
-- Dependencies: 301
-- Name: FUNCTION fun_farma_event_insert_sqlserver_uptime(iidaccount bigint, iuptime integer); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION fun_farma_event_insert_sqlserver_uptime(iidaccount bigint, iuptime integer) IS 'El parametro de entrada es en minutos';


--
-- TOC entry 302 (class 1255 OID 89934)
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
-- TOC entry 303 (class 1255 OID 89935)
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
-- TOC entry 304 (class 1255 OID 89937)
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
-- TOC entry 305 (class 1255 OID 89938)
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
-- TOC entry 3106 (class 0 OID 0)
-- Dependencies: 305
-- Name: FUNCTION fun_farma_import_accounts_insertphone(iidcontact bigint, inumber text); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION fun_farma_import_accounts_insertphone(iidcontact bigint, inumber text) IS 'Funcion de apoyo para importar datos de telefonos de la cuenta';


--
-- TOC entry 306 (class 1255 OID 89939)
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
-- TOC entry 307 (class 1255 OID 89940)
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
-- TOC entry 308 (class 1255 OID 89941)
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
-- TOC entry 309 (class 1255 OID 89942)
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
-- TOC entry 310 (class 1255 OID 89943)
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
-- TOC entry 331 (class 1255 OID 89944)
-- Name: fun_farma_import_tec_asig(text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_farma_import_tec_asig(iidentification text, ioficina text, OUT fun_return integer, OUT fun_msg text) RETURNS record
    LANGUAGE plpgsql
    AS $$DECLARE

idtec INTEGER DEFAULT 0;
idofi INTEGER DEFAULT 0;
iidadmin INTEGER;

BEGIN

fun_return := -100;
fun_msg := 'Error desconocido';

SELECT  idcontact, idadmin INTO idtec, iidadmin  FROM view_admins WHERE identification = iidentification;
SELECT  idcontact INTO idofi FROM accounts WHERE account = ioficina AND iddivision = 1;

IF idtec > 0 AND idofi > 0 THEN

--assigned
--DELETE FROM account_contacts WHERE idaccount = idofi AND appointment = 'Técnico Responsable';
UPDATE accounts SET admins = array_prepend(iidadmin, admins) WHERE idcontact = idofi;

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
-- TOC entry 311 (class 1255 OID 89945)
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
-- TOC entry 312 (class 1255 OID 89946)
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
-- TOC entry 314 (class 1255 OID 89947)
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
-- TOC entry 315 (class 1255 OID 89948)
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
-- TOC entry 327 (class 1255 OID 89949)
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
-- TOC entry 326 (class 1255 OID 94492)
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
-- TOC entry 316 (class 1255 OID 89951)
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
-- TOC entry 317 (class 1255 OID 89952)
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
-- TOC entry 318 (class 1255 OID 89953)
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
-- TOC entry 313 (class 1255 OID 89954)
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
-- TOC entry 319 (class 1255 OID 89955)
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
-- TOC entry 320 (class 1255 OID 89956)
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
-- TOC entry 321 (class 1255 OID 89957)
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
-- TOC entry 3107 (class 0 OID 0)
-- Dependencies: 321
-- Name: FUNCTION fun_sufix_name_by_date(idate timestamp without time zone); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION fun_sufix_name_by_date(idate timestamp without time zone) IS 'Devuelva el sufijo del nombre de las tablas segun la fecha ingresada como parametro.';


--
-- TOC entry 335 (class 1255 OID 89958)
-- Name: fun_udc_mapper(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fun_udc_mapper() RETURNS integer
    LANGUAGE plpgsql
    AS $$DECLARE

idata_type text;
fun_return INTEGER DEFAULT 0;
cursor1 CURSOR FOR SELECT table_name, column_name, data_type, column_default, udt_name from information_schema.columns where table_name NOT LIKE '%_20%' AND table_name NOT LIKE '%_19%' AND table_schema = 'public' ORDER BY table_name, column_name, data_type;
    cursor1_row RECORD;

BEGIN


    FOR cursor1_row IN cursor1 LOOP

idata_type := cursor1_row.data_type;

IF cursor1_row.data_type::TEXT = 'ARRAY' THEN
idata_type := replace(cursor1_row.udt_name::TEXT, '_', '')||'[]';
END IF;
    
UPDATE udc_tables_columns
   SET data_type=idata_type, column_default=cursor1_row.column_default
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
-- TOC entry 322 (class 1255 OID 89959)
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
-- TOC entry 323 (class 1255 OID 89960)
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
-- TOC entry 324 (class 1255 OID 89961)
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
-- TOC entry 3108 (class 0 OID 0)
-- Dependencies: 324
-- Name: FUNCTION notifications_before_insert(); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION notifications_before_insert() IS 'Acciones y comprobaciones antes de insertar el registro de notificacion';


--
-- TOC entry 336 (class 1255 OID 89962)
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
-- TOC entry 3109 (class 0 OID 0)
-- Dependencies: 336
-- Name: FUNCTION on_changed_table(); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION on_changed_table() IS 'Debe ser disparado despues de que la tabla ha sufrido cambios.';


--
-- TOC entry 325 (class 1255 OID 89963)
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
-- TOC entry 3110 (class 0 OID 0)
-- Dependencies: 325
-- Name: FUNCTION on_update_row_update_ts(); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION on_update_row_update_ts() IS 'Debe ser disparado antes de actualizar un registro de una tabla para que el campo ts sea actualizado.';


--
-- TOC entry 334 (class 1255 OID 102735)
-- Name: xxx_temp_set_idequipment(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION xxx_temp_set_idequipment() RETURNS integer
    LANGUAGE plpgsql
    AS $$DECLARE

iidequipment BIGINT;
fun_return INTEGER DEFAULT 0;
cursor1 CURSOR FOR select * from events where idequipment is null;
    cursor1_row RECORD;

BEGIN


    FOR cursor1_row IN cursor1 LOOP
            -- if cursor1_row.minutes_event >=  cursor1_row.limit_expiration then
        --  PERFORM fun_edit_event_comments(0, 0, now()::timestamp without time zone, 1, 'Event expired. Automatically closed by the system.'::text, 5, cursor1_row.idevent::bigint);   

SELECT idequipment INTO iidequipment FROM view_equipments WHERE idcontact = cursor1_row.idaccount;

IF iidequipment is null THEN
iidequipment := 0;
END IF;

UPDATE events set idequipment = iidequipment WHERE idevent = cursor1_row.idevent;

    END LOOP;

    

RETURN fun_return;
END;$$;


ALTER FUNCTION public.xxx_temp_set_idequipment() OWNER TO postgres;

--
-- TOC entry 179 (class 1259 OID 89964)
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
-- TOC entry 3111 (class 0 OID 0)
-- Dependencies: 179
-- Name: TABLE account_contacts; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE account_contacts IS 'Usuarios de un abonado (cliente).
No hay como usar idacount como llave foranea porque es una tabla heredada, hay que hacer la comprobacion manualmente.';


--
-- TOC entry 3112 (class 0 OID 0)
-- Dependencies: 179
-- Name: COLUMN account_contacts.idaccount; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN account_contacts.idaccount IS 'ID de la cuenta';


--
-- TOC entry 3113 (class 0 OID 0)
-- Dependencies: 179
-- Name: COLUMN account_contacts.idcontact; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN account_contacts.idcontact IS 'ID asociado de la lista de contactos';


--
-- TOC entry 180 (class 1259 OID 89972)
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
-- TOC entry 3114 (class 0 OID 0)
-- Dependencies: 180
-- Name: TABLE account_states; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE account_states IS 'Lista de posibles estados de un abonado';


--
-- TOC entry 181 (class 1259 OID 89979)
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
-- TOC entry 3115 (class 0 OID 0)
-- Dependencies: 181
-- Name: account_state_idaccountstate_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE account_state_idaccountstate_seq OWNED BY account_states.idaccountstate;


--
-- TOC entry 182 (class 1259 OID 89981)
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
-- TOC entry 183 (class 1259 OID 89988)
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
-- TOC entry 3116 (class 0 OID 0)
-- Dependencies: 183
-- Name: account_types_idaccounttype_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE account_types_idaccounttype_seq OWNED BY account_types.idaccounttype;


--
-- TOC entry 184 (class 1259 OID 89990)
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
-- TOC entry 3117 (class 0 OID 0)
-- Dependencies: 184
-- Name: account_users_idaccountuser_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE account_users_idaccountuser_seq OWNED BY account_contacts.idaccountuser;


--
-- TOC entry 240 (class 1259 OID 93483)
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
-- TOC entry 185 (class 1259 OID 90004)
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
-- TOC entry 3118 (class 0 OID 0)
-- Dependencies: 185
-- Name: COLUMN contacts.enabled; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.enabled IS 'Indica si el contacto esta habilitado o no.
Por ejemplo si el contacto debe usarse o no para otras areas de la aplicacion.';


--
-- TOC entry 3119 (class 0 OID 0)
-- Dependencies: 185
-- Name: COLUMN contacts.first_name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.first_name IS 'Nombre del contacto.
Este campo es oblogatorio y no puede ser nulo.
';


--
-- TOC entry 3120 (class 0 OID 0)
-- Dependencies: 185
-- Name: COLUMN contacts.last_name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.last_name IS 'Apellido del contacto.
Este valor puede ser nulo aunque no se recomienda.';


--
-- TOC entry 3121 (class 0 OID 0)
-- Dependencies: 185
-- Name: COLUMN contacts.identification; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.identification IS 'Este campo es importante, obligatorio y unico entre todos los registros.
Es un identificador unico entre el resto de contactos.
';


--
-- TOC entry 3122 (class 0 OID 0)
-- Dependencies: 185
-- Name: COLUMN contacts.ididtype; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.ididtype IS 'Tipo de identificacion (Ej.: Cedula, RUC, etc)';


--
-- TOC entry 3123 (class 0 OID 0)
-- Dependencies: 185
-- Name: COLUMN contacts.postal_code; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.postal_code IS 'Codigo Postal';


--
-- TOC entry 3124 (class 0 OID 0)
-- Dependencies: 185
-- Name: COLUMN contacts.gender; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.gender IS 'Genero:
0 - No establecido
1 - Hombre
2 - Mujer';


--
-- TOC entry 3125 (class 0 OID 0)
-- Dependencies: 185
-- Name: COLUMN contacts.geox; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.geox IS 'Geolocalizacion X';


--
-- TOC entry 3126 (class 0 OID 0)
-- Dependencies: 185
-- Name: COLUMN contacts.geoy; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.geoy IS 'Geolocalizacion Y';


--
-- TOC entry 3127 (class 0 OID 0)
-- Dependencies: 185
-- Name: COLUMN contacts.address; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.address IS 'Direccion del contacto';


--
-- TOC entry 3128 (class 0 OID 0)
-- Dependencies: 185
-- Name: COLUMN contacts.address_ref; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.address_ref IS 'Puntos referenciales para ubucacion del contacto';


--
-- TOC entry 3129 (class 0 OID 0)
-- Dependencies: 185
-- Name: COLUMN contacts.groups; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.groups IS 'Id de los grupos a los que pertenece este abonado';


--
-- TOC entry 186 (class 1259 OID 90016)
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
-- TOC entry 3130 (class 0 OID 0)
-- Dependencies: 186
-- Name: contacts_idcontact_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE contacts_idcontact_seq OWNED BY contacts.idcontact;


--
-- TOC entry 187 (class 1259 OID 90018)
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
    iddivision integer,
    admins integer[]
)
INHERITS (contacts)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE accounts OWNER TO postgres;

--
-- TOC entry 3131 (class 0 OID 0)
-- Dependencies: 187
-- Name: COLUMN accounts.admins; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN accounts.admins IS 'Lista de administradores asignados a la cuenta';


--
-- TOC entry 188 (class 1259 OID 90034)
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
    admin_failed_access_attempts smallint DEFAULT 0,
    appointment text DEFAULT 'Admin'::text
)
WITH (toast.autovacuum_enabled='true');


ALTER TABLE admins OWNER TO postgres;

--
-- TOC entry 189 (class 1259 OID 90047)
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
-- TOC entry 3132 (class 0 OID 0)
-- Dependencies: 189
-- Name: admins_idadmin_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE admins_idadmin_seq OWNED BY admins.idadmin;


--
-- TOC entry 190 (class 1259 OID 90049)
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
-- TOC entry 3133 (class 0 OID 0)
-- Dependencies: 190
-- Name: admins_idcontact_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE admins_idcontact_seq OWNED BY admins.idcontact;


--
-- TOC entry 191 (class 1259 OID 90051)
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
-- TOC entry 192 (class 1259 OID 90058)
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
-- TOC entry 3134 (class 0 OID 0)
-- Dependencies: 192
-- Name: attachments_idattachment_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE attachments_idattachment_seq OWNED BY attachments.idattachment;


--
-- TOC entry 193 (class 1259 OID 90060)
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
-- TOC entry 3135 (class 0 OID 0)
-- Dependencies: 193
-- Name: TABLE divisions; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE divisions IS 'Division, area, grupo empresarial, etc';


--
-- TOC entry 194 (class 1259 OID 90068)
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
-- TOC entry 3136 (class 0 OID 0)
-- Dependencies: 194
-- Name: division_iddivision_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE division_iddivision_seq OWNED BY divisions.iddivision;


--
-- TOC entry 195 (class 1259 OID 90070)
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
-- TOC entry 3137 (class 0 OID 0)
-- Dependencies: 195
-- Name: COLUMN emails.notify_if_administrator; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN emails.notify_if_administrator IS 'Habilita envio de email de notificacion a esta direccion de corre cuando el email corresponde a un usuario administrador del sistema';


--
-- TOC entry 196 (class 1259 OID 90080)
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
-- TOC entry 3138 (class 0 OID 0)
-- Dependencies: 196
-- Name: emails_idemail_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE emails_idemail_seq OWNED BY emails.idemail;


--
-- TOC entry 197 (class 1259 OID 90082)
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
    agreement_code_provider text,
    identification text,
    enabled boolean DEFAULT true NOT NULL,
    eventtypes integer[]
);


ALTER TABLE equipments OWNER TO postgres;

--
-- TOC entry 3139 (class 0 OID 0)
-- Dependencies: 197
-- Name: COLUMN equipments.serial_number; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN equipments.serial_number IS 'Numero de serie que viene en el producto';


--
-- TOC entry 3140 (class 0 OID 0)
-- Dependencies: 197
-- Name: COLUMN equipments.code_ref; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN equipments.code_ref IS 'Codigo para uso interno';


--
-- TOC entry 3141 (class 0 OID 0)
-- Dependencies: 197
-- Name: COLUMN equipments.operability; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN equipments.operability IS 'Porcentage de operatividad del equipo';


--
-- TOC entry 3142 (class 0 OID 0)
-- Dependencies: 197
-- Name: COLUMN equipments.agreement_code_provider; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN equipments.agreement_code_provider IS 'Numero de contrato, numero o codigo con que el proveedor nos conoce.';


--
-- TOC entry 3143 (class 0 OID 0)
-- Dependencies: 197
-- Name: COLUMN equipments.identification; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN equipments.identification IS 'Numero Unico de identificacion del dispositivo dentro del sistema, con el cual se podrá aceptar eventos del dispositivo.';


--
-- TOC entry 3144 (class 0 OID 0)
-- Dependencies: 197
-- Name: COLUMN equipments.eventtypes; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN equipments.eventtypes IS 'Tipos de eventos que se van a monitorear de este equipo.';


--
-- TOC entry 198 (class 1259 OID 90091)
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
-- TOC entry 3145 (class 0 OID 0)
-- Dependencies: 198
-- Name: equipments_idequipment_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE equipments_idequipment_seq OWNED BY equipments.idequipment;


--
-- TOC entry 199 (class 1259 OID 90093)
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
-- TOC entry 200 (class 1259 OID 90097)
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
-- TOC entry 3146 (class 0 OID 0)
-- Dependencies: 200
-- Name: event_attachments_ideventattach_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE event_attachments_ideventattach_seq OWNED BY event_comments_attachments.ideventcommentattach;


--
-- TOC entry 201 (class 1259 OID 90099)
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
-- TOC entry 3147 (class 0 OID 0)
-- Dependencies: 201
-- Name: COLUMN event_comments.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN event_comments.status IS 'Este campo es necesario para actualiza la tabla events cuando un comentario es ingresado.';


--
-- TOC entry 202 (class 1259 OID 90109)
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
-- TOC entry 3148 (class 0 OID 0)
-- Dependencies: 202
-- Name: event_comments_ideventcomment_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE event_comments_ideventcomment_seq OWNED BY event_comments.ideventcomment;


--
-- TOC entry 256 (class 1259 OID 96263)
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
-- TOC entry 3149 (class 0 OID 0)
-- Dependencies: 256
-- Name: COLUMN event_comments_2016.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN event_comments_2016.status IS 'Este campo es necesario para actualiza la tabla events cuando un comentario es ingresado.';


--
-- TOC entry 203 (class 1259 OID 90166)
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
-- TOC entry 3150 (class 0 OID 0)
-- Dependencies: 203
-- Name: events_idevent_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE events_idevent_seq OWNED BY events.idevent;


--
-- TOC entry 246 (class 1259 OID 95114)
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
    idequipment bigint DEFAULT 0,
    CONSTRAINT events_2016_dateevent_check CHECK ((date_part('year'::text, dateevent) = (2016)::double precision))
)
INHERITS (events)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_2016 OWNER TO postgres;

--
-- TOC entry 3151 (class 0 OID 0)
-- Dependencies: 246
-- Name: COLUMN events_2016.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_2016.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 3152 (class 0 OID 0)
-- Dependencies: 246
-- Name: COLUMN events_2016.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_2016.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.

No se lo pone como llave foranea para no tener que crearlas en cada tabla heredada mas bien se hace la comprobacion antes de insertar en la tabla y de no existir se pone a null';


--
-- TOC entry 3153 (class 0 OID 0)
-- Dependencies: 246
-- Name: COLUMN events_2016.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_2016.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 204 (class 1259 OID 90234)
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
-- TOC entry 3154 (class 0 OID 0)
-- Dependencies: 204
-- Name: TABLE events_dbsizes; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE events_dbsizes IS 'Aqui no debe crearse el check de fecha ya que ese check se lo crea en cada tabla hija';


--
-- TOC entry 3155 (class 0 OID 0)
-- Dependencies: 204
-- Name: COLUMN events_dbsizes.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_dbsizes.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 3156 (class 0 OID 0)
-- Dependencies: 204
-- Name: COLUMN events_dbsizes.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_dbsizes.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 3157 (class 0 OID 0)
-- Dependencies: 204
-- Name: COLUMN events_dbsizes.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_dbsizes.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 253 (class 1259 OID 96141)
-- Name: events_dbsizes_2015; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_dbsizes_2015 (
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
    idequipment bigint DEFAULT 0,
    db_name text,
    db_size real,
    db_type smallint
)
INHERITS (events_dbsizes)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_dbsizes_2015 OWNER TO postgres;

--
-- TOC entry 3158 (class 0 OID 0)
-- Dependencies: 253
-- Name: COLUMN events_dbsizes_2015.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_dbsizes_2015.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 3159 (class 0 OID 0)
-- Dependencies: 253
-- Name: COLUMN events_dbsizes_2015.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_dbsizes_2015.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 3160 (class 0 OID 0)
-- Dependencies: 253
-- Name: COLUMN events_dbsizes_2015.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_dbsizes_2015.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 248 (class 1259 OID 95195)
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
    idequipment bigint DEFAULT 0,
    db_name text,
    db_size real,
    db_type smallint,
    CONSTRAINT events_dbsizes_2016_dateevent_check CHECK ((date_part('year'::text, dateevent) = (2016)::double precision))
)
INHERITS (events_dbsizes)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_dbsizes_2016 OWNER TO postgres;

--
-- TOC entry 3161 (class 0 OID 0)
-- Dependencies: 248
-- Name: COLUMN events_dbsizes_2016.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_dbsizes_2016.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 3162 (class 0 OID 0)
-- Dependencies: 248
-- Name: COLUMN events_dbsizes_2016.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_dbsizes_2016.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 3163 (class 0 OID 0)
-- Dependencies: 248
-- Name: COLUMN events_dbsizes_2016.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_dbsizes_2016.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 205 (class 1259 OID 90313)
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
-- TOC entry 3164 (class 0 OID 0)
-- Dependencies: 205
-- Name: COLUMN events_device_uptime.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_device_uptime.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 3165 (class 0 OID 0)
-- Dependencies: 205
-- Name: COLUMN events_device_uptime.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_device_uptime.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 3166 (class 0 OID 0)
-- Dependencies: 205
-- Name: COLUMN events_device_uptime.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_device_uptime.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 252 (class 1259 OID 96118)
-- Name: events_device_uptime_2015; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_device_uptime_2015 (
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
    idequipment bigint DEFAULT 0,
    uptime real DEFAULT (-1)
)
INHERITS (events_device_uptime)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_device_uptime_2015 OWNER TO postgres;

--
-- TOC entry 3167 (class 0 OID 0)
-- Dependencies: 252
-- Name: COLUMN events_device_uptime_2015.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_device_uptime_2015.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 3168 (class 0 OID 0)
-- Dependencies: 252
-- Name: COLUMN events_device_uptime_2015.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_device_uptime_2015.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 3169 (class 0 OID 0)
-- Dependencies: 252
-- Name: COLUMN events_device_uptime_2015.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_device_uptime_2015.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 245 (class 1259 OID 95074)
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
    idequipment bigint DEFAULT 0,
    uptime real DEFAULT (-1),
    CONSTRAINT events_device_uptime_2016_dateevent_check CHECK ((date_part('year'::text, dateevent) = (2016)::double precision))
)
INHERITS (events_device_uptime)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_device_uptime_2016 OWNER TO postgres;

--
-- TOC entry 3170 (class 0 OID 0)
-- Dependencies: 245
-- Name: COLUMN events_device_uptime_2016.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_device_uptime_2016.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 3171 (class 0 OID 0)
-- Dependencies: 245
-- Name: COLUMN events_device_uptime_2016.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_device_uptime_2016.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 3172 (class 0 OID 0)
-- Dependencies: 245
-- Name: COLUMN events_device_uptime_2016.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_device_uptime_2016.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 206 (class 1259 OID 90398)
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
-- TOC entry 3173 (class 0 OID 0)
-- Dependencies: 206
-- Name: COLUMN events_diskspace.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_diskspace.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 3174 (class 0 OID 0)
-- Dependencies: 206
-- Name: COLUMN events_diskspace.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_diskspace.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 3175 (class 0 OID 0)
-- Dependencies: 206
-- Name: COLUMN events_diskspace.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_diskspace.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 251 (class 1259 OID 96090)
-- Name: events_diskspace_2015; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_diskspace_2015 (
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
    idequipment bigint DEFAULT 0,
    drive character(2),
    drive_size real DEFAULT (-1),
    drive_free real DEFAULT (-1),
    CONSTRAINT events_diskspace_check_ideventtype CHECK (((ideventtype = 62) OR (ideventtype = 52)))
)
INHERITS (events_diskspace)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_diskspace_2015 OWNER TO postgres;

--
-- TOC entry 3176 (class 0 OID 0)
-- Dependencies: 251
-- Name: COLUMN events_diskspace_2015.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_diskspace_2015.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 3177 (class 0 OID 0)
-- Dependencies: 251
-- Name: COLUMN events_diskspace_2015.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_diskspace_2015.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 3178 (class 0 OID 0)
-- Dependencies: 251
-- Name: COLUMN events_diskspace_2015.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_diskspace_2015.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 244 (class 1259 OID 95032)
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
    idequipment bigint DEFAULT 0,
    drive character(2),
    drive_size real DEFAULT (-1),
    drive_free real DEFAULT (-1),
    CONSTRAINT events_diskspace_2016_dateevent_check CHECK ((date_part('year'::text, dateevent) = (2016)::double precision)),
    CONSTRAINT events_diskspace_check_ideventtype CHECK (((ideventtype = 62) OR (ideventtype = 52)))
)
INHERITS (events_diskspace)
WITH (autovacuum_enabled='true', toast.autovacuum_enabled='true');


ALTER TABLE events_diskspace_2016 OWNER TO postgres;

--
-- TOC entry 3179 (class 0 OID 0)
-- Dependencies: 244
-- Name: COLUMN events_diskspace_2016.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_diskspace_2016.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 3180 (class 0 OID 0)
-- Dependencies: 244
-- Name: COLUMN events_diskspace_2016.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_diskspace_2016.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 3181 (class 0 OID 0)
-- Dependencies: 244
-- Name: COLUMN events_diskspace_2016.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_diskspace_2016.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 207 (class 1259 OID 90495)
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
-- TOC entry 3182 (class 0 OID 0)
-- Dependencies: 207
-- Name: COLUMN events_jobs.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 3183 (class 0 OID 0)
-- Dependencies: 207
-- Name: COLUMN events_jobs.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 3184 (class 0 OID 0)
-- Dependencies: 207
-- Name: COLUMN events_jobs.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 250 (class 1259 OID 96003)
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
    idequipment bigint DEFAULT 0,
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
-- TOC entry 3185 (class 0 OID 0)
-- Dependencies: 250
-- Name: COLUMN events_jobs_1990.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_1990.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 3186 (class 0 OID 0)
-- Dependencies: 250
-- Name: COLUMN events_jobs_1990.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_1990.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 3187 (class 0 OID 0)
-- Dependencies: 250
-- Name: COLUMN events_jobs_1990.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_1990.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 249 (class 1259 OID 95946)
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
    idequipment bigint DEFAULT 0,
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
-- TOC entry 3188 (class 0 OID 0)
-- Dependencies: 249
-- Name: COLUMN events_jobs_2015.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_2015.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 3189 (class 0 OID 0)
-- Dependencies: 249
-- Name: COLUMN events_jobs_2015.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_2015.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 3190 (class 0 OID 0)
-- Dependencies: 249
-- Name: COLUMN events_jobs_2015.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_2015.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 247 (class 1259 OID 95153)
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
    idequipment bigint DEFAULT 0,
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
-- TOC entry 3191 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN events_jobs_2016.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_2016.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 3192 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN events_jobs_2016.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_2016.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 3193 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN events_jobs_2016.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs_2016.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 208 (class 1259 OID 90834)
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
-- TOC entry 3194 (class 0 OID 0)
-- Dependencies: 208
-- Name: TABLE events_raid; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE events_raid IS 'Importa los reportes de Servidores RAID (AMD) recibidor por email desde el archivo de icedove.';


--
-- TOC entry 3195 (class 0 OID 0)
-- Dependencies: 208
-- Name: COLUMN events_raid.line_file; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_raid.line_file IS 'Ultima linea que leyo el sistema desde el archivo de email de icedove.';


--
-- TOC entry 209 (class 1259 OID 90862)
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
    ideventtype_group integer
);


ALTER TABLE eventtypes OWNER TO postgres;

--
-- TOC entry 3196 (class 0 OID 0)
-- Dependencies: 209
-- Name: TABLE eventtypes; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE eventtypes IS 'Tipos de eventos definidos para el sistema.
A partir del evento 1000 son definidos internamente por oams y no deben ser utilizados por el usuario.';


--
-- TOC entry 3197 (class 0 OID 0)
-- Dependencies: 209
-- Name: COLUMN eventtypes.name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.name IS 'Nombre del evento';


--
-- TOC entry 3198 (class 0 OID 0)
-- Dependencies: 209
-- Name: COLUMN eventtypes.treatment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.treatment IS 'Requiere tratamiento por parte del operador';


--
-- TOC entry 3199 (class 0 OID 0)
-- Dependencies: 209
-- Name: COLUMN eventtypes.manual; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.manual IS 'Puede ser creado el evento manualmente, la mayoria de los eventos deberian ser creados solo por un software y no generados a mano por razones de seguridad.';


--
-- TOC entry 3200 (class 0 OID 0)
-- Dependencies: 209
-- Name: COLUMN eventtypes.date_editable; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.date_editable IS 'Las fechas de los eventos NO deberian ser editables por razones de seguridda, a exepcion de las tareas que si podrian ser modificadas. ';


--
-- TOC entry 3201 (class 0 OID 0)
-- Dependencies: 209
-- Name: COLUMN eventtypes.notify_timeout; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.notify_timeout IS 'Tiempo que la notificacion sera visible para el usuario';


--
-- TOC entry 3202 (class 0 OID 0)
-- Dependencies: 209
-- Name: COLUMN eventtypes.notify_closable; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.notify_closable IS 'La notificacion puede ser cerrada por el usuario antes de que se cierre automaticamente una vez trascurrido el timeout.';


--
-- TOC entry 3203 (class 0 OID 0)
-- Dependencies: 209
-- Name: COLUMN eventtypes.notify_img; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.notify_img IS 'Imagen a ser  mostrada en la notificacion';


--
-- TOC entry 3204 (class 0 OID 0)
-- Dependencies: 209
-- Name: COLUMN eventtypes.notify_snd; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.notify_snd IS 'Sonido a ser escuchado cuando la notificacion es mostrada.';


--
-- TOC entry 3205 (class 0 OID 0)
-- Dependencies: 209
-- Name: COLUMN eventtypes.label; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.label IS 'Etiqueta que se mostrara en la interface grafica';


--
-- TOC entry 3206 (class 0 OID 0)
-- Dependencies: 209
-- Name: COLUMN eventtypes.code; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.code IS 'Codigo de alarma';


--
-- TOC entry 3207 (class 0 OID 0)
-- Dependencies: 209
-- Name: COLUMN eventtypes.notify_all_users; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.notify_all_users IS 'Muestra la notificacion de este evento a todos los usuarios  o solo al usuario que lo genera.';


--
-- TOC entry 3208 (class 0 OID 0)
-- Dependencies: 209
-- Name: COLUMN eventtypes.expiration; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.expiration IS 'Tiempo en que el evento permanece en espera de sewr atendido antes de ser cerrado automaticamente por el sistema, en minutos.
De fabrica 525600 = 365 dias.
Se puede usar este campo para auto cerrar los eventos que no requieren tratamiento por parte del operador seteando en valor a 0.';


--
-- TOC entry 3209 (class 0 OID 0)
-- Dependencies: 209
-- Name: COLUMN eventtypes.auto_close_on_event_defined; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.auto_close_on_event_defined IS 'Cierra el evento automaticamente si llega un evento con idevent listado en esta matriz.';


--
-- TOC entry 258 (class 1259 OID 97550)
-- Name: eventtypes_groups; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE eventtypes_groups (
    ideventtype_group bigint NOT NULL,
    "group" text NOT NULL,
    enabled boolean DEFAULT true,
    is_status boolean DEFAULT false NOT NULL,
    description text
);


ALTER TABLE eventtypes_groups OWNER TO postgres;

--
-- TOC entry 257 (class 1259 OID 97548)
-- Name: eventtypes_groups_ideventtype_group_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE eventtypes_groups_ideventtype_group_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE eventtypes_groups_ideventtype_group_seq OWNER TO postgres;

--
-- TOC entry 3210 (class 0 OID 0)
-- Dependencies: 257
-- Name: eventtypes_groups_ideventtype_group_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE eventtypes_groups_ideventtype_group_seq OWNED BY eventtypes_groups.ideventtype_group;


--
-- TOC entry 210 (class 1259 OID 90879)
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
-- TOC entry 3211 (class 0 OID 0)
-- Dependencies: 210
-- Name: eventtypes_ideventtype_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE eventtypes_ideventtype_seq OWNED BY eventtypes.ideventtype;


--
-- TOC entry 211 (class 1259 OID 90881)
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
-- TOC entry 3212 (class 0 OID 0)
-- Dependencies: 211
-- Name: TABLE farma_lista_precios_farmacias; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE farma_lista_precios_farmacias IS 'Tabla con la lista de precios de actuales de las farmacias';


--
-- TOC entry 212 (class 1259 OID 90892)
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
-- TOC entry 3213 (class 0 OID 0)
-- Dependencies: 212
-- Name: farma_lista_precios_farmacias_idlista_precios_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE farma_lista_precios_farmacias_idlista_precios_seq OWNED BY farma_lista_precios_farmacias.idlista_precios;


--
-- TOC entry 213 (class 1259 OID 90894)
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
-- TOC entry 3214 (class 0 OID 0)
-- Dependencies: 213
-- Name: TABLE groups; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE groups IS 'Grupos';


--
-- TOC entry 214 (class 1259 OID 90902)
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
-- TOC entry 3215 (class 0 OID 0)
-- Dependencies: 214
-- Name: groups_idgrupo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE groups_idgrupo_seq OWNED BY groups.idgroup;


--
-- TOC entry 215 (class 1259 OID 90904)
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
-- TOC entry 216 (class 1259 OID 90911)
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
-- TOC entry 217 (class 1259 OID 90919)
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
-- TOC entry 3216 (class 0 OID 0)
-- Dependencies: 217
-- Name: identification_type_ididtype_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE identification_type_ididtype_seq OWNED BY identification_types.ididtype;


--
-- TOC entry 218 (class 1259 OID 90921)
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
-- TOC entry 3217 (class 0 OID 0)
-- Dependencies: 218
-- Name: TABLE interface_words; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE interface_words IS 'Lista de palabras o frases comunes usadas en la interface grafica que pueden ser usadas para traduccion a diferentes idiomas';


--
-- TOC entry 3218 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN interface_words.word; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN interface_words.word IS 'Palabras usadas en la interface grafica';


--
-- TOC entry 219 (class 1259 OID 90928)
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
-- TOC entry 3219 (class 0 OID 0)
-- Dependencies: 219
-- Name: interface_words_idwords_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE interface_words_idwords_seq OWNED BY interface_words.idword;


--
-- TOC entry 220 (class 1259 OID 90930)
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
-- TOC entry 3220 (class 0 OID 0)
-- Dependencies: 220
-- Name: TABLE network_devices; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE network_devices IS 'Equipos que funcionan en red o estan conectados a una red y disponen de direccion IP.';


--
-- TOC entry 3221 (class 0 OID 0)
-- Dependencies: 220
-- Name: COLUMN network_devices.ip; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN network_devices.ip IS 'Direccion IP';


--
-- TOC entry 3222 (class 0 OID 0)
-- Dependencies: 220
-- Name: COLUMN network_devices.mac; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN network_devices.mac IS 'MAC';


--
-- TOC entry 255 (class 1259 OID 96235)
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
-- TOC entry 254 (class 1259 OID 96233)
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
-- TOC entry 3223 (class 0 OID 0)
-- Dependencies: 254
-- Name: notification_area_idnotify_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE notification_area_idnotify_seq OWNED BY notification_area.idnotify;


--
-- TOC entry 221 (class 1259 OID 90955)
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
-- TOC entry 3224 (class 0 OID 0)
-- Dependencies: 221
-- Name: TABLE oams_table_columns; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE oams_table_columns IS 'Propiedades de los Campos de las tables del sistema, definidas por el sistema y por el usuario';


--
-- TOC entry 3225 (class 0 OID 0)
-- Dependencies: 221
-- Name: COLUMN oams_table_columns.table_name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN oams_table_columns.table_name IS 'id table column';


--
-- TOC entry 3226 (class 0 OID 0)
-- Dependencies: 221
-- Name: COLUMN oams_table_columns.column_label; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN oams_table_columns.column_label IS 'Etiqueta definida por el usuario.
Si  es null se usa el nombre de la columna';


--
-- TOC entry 222 (class 1259 OID 90962)
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
-- TOC entry 223 (class 1259 OID 90970)
-- Name: phone_types; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE phone_types (
    idphonetype bigint NOT NULL,
    ts timestamp without time zone DEFAULT now(),
    type text NOT NULL
);


ALTER TABLE phone_types OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 90977)
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
-- TOC entry 3227 (class 0 OID 0)
-- Dependencies: 224
-- Name: phone_type_idphonetype_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE phone_type_idphonetype_seq OWNED BY phone_types.idphonetype;


--
-- TOC entry 225 (class 1259 OID 90979)
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
-- TOC entry 3228 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN phones.idcontact; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN phones.idcontact IS 'Validar si existe este contacto hay que hacerlo manualmente ya que hay una tabla heredada accounts.';


--
-- TOC entry 226 (class 1259 OID 90990)
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
-- TOC entry 3229 (class 0 OID 0)
-- Dependencies: 226
-- Name: phones_idphone_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE phones_idphone_seq OWNED BY phones.idphone;


--
-- TOC entry 227 (class 1259 OID 90992)
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
-- TOC entry 3230 (class 0 OID 0)
-- Dependencies: 227
-- Name: TABLE providers; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE providers IS 'Lista de proveedores de productos y servicios';


--
-- TOC entry 228 (class 1259 OID 91009)
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
-- TOC entry 3231 (class 0 OID 0)
-- Dependencies: 228
-- Name: providers_idprovider_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE providers_idprovider_seq OWNED BY phone_providers.idprovider;


--
-- TOC entry 229 (class 1259 OID 91011)
-- Name: sys_table_ts; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE sys_table_ts (
    table_name text NOT NULL,
    ts timestamp without time zone DEFAULT now(),
    tsz timestamp with time zone DEFAULT now()
);


ALTER TABLE sys_table_ts OWNER TO postgres;

--
-- TOC entry 3232 (class 0 OID 0)
-- Dependencies: 229
-- Name: TABLE sys_table_ts; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE sys_table_ts IS 'Esta tabla contiene el timestamp de la ultima actualizacion de las tablas.';


--
-- TOC entry 3233 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN sys_table_ts.table_name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN sys_table_ts.table_name IS 'Nombre de la tabla de la base de datos.';


--
-- TOC entry 230 (class 1259 OID 91035)
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
-- TOC entry 231 (class 1259 OID 91042)
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
-- TOC entry 232 (class 1259 OID 91047)
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
-- TOC entry 241 (class 1259 OID 93550)
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
-- TOC entry 233 (class 1259 OID 91056)
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
-- TOC entry 260 (class 1259 OID 97650)
-- Name: view_admins; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW view_admins AS
 SELECT contacts.idcontact,
    ((contacts.last_name || ' '::text) || contacts.last_name) AS contact_name,
    admins.appointment,
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
-- TOC entry 261 (class 1259 OID 97655)
-- Name: view_accounts_contacts_admins; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW view_accounts_contacts_admins AS
 SELECT 0 AS idaccountuser,
    accounts.idcontact AS idaccount,
    view_admins.idcontact,
    view_admins.contact_name,
    view_admins.appointment,
    0 AS priority
   FROM accounts,
    view_admins
  WHERE ((view_admins.idadmin = ANY (accounts.admins)) AND (view_admins.enabled = true))
UNION
 SELECT account_contacts.idaccountuser,
    account_contacts.idaccount,
    account_contacts.idcontact,
    ((contacts.last_name || ' '::text) || contacts.first_name) AS contact_name,
    account_contacts.appointment,
    account_contacts.priority
   FROM contacts,
    account_contacts,
    accounts
  WHERE ((account_contacts.idcontact = contacts.idcontact) AND (accounts.idcontact = account_contacts.idaccount));


ALTER TABLE view_accounts_contacts_admins OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 91061)
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
-- TOC entry 242 (class 1259 OID 93554)
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
-- TOC entry 235 (class 1259 OID 91074)
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
-- TOC entry 236 (class 1259 OID 91078)
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
-- TOC entry 237 (class 1259 OID 91082)
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
-- TOC entry 262 (class 1259 OID 97886)
-- Name: view_events_jobs; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW view_events_jobs AS
 SELECT events_jobs.idevent,
    events_jobs.dateevent,
    events_jobs.status,
    fun_event_status_get_label(events_jobs.status) AS status_label,
    events_jobs.idaccount,
    events_jobs.zu,
    events_jobs.priority,
    events_jobs.ideventtype,
    events_jobs.idequipment,
    events_jobs.description,
    events_jobs.job_name,
    events_jobs.job_run_duration,
    events_jobs.last_comment,
    ((accounts.last_name || ' '::text) || accounts.first_name) AS account_name,
    accounts.account,
    eventtypes.label,
    ( SELECT string_agg(( SELECT ((contacts.last_name || ' '::text) || contacts.first_name) AS n
                   FROM contacts
                  WHERE (contacts.idcontact = account_contacts.idcontact)), ', '::text) AS string_agg
           FROM account_contacts
          WHERE ((account_contacts.idaccount = events_jobs.idaccount) AND (account_contacts.appointment = 'Técnico Responsable'::text))) AS oams_assigned
   FROM events_jobs,
    accounts,
    eventtypes
  WHERE ((events_jobs.idaccount = accounts.idcontact) AND (events_jobs.ideventtype = eventtypes.ideventtype))
  ORDER BY events_jobs.dateevent DESC, events_jobs.idevent DESC;


ALTER TABLE view_events_jobs OWNER TO postgres;

--
-- TOC entry 263 (class 1259 OID 102743)
-- Name: view_events_jobs_last; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW view_events_jobs_last AS
 SELECT ej.idevent,
    ej.dateevent,
    ej.status,
    fun_event_status_get_label(ej.status) AS status_label,
    ej.idaccount,
    ej.zu,
    ej.priority,
    ej.ideventtype,
    ej.idequipment,
    ej.description,
    ej.job_name,
    ej.job_run_duration,
    ej.last_comment,
    ((accounts.last_name || ' '::text) || accounts.first_name) AS account_name,
    accounts.account,
    eventtypes.label,
    ( SELECT string_agg(( SELECT ((contacts.last_name || ' '::text) || contacts.first_name) AS n
                   FROM contacts
                  WHERE (contacts.idcontact = account_contacts.idcontact)), ', '::text) AS string_agg
           FROM account_contacts
          WHERE ((account_contacts.idaccount = ej.idaccount) AND (account_contacts.appointment = 'Técnico Responsable'::text))) AS oams_assigned
   FROM ( SELECT i1.idevent,
            i1.ts,
            i1.loaded,
            i1.dateevent,
            i1.status,
            i1.idaccount,
            i1.priority,
            i1.ideventtype,
            i1.description,
            i1.idadmin,
            i1.last_comment,
            i1.zu,
            i1.idequipment,
            i1.job_name,
            i1.job_enabled,
            i1.job_description,
            i1.job_date_create,
            i1.job_run_duration,
            i1.job_run_status,
            i1.job_next_run
           FROM (events_jobs i1
             LEFT JOIN events_jobs i2 ON ((((i1.idequipment = i2.idequipment) AND (i1.zu = i2.zu)) AND (i1.dateevent < i2.dateevent))))
          WHERE (i2.dateevent IS NULL)) ej,
    accounts,
    eventtypes
  WHERE (((ej.idaccount = accounts.idcontact) AND (ej.ideventtype = eventtypes.ideventtype)) AND (ej.idequipment > 0));


ALTER TABLE view_events_jobs_last OWNER TO postgres;

--
-- TOC entry 259 (class 1259 OID 97599)
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
    events.idequipment,
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
-- TOC entry 238 (class 1259 OID 91092)
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
-- TOC entry 239 (class 1259 OID 91096)
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
-- TOC entry 243 (class 1259 OID 94511)
-- Name: view_table_events_father; Type: MATERIALIZED VIEW; Schema: public; Owner: postgres; Tablespace: 
--

CREATE MATERIALIZED VIEW view_table_events_father AS
 SELECT DISTINCT ON (columns.table_name) columns.table_name
   FROM information_schema.columns
  WHERE ((((columns.table_name)::text ~~ 'events%'::text) AND (NOT ((columns.table_name)::text ~ '.[0-9]'::text))) AND ((columns.table_schema)::text = 'public'::text))
  ORDER BY columns.table_name, columns.column_name, columns.data_type
  WITH NO DATA;


ALTER TABLE view_table_events_father OWNER TO postgres;

--
-- TOC entry 3234 (class 0 OID 0)
-- Dependencies: 243
-- Name: MATERIALIZED VIEW view_table_events_father; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON MATERIALIZED VIEW view_table_events_father IS 'Tablas padres de eventos';


--
-- TOC entry 2299 (class 2604 OID 93558)
-- Name: idaccountuser; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY account_contacts ALTER COLUMN idaccountuser SET DEFAULT nextval('account_users_idaccountuser_seq'::regclass);


--
-- TOC entry 2301 (class 2604 OID 93559)
-- Name: idaccountstate; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY account_states ALTER COLUMN idaccountstate SET DEFAULT nextval('account_state_idaccountstate_seq'::regclass);


--
-- TOC entry 2303 (class 2604 OID 93560)
-- Name: idaccounttype; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY account_types ALTER COLUMN idaccounttype SET DEFAULT nextval('account_types_idaccounttype_seq'::regclass);


--
-- TOC entry 2328 (class 2604 OID 93561)
-- Name: idadmin; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY admins ALTER COLUMN idadmin SET DEFAULT nextval('admins_idadmin_seq'::regclass);


--
-- TOC entry 2329 (class 2604 OID 93562)
-- Name: idcontact; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY admins ALTER COLUMN idcontact SET DEFAULT nextval('admins_idcontact_seq'::regclass);


--
-- TOC entry 2332 (class 2604 OID 93563)
-- Name: idattachment; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY attachments ALTER COLUMN idattachment SET DEFAULT nextval('attachments_idattachment_seq'::regclass);


--
-- TOC entry 2310 (class 2604 OID 93564)
-- Name: idcontact; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY contacts ALTER COLUMN idcontact SET DEFAULT nextval('contacts_idcontact_seq'::regclass);


--
-- TOC entry 2335 (class 2604 OID 93565)
-- Name: iddivision; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY divisions ALTER COLUMN iddivision SET DEFAULT nextval('division_iddivision_seq'::regclass);


--
-- TOC entry 2340 (class 2604 OID 93566)
-- Name: idemail; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY emails ALTER COLUMN idemail SET DEFAULT nextval('emails_idemail_seq'::regclass);


--
-- TOC entry 2344 (class 2604 OID 93567)
-- Name: idequipment; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY equipments ALTER COLUMN idequipment SET DEFAULT nextval('equipments_idequipment_seq'::regclass);


--
-- TOC entry 2352 (class 2604 OID 93568)
-- Name: ideventcomment; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY event_comments ALTER COLUMN ideventcomment SET DEFAULT nextval('event_comments_ideventcomment_seq'::regclass);


--
-- TOC entry 2347 (class 2604 OID 93569)
-- Name: ideventcommentattach; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY event_comments_attachments ALTER COLUMN ideventcommentattach SET DEFAULT nextval('event_attachments_ideventattach_seq'::regclass);


--
-- TOC entry 2295 (class 2604 OID 93570)
-- Name: idevent; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events ALTER COLUMN idevent SET DEFAULT nextval('events_idevent_seq'::regclass);


--
-- TOC entry 2360 (class 2604 OID 102720)
-- Name: idequipment; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_dbsizes ALTER COLUMN idequipment SET DEFAULT 0;


--
-- TOC entry 2369 (class 2604 OID 102721)
-- Name: idequipment; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_device_uptime ALTER COLUMN idequipment SET DEFAULT 0;


--
-- TOC entry 2379 (class 2604 OID 102722)
-- Name: idequipment; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_diskspace ALTER COLUMN idequipment SET DEFAULT 0;


--
-- TOC entry 2391 (class 2604 OID 102723)
-- Name: idequipment; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs ALTER COLUMN idequipment SET DEFAULT 0;


--
-- TOC entry 2400 (class 2604 OID 102724)
-- Name: idequipment; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_raid ALTER COLUMN idequipment SET DEFAULT 0;


--
-- TOC entry 2412 (class 2604 OID 93571)
-- Name: ideventtype; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY eventtypes ALTER COLUMN ideventtype SET DEFAULT nextval('eventtypes_ideventtype_seq'::regclass);


--
-- TOC entry 2582 (class 2604 OID 97553)
-- Name: ideventtype_group; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY eventtypes_groups ALTER COLUMN ideventtype_group SET DEFAULT nextval('eventtypes_groups_ideventtype_group_seq'::regclass);


--
-- TOC entry 2418 (class 2604 OID 93572)
-- Name: idlista_precios; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY farma_lista_precios_farmacias ALTER COLUMN idlista_precios SET DEFAULT nextval('farma_lista_precios_farmacias_idlista_precios_seq'::regclass);


--
-- TOC entry 2421 (class 2604 OID 93573)
-- Name: idgroup; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY groups ALTER COLUMN idgroup SET DEFAULT nextval('groups_idgrupo_seq'::regclass);


--
-- TOC entry 2425 (class 2604 OID 93574)
-- Name: ididtype; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY identification_types ALTER COLUMN ididtype SET DEFAULT nextval('identification_type_ididtype_seq'::regclass);


--
-- TOC entry 2427 (class 2604 OID 93575)
-- Name: idword; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY interface_words ALTER COLUMN idword SET DEFAULT nextval('interface_words_idwords_seq'::regclass);


--
-- TOC entry 2434 (class 2604 OID 97526)
-- Name: enabled; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY network_devices ALTER COLUMN enabled SET DEFAULT true;


--
-- TOC entry 2571 (class 2604 OID 96238)
-- Name: idnotify; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY notification_area ALTER COLUMN idnotify SET DEFAULT nextval('notification_area_idnotify_seq'::regclass);


--
-- TOC entry 2438 (class 2604 OID 93577)
-- Name: idprovider; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY phone_providers ALTER COLUMN idprovider SET DEFAULT nextval('providers_idprovider_seq'::regclass);


--
-- TOC entry 2440 (class 2604 OID 93578)
-- Name: idphonetype; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY phone_types ALTER COLUMN idphonetype SET DEFAULT nextval('phone_type_idphonetype_seq'::regclass);


--
-- TOC entry 2446 (class 2604 OID 93579)
-- Name: idphone; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY phones ALTER COLUMN idphone SET DEFAULT nextval('phones_idphone_seq'::regclass);


--
-- TOC entry 2725 (class 2606 OID 93581)
-- Name: account_users_idaccount_idcontact_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY account_users
    ADD CONSTRAINT account_users_idaccount_idcontact_key UNIQUE (idaccount, idcontact);


--
-- TOC entry 2727 (class 2606 OID 93583)
-- Name: account_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY account_users
    ADD CONSTRAINT account_users_pkey PRIMARY KEY (idaccountuser);


--
-- TOC entry 2608 (class 2606 OID 93585)
-- Name: accounts__pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY accounts
    ADD CONSTRAINT accounts__pkey PRIMARY KEY (idcontact);


--
-- TOC entry 2817 (class 2606 OID 96275)
-- Name: event_comments_2016_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY event_comments_2016
    ADD CONSTRAINT event_comments_2016_pkey PRIMARY KEY (ideventcomment);


--
-- TOC entry 2751 (class 2606 OID 95128)
-- Name: events_2016_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_2016
    ADD CONSTRAINT events_2016_pkey PRIMARY KEY (idevent);


--
-- TOC entry 2811 (class 2606 OID 96155)
-- Name: events_dbsizes_2015_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_dbsizes_2015
    ADD CONSTRAINT events_dbsizes_2015_pkey PRIMARY KEY (idevent);


--
-- TOC entry 2771 (class 2606 OID 95209)
-- Name: events_dbsizes_2016_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_dbsizes_2016
    ADD CONSTRAINT events_dbsizes_2016_pkey PRIMARY KEY (idevent);


--
-- TOC entry 2637 (class 2606 OID 91814)
-- Name: events_dbsizes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_dbsizes
    ADD CONSTRAINT events_dbsizes_pkey PRIMARY KEY (idevent);


--
-- TOC entry 2806 (class 2606 OID 96133)
-- Name: events_device_uptime_2015_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_device_uptime_2015
    ADD CONSTRAINT events_device_uptime_2015_pkey PRIMARY KEY (idevent);


--
-- TOC entry 2741 (class 2606 OID 95089)
-- Name: events_device_uptime_2016_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_device_uptime_2016
    ADD CONSTRAINT events_device_uptime_2016_pkey PRIMARY KEY (idevent);


--
-- TOC entry 2801 (class 2606 OID 96107)
-- Name: events_diskspace_2015_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_diskspace_2015
    ADD CONSTRAINT events_diskspace_2015_pkey PRIMARY KEY (idevent);


--
-- TOC entry 2731 (class 2606 OID 95049)
-- Name: events_diskspace_2016_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_diskspace_2016
    ADD CONSTRAINT events_diskspace_2016_pkey PRIMARY KEY (idevent);


--
-- TOC entry 2649 (class 2606 OID 91864)
-- Name: events_diskspace_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_diskspace
    ADD CONSTRAINT events_diskspace_pkey PRIMARY KEY (idevent);


--
-- TOC entry 2791 (class 2606 OID 96020)
-- Name: events_jobs_1990_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_1990
    ADD CONSTRAINT events_jobs_1990_pkey PRIMARY KEY (idevent);


--
-- TOC entry 2781 (class 2606 OID 95963)
-- Name: events_jobs_2015_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_2015
    ADD CONSTRAINT events_jobs_2015_pkey PRIMARY KEY (idevent);


--
-- TOC entry 2761 (class 2606 OID 95170)
-- Name: events_jobs_2016_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_2016
    ADD CONSTRAINT events_jobs_2016_pkey PRIMARY KEY (idevent);


--
-- TOC entry 2654 (class 2606 OID 91948)
-- Name: events_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs
    ADD CONSTRAINT events_jobs_pkey PRIMARY KEY (idevent);


--
-- TOC entry 2659 (class 2606 OID 91956)
-- Name: events_raid_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_raid
    ADD CONSTRAINT events_raid_pkey PRIMARY KEY (idevent);


--
-- TOC entry 2644 (class 2606 OID 91960)
-- Name: events_sqlserver_uptime_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_device_uptime
    ADD CONSTRAINT events_sqlserver_uptime_pkey PRIMARY KEY (idevent);


--
-- TOC entry 2693 (class 2606 OID 91964)
-- Name: network_devices_2_equipment_mark_serial_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY network_devices
    ADD CONSTRAINT network_devices_2_equipment_mark_serial_number_key UNIQUE (equipment, mark, serial_number);


--
-- TOC entry 2695 (class 2606 OID 91966)
-- Name: network_devices_2_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY network_devices
    ADD CONSTRAINT network_devices_2_pkey PRIMARY KEY (idequipment);


--
-- TOC entry 2596 (class 2606 OID 93603)
-- Name: pk_account_state_idaccountstate; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY account_states
    ADD CONSTRAINT pk_account_state_idaccountstate PRIMARY KEY (idaccountstate);


--
-- TOC entry 2600 (class 2606 OID 93605)
-- Name: pk_account_types_idaccounttype; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY account_types
    ADD CONSTRAINT pk_account_types_idaccounttype PRIMARY KEY (idaccounttype);


--
-- TOC entry 2592 (class 2606 OID 93607)
-- Name: pk_account_users_idaccounuser; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY account_contacts
    ADD CONSTRAINT pk_account_users_idaccounuser PRIMARY KEY (idaccountuser);


--
-- TOC entry 2613 (class 2606 OID 93609)
-- Name: pk_admin_idadmin; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY admins
    ADD CONSTRAINT pk_admin_idadmin PRIMARY KEY (idadmin);


--
-- TOC entry 2615 (class 2606 OID 91976)
-- Name: pk_attachments_idattachment; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY attachments
    ADD CONSTRAINT pk_attachments_idattachment PRIMARY KEY (idattachment);


--
-- TOC entry 2604 (class 2606 OID 93611)
-- Name: pk_contacts_idcontact; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY contacts
    ADD CONSTRAINT pk_contacts_idcontact PRIMARY KEY (idcontact);


--
-- TOC entry 2617 (class 2606 OID 93613)
-- Name: pk_division_iddivision; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY divisions
    ADD CONSTRAINT pk_division_iddivision PRIMARY KEY (iddivision);


--
-- TOC entry 2619 (class 2606 OID 93615)
-- Name: pk_email_idemail; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY emails
    ADD CONSTRAINT pk_email_idemail PRIMARY KEY (idemail);


--
-- TOC entry 2624 (class 2606 OID 93617)
-- Name: pk_equipments_idequipment; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY equipments
    ADD CONSTRAINT pk_equipments_idequipment PRIMARY KEY (idequipment);


--
-- TOC entry 2630 (class 2606 OID 91986)
-- Name: pk_event_attachments_ideventattach; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY event_comments_attachments
    ADD CONSTRAINT pk_event_attachments_ideventattach PRIMARY KEY (ideventcommentattach);


--
-- TOC entry 2635 (class 2606 OID 91988)
-- Name: pk_event_comments_ideventcomment; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY event_comments
    ADD CONSTRAINT pk_event_comments_ideventcomment PRIMARY KEY (ideventcomment);


--
-- TOC entry 2589 (class 2606 OID 91990)
-- Name: pk_events_idevent; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events
    ADD CONSTRAINT pk_events_idevent PRIMARY KEY (idevent);


--
-- TOC entry 2819 (class 2606 OID 97558)
-- Name: pk_eventtypes_groups_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY eventtypes_groups
    ADD CONSTRAINT pk_eventtypes_groups_id PRIMARY KEY (ideventtype_group);


--
-- TOC entry 2665 (class 2606 OID 91992)
-- Name: pk_eventtypes_ideventtype; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY eventtypes
    ADD CONSTRAINT pk_eventtypes_ideventtype PRIMARY KEY (ideventtype);


--
-- TOC entry 2674 (class 2606 OID 91994)
-- Name: pk_farma_lista_precios; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY farma_lista_precios_farmacias
    ADD CONSTRAINT pk_farma_lista_precios PRIMARY KEY (idlista_precios);


--
-- TOC entry 2678 (class 2606 OID 91996)
-- Name: pk_group_idgroup; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY groups
    ADD CONSTRAINT pk_group_idgroup PRIMARY KEY (idgroup);


--
-- TOC entry 2682 (class 2606 OID 91998)
-- Name: pk_guitc; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY gui_tables_columns
    ADD CONSTRAINT pk_guitc PRIMARY KEY (table_name, column_name);


--
-- TOC entry 2688 (class 2606 OID 92000)
-- Name: pk_id_interface_words; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY interface_words
    ADD CONSTRAINT pk_id_interface_words PRIMARY KEY (idword);


--
-- TOC entry 2684 (class 2606 OID 92002)
-- Name: pk_identification_type_ididtype; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY identification_types
    ADD CONSTRAINT pk_identification_type_ididtype PRIMARY KEY (ididtype);


--
-- TOC entry 2814 (class 2606 OID 96248)
-- Name: pk_notification_area_idnotify; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY notification_area
    ADD CONSTRAINT pk_notification_area_idnotify PRIMARY KEY (idnotify);


--
-- TOC entry 2701 (class 2606 OID 92006)
-- Name: pk_otc; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY oams_table_columns
    ADD CONSTRAINT pk_otc PRIMARY KEY (table_name, column_name);


--
-- TOC entry 2707 (class 2606 OID 92008)
-- Name: pk_phone_type_idphonetype; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY phone_types
    ADD CONSTRAINT pk_phone_type_idphonetype PRIMARY KEY (idphonetype);


--
-- TOC entry 2711 (class 2606 OID 92010)
-- Name: pk_phones_idphone; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY phones
    ADD CONSTRAINT pk_phones_idphone PRIMARY KEY (idphone);


--
-- TOC entry 2703 (class 2606 OID 92012)
-- Name: pk_providers_idprovider; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY phone_providers
    ADD CONSTRAINT pk_providers_idprovider PRIMARY KEY (idprovider);


--
-- TOC entry 2721 (class 2606 OID 92014)
-- Name: pk_tables_changed_name; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY sys_table_ts
    ADD CONSTRAINT pk_tables_changed_name PRIMARY KEY (table_name);


--
-- TOC entry 2723 (class 2606 OID 92016)
-- Name: pk_udctc; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY udc_tables_columns
    ADD CONSTRAINT pk_udctc PRIMARY KEY (table_name, column_name);


--
-- TOC entry 2715 (class 2606 OID 92018)
-- Name: providers_admin_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY providers
    ADD CONSTRAINT providers_admin_username_key UNIQUE (admin_username);


--
-- TOC entry 2717 (class 2606 OID 92020)
-- Name: providers_first_name_last_name_identification_ididtype_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY providers
    ADD CONSTRAINT providers_first_name_last_name_identification_ididtype_key UNIQUE (first_name, last_name, identification, ididtype);


--
-- TOC entry 2719 (class 2606 OID 92022)
-- Name: providers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY providers
    ADD CONSTRAINT providers_pkey PRIMARY KEY (idcontact);


--
-- TOC entry 2594 (class 2606 OID 93619)
-- Name: uniq_account_contacts_idcontact; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY account_contacts
    ADD CONSTRAINT uniq_account_contacts_idcontact UNIQUE (idaccount, idcontact);


--
-- TOC entry 2598 (class 2606 OID 93621)
-- Name: uniq_account_states_state; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY account_states
    ADD CONSTRAINT uniq_account_states_state UNIQUE (state);


--
-- TOC entry 2602 (class 2606 OID 93623)
-- Name: uniq_account_type_type; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY account_types
    ADD CONSTRAINT uniq_account_type_type UNIQUE (type);


--
-- TOC entry 2611 (class 2606 OID 93625)
-- Name: uniq_accounts_div_account_type_enabled; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY accounts
    ADD CONSTRAINT uniq_accounts_div_account_type_enabled UNIQUE (enabled, iddivision, account);


--
-- TOC entry 2606 (class 2606 OID 93627)
-- Name: uniq_contacts_fname_lname_identification_ididtype; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY contacts
    ADD CONSTRAINT uniq_contacts_fname_lname_identification_ididtype UNIQUE (first_name, last_name, identification, ididtype);


--
-- TOC entry 2621 (class 2606 OID 93629)
-- Name: uniq_email_idcontact_email; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY emails
    ADD CONSTRAINT uniq_email_idcontact_email UNIQUE (idcontact, email);


--
-- TOC entry 2626 (class 2606 OID 97522)
-- Name: uniq_equipment_identification; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY equipments
    ADD CONSTRAINT uniq_equipment_identification UNIQUE (identification);


--
-- TOC entry 2628 (class 2606 OID 95982)
-- Name: uniq_equipments_eq_codref_serial; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY equipments
    ADD CONSTRAINT uniq_equipments_eq_codref_serial UNIQUE (equipment, serial_number, code_ref);


--
-- TOC entry 2632 (class 2606 OID 92044)
-- Name: uniq_event_comments_attach; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY event_comments_attachments
    ADD CONSTRAINT uniq_event_comments_attach UNIQUE (idevent, idattachment);


--
-- TOC entry 2757 (class 2606 OID 95149)
-- Name: uniq_events_2016_de_ide_idevt_zu; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_2016
    ADD CONSTRAINT uniq_events_2016_de_ide_idevt_zu UNIQUE (dateevent, idequipment, zu, ideventtype);


--
-- TOC entry 2777 (class 2606 OID 95230)
-- Name: uniq_events_dbsizes_2016_de_ide_idevt_zu; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_dbsizes_2016
    ADD CONSTRAINT uniq_events_dbsizes_2016_de_ide_idevt_zu UNIQUE (dateevent, idequipment, zu, ideventtype);


--
-- TOC entry 2642 (class 2606 OID 94980)
-- Name: uniq_events_dbsizes_dateevent_ideq_ideventtype; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_dbsizes
    ADD CONSTRAINT uniq_events_dbsizes_dateevent_ideq_ideventtype UNIQUE (dateevent, idequipment, zu, ideventtype);


--
-- TOC entry 2747 (class 2606 OID 95110)
-- Name: uniq_events_device_uptime_2016_de_ide_idevt_zu; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_device_uptime_2016
    ADD CONSTRAINT uniq_events_device_uptime_2016_de_ide_idevt_zu UNIQUE (dateevent, idequipment, zu, ideventtype);


--
-- TOC entry 2737 (class 2606 OID 95070)
-- Name: uniq_events_diskspace_2016_de_ide_idevt_zu; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_diskspace_2016
    ADD CONSTRAINT uniq_events_diskspace_2016_de_ide_idevt_zu UNIQUE (dateevent, idequipment, zu, ideventtype);


--
-- TOC entry 2797 (class 2606 OID 96041)
-- Name: uniq_events_jobs_1990_de_ide_idevt_zu; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_1990
    ADD CONSTRAINT uniq_events_jobs_1990_de_ide_idevt_zu UNIQUE (dateevent, idequipment, zu, ideventtype);


--
-- TOC entry 2787 (class 2606 OID 96065)
-- Name: uniq_events_jobs_2015_de_ide_idevt_zu; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_2015
    ADD CONSTRAINT uniq_events_jobs_2015_de_ide_idevt_zu UNIQUE (dateevent, idequipment, zu, ideventtype);


--
-- TOC entry 2767 (class 2606 OID 95191)
-- Name: uniq_events_jobs_2016_de_ide_idevt_zu; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs_2016
    ADD CONSTRAINT uniq_events_jobs_2016_de_ide_idevt_zu UNIQUE (dateevent, idequipment, zu, ideventtype);


--
-- TOC entry 2667 (class 2606 OID 92062)
-- Name: uniq_eventtypes_code; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY eventtypes
    ADD CONSTRAINT uniq_eventtypes_code UNIQUE (code);


--
-- TOC entry 2669 (class 2606 OID 92064)
-- Name: uniq_eventtypes_label; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY eventtypes
    ADD CONSTRAINT uniq_eventtypes_label UNIQUE (label);


--
-- TOC entry 2671 (class 2606 OID 92066)
-- Name: uniq_eventtypes_name; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY eventtypes
    ADD CONSTRAINT uniq_eventtypes_name UNIQUE (name);


--
-- TOC entry 2676 (class 2606 OID 92068)
-- Name: uniq_farma_lista_precios_idaccount; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY farma_lista_precios_farmacias
    ADD CONSTRAINT uniq_farma_lista_precios_idaccount UNIQUE (idaccount);


--
-- TOC entry 2680 (class 2606 OID 92070)
-- Name: uniq_groups_iddivision; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY groups
    ADD CONSTRAINT uniq_groups_iddivision UNIQUE (name, iddivision);


--
-- TOC entry 2713 (class 2606 OID 92072)
-- Name: uniq_idcontact_phone_ext; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY phones
    ADD CONSTRAINT uniq_idcontact_phone_ext UNIQUE (idcontact, number, note);


--
-- TOC entry 2686 (class 2606 OID 92074)
-- Name: uniq_identification_types_name; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY identification_types
    ADD CONSTRAINT uniq_identification_types_name UNIQUE (name);


--
-- TOC entry 2690 (class 2606 OID 92076)
-- Name: uniq_interface_words_word; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY interface_words
    ADD CONSTRAINT uniq_interface_words_word UNIQUE (word);


--
-- TOC entry 2697 (class 2606 OID 97520)
-- Name: uniq_netdev_mac; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY network_devices
    ADD CONSTRAINT uniq_netdev_mac UNIQUE (mac);


--
-- TOC entry 2699 (class 2606 OID 95984)
-- Name: uniq_network_devices_eq_codref_serial; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY network_devices
    ADD CONSTRAINT uniq_network_devices_eq_codref_serial UNIQUE (equipment, serial_number, code_ref);


--
-- TOC entry 2709 (class 2606 OID 92078)
-- Name: uniq_phone_types_type; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY phone_types
    ADD CONSTRAINT uniq_phone_types_type UNIQUE (type);


--
-- TOC entry 2705 (class 2606 OID 92080)
-- Name: uniq_providers_provider; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY phone_providers
    ADD CONSTRAINT uniq_providers_provider UNIQUE (provider);


--
-- TOC entry 2815 (class 1259 OID 96276)
-- Name: event_comments_2016_idevent_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX event_comments_2016_idevent_idx ON event_comments_2016 USING btree (idevent);


--
-- TOC entry 2748 (class 1259 OID 95131)
-- Name: events_2016_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_2016_idaccount_idx ON events_2016 USING btree (idaccount);


--
-- TOC entry 2749 (class 1259 OID 95132)
-- Name: events_2016_idequipment_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_2016_idequipment_idx ON events_2016 USING btree (idequipment);


--
-- TOC entry 2752 (class 1259 OID 95133)
-- Name: events_2016_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_2016_status_idx ON events_2016 USING btree (status) WHERE (status = 0);


--
-- TOC entry 2808 (class 1259 OID 96156)
-- Name: events_dbsizes_2015_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_dbsizes_2015_idaccount_idx ON events_dbsizes_2015 USING btree (idaccount);


--
-- TOC entry 2809 (class 1259 OID 96157)
-- Name: events_dbsizes_2015_idequipment_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_dbsizes_2015_idequipment_idx ON events_dbsizes_2015 USING btree (idequipment);


--
-- TOC entry 2812 (class 1259 OID 96158)
-- Name: events_dbsizes_2015_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_dbsizes_2015_status_idx ON events_dbsizes_2015 USING btree (status) WHERE (status = 0);


--
-- TOC entry 2768 (class 1259 OID 95210)
-- Name: events_dbsizes_2016_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_dbsizes_2016_idaccount_idx ON events_dbsizes_2016 USING btree (idaccount);


--
-- TOC entry 2769 (class 1259 OID 95211)
-- Name: events_dbsizes_2016_idequipment_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_dbsizes_2016_idequipment_idx ON events_dbsizes_2016 USING btree (idequipment);


--
-- TOC entry 2772 (class 1259 OID 95212)
-- Name: events_dbsizes_2016_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_dbsizes_2016_status_idx ON events_dbsizes_2016 USING btree (status) WHERE (status = 0);


--
-- TOC entry 2803 (class 1259 OID 96136)
-- Name: events_device_uptime_2015_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_device_uptime_2015_idaccount_idx ON events_device_uptime_2015 USING btree (idaccount);


--
-- TOC entry 2804 (class 1259 OID 96137)
-- Name: events_device_uptime_2015_idequipment_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_device_uptime_2015_idequipment_idx ON events_device_uptime_2015 USING btree (idequipment);


--
-- TOC entry 2807 (class 1259 OID 96138)
-- Name: events_device_uptime_2015_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_device_uptime_2015_status_idx ON events_device_uptime_2015 USING btree (status) WHERE (status = 0);


--
-- TOC entry 2738 (class 1259 OID 95092)
-- Name: events_device_uptime_2016_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_device_uptime_2016_idaccount_idx ON events_device_uptime_2016 USING btree (idaccount);


--
-- TOC entry 2739 (class 1259 OID 95093)
-- Name: events_device_uptime_2016_idequipment_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_device_uptime_2016_idequipment_idx ON events_device_uptime_2016 USING btree (idequipment);


--
-- TOC entry 2742 (class 1259 OID 95094)
-- Name: events_device_uptime_2016_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_device_uptime_2016_status_idx ON events_device_uptime_2016 USING btree (status) WHERE (status = 0);


--
-- TOC entry 2798 (class 1259 OID 96108)
-- Name: events_diskspace_2015_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_diskspace_2015_idaccount_idx ON events_diskspace_2015 USING btree (idaccount);


--
-- TOC entry 2799 (class 1259 OID 96109)
-- Name: events_diskspace_2015_idequipment_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_diskspace_2015_idequipment_idx ON events_diskspace_2015 USING btree (idequipment);


--
-- TOC entry 2802 (class 1259 OID 96110)
-- Name: events_diskspace_2015_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_diskspace_2015_status_idx ON events_diskspace_2015 USING btree (status) WHERE (status = 0);


--
-- TOC entry 2728 (class 1259 OID 95050)
-- Name: events_diskspace_2016_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_diskspace_2016_idaccount_idx ON events_diskspace_2016 USING btree (idaccount);


--
-- TOC entry 2729 (class 1259 OID 95051)
-- Name: events_diskspace_2016_idequipment_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_diskspace_2016_idequipment_idx ON events_diskspace_2016 USING btree (idequipment);


--
-- TOC entry 2732 (class 1259 OID 95052)
-- Name: events_diskspace_2016_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_diskspace_2016_status_idx ON events_diskspace_2016 USING btree (status) WHERE (status = 0);


--
-- TOC entry 2788 (class 1259 OID 96021)
-- Name: events_jobs_1990_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_1990_idaccount_idx ON events_jobs_1990 USING btree (idaccount);


--
-- TOC entry 2789 (class 1259 OID 96022)
-- Name: events_jobs_1990_idequipment_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_1990_idequipment_idx ON events_jobs_1990 USING btree (idequipment);


--
-- TOC entry 2792 (class 1259 OID 96023)
-- Name: events_jobs_1990_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_1990_status_idx ON events_jobs_1990 USING btree (status) WHERE (status = 0);


--
-- TOC entry 2778 (class 1259 OID 95964)
-- Name: events_jobs_2015_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_2015_idaccount_idx ON events_jobs_2015 USING btree (idaccount);


--
-- TOC entry 2779 (class 1259 OID 95965)
-- Name: events_jobs_2015_idequipment_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_2015_idequipment_idx ON events_jobs_2015 USING btree (idequipment);


--
-- TOC entry 2782 (class 1259 OID 95966)
-- Name: events_jobs_2015_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_2015_status_idx ON events_jobs_2015 USING btree (status) WHERE (status = 0);


--
-- TOC entry 2758 (class 1259 OID 95171)
-- Name: events_jobs_2016_idaccount_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_2016_idaccount_idx ON events_jobs_2016 USING btree (idaccount);


--
-- TOC entry 2759 (class 1259 OID 95172)
-- Name: events_jobs_2016_idequipment_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_2016_idequipment_idx ON events_jobs_2016 USING btree (idequipment);


--
-- TOC entry 2762 (class 1259 OID 95173)
-- Name: events_jobs_2016_status_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_jobs_2016_status_idx ON events_jobs_2016 USING btree (status) WHERE (status = 0);


--
-- TOC entry 2590 (class 1259 OID 93756)
-- Name: index_account_contacts_appointment; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_account_contacts_appointment ON account_contacts USING btree (appointment) WHERE (appointment = 'oams_assigned'::text);


--
-- TOC entry 2609 (class 1259 OID 93757)
-- Name: index_accounts_account; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_accounts_account ON accounts USING btree (account);


--
-- TOC entry 2633 (class 1259 OID 93758)
-- Name: index_ec_idevent; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_ec_idevent ON event_comments USING btree (idevent);


--
-- TOC entry 2622 (class 1259 OID 93771)
-- Name: index_equipment_eq; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_equipment_eq ON equipments USING btree (equipment);


--
-- TOC entry 2753 (class 1259 OID 95150)
-- Name: index_events_2016_idaccount; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_2016_idaccount ON events_2016 USING btree (idaccount);


--
-- TOC entry 2754 (class 1259 OID 95151)
-- Name: index_events_2016_idequipment; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_2016_idequipment ON events_2016 USING btree (idequipment);


--
-- TOC entry 2755 (class 1259 OID 95152)
-- Name: index_events_2016_status; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_2016_status ON events_2016 USING btree (status) WHERE (status = 0);


--
-- TOC entry 2773 (class 1259 OID 95231)
-- Name: index_events_dbsizes_2016_idaccount; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_dbsizes_2016_idaccount ON events_dbsizes_2016 USING btree (idaccount);


--
-- TOC entry 2774 (class 1259 OID 95232)
-- Name: index_events_dbsizes_2016_idequipment; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_dbsizes_2016_idequipment ON events_dbsizes_2016 USING btree (idequipment);


--
-- TOC entry 2775 (class 1259 OID 95233)
-- Name: index_events_dbsizes_2016_status; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_dbsizes_2016_status ON events_dbsizes_2016 USING btree (status) WHERE (status = 0);


--
-- TOC entry 2638 (class 1259 OID 94976)
-- Name: index_events_dbsizes_idaccount; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_dbsizes_idaccount ON events_dbsizes USING btree (idaccount);


--
-- TOC entry 2639 (class 1259 OID 94977)
-- Name: index_events_dbsizes_idequipment; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_dbsizes_idequipment ON events_dbsizes USING btree (idequipment);


--
-- TOC entry 2640 (class 1259 OID 94978)
-- Name: index_events_dbsizes_status; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_dbsizes_status ON events_dbsizes USING btree (status) WHERE (status = 0);


--
-- TOC entry 2743 (class 1259 OID 95111)
-- Name: index_events_device_uptime_2016_idaccount; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_device_uptime_2016_idaccount ON events_device_uptime_2016 USING btree (idaccount);


--
-- TOC entry 2744 (class 1259 OID 95112)
-- Name: index_events_device_uptime_2016_idequipment; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_device_uptime_2016_idequipment ON events_device_uptime_2016 USING btree (idequipment);


--
-- TOC entry 2745 (class 1259 OID 95113)
-- Name: index_events_device_uptime_2016_status; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_device_uptime_2016_status ON events_device_uptime_2016 USING btree (status) WHERE (status = 0);


--
-- TOC entry 2645 (class 1259 OID 94983)
-- Name: index_events_device_uptime_idaccount; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_device_uptime_idaccount ON events_device_uptime USING btree (idaccount);


--
-- TOC entry 2646 (class 1259 OID 94984)
-- Name: index_events_device_uptime_idequipment; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_device_uptime_idequipment ON events_device_uptime USING btree (idequipment);


--
-- TOC entry 2647 (class 1259 OID 94985)
-- Name: index_events_device_uptime_status; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_device_uptime_status ON events_device_uptime USING btree (status) WHERE (status = 0);


--
-- TOC entry 2733 (class 1259 OID 95071)
-- Name: index_events_diskspace_2016_idaccount; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_diskspace_2016_idaccount ON events_diskspace_2016 USING btree (idaccount);


--
-- TOC entry 2734 (class 1259 OID 95072)
-- Name: index_events_diskspace_2016_idequipment; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_diskspace_2016_idequipment ON events_diskspace_2016 USING btree (idequipment);


--
-- TOC entry 2735 (class 1259 OID 95073)
-- Name: index_events_diskspace_2016_status; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_diskspace_2016_status ON events_diskspace_2016 USING btree (status) WHERE (status = 0);


--
-- TOC entry 2650 (class 1259 OID 94996)
-- Name: index_events_diskspace_idaccount; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_diskspace_idaccount ON events_diskspace USING btree (idaccount);


--
-- TOC entry 2651 (class 1259 OID 94997)
-- Name: index_events_diskspace_idequipment; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_diskspace_idequipment ON events_diskspace USING btree (idequipment);


--
-- TOC entry 2652 (class 1259 OID 94998)
-- Name: index_events_diskspace_status; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_diskspace_status ON events_diskspace USING btree (status) WHERE (status = 0);


--
-- TOC entry 2585 (class 1259 OID 93789)
-- Name: index_events_idaccount; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_idaccount ON events USING btree (idaccount);


--
-- TOC entry 2586 (class 1259 OID 93790)
-- Name: index_events_idequipment; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_idequipment ON events USING btree (idequipment);


--
-- TOC entry 2793 (class 1259 OID 96042)
-- Name: index_events_jobs_1990_idaccount; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_jobs_1990_idaccount ON events_jobs_1990 USING btree (idaccount);


--
-- TOC entry 2794 (class 1259 OID 96043)
-- Name: index_events_jobs_1990_idequipment; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_jobs_1990_idequipment ON events_jobs_1990 USING btree (idequipment);


--
-- TOC entry 2795 (class 1259 OID 96044)
-- Name: index_events_jobs_1990_status; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_jobs_1990_status ON events_jobs_1990 USING btree (status) WHERE (status = 0);


--
-- TOC entry 2783 (class 1259 OID 96066)
-- Name: index_events_jobs_2015_idaccount; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_jobs_2015_idaccount ON events_jobs_2015 USING btree (idaccount);


--
-- TOC entry 2784 (class 1259 OID 96067)
-- Name: index_events_jobs_2015_idequipment; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_jobs_2015_idequipment ON events_jobs_2015 USING btree (idequipment);


--
-- TOC entry 2785 (class 1259 OID 96068)
-- Name: index_events_jobs_2015_status; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_jobs_2015_status ON events_jobs_2015 USING btree (status) WHERE (status = 0);


--
-- TOC entry 2763 (class 1259 OID 95192)
-- Name: index_events_jobs_2016_idaccount; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_jobs_2016_idaccount ON events_jobs_2016 USING btree (idaccount);


--
-- TOC entry 2764 (class 1259 OID 95193)
-- Name: index_events_jobs_2016_idequipment; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_jobs_2016_idequipment ON events_jobs_2016 USING btree (idequipment);


--
-- TOC entry 2765 (class 1259 OID 95194)
-- Name: index_events_jobs_2016_status; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_jobs_2016_status ON events_jobs_2016 USING btree (status) WHERE (status = 0);


--
-- TOC entry 2655 (class 1259 OID 95011)
-- Name: index_events_jobs_idaccount; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_jobs_idaccount ON events_jobs USING btree (idaccount);


--
-- TOC entry 2656 (class 1259 OID 95012)
-- Name: index_events_jobs_idequipment; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_jobs_idequipment ON events_jobs USING btree (idequipment);


--
-- TOC entry 2657 (class 1259 OID 95013)
-- Name: index_events_jobs_status; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_jobs_status ON events_jobs USING btree (status) WHERE (status = 0);


--
-- TOC entry 2660 (class 1259 OID 95026)
-- Name: index_events_raid_idaccount; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_raid_idaccount ON events_raid USING btree (idaccount);


--
-- TOC entry 2661 (class 1259 OID 95027)
-- Name: index_events_raid_idequipment; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_raid_idequipment ON events_raid USING btree (idequipment);


--
-- TOC entry 2662 (class 1259 OID 95028)
-- Name: index_events_raid_status; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_raid_status ON events_raid USING btree (status) WHERE (status = 0);


--
-- TOC entry 2587 (class 1259 OID 93805)
-- Name: index_events_status; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_status ON events USING btree (status) WHERE (status = 0);


--
-- TOC entry 2663 (class 1259 OID 93806)
-- Name: index_eventtypes; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_eventtypes ON eventtypes USING btree (code);


--
-- TOC entry 2672 (class 1259 OID 93807)
-- Name: index_farma_lista_precios_idaccount; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_farma_lista_precios_idaccount ON farma_lista_precios_farmacias USING btree (idaccount);


--
-- TOC entry 2691 (class 1259 OID 93808)
-- Name: index_network_devices_eq; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_network_devices_eq ON network_devices USING btree (equipment);


--
-- TOC entry 2874 (class 2620 OID 97639)
-- Name: 0_insert_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "0_insert_update" BEFORE INSERT OR UPDATE ON accounts FOR EACH ROW EXECUTE PROCEDURE accounts_insert_update();


--
-- TOC entry 2909 (class 2620 OID 97641)
-- Name: 1_insert_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "1_insert_update" BEFORE INSERT OR UPDATE ON eventtypes FOR EACH ROW EXECUTE PROCEDURE eventtypes_before_insert_update();


--
-- TOC entry 2868 (class 2620 OID 93814)
-- Name: 1_update_ts; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "1_update_ts" BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3235 (class 0 OID 0)
-- Dependencies: 2868
-- Name: TRIGGER "1_update_ts" ON contacts; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER "1_update_ts" ON contacts IS 'Actualiza el ts cuando un registro es actualizado';


--
-- TOC entry 2871 (class 2620 OID 93815)
-- Name: 1_update_ts; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "1_update_ts" BEFORE UPDATE ON accounts FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3236 (class 0 OID 0)
-- Dependencies: 2871
-- Name: TRIGGER "1_update_ts" ON accounts; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER "1_update_ts" ON accounts IS 'Actualiza el ts cuando un registro es actualizado';


--
-- TOC entry 2875 (class 2620 OID 93816)
-- Name: 1_update_ts; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "1_update_ts" BEFORE UPDATE ON admins FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3237 (class 0 OID 0)
-- Dependencies: 2875
-- Name: TRIGGER "1_update_ts" ON admins; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER "1_update_ts" ON admins IS 'Actualiza el ts cuando un registro es actualizado';


--
-- TOC entry 2916 (class 2620 OID 93817)
-- Name: 1on_insert_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "1on_insert_update" BEFORE INSERT OR UPDATE ON network_devices FOR EACH ROW EXECUTE PROCEDURE equipment_insert_update();


--
-- TOC entry 2876 (class 2620 OID 93818)
-- Name: 2_on_insert_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "2_on_insert_update" BEFORE INSERT OR UPDATE ON admins FOR EACH ROW EXECUTE PROCEDURE admins_insert_update();


--
-- TOC entry 2869 (class 2620 OID 93819)
-- Name: 2_on_insert_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "2_on_insert_update" BEFORE INSERT OR UPDATE OF identification ON contacts FOR EACH ROW EXECUTE PROCEDURE contacts_insert_update();


--
-- TOC entry 2872 (class 2620 OID 93820)
-- Name: 2_on_insert_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "2_on_insert_update" BEFORE INSERT OR UPDATE OF identification ON accounts FOR EACH ROW EXECUTE PROCEDURE contacts_insert_update();


--
-- TOC entry 2952 (class 2620 OID 96255)
-- Name: before_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER before_insert BEFORE INSERT ON notification_area FOR EACH ROW EXECUTE PROCEDURE notifications_before_insert();


--
-- TOC entry 2888 (class 2620 OID 93823)
-- Name: on_before_insert_comment; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_before_insert_comment BEFORE INSERT ON event_comments FOR EACH ROW EXECUTE PROCEDURE event_comments_before_insert_redirect_partition();


--
-- TOC entry 2858 (class 2620 OID 93824)
-- Name: on_before_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_before_insert_event BEFORE INSERT ON events FOR EACH ROW EXECUTE PROCEDURE events_before_insert_redirect_partition();


--
-- TOC entry 3238 (class 0 OID 0)
-- Dependencies: 2858
-- Name: TRIGGER on_before_insert_event ON events; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER on_before_insert_event ON events IS 'Se dispara cuando se trata de insertar un evento y se redirige a la tabla que le corresponde segun la particion.';


--
-- TOC entry 2899 (class 2620 OID 93825)
-- Name: on_before_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_before_insert_event BEFORE INSERT ON events_jobs FOR EACH ROW EXECUTE PROCEDURE events_before_insert_redirect_partition();


--
-- TOC entry 2890 (class 2620 OID 93826)
-- Name: on_before_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_before_insert_event BEFORE INSERT ON events_dbsizes FOR EACH ROW EXECUTE PROCEDURE events_before_insert_redirect_partition();


--
-- TOC entry 3239 (class 0 OID 0)
-- Dependencies: 2890
-- Name: TRIGGER on_before_insert_event ON events_dbsizes; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER on_before_insert_event ON events_dbsizes IS 'Se dispara cuando se trata de insertar un evento y se redirige a la tabla que le corresponde segun la particion.';


--
-- TOC entry 2897 (class 2620 OID 93827)
-- Name: on_before_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_before_insert_event BEFORE INSERT ON events_diskspace FOR EACH ROW EXECUTE PROCEDURE events_before_insert_redirect_partition();


--
-- TOC entry 2893 (class 2620 OID 93828)
-- Name: on_before_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_before_insert_event BEFORE INSERT ON events_device_uptime FOR EACH ROW EXECUTE PROCEDURE events_before_insert_redirect_partition();


--
-- TOC entry 3240 (class 0 OID 0)
-- Dependencies: 2893
-- Name: TRIGGER on_before_insert_event ON events_device_uptime; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER on_before_insert_event ON events_device_uptime IS 'Se dispara cuando se trata de insertar un evento y se redirige a la tabla que le corresponde segun la particion.';


--
-- TOC entry 2903 (class 2620 OID 93829)
-- Name: on_before_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_before_insert_event BEFORE INSERT ON events_raid FOR EACH ROW EXECUTE PROCEDURE events_before_insert_redirect_partition();


--
-- TOC entry 2864 (class 2620 OID 93830)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON account_states FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 3241 (class 0 OID 0)
-- Dependencies: 2864
-- Name: TRIGGER on_changed_table ON account_states; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER on_changed_table ON account_states IS 'Actualiza la tabla sys_table_ts cuando un cambio en la tabla actual es realizado. ';


--
-- TOC entry 2866 (class 2620 OID 93831)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON account_types FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2878 (class 2620 OID 93832)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON attachments FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2870 (class 2620 OID 93833)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON contacts FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2881 (class 2620 OID 93834)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON emails FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2889 (class 2620 OID 93835)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON event_comments FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2859 (class 2620 OID 93836)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events FOR EACH ROW EXECUTE PROCEDURE on_changed_table();

ALTER TABLE events DISABLE TRIGGER on_changed_table;


--
-- TOC entry 2907 (class 2620 OID 93837)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON eventtypes FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2912 (class 2620 OID 93838)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON groups FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2914 (class 2620 OID 93839)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON identification_types FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2919 (class 2620 OID 93840)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON phone_types FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2921 (class 2620 OID 93841)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON phones FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2917 (class 2620 OID 93842)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON phone_providers FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2883 (class 2620 OID 93844)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON equipments FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2862 (class 2620 OID 93845)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON account_contacts FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2886 (class 2620 OID 93846)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON event_comments_attachments FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2873 (class 2620 OID 93847)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON accounts FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2902 (class 2620 OID 93848)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_jobs FOR EACH ROW EXECUTE PROCEDURE on_changed_table();

ALTER TABLE events_jobs DISABLE TRIGGER on_changed_table;


--
-- TOC entry 2891 (class 2620 OID 93851)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_dbsizes FOR EACH ROW EXECUTE PROCEDURE on_changed_table();

ALTER TABLE events_dbsizes DISABLE TRIGGER on_changed_table;


--
-- TOC entry 2896 (class 2620 OID 93852)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_diskspace FOR EACH ROW EXECUTE PROCEDURE on_changed_table();

ALTER TABLE events_diskspace DISABLE TRIGGER on_changed_table;


--
-- TOC entry 2894 (class 2620 OID 93853)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_device_uptime FOR EACH ROW EXECUTE PROCEDURE on_changed_table();

ALTER TABLE events_device_uptime DISABLE TRIGGER on_changed_table;


--
-- TOC entry 2904 (class 2620 OID 93865)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_raid FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2910 (class 2620 OID 93872)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON farma_lista_precios_farmacias FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2880 (class 2620 OID 93880)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON divisions FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2923 (class 2620 OID 93888)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON account_users FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2877 (class 2620 OID 93894)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON admins FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2927 (class 2620 OID 95055)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_diskspace_2016 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2929 (class 2620 OID 95095)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_device_uptime_2016 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2933 (class 2620 OID 95134)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_2016 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2935 (class 2620 OID 95176)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_jobs_2016 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2939 (class 2620 OID 95215)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_dbsizes_2016 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2942 (class 2620 OID 95969)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_jobs_2015 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2945 (class 2620 OID 96026)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_jobs_1990 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2947 (class 2620 OID 96113)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_diskspace_2015 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2948 (class 2620 OID 96139)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_device_uptime_2015 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2951 (class 2620 OID 96161)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_dbsizes_2015 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2953 (class 2620 OID 96256)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON notification_area FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2955 (class 2620 OID 96277)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON event_comments_2016 FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2957 (class 2620 OID 96279)
-- Name: on_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert AFTER INSERT ON event_comments_2016 FOR EACH ROW EXECUTE PROCEDURE event_comments_after_insert();


--
-- TOC entry 2860 (class 2620 OID 93907)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events FOR EACH ROW EXECUTE PROCEDURE events_on_insert();

ALTER TABLE events DISABLE TRIGGER on_insert_event;


--
-- TOC entry 2901 (class 2620 OID 93908)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_jobs FOR EACH ROW EXECUTE PROCEDURE events_on_insert();

ALTER TABLE events_jobs DISABLE TRIGGER on_insert_event;


--
-- TOC entry 2905 (class 2620 OID 93922)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_raid FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 2925 (class 2620 OID 95058)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_diskspace_2016 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 2928 (class 2620 OID 95098)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_device_uptime_2016 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 2932 (class 2620 OID 95137)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_2016 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 2934 (class 2620 OID 95179)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_jobs_2016 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 2937 (class 2620 OID 95218)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_dbsizes_2016 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 2943 (class 2620 OID 96029)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_jobs_1990 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 2940 (class 2620 OID 96053)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_jobs_2015 FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 2884 (class 2620 OID 93951)
-- Name: on_insert_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_update BEFORE INSERT OR UPDATE ON equipments FOR EACH ROW EXECUTE PROCEDURE equipment_insert_update();


--
-- TOC entry 3242 (class 0 OID 0)
-- Dependencies: 2884
-- Name: TRIGGER on_insert_update ON equipments; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER on_insert_update ON equipments IS 'Valida datos antes de insertar o actualkizar';


--
-- TOC entry 2865 (class 2620 OID 93952)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON account_states FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 3243 (class 0 OID 0)
-- Dependencies: 2865
-- Name: TRIGGER on_update_row ON account_states; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER on_update_row ON account_states IS 'Actualiza el ts cuando un campo es actualizado.';


--
-- TOC entry 2867 (class 2620 OID 93953)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON account_types FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2879 (class 2620 OID 93954)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON attachments FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2882 (class 2620 OID 93955)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON emails FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2908 (class 2620 OID 93956)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON eventtypes FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2913 (class 2620 OID 93957)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON groups FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2915 (class 2620 OID 93958)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON identification_types FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2920 (class 2620 OID 93959)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON phone_types FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2922 (class 2620 OID 93960)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON phones FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2918 (class 2620 OID 93961)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON phone_providers FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2885 (class 2620 OID 93963)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON equipments FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2863 (class 2620 OID 93964)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON account_contacts FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2887 (class 2620 OID 93965)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON event_comments_attachments FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2861 (class 2620 OID 93966)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();

ALTER TABLE events DISABLE TRIGGER on_update_row;


--
-- TOC entry 2900 (class 2620 OID 93967)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_jobs FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();

ALTER TABLE events_jobs DISABLE TRIGGER on_update_row;


--
-- TOC entry 2892 (class 2620 OID 93970)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_dbsizes FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();

ALTER TABLE events_dbsizes DISABLE TRIGGER on_update_row;


--
-- TOC entry 2898 (class 2620 OID 93971)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_diskspace FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();

ALTER TABLE events_diskspace DISABLE TRIGGER on_update_row;


--
-- TOC entry 2895 (class 2620 OID 93972)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_device_uptime FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();

ALTER TABLE events_device_uptime DISABLE TRIGGER on_update_row;


--
-- TOC entry 2906 (class 2620 OID 93984)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_raid FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2911 (class 2620 OID 93986)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON farma_lista_precios_farmacias FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2924 (class 2620 OID 94006)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON account_users FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2926 (class 2620 OID 95056)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_diskspace_2016 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2930 (class 2620 OID 95096)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_device_uptime_2016 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2931 (class 2620 OID 95135)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_2016 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2936 (class 2620 OID 95177)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_jobs_2016 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2938 (class 2620 OID 95216)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_dbsizes_2016 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2941 (class 2620 OID 95970)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_jobs_2015 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2944 (class 2620 OID 96027)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_jobs_1990 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2946 (class 2620 OID 96114)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_diskspace_2015 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2949 (class 2620 OID 96140)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_device_uptime_2015 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2950 (class 2620 OID 96162)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_dbsizes_2015 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2954 (class 2620 OID 96257)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON notification_area FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2956 (class 2620 OID 96278)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON event_comments_2016 FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2822 (class 2606 OID 94020)
-- Name: fk_account_contacts_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY account_contacts
    ADD CONSTRAINT fk_account_contacts_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact);


--
-- TOC entry 2843 (class 2606 OID 94025)
-- Name: fk_account_user_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY account_users
    ADD CONSTRAINT fk_account_user_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2824 (class 2606 OID 94030)
-- Name: fk_accounts_iddivision; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY accounts
    ADD CONSTRAINT fk_accounts_iddivision FOREIGN KEY (iddivision) REFERENCES divisions(iddivision) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 2825 (class 2606 OID 94035)
-- Name: fk_admins_idcontact_idcontact; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY admins
    ADD CONSTRAINT fk_admins_idcontact_idcontact FOREIGN KEY (idcontact) REFERENCES contacts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2823 (class 2606 OID 94040)
-- Name: fk_contacts_ididtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY contacts
    ADD CONSTRAINT fk_contacts_ididtype FOREIGN KEY (ididtype) REFERENCES identification_types(ididtype);


--
-- TOC entry 2826 (class 2606 OID 94045)
-- Name: fk_equipments_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY equipments
    ADD CONSTRAINT fk_equipments_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 2827 (class 2606 OID 94055)
-- Name: fk_event_comments_attach_idattach; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY event_comments_attachments
    ADD CONSTRAINT fk_event_comments_attach_idattach FOREIGN KEY (idattachment) REFERENCES attachments(idattachment) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2848 (class 2606 OID 95138)
-- Name: fk_events_2016_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_2016
    ADD CONSTRAINT fk_events_2016_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2849 (class 2606 OID 95143)
-- Name: fk_events_2016_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_2016
    ADD CONSTRAINT fk_events_2016_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 2828 (class 2606 OID 94110)
-- Name: fk_events_comments_idadmin; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY event_comments
    ADD CONSTRAINT fk_events_comments_idadmin FOREIGN KEY (idadmin) REFERENCES contacts(idcontact) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 2852 (class 2606 OID 95219)
-- Name: fk_events_dbsizes_2016_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_dbsizes_2016
    ADD CONSTRAINT fk_events_dbsizes_2016_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2853 (class 2606 OID 95224)
-- Name: fk_events_dbsizes_2016_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_dbsizes_2016
    ADD CONSTRAINT fk_events_dbsizes_2016_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 2829 (class 2606 OID 94966)
-- Name: fk_events_dbsizes_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_dbsizes
    ADD CONSTRAINT fk_events_dbsizes_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2830 (class 2606 OID 94971)
-- Name: fk_events_dbsizes_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_dbsizes
    ADD CONSTRAINT fk_events_dbsizes_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 2846 (class 2606 OID 95099)
-- Name: fk_events_device_uptime_2016_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_device_uptime_2016
    ADD CONSTRAINT fk_events_device_uptime_2016_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2847 (class 2606 OID 95104)
-- Name: fk_events_device_uptime_2016_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_device_uptime_2016
    ADD CONSTRAINT fk_events_device_uptime_2016_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 2831 (class 2606 OID 94940)
-- Name: fk_events_device_uptime_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_device_uptime
    ADD CONSTRAINT fk_events_device_uptime_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2832 (class 2606 OID 94945)
-- Name: fk_events_device_uptime_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_device_uptime
    ADD CONSTRAINT fk_events_device_uptime_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 2844 (class 2606 OID 95059)
-- Name: fk_events_diskspace_2016_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_diskspace_2016
    ADD CONSTRAINT fk_events_diskspace_2016_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2845 (class 2606 OID 95064)
-- Name: fk_events_diskspace_2016_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_diskspace_2016
    ADD CONSTRAINT fk_events_diskspace_2016_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 2834 (class 2606 OID 94991)
-- Name: fk_events_diskspace_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_diskspace
    ADD CONSTRAINT fk_events_diskspace_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 2833 (class 2606 OID 94986)
-- Name: fk_events_events_diskspace_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_diskspace
    ADD CONSTRAINT fk_events_events_diskspace_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2820 (class 2606 OID 94265)
-- Name: fk_events_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events
    ADD CONSTRAINT fk_events_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2821 (class 2606 OID 94270)
-- Name: fk_events_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events
    ADD CONSTRAINT fk_events_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 2856 (class 2606 OID 96030)
-- Name: fk_events_jobs_1990_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs_1990
    ADD CONSTRAINT fk_events_jobs_1990_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2857 (class 2606 OID 96035)
-- Name: fk_events_jobs_1990_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs_1990
    ADD CONSTRAINT fk_events_jobs_1990_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 2854 (class 2606 OID 96054)
-- Name: fk_events_jobs_2015_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs_2015
    ADD CONSTRAINT fk_events_jobs_2015_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2855 (class 2606 OID 96059)
-- Name: fk_events_jobs_2015_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs_2015
    ADD CONSTRAINT fk_events_jobs_2015_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 2850 (class 2606 OID 95180)
-- Name: fk_events_jobs_2016_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs_2016
    ADD CONSTRAINT fk_events_jobs_2016_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2851 (class 2606 OID 95185)
-- Name: fk_events_jobs_2016_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs_2016
    ADD CONSTRAINT fk_events_jobs_2016_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 2835 (class 2606 OID 95001)
-- Name: fk_events_jobs_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs
    ADD CONSTRAINT fk_events_jobs_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2836 (class 2606 OID 95006)
-- Name: fk_events_jobs_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_jobs
    ADD CONSTRAINT fk_events_jobs_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 2837 (class 2606 OID 95016)
-- Name: fk_events_raid_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_raid
    ADD CONSTRAINT fk_events_raid_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2838 (class 2606 OID 95021)
-- Name: fk_events_raid_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events_raid
    ADD CONSTRAINT fk_events_raid_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 2839 (class 2606 OID 97575)
-- Name: fk_eventtypes_ideventtype_group; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY eventtypes
    ADD CONSTRAINT fk_eventtypes_ideventtype_group FOREIGN KEY (ideventtype_group) REFERENCES eventtypes_groups(ideventtype_group) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 2840 (class 2606 OID 94445)
-- Name: fk_groups_iddivision; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY groups
    ADD CONSTRAINT fk_groups_iddivision FOREIGN KEY (iddivision) REFERENCES divisions(iddivision) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 2841 (class 2606 OID 94450)
-- Name: fk_phones_idphonetype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY phones
    ADD CONSTRAINT fk_phones_idphonetype FOREIGN KEY (idphonetype) REFERENCES phone_types(idphonetype) ON UPDATE CASCADE ON DELETE SET DEFAULT;


--
-- TOC entry 2842 (class 2606 OID 94455)
-- Name: fk_phones_idprovider; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY phones
    ADD CONSTRAINT fk_phones_idprovider FOREIGN KEY (idprovider) REFERENCES phone_providers(idprovider) ON UPDATE CASCADE ON DELETE SET DEFAULT;


--
-- TOC entry 3091 (class 0 OID 0)
-- Dependencies: 8
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2016-03-30 13:38:19 ECT

--
-- PostgreSQL database dump complete
--

