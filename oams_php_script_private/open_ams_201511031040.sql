--
-- PostgreSQL database dump
--

-- Dumped from database version 9.4.5
-- Dumped by pg_dump version 9.4.4
-- Started on 2015-11-03 10:44:18 ECT

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 177 (class 1259 OID 42551)
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
-- TOC entry 2835 (class 0 OID 0)
-- Dependencies: 177
-- Name: TABLE account_contacts; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE account_contacts IS 'Usuarios de un abonado (cliente).
No hay como usar idacount como llave foranea porque es una tabla heredada, hay que hacer la comprobacion manualmente.';


--
-- TOC entry 2836 (class 0 OID 0)
-- Dependencies: 177
-- Name: COLUMN account_contacts.idaccount; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN account_contacts.idaccount IS 'ID de la cuenta';


--
-- TOC entry 2837 (class 0 OID 0)
-- Dependencies: 177
-- Name: COLUMN account_contacts.idcontact; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN account_contacts.idcontact IS 'ID asociado de la lista de contactos';


--
-- TOC entry 178 (class 1259 OID 42559)
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
-- TOC entry 2838 (class 0 OID 0)
-- Dependencies: 178
-- Name: TABLE account_states; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE account_states IS 'Lista de posibles estados de un abonado';


--
-- TOC entry 179 (class 1259 OID 42566)
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
-- TOC entry 2839 (class 0 OID 0)
-- Dependencies: 179
-- Name: account_state_idaccountstate_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE account_state_idaccountstate_seq OWNED BY account_states.idaccountstate;


--
-- TOC entry 180 (class 1259 OID 42568)
-- Name: account_technicals; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE account_technicals (
    idtechnical integer NOT NULL,
    idaccount integer,
    idcontact integer DEFAULT 0 NOT NULL,
    priority integer DEFAULT 1 NOT NULL
);


ALTER TABLE account_technicals OWNER TO postgres;

--
-- TOC entry 2840 (class 0 OID 0)
-- Dependencies: 180
-- Name: COLUMN account_technicals.idcontact; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN account_technicals.idcontact IS 'Esta columna debe ser comprobada manualmente verificando que el idcontact existe en la tabla contacts.';


--
-- TOC entry 181 (class 1259 OID 42573)
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
-- TOC entry 182 (class 1259 OID 42580)
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
-- TOC entry 2841 (class 0 OID 0)
-- Dependencies: 182
-- Name: account_types_idaccounttype_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE account_types_idaccounttype_seq OWNED BY account_types.idaccounttype;


--
-- TOC entry 183 (class 1259 OID 42582)
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
-- TOC entry 2842 (class 0 OID 0)
-- Dependencies: 183
-- Name: account_users_idaccountuser_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE account_users_idaccountuser_seq OWNED BY account_contacts.idaccountuser;


--
-- TOC entry 227 (class 1259 OID 2441971)
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
-- TOC entry 173 (class 1259 OID 42485)
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
    ididtype integer DEFAULT 0 NOT NULL,
    postal_code text,
    gender integer DEFAULT 0,
    geox double precision DEFAULT 0,
    geoy double precision DEFAULT 0,
    note text,
    address text,
    address_ref text,
    is_admin boolean DEFAULT false NOT NULL,
    admin_start timestamp without time zone DEFAULT now() NOT NULL,
    admin_end timestamp without time zone DEFAULT now() NOT NULL,
    admin_username text,
    admin_pwd text,
    admin_sessionid text,
    admin_ip text,
    admin_level integer DEFAULT 0 NOT NULL,
    groups integer[],
    admin_locked_date timestamp without time zone DEFAULT now(),
    admin_failed_access_attempts smallint DEFAULT 0
)
WITH (autovacuum_enabled=true, toast.autovacuum_enabled=true);


ALTER TABLE contacts OWNER TO postgres;

--
-- TOC entry 2843 (class 0 OID 0)
-- Dependencies: 173
-- Name: COLUMN contacts.enabled; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.enabled IS 'Indica si el contacto esta habilitado o no.
Por ejemplo si el contacto debe usarse o no para otras areas de la aplicacion.';


--
-- TOC entry 2844 (class 0 OID 0)
-- Dependencies: 173
-- Name: COLUMN contacts.first_name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.first_name IS 'Nombre del contacto.
Este campo es oblogatorio y no puede ser nulo.
';


--
-- TOC entry 2845 (class 0 OID 0)
-- Dependencies: 173
-- Name: COLUMN contacts.last_name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.last_name IS 'Apellido del contacto.
Este valor puede ser nulo aunque no se recomienda.';


--
-- TOC entry 2846 (class 0 OID 0)
-- Dependencies: 173
-- Name: COLUMN contacts.identification; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.identification IS 'Este campo es importante, obligatorio y unico entre todos los registros.
Es un identificador unico entre el resto de contactos.
';


--
-- TOC entry 2847 (class 0 OID 0)
-- Dependencies: 173
-- Name: COLUMN contacts.ididtype; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.ididtype IS 'Tipo de identificacion (Ej.: Cedula, RUC, etc)';


--
-- TOC entry 2848 (class 0 OID 0)
-- Dependencies: 173
-- Name: COLUMN contacts.postal_code; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.postal_code IS 'Codigo Postal';


--
-- TOC entry 2849 (class 0 OID 0)
-- Dependencies: 173
-- Name: COLUMN contacts.gender; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.gender IS 'Genero:
0 - No establecido
1 - Hombre
2 - Mujer';


--
-- TOC entry 2850 (class 0 OID 0)
-- Dependencies: 173
-- Name: COLUMN contacts.geox; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.geox IS 'Geolocalizacion X';


--
-- TOC entry 2851 (class 0 OID 0)
-- Dependencies: 173
-- Name: COLUMN contacts.geoy; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.geoy IS 'Geolocalizacion Y';


--
-- TOC entry 2852 (class 0 OID 0)
-- Dependencies: 173
-- Name: COLUMN contacts.address; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.address IS 'Direccion del contacto';


--
-- TOC entry 2853 (class 0 OID 0)
-- Dependencies: 173
-- Name: COLUMN contacts.address_ref; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.address_ref IS 'Puntos referenciales para ubucacion del contacto';


--
-- TOC entry 2854 (class 0 OID 0)
-- Dependencies: 173
-- Name: COLUMN contacts.is_admin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.is_admin IS 'Indica si el contacto es administrador del sistema.';


--
-- TOC entry 2855 (class 0 OID 0)
-- Dependencies: 173
-- Name: COLUMN contacts.admin_start; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.admin_start IS 'Fecha de inicio en que el administrador puede tener acceso';


--
-- TOC entry 2856 (class 0 OID 0)
-- Dependencies: 173
-- Name: COLUMN contacts.admin_end; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.admin_end IS 'Fecha hasta la cual el administrador puede tener acceso';


--
-- TOC entry 2857 (class 0 OID 0)
-- Dependencies: 173
-- Name: COLUMN contacts.admin_sessionid; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.admin_sessionid IS 'Dato proporcionado automaticamente por el navegador cuando el usuario se loguea.
(No modificar)';


--
-- TOC entry 2858 (class 0 OID 0)
-- Dependencies: 173
-- Name: COLUMN contacts.admin_ip; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.admin_ip IS 'IP desde la cual el administrador se logueó por ultima vez.';


--
-- TOC entry 2859 (class 0 OID 0)
-- Dependencies: 173
-- Name: COLUMN contacts.admin_level; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.admin_level IS 'Nivel de privilegios del administrador';


--
-- TOC entry 2860 (class 0 OID 0)
-- Dependencies: 173
-- Name: COLUMN contacts.groups; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.groups IS 'Id de los grupos a los que pertenece este abonado';


--
-- TOC entry 2861 (class 0 OID 0)
-- Dependencies: 173
-- Name: COLUMN contacts.admin_locked_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.admin_locked_date IS 'Tiempo hasta el cual el administrador estara bloqueado sin acceso poder loguearse';


--
-- TOC entry 2862 (class 0 OID 0)
-- Dependencies: 173
-- Name: COLUMN contacts.admin_failed_access_attempts; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN contacts.admin_failed_access_attempts IS 'Numero de intentos fallidos para ingresar.';


--
-- TOC entry 174 (class 1259 OID 42498)
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
-- TOC entry 2863 (class 0 OID 0)
-- Dependencies: 174
-- Name: contacts_idcontact_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE contacts_idcontact_seq OWNED BY contacts.idcontact;


--
-- TOC entry 226 (class 1259 OID 129644)
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
    account text NOT NULL
)
INHERITS (contacts)
WITH (autovacuum_enabled=true, toast.autovacuum_enabled=true);


ALTER TABLE accounts OWNER TO postgres;

--
-- TOC entry 267 (class 1259 OID 5416812)
-- Name: admin_notifications; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE admin_notifications (
    idadmin_notification bigint NOT NULL,
    ts timestamp without time zone DEFAULT now()
);


ALTER TABLE admin_notifications OWNER TO postgres;

--
-- TOC entry 2864 (class 0 OID 0)
-- Dependencies: 267
-- Name: TABLE admin_notifications; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE admin_notifications IS 'Tabla de notificaciones a ser enviadas a los administradores del sistema';


--
-- TOC entry 268 (class 1259 OID 5416815)
-- Name: admin_notifications_idadmin_notification_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE admin_notifications_idadmin_notification_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE admin_notifications_idadmin_notification_seq OWNER TO postgres;

--
-- TOC entry 2865 (class 0 OID 0)
-- Dependencies: 268
-- Name: admin_notifications_idadmin_notification_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE admin_notifications_idadmin_notification_seq OWNED BY admin_notifications.idadmin_notification;


--
-- TOC entry 184 (class 1259 OID 42606)
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
-- TOC entry 185 (class 1259 OID 42613)
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
-- TOC entry 2866 (class 0 OID 0)
-- Dependencies: 185
-- Name: attachments_idattachment_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE attachments_idattachment_seq OWNED BY attachments.idattachment;


--
-- TOC entry 186 (class 1259 OID 42615)
-- Name: contacts_groups; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE contacts_groups (
    idcontactgroup bigint NOT NULL,
    ts timestamp without time zone DEFAULT now(),
    idcontact integer DEFAULT 0,
    idgroup integer DEFAULT 0
);


ALTER TABLE contacts_groups OWNER TO postgres;

--
-- TOC entry 2867 (class 0 OID 0)
-- Dependencies: 186
-- Name: TABLE contacts_groups; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE contacts_groups IS 'Grupos a los que pertenece el contacto';


--
-- TOC entry 187 (class 1259 OID 42621)
-- Name: contacts_groups_idcontactgroup_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE contacts_groups_idcontactgroup_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contacts_groups_idcontactgroup_seq OWNER TO postgres;

--
-- TOC entry 2868 (class 0 OID 0)
-- Dependencies: 187
-- Name: contacts_groups_idcontactgroup_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE contacts_groups_idcontactgroup_seq OWNED BY contacts_groups.idcontactgroup;


--
-- TOC entry 188 (class 1259 OID 42623)
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
-- TOC entry 2869 (class 0 OID 0)
-- Dependencies: 188
-- Name: COLUMN emails.notify_if_administrator; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN emails.notify_if_administrator IS 'Habilita envio de email de notificacion a esta direccion de corre cuando el email corresponde a un usuario administrador del sistema';


--
-- TOC entry 189 (class 1259 OID 42632)
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
-- TOC entry 2870 (class 0 OID 0)
-- Dependencies: 189
-- Name: emails_idemail_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE emails_idemail_seq OWNED BY emails.idemail;


--
-- TOC entry 190 (class 1259 OID 42634)
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
-- TOC entry 2871 (class 0 OID 0)
-- Dependencies: 190
-- Name: COLUMN equipments.serial_number; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN equipments.serial_number IS 'Numero de serie que viene en el producto';


--
-- TOC entry 2872 (class 0 OID 0)
-- Dependencies: 190
-- Name: COLUMN equipments.code_ref; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN equipments.code_ref IS 'Codigo para uso interno';


--
-- TOC entry 2873 (class 0 OID 0)
-- Dependencies: 190
-- Name: COLUMN equipments.operability; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN equipments.operability IS 'Porcentage de operatividad del equipo';


--
-- TOC entry 2874 (class 0 OID 0)
-- Dependencies: 190
-- Name: COLUMN equipments.agreement_code_provider; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN equipments.agreement_code_provider IS 'Numero de contrato, numero o codigo con que el proveedor nos conoce.';


--
-- TOC entry 191 (class 1259 OID 42643)
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
-- TOC entry 2875 (class 0 OID 0)
-- Dependencies: 191
-- Name: equipments_idequipment_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE equipments_idequipment_seq OWNED BY equipments.idequipment;


--
-- TOC entry 192 (class 1259 OID 42645)
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
-- TOC entry 193 (class 1259 OID 42649)
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
-- TOC entry 2876 (class 0 OID 0)
-- Dependencies: 193
-- Name: event_attachments_ideventattach_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE event_attachments_ideventattach_seq OWNED BY event_comments_attachments.ideventcommentattach;


--
-- TOC entry 194 (class 1259 OID 42651)
-- Name: event_comments; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE event_comments (
    ideventcomment bigint NOT NULL,
    ts timestamp without time zone DEFAULT now(),
    idadmin integer DEFAULT 0,
    start timestamp without time zone DEFAULT now(),
    seconds integer DEFAULT 0,
    comment_event text,
    status smallint DEFAULT 0,
    idevent bigint
)
WITH (autovacuum_enabled=true, toast.autovacuum_enabled=true);


ALTER TABLE event_comments OWNER TO postgres;

--
-- TOC entry 2877 (class 0 OID 0)
-- Dependencies: 194
-- Name: COLUMN event_comments.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN event_comments.status IS 'Es estado del comentario sirve para definir el estado del evento en cuestion ';


--
-- TOC entry 195 (class 1259 OID 42662)
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
-- TOC entry 2878 (class 0 OID 0)
-- Dependencies: 195
-- Name: event_comments_ideventcomment_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE event_comments_ideventcomment_seq OWNED BY event_comments.ideventcomment;


--
-- TOC entry 175 (class 1259 OID 42518)
-- Name: events; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events (
    idevent bigint NOT NULL,
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0 NOT NULL,
    idaccount integer,
    code text,
    priority integer DEFAULT (-1),
    ideventtype integer DEFAULT 0,
    description text,
    idadmin integer DEFAULT 0,
    last_comment timestamp without time zone,
    account text,
    zu bigint DEFAULT 0 NOT NULL,
    note text
)
WITH (autovacuum_enabled=true, toast.autovacuum_enabled=true);


ALTER TABLE events OWNER TO postgres;

--
-- TOC entry 2879 (class 0 OID 0)
-- Dependencies: 175
-- Name: TABLE events; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE events IS 'Las notificaciones de los ecentos solo se muestran al usuario si su proiridad es <= 20';


--
-- TOC entry 2880 (class 0 OID 0)
-- Dependencies: 175
-- Name: COLUMN events.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 2881 (class 0 OID 0)
-- Dependencies: 175
-- Name: COLUMN events.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 2882 (class 0 OID 0)
-- Dependencies: 175
-- Name: COLUMN events.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 196 (class 1259 OID 42664)
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
-- TOC entry 2883 (class 0 OID 0)
-- Dependencies: 196
-- Name: events_idevent_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE events_idevent_seq OWNED BY events.idevent;


--
-- TOC entry 238 (class 1259 OID 3887167)
-- Name: events_dbsizes; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_dbsizes (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    code text,
    priority integer DEFAULT (-1),
    ideventtype integer DEFAULT 0,
    description text,
    idadmin integer DEFAULT 0,
    last_comment timestamp without time zone,
    account text,
    zu bigint DEFAULT 0,
    db_name text,
    db_size real,
    db_type smallint
)
INHERITS (events)
WITH (autovacuum_enabled=true, toast.autovacuum_enabled=true);


ALTER TABLE events_dbsizes OWNER TO postgres;

--
-- TOC entry 2884 (class 0 OID 0)
-- Dependencies: 238
-- Name: COLUMN events_dbsizes.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_dbsizes.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 2885 (class 0 OID 0)
-- Dependencies: 238
-- Name: COLUMN events_dbsizes.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_dbsizes.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 2886 (class 0 OID 0)
-- Dependencies: 238
-- Name: COLUMN events_dbsizes.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_dbsizes.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 241 (class 1259 OID 3887243)
-- Name: events_device_uptime; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_device_uptime (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    code text,
    priority integer DEFAULT (-1),
    ideventtype integer DEFAULT 0,
    description text,
    idadmin integer DEFAULT 0,
    last_comment timestamp without time zone,
    account text,
    zu bigint DEFAULT 0,
    uptime integer DEFAULT (-1)
)
INHERITS (events)
WITH (autovacuum_enabled=true, toast.autovacuum_enabled=true);


ALTER TABLE events_device_uptime OWNER TO postgres;

--
-- TOC entry 2887 (class 0 OID 0)
-- Dependencies: 241
-- Name: COLUMN events_device_uptime.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_device_uptime.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 2888 (class 0 OID 0)
-- Dependencies: 241
-- Name: COLUMN events_device_uptime.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_device_uptime.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 2889 (class 0 OID 0)
-- Dependencies: 241
-- Name: COLUMN events_device_uptime.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_device_uptime.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 240 (class 1259 OID 3887214)
-- Name: events_diskspace; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_diskspace (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    code text,
    priority integer DEFAULT (-1),
    ideventtype integer DEFAULT 0,
    description text,
    idadmin integer DEFAULT 0,
    last_comment timestamp without time zone,
    account text,
    zu bigint DEFAULT 0,
    drive text,
    drive_size real DEFAULT (-1),
    drive_free real DEFAULT (-1)
)
INHERITS (events)
WITH (autovacuum_enabled=true, toast.autovacuum_enabled=true);


ALTER TABLE events_diskspace OWNER TO postgres;

--
-- TOC entry 2890 (class 0 OID 0)
-- Dependencies: 240
-- Name: COLUMN events_diskspace.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_diskspace.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 2891 (class 0 OID 0)
-- Dependencies: 240
-- Name: COLUMN events_diskspace.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_diskspace.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 2892 (class 0 OID 0)
-- Dependencies: 240
-- Name: COLUMN events_diskspace.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_diskspace.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 235 (class 1259 OID 3886477)
-- Name: events_jobs; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE events_jobs (
    idevent bigint DEFAULT nextval('events_idevent_seq'::regclass),
    ts timestamp without time zone DEFAULT now(),
    loaded timestamp without time zone DEFAULT now(),
    dateevent timestamp without time zone DEFAULT now(),
    status integer DEFAULT 0,
    idaccount integer,
    code text,
    priority integer DEFAULT (-1),
    ideventtype integer DEFAULT 0,
    description text,
    idadmin integer DEFAULT 0,
    last_comment timestamp without time zone,
    account text,
    zu bigint DEFAULT 0,
    job_name text,
    job_enabled boolean DEFAULT true,
    job_description text,
    job_date_create timestamp without time zone,
    job_run_duration integer DEFAULT (-1) NOT NULL,
    job_run_status smallint DEFAULT (-10),
    job_next_run timestamp without time zone
)
INHERITS (events)
WITH (autovacuum_enabled=true, toast.autovacuum_enabled=true);


ALTER TABLE events_jobs OWNER TO postgres;

--
-- TOC entry 2893 (class 0 OID 0)
-- Dependencies: 235
-- Name: COLUMN events_jobs.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs.status IS 'Este campo se actualiza automaticamente segun el estado del ultimo comentario ingresado para este evento.';


--
-- TOC entry 2894 (class 0 OID 0)
-- Dependencies: 235
-- Name: COLUMN events_jobs.idadmin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs.idadmin IS 'IdAdmin del usuario que crea el evento, generalmente es el sistema quien ingresa el evento, por seguridad es necesario registrar si un administrador inserta un evento manualmente.';


--
-- TOC entry 2895 (class 0 OID 0)
-- Dependencies: 235
-- Name: COLUMN events_jobs.last_comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN events_jobs.last_comment IS 'Fecha del ultimo comentario registrado.';


--
-- TOC entry 176 (class 1259 OID 42531)
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
    autoclose_if_there_is_an_equal_even_noclosed_event integer DEFAULT 0 NOT NULL,
    auto_close_on_event_defined integer[],
    enable_auto_close_on_event_defined boolean DEFAULT false NOT NULL
);


ALTER TABLE eventtypes OWNER TO postgres;

--
-- TOC entry 2896 (class 0 OID 0)
-- Dependencies: 176
-- Name: TABLE eventtypes; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE eventtypes IS 'Tipos de eventos definidos para el sistema.
A partir del evento 1000 son definidos internamente por oams y no deben ser utilizados por el usuario.';


--
-- TOC entry 2897 (class 0 OID 0)
-- Dependencies: 176
-- Name: COLUMN eventtypes.name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.name IS 'Nombre del evento';


--
-- TOC entry 2898 (class 0 OID 0)
-- Dependencies: 176
-- Name: COLUMN eventtypes.treatment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.treatment IS 'Requiere tratamiento por parte del operador';


--
-- TOC entry 2899 (class 0 OID 0)
-- Dependencies: 176
-- Name: COLUMN eventtypes.manual; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.manual IS 'Puede ser creado el evento manualmente, la mayoria de los eventos deberian ser creados solo por un software y no generados a mano por razones de seguridad.';


--
-- TOC entry 2900 (class 0 OID 0)
-- Dependencies: 176
-- Name: COLUMN eventtypes.date_editable; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.date_editable IS 'Las fechas de los eventos NO deberian ser editables por razones de seguridda, a exepcion de las tareas que si podrian ser modificadas. ';


--
-- TOC entry 2901 (class 0 OID 0)
-- Dependencies: 176
-- Name: COLUMN eventtypes.notify_timeout; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.notify_timeout IS 'Tiempo que la notificacion sera visible para el usuario';


--
-- TOC entry 2902 (class 0 OID 0)
-- Dependencies: 176
-- Name: COLUMN eventtypes.notify_closable; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.notify_closable IS 'La notificacion puede ser cerrada por el usuario antes de que se cierre automaticamente una vez trascurrido el timeout.';


--
-- TOC entry 2903 (class 0 OID 0)
-- Dependencies: 176
-- Name: COLUMN eventtypes.notify_img; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.notify_img IS 'Imagen a ser  mostrada en la notificacion';


--
-- TOC entry 2904 (class 0 OID 0)
-- Dependencies: 176
-- Name: COLUMN eventtypes.notify_snd; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.notify_snd IS 'Sonido a ser escuchado cuando la notificacion es mostrada.';


--
-- TOC entry 2905 (class 0 OID 0)
-- Dependencies: 176
-- Name: COLUMN eventtypes.label; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.label IS 'Etiqueta que se mostrara en la interface grafica';


--
-- TOC entry 2906 (class 0 OID 0)
-- Dependencies: 176
-- Name: COLUMN eventtypes.code; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.code IS 'Codigo de alarma';


--
-- TOC entry 2907 (class 0 OID 0)
-- Dependencies: 176
-- Name: COLUMN eventtypes.notify_all_users; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.notify_all_users IS 'Muestra la notificacion de este evento a todos los usuarios  o solo al usuario que lo genera.';


--
-- TOC entry 2908 (class 0 OID 0)
-- Dependencies: 176
-- Name: COLUMN eventtypes.expiration; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.expiration IS 'Tiempo en que el evento permanece en espera de sewr atendido antes de ser cerrado automaticamente por el sistema, en minutos.
De fabrica 525600 = 365 dias.
Se puede usar este campo para auto cerrar los eventos que no requieren tratamiento por parte del operador seteando en valor a 0.';


--
-- TOC entry 2909 (class 0 OID 0)
-- Dependencies: 176
-- Name: COLUMN eventtypes.autoclose_if_there_is_an_equal_even_noclosed_event; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.autoclose_if_there_is_an_equal_even_noclosed_event IS 'Cierra automaticamente los proximos eventos por X minutos si hay algun evento con el mismo tipo, misma cuenta y comentario aun sin cerrar.
Default = 0 (inserta todos los eventos y los deja abiertos) ';


--
-- TOC entry 2910 (class 0 OID 0)
-- Dependencies: 176
-- Name: COLUMN eventtypes.auto_close_on_event_defined; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN eventtypes.auto_close_on_event_defined IS 'Cierra el evento automaticamente si llega un evento con idevent listado en esta matriz.';


--
-- TOC entry 197 (class 1259 OID 42666)
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
-- TOC entry 2911 (class 0 OID 0)
-- Dependencies: 197
-- Name: eventtypes_ideventtype_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE eventtypes_ideventtype_seq OWNED BY eventtypes.ideventtype;


--
-- TOC entry 198 (class 1259 OID 42668)
-- Name: groups; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE groups (
    idgroup bigint NOT NULL,
    ts timestamp without time zone DEFAULT now(),
    enabled boolean DEFAULT true,
    name text NOT NULL,
    description text,
    note text
);


ALTER TABLE groups OWNER TO postgres;

--
-- TOC entry 2912 (class 0 OID 0)
-- Dependencies: 198
-- Name: TABLE groups; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE groups IS 'Grupos';


--
-- TOC entry 199 (class 1259 OID 42676)
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
-- TOC entry 2913 (class 0 OID 0)
-- Dependencies: 199
-- Name: groups_idgrupo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE groups_idgrupo_seq OWNED BY groups.idgroup;


--
-- TOC entry 200 (class 1259 OID 42678)
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
-- TOC entry 201 (class 1259 OID 42686)
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
-- TOC entry 2914 (class 0 OID 0)
-- Dependencies: 201
-- Name: identification_type_ididtype_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE identification_type_ididtype_seq OWNED BY identification_types.ididtype;


--
-- TOC entry 259 (class 1259 OID 5363491)
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
-- TOC entry 2915 (class 0 OID 0)
-- Dependencies: 259
-- Name: TABLE network_devices; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE network_devices IS 'Equipos que funcionan en red o estan conectados a una red y disponen de direccion IP.';


--
-- TOC entry 2916 (class 0 OID 0)
-- Dependencies: 259
-- Name: COLUMN network_devices.ip; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN network_devices.ip IS 'Direccion IP';


--
-- TOC entry 2917 (class 0 OID 0)
-- Dependencies: 259
-- Name: COLUMN network_devices.mac; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN network_devices.mac IS 'MAC';


--
-- TOC entry 202 (class 1259 OID 42688)
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
WITH (autovacuum_enabled=true);


ALTER TABLE notification_area OWNER TO postgres;

--
-- TOC entry 2918 (class 0 OID 0)
-- Dependencies: 202
-- Name: COLUMN notification_area.sessionid; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN notification_area.sessionid IS 'Numero de referencia del usuario al que se va a mostrar las notificaciones, si este campo es igual a ''all'' se mostrara a todos los usuarios conectados.';


--
-- TOC entry 203 (class 1259 OID 42703)
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
-- TOC entry 2919 (class 0 OID 0)
-- Dependencies: 203
-- Name: notification_area_idnotify_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE notification_area_idnotify_seq OWNED BY notification_area.idnotify;


--
-- TOC entry 264 (class 1259 OID 5400539)
-- Name: oams_table_columns; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE oams_table_columns (
    table_name text NOT NULL,
    column_name text NOT NULL,
    data_type text NOT NULL,
    column_default text,
    column_label text NOT NULL,
    column_width text,
    ts timestamp without time zone DEFAULT now()
);


ALTER TABLE oams_table_columns OWNER TO postgres;

--
-- TOC entry 2920 (class 0 OID 0)
-- Dependencies: 264
-- Name: TABLE oams_table_columns; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE oams_table_columns IS 'Propiedades de los Campos de las tables del sistema, definidas por el sistema y por el usuario';


--
-- TOC entry 2921 (class 0 OID 0)
-- Dependencies: 264
-- Name: COLUMN oams_table_columns.table_name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN oams_table_columns.table_name IS 'id table column';


--
-- TOC entry 2922 (class 0 OID 0)
-- Dependencies: 264
-- Name: COLUMN oams_table_columns.column_label; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN oams_table_columns.column_label IS 'Etiqueta definida por el usuario.
Si  es null se usa el nombre de la columna';


--
-- TOC entry 208 (class 1259 OID 42727)
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
-- TOC entry 204 (class 1259 OID 42705)
-- Name: phone_types; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE phone_types (
    idphonetype bigint NOT NULL,
    ts timestamp without time zone DEFAULT now(),
    type text NOT NULL
);


ALTER TABLE phone_types OWNER TO postgres;

--
-- TOC entry 205 (class 1259 OID 42712)
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
-- TOC entry 2923 (class 0 OID 0)
-- Dependencies: 205
-- Name: phone_type_idphonetype_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE phone_type_idphonetype_seq OWNED BY phone_types.idphonetype;


--
-- TOC entry 206 (class 1259 OID 42714)
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
-- TOC entry 2924 (class 0 OID 0)
-- Dependencies: 206
-- Name: COLUMN phones.idcontact; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN phones.idcontact IS 'Validar si existe este contacto hay que hacerlo manualmente ya que hay una tabla heredada accounts.';


--
-- TOC entry 207 (class 1259 OID 42725)
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
-- TOC entry 2925 (class 0 OID 0)
-- Dependencies: 207
-- Name: phones_idphone_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE phones_idphone_seq OWNED BY phones.idphone;


--
-- TOC entry 244 (class 1259 OID 3893608)
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
    is_admin boolean DEFAULT false,
    admin_start timestamp without time zone DEFAULT now(),
    admin_end timestamp without time zone DEFAULT now(),
    admin_username text,
    admin_pwd text,
    admin_sessionid text,
    admin_ip text,
    admin_level integer DEFAULT 0,
    groups integer[],
    product_or_service text NOT NULL
)
INHERITS (contacts);


ALTER TABLE providers OWNER TO postgres;

--
-- TOC entry 2926 (class 0 OID 0)
-- Dependencies: 244
-- Name: TABLE providers; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE providers IS 'Lista de proveedores de productos y servicios';


--
-- TOC entry 209 (class 1259 OID 42735)
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
-- TOC entry 2927 (class 0 OID 0)
-- Dependencies: 209
-- Name: providers_idprovider_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE providers_idprovider_seq OWNED BY phone_providers.idprovider;


--
-- TOC entry 210 (class 1259 OID 42737)
-- Name: sys_table_ts; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE sys_table_ts (
    table_name text NOT NULL,
    ts timestamp without time zone DEFAULT now()
);


ALTER TABLE sys_table_ts OWNER TO postgres;

--
-- TOC entry 2928 (class 0 OID 0)
-- Dependencies: 210
-- Name: TABLE sys_table_ts; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE sys_table_ts IS 'Esta tabla contiene el timestamp de la ultima actualizacion de las tablas.';


--
-- TOC entry 2929 (class 0 OID 0)
-- Dependencies: 210
-- Name: COLUMN sys_table_ts.table_name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN sys_table_ts.table_name IS 'Nombre de la tabla de la base de datos.';


--
-- TOC entry 2356 (class 2604 OID 4822090)
-- Name: idaccountuser; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY account_contacts ALTER COLUMN idaccountuser SET DEFAULT nextval('account_users_idaccountuser_seq'::regclass);


--
-- TOC entry 2359 (class 2604 OID 4822091)
-- Name: idaccountstate; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY account_states ALTER COLUMN idaccountstate SET DEFAULT nextval('account_state_idaccountstate_seq'::regclass);


--
-- TOC entry 2363 (class 2604 OID 4822092)
-- Name: idaccounttype; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY account_types ALTER COLUMN idaccounttype SET DEFAULT nextval('account_types_idaccounttype_seq'::regclass);


--
-- TOC entry 2422 (class 2604 OID 4822093)
-- Name: is_admin; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY accounts ALTER COLUMN is_admin SET DEFAULT false;


--
-- TOC entry 2423 (class 2604 OID 4822094)
-- Name: admin_start; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY accounts ALTER COLUMN admin_start SET DEFAULT now();


--
-- TOC entry 2424 (class 2604 OID 4822095)
-- Name: admin_end; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY accounts ALTER COLUMN admin_end SET DEFAULT now();


--
-- TOC entry 2425 (class 2604 OID 4822096)
-- Name: admin_level; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY accounts ALTER COLUMN admin_level SET DEFAULT 0;


--
-- TOC entry 2413 (class 2604 OID 5189866)
-- Name: admin_locked_date; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY accounts ALTER COLUMN admin_locked_date SET DEFAULT now();


--
-- TOC entry 2412 (class 2604 OID 5189832)
-- Name: admin_failed_access_attempts; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY accounts ALTER COLUMN admin_failed_access_attempts SET DEFAULT 0;


--
-- TOC entry 2496 (class 2604 OID 5416817)
-- Name: idadmin_notification; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY admin_notifications ALTER COLUMN idadmin_notification SET DEFAULT nextval('admin_notifications_idadmin_notification_seq'::regclass);


--
-- TOC entry 2365 (class 2604 OID 4822097)
-- Name: idattachment; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY attachments ALTER COLUMN idattachment SET DEFAULT nextval('attachments_idattachment_seq'::regclass);


--
-- TOC entry 2331 (class 2604 OID 4822098)
-- Name: idcontact; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY contacts ALTER COLUMN idcontact SET DEFAULT nextval('contacts_idcontact_seq'::regclass);


--
-- TOC entry 2370 (class 2604 OID 4822099)
-- Name: idcontactgroup; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY contacts_groups ALTER COLUMN idcontactgroup SET DEFAULT nextval('contacts_groups_idcontactgroup_seq'::regclass);


--
-- TOC entry 2373 (class 2604 OID 4822100)
-- Name: idemail; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY emails ALTER COLUMN idemail SET DEFAULT nextval('emails_idemail_seq'::regclass);


--
-- TOC entry 2379 (class 2604 OID 4822101)
-- Name: idequipment; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY equipments ALTER COLUMN idequipment SET DEFAULT nextval('equipments_idequipment_seq'::regclass);


--
-- TOC entry 2387 (class 2604 OID 4822102)
-- Name: ideventcomment; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY event_comments ALTER COLUMN ideventcomment SET DEFAULT nextval('event_comments_ideventcomment_seq'::regclass);


--
-- TOC entry 2380 (class 2604 OID 4822103)
-- Name: ideventcommentattach; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY event_comments_attachments ALTER COLUMN ideventcommentattach SET DEFAULT nextval('event_attachments_ideventattach_seq'::regclass);


--
-- TOC entry 2342 (class 2604 OID 4822104)
-- Name: idevent; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events ALTER COLUMN idevent SET DEFAULT nextval('events_idevent_seq'::regclass);


--
-- TOC entry 2355 (class 2604 OID 4822105)
-- Name: ideventtype; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY eventtypes ALTER COLUMN ideventtype SET DEFAULT nextval('eventtypes_ideventtype_seq'::regclass);


--
-- TOC entry 2388 (class 2604 OID 4822106)
-- Name: idgroup; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY groups ALTER COLUMN idgroup SET DEFAULT nextval('groups_idgrupo_seq'::regclass);


--
-- TOC entry 2391 (class 2604 OID 4822107)
-- Name: ididtype; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY identification_types ALTER COLUMN ididtype SET DEFAULT nextval('identification_type_ididtype_seq'::regclass);


--
-- TOC entry 2399 (class 2604 OID 4822109)
-- Name: idnotify; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY notification_area ALTER COLUMN idnotify SET DEFAULT nextval('notification_area_idnotify_seq'::regclass);


--
-- TOC entry 2408 (class 2604 OID 4822110)
-- Name: idprovider; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY phone_providers ALTER COLUMN idprovider SET DEFAULT nextval('providers_idprovider_seq'::regclass);


--
-- TOC entry 2400 (class 2604 OID 4822111)
-- Name: idphonetype; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY phone_types ALTER COLUMN idphonetype SET DEFAULT nextval('phone_type_idphonetype_seq'::regclass);


--
-- TOC entry 2407 (class 2604 OID 4822112)
-- Name: idphone; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY phones ALTER COLUMN idphone SET DEFAULT nextval('phones_idphone_seq'::regclass);


--
-- TOC entry 2478 (class 2604 OID 5189867)
-- Name: admin_locked_date; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY providers ALTER COLUMN admin_locked_date SET DEFAULT now();


--
-- TOC entry 2476 (class 2604 OID 5189833)
-- Name: admin_failed_access_attempts; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY providers ALTER COLUMN admin_failed_access_attempts SET DEFAULT 0;


--
-- TOC entry 2593 (class 2606 OID 2441985)
-- Name: account_users_idaccount_idcontact_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY account_users
    ADD CONSTRAINT account_users_idaccount_idcontact_key UNIQUE (idaccount, idcontact);


--
-- TOC entry 2595 (class 2606 OID 2441983)
-- Name: account_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY account_users
    ADD CONSTRAINT account_users_pkey PRIMARY KEY (idaccountuser);


--
-- TOC entry 2585 (class 2606 OID 129667)
-- Name: accounts__ididtype_identification_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY accounts
    ADD CONSTRAINT accounts__ididtype_identification_key UNIQUE (ididtype, identification);


--
-- TOC entry 2587 (class 2606 OID 129663)
-- Name: accounts__pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY accounts
    ADD CONSTRAINT accounts__pkey PRIMARY KEY (idcontact);


--
-- TOC entry 2605 (class 2606 OID 3887186)
-- Name: events_dbsizes_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_dbsizes
    ADD CONSTRAINT events_dbsizes_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 2607 (class 2606 OID 3887183)
-- Name: events_dbsizes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_dbsizes
    ADD CONSTRAINT events_dbsizes_pkey PRIMARY KEY (idevent);


--
-- TOC entry 2612 (class 2606 OID 3887233)
-- Name: events_diskspace_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_diskspace
    ADD CONSTRAINT events_diskspace_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 2614 (class 2606 OID 3887230)
-- Name: events_diskspace_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_diskspace
    ADD CONSTRAINT events_diskspace_pkey PRIMARY KEY (idevent);


--
-- TOC entry 2599 (class 2606 OID 3886496)
-- Name: events_jobs_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs
    ADD CONSTRAINT events_jobs_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 2601 (class 2606 OID 3886493)
-- Name: events_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_jobs
    ADD CONSTRAINT events_jobs_pkey PRIMARY KEY (idevent);


--
-- TOC entry 2620 (class 2606 OID 3887262)
-- Name: events_sqlserver_uptime_dateevent_idaccount_ideventtype_zu_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_device_uptime
    ADD CONSTRAINT events_sqlserver_uptime_dateevent_idaccount_ideventtype_zu_key UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 2622 (class 2606 OID 3887259)
-- Name: events_sqlserver_uptime_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events_device_uptime
    ADD CONSTRAINT events_sqlserver_uptime_pkey PRIMARY KEY (idevent);


--
-- TOC entry 2632 (class 2606 OID 5363505)
-- Name: network_devices_2_code_ref_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY network_devices
    ADD CONSTRAINT network_devices_2_code_ref_key UNIQUE (code_ref);


--
-- TOC entry 2634 (class 2606 OID 5363507)
-- Name: network_devices_2_equipment_mark_serial_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY network_devices
    ADD CONSTRAINT network_devices_2_equipment_mark_serial_number_key UNIQUE (equipment, mark, serial_number);


--
-- TOC entry 2636 (class 2606 OID 5363503)
-- Name: network_devices_2_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY network_devices
    ADD CONSTRAINT network_devices_2_pkey PRIMARY KEY (idequipment);


--
-- TOC entry 2528 (class 2606 OID 42776)
-- Name: pk_account_state_idaccountstate; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY account_states
    ADD CONSTRAINT pk_account_state_idaccountstate PRIMARY KEY (idaccountstate);


--
-- TOC entry 2534 (class 2606 OID 42778)
-- Name: pk_account_types_idaccounttype; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY account_types
    ADD CONSTRAINT pk_account_types_idaccounttype PRIMARY KEY (idaccounttype);


--
-- TOC entry 2524 (class 2606 OID 42780)
-- Name: pk_account_users_idaccounuser; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY account_contacts
    ADD CONSTRAINT pk_account_users_idaccounuser PRIMARY KEY (idaccountuser);


--
-- TOC entry 2538 (class 2606 OID 42784)
-- Name: pk_attachments_idattachment; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY attachments
    ADD CONSTRAINT pk_attachments_idattachment PRIMARY KEY (idattachment);


--
-- TOC entry 2540 (class 2606 OID 42786)
-- Name: pk_contacts_groups_idcontactgroup; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY contacts_groups
    ADD CONSTRAINT pk_contacts_groups_idcontactgroup PRIMARY KEY (idcontactgroup);


--
-- TOC entry 2501 (class 2606 OID 42788)
-- Name: pk_contacts_idcontact; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY contacts
    ADD CONSTRAINT pk_contacts_idcontact PRIMARY KEY (idcontact);


--
-- TOC entry 2544 (class 2606 OID 42790)
-- Name: pk_email_idemail; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY emails
    ADD CONSTRAINT pk_email_idemail PRIMARY KEY (idemail);


--
-- TOC entry 2548 (class 2606 OID 42792)
-- Name: pk_equipments_idequipment; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY equipments
    ADD CONSTRAINT pk_equipments_idequipment PRIMARY KEY (idequipment);


--
-- TOC entry 2554 (class 2606 OID 42794)
-- Name: pk_event_attachments_ideventattach; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY event_comments_attachments
    ADD CONSTRAINT pk_event_attachments_ideventattach PRIMARY KEY (ideventcommentattach);


--
-- TOC entry 2559 (class 2606 OID 42796)
-- Name: pk_event_comments_ideventcomment; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY event_comments
    ADD CONSTRAINT pk_event_comments_ideventcomment PRIMARY KEY (ideventcomment);


--
-- TOC entry 2510 (class 2606 OID 42798)
-- Name: pk_events_idevent; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events
    ADD CONSTRAINT pk_events_idevent PRIMARY KEY (idevent);


--
-- TOC entry 2515 (class 2606 OID 42800)
-- Name: pk_eventtypes_ideventtype; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY eventtypes
    ADD CONSTRAINT pk_eventtypes_ideventtype PRIMARY KEY (ideventtype);


--
-- TOC entry 2561 (class 2606 OID 42802)
-- Name: pk_group_idgroup; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY groups
    ADD CONSTRAINT pk_group_idgroup PRIMARY KEY (idgroup);


--
-- TOC entry 2640 (class 2606 OID 5416826)
-- Name: pk_idadmin_notification; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY admin_notifications
    ADD CONSTRAINT pk_idadmin_notification PRIMARY KEY (idadmin_notification);


--
-- TOC entry 2565 (class 2606 OID 42804)
-- Name: pk_identification_type_ididtype; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY identification_types
    ADD CONSTRAINT pk_identification_type_ididtype PRIMARY KEY (ididtype);


--
-- TOC entry 2569 (class 2606 OID 42806)
-- Name: pk_notification_area_idnotify; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY notification_area
    ADD CONSTRAINT pk_notification_area_idnotify PRIMARY KEY (idnotify);


--
-- TOC entry 2638 (class 2606 OID 5400547)
-- Name: pk_otc; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY oams_table_columns
    ADD CONSTRAINT pk_otc PRIMARY KEY (table_name, column_name);


--
-- TOC entry 2571 (class 2606 OID 42808)
-- Name: pk_phone_type_idphonetype; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY phone_types
    ADD CONSTRAINT pk_phone_type_idphonetype PRIMARY KEY (idphonetype);


--
-- TOC entry 2575 (class 2606 OID 42810)
-- Name: pk_phones_idphone; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY phones
    ADD CONSTRAINT pk_phones_idphone PRIMARY KEY (idphone);


--
-- TOC entry 2579 (class 2606 OID 42812)
-- Name: pk_providers_idprovider; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY phone_providers
    ADD CONSTRAINT pk_providers_idprovider PRIMARY KEY (idprovider);


--
-- TOC entry 2583 (class 2606 OID 42814)
-- Name: pk_tables_changed_name; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY sys_table_ts
    ADD CONSTRAINT pk_tables_changed_name PRIMARY KEY (table_name);


--
-- TOC entry 2532 (class 2606 OID 42816)
-- Name: pk_technicals_idtechnical; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY account_technicals
    ADD CONSTRAINT pk_technicals_idtechnical PRIMARY KEY (idtechnical);


--
-- TOC entry 2626 (class 2606 OID 3893628)
-- Name: providers_admin_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY providers
    ADD CONSTRAINT providers_admin_username_key UNIQUE (admin_username);


--
-- TOC entry 2628 (class 2606 OID 3893630)
-- Name: providers_first_name_last_name_identification_ididtype_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY providers
    ADD CONSTRAINT providers_first_name_last_name_identification_ididtype_key UNIQUE (first_name, last_name, identification, ididtype);


--
-- TOC entry 2630 (class 2606 OID 3893626)
-- Name: providers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY providers
    ADD CONSTRAINT providers_pkey PRIMARY KEY (idcontact);


--
-- TOC entry 2526 (class 2606 OID 2441970)
-- Name: uniq_account_contacts_idcontact; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY account_contacts
    ADD CONSTRAINT uniq_account_contacts_idcontact UNIQUE (idaccount, idcontact);


--
-- TOC entry 2591 (class 2606 OID 2443430)
-- Name: uniq_account_idaccounttype; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY accounts
    ADD CONSTRAINT uniq_account_idaccounttype UNIQUE (account, idaccounttype);


--
-- TOC entry 2530 (class 2606 OID 42824)
-- Name: uniq_account_states_state; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY account_states
    ADD CONSTRAINT uniq_account_states_state UNIQUE (state);


--
-- TOC entry 2536 (class 2606 OID 42826)
-- Name: uniq_account_type_type; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY account_types
    ADD CONSTRAINT uniq_account_type_type UNIQUE (type);


--
-- TOC entry 2503 (class 2606 OID 2442207)
-- Name: uniq_contact_adminusername; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY contacts
    ADD CONSTRAINT uniq_contact_adminusername UNIQUE (admin_username);


--
-- TOC entry 2505 (class 2606 OID 2442963)
-- Name: uniq_contacts_fname_lname_identification_ididtype; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY contacts
    ADD CONSTRAINT uniq_contacts_fname_lname_identification_ididtype UNIQUE (first_name, last_name, identification, ididtype);


--
-- TOC entry 2542 (class 2606 OID 42830)
-- Name: uniq_contacts_groups_groups; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY contacts_groups
    ADD CONSTRAINT uniq_contacts_groups_groups UNIQUE (idcontact, idgroup);


--
-- TOC entry 2546 (class 2606 OID 5363803)
-- Name: uniq_email_idcontact_email; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY emails
    ADD CONSTRAINT uniq_email_idcontact_email UNIQUE (idcontact, email);


--
-- TOC entry 2550 (class 2606 OID 42834)
-- Name: uniq_equipments_cod_ref; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY equipments
    ADD CONSTRAINT uniq_equipments_cod_ref UNIQUE (code_ref);


--
-- TOC entry 2552 (class 2606 OID 42836)
-- Name: uniq_equipments_serial_number; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY equipments
    ADD CONSTRAINT uniq_equipments_serial_number UNIQUE (equipment, mark, serial_number);


--
-- TOC entry 2556 (class 2606 OID 42838)
-- Name: uniq_event_comments_attach; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY event_comments_attachments
    ADD CONSTRAINT uniq_event_comments_attach UNIQUE (idevent, idattachment);


--
-- TOC entry 2512 (class 2606 OID 3886365)
-- Name: uniq_events_idaccount_idevettype_zu; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY events
    ADD CONSTRAINT uniq_events_idaccount_idevettype_zu UNIQUE (dateevent, idaccount, ideventtype, zu);


--
-- TOC entry 2517 (class 2606 OID 42842)
-- Name: uniq_eventtypes_code; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY eventtypes
    ADD CONSTRAINT uniq_eventtypes_code UNIQUE (code);


--
-- TOC entry 2519 (class 2606 OID 42844)
-- Name: uniq_eventtypes_label; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY eventtypes
    ADD CONSTRAINT uniq_eventtypes_label UNIQUE (label);


--
-- TOC entry 2521 (class 2606 OID 42846)
-- Name: uniq_eventtypes_name; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY eventtypes
    ADD CONSTRAINT uniq_eventtypes_name UNIQUE (name);


--
-- TOC entry 2563 (class 2606 OID 42848)
-- Name: uniq_group_name; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY groups
    ADD CONSTRAINT uniq_group_name UNIQUE (name);


--
-- TOC entry 2577 (class 2606 OID 3954120)
-- Name: uniq_idcontact_phone_ext; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY phones
    ADD CONSTRAINT uniq_idcontact_phone_ext UNIQUE (idcontact, number, note);


--
-- TOC entry 2567 (class 2606 OID 42850)
-- Name: uniq_identification_types_name; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY identification_types
    ADD CONSTRAINT uniq_identification_types_name UNIQUE (name);


--
-- TOC entry 2573 (class 2606 OID 42852)
-- Name: uniq_phone_types_type; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY phone_types
    ADD CONSTRAINT uniq_phone_types_type UNIQUE (type);


--
-- TOC entry 2581 (class 2606 OID 42856)
-- Name: uniq_providers_provider; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY phone_providers
    ADD CONSTRAINT uniq_providers_provider UNIQUE (provider);


--
-- TOC entry 2506 (class 1259 OID 4813102)
-- Name: events_index_ideventtype_idaccount_zu_status; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_index_ideventtype_idaccount_zu_status ON events USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 2930 (class 0 OID 0)
-- Dependencies: 2506
-- Name: INDEX events_index_ideventtype_idaccount_zu_status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON INDEX events_index_ideventtype_idaccount_zu_status IS 'Para solventar este script lento

ideventtype = iideventtype AND idaccount = iidaccount AND zu = izu AND status IN(0, 4, 5) ';


--
-- TOC entry 2618 (class 1259 OID 4814359)
-- Name: events_index_ideventtype_idaccount_zu_status_edpt; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_index_ideventtype_idaccount_zu_status_edpt ON events_device_uptime USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 2597 (class 1259 OID 4814365)
-- Name: events_index_ideventtype_idaccount_zu_status_ej; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_index_ideventtype_idaccount_zu_status_ej ON events_jobs USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 2608 (class 1259 OID 4814356)
-- Name: events_index_ideventtype_idaccount_zu_status_events_dbsizes; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_index_ideventtype_idaccount_zu_status_events_dbsizes ON events_dbsizes USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 2615 (class 1259 OID 4814362)
-- Name: events_index_ideventtype_idaccount_zu_status_events_diskspace; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX events_index_ideventtype_idaccount_zu_status_events_diskspace ON events_diskspace USING btree (status, idaccount, ideventtype, zu);


--
-- TOC entry 2588 (class 1259 OID 3885282)
-- Name: index_account_account; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_account_account ON accounts USING btree (account);


--
-- TOC entry 2522 (class 1259 OID 4012980)
-- Name: index_account_contacts_appointment; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_account_contacts_appointment ON account_contacts USING btree (appointment) WHERE (appointment = 'oams_assigned'::text);


--
-- TOC entry 2596 (class 1259 OID 4012981)
-- Name: index_account_users_appointment; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_account_users_appointment ON account_users USING btree (appointment) WHERE (appointment = 'oams_assigned'::text);


--
-- TOC entry 2589 (class 1259 OID 4012691)
-- Name: index_accounts_account; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_accounts_account ON accounts USING btree (account);


--
-- TOC entry 2498 (class 1259 OID 5180915)
-- Name: index_contacts_admin_sessionid; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_contacts_admin_sessionid ON contacts USING btree (admin_username, admin_sessionid) WHERE (is_admin = true);


--
-- TOC entry 2499 (class 1259 OID 4012982)
-- Name: index_contacts_username_pwd; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_contacts_username_pwd ON contacts USING btree (admin_username, admin_pwd) WHERE (is_admin = true);


--
-- TOC entry 2557 (class 1259 OID 5342508)
-- Name: index_ec_idevent; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_ec_idevent ON event_comments USING btree (idevent);


--
-- TOC entry 2609 (class 1259 OID 5342578)
-- Name: index_edbs_idaccount; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_edbs_idaccount ON events_dbsizes USING btree (idaccount);


--
-- TOC entry 2616 (class 1259 OID 5342584)
-- Name: index_eds_idaccount; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_eds_idaccount ON events_diskspace USING btree (idaccount);


--
-- TOC entry 2623 (class 1259 OID 5342581)
-- Name: index_edu_idaccount; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_edu_idaccount ON events_device_uptime USING btree (idaccount);


--
-- TOC entry 2602 (class 1259 OID 5342587)
-- Name: index_ej_idaccount; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_ej_idaccount ON events_jobs USING btree (idaccount);


--
-- TOC entry 2610 (class 1259 OID 3985343)
-- Name: index_events_dbsizes_status; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_dbsizes_status ON events_dbsizes USING btree (status) WHERE (status = 0);


--
-- TOC entry 2617 (class 1259 OID 3985344)
-- Name: index_events_diskspace_status; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_diskspace_status ON events_diskspace USING btree (status) WHERE (status = 0);


--
-- TOC entry 2624 (class 1259 OID 3986698)
-- Name: index_events_dut; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_dut ON events_device_uptime USING btree (status) WHERE (status = 0);


--
-- TOC entry 2507 (class 1259 OID 5253651)
-- Name: index_events_idaccount; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_idaccount ON events USING btree (idaccount);


--
-- TOC entry 2603 (class 1259 OID 3985528)
-- Name: index_events_jobs_status; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_jobs_status ON events_jobs USING btree (status) WHERE (status = 0);


--
-- TOC entry 2508 (class 1259 OID 3985342)
-- Name: index_events_status; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_events_status ON events USING btree (status) WHERE (status = 0);


--
-- TOC entry 2513 (class 1259 OID 4012927)
-- Name: index_eventtypes; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX index_eventtypes ON eventtypes USING btree (code);


--
-- TOC entry 2651 (class 2620 OID 2443356)
-- Name: 1_update_ts; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "1_update_ts" BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2931 (class 0 OID 0)
-- Dependencies: 2651
-- Name: TRIGGER "1_update_ts" ON contacts; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER "1_update_ts" ON contacts IS 'Actualiza el ts cuando un registro es actualizado';


--
-- TOC entry 2692 (class 2620 OID 2443399)
-- Name: 1_update_ts; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "1_update_ts" BEFORE UPDATE ON accounts FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2932 (class 0 OID 0)
-- Dependencies: 2692
-- Name: TRIGGER "1_update_ts" ON accounts; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER "1_update_ts" ON accounts IS 'Actualiza el ts cuando un registro es actualizado';


--
-- TOC entry 2709 (class 2620 OID 5363508)
-- Name: 1on_insert_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "1on_insert_update" BEFORE INSERT OR UPDATE ON network_devices FOR EACH ROW EXECUTE PROCEDURE equipment_insert_update();


--
-- TOC entry 2693 (class 2620 OID 2443400)
-- Name: 2_on_insert_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "2_on_insert_update" BEFORE INSERT OR UPDATE OF identification, is_admin, admin_username, admin_pwd ON accounts FOR EACH ROW EXECUTE PROCEDURE contacts_insert_update();


--
-- TOC entry 2652 (class 2620 OID 2443726)
-- Name: 2_on_insert_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "2_on_insert_update" BEFORE INSERT OR UPDATE OF identification, is_admin, admin_username ON contacts FOR EACH ROW EXECUTE PROCEDURE contacts_insert_update();


--
-- TOC entry 2694 (class 2620 OID 2443428)
-- Name: 3_on_insert_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "3_on_insert_update" BEFORE INSERT OR UPDATE OF idaccounttype, account ON accounts FOR EACH ROW EXECUTE PROCEDURE accounts_insert_update();


--
-- TOC entry 2683 (class 2620 OID 3952668)
-- Name: before_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER before_insert BEFORE INSERT ON notification_area FOR EACH ROW EXECUTE PROCEDURE notifications_before_insert();


--
-- TOC entry 2677 (class 2620 OID 120642)
-- Name: on_before_insert_comment; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_before_insert_comment BEFORE INSERT ON event_comments FOR EACH ROW EXECUTE PROCEDURE event_comments_before_insert_redirect_partition();


--
-- TOC entry 2657 (class 2620 OID 119486)
-- Name: on_before_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_before_insert_event BEFORE INSERT ON events FOR EACH ROW EXECUTE PROCEDURE events_before_insert_redirect_partition();


--
-- TOC entry 2933 (class 0 OID 0)
-- Dependencies: 2657
-- Name: TRIGGER on_before_insert_event ON events; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER on_before_insert_event ON events IS 'Se dispara cuando se trata de insertar un evento y se redirige a la tabla que le corresponde segun la particion.';


--
-- TOC entry 2699 (class 2620 OID 3886546)
-- Name: on_before_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_before_insert_event BEFORE INSERT ON events_jobs FOR EACH ROW EXECUTE PROCEDURE events_before_insert_redirect_partition();


--
-- TOC entry 2702 (class 2620 OID 3887189)
-- Name: on_before_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_before_insert_event BEFORE INSERT ON events_dbsizes FOR EACH ROW EXECUTE PROCEDURE events_before_insert_redirect_partition();


--
-- TOC entry 2934 (class 0 OID 0)
-- Dependencies: 2702
-- Name: TRIGGER on_before_insert_event ON events_dbsizes; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER on_before_insert_event ON events_dbsizes IS 'Se dispara cuando se trata de insertar un evento y se redirige a la tabla que le corresponde segun la particion.';


--
-- TOC entry 2703 (class 2620 OID 3887236)
-- Name: on_before_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_before_insert_event BEFORE INSERT ON events_diskspace FOR EACH ROW EXECUTE PROCEDURE events_before_insert_redirect_partition();


--
-- TOC entry 2708 (class 2620 OID 3887265)
-- Name: on_before_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_before_insert_event BEFORE INSERT ON events_device_uptime FOR EACH ROW EXECUTE PROCEDURE events_before_insert_redirect_partition();


--
-- TOC entry 2935 (class 0 OID 0)
-- Dependencies: 2708
-- Name: TRIGGER on_before_insert_event ON events_device_uptime; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER on_before_insert_event ON events_device_uptime IS 'Se dispara cuando se trata de insertar un evento y se redirige a la tabla que le corresponde segun la particion.';


--
-- TOC entry 2662 (class 2620 OID 42857)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON account_states FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2936 (class 0 OID 0)
-- Dependencies: 2662
-- Name: TRIGGER on_changed_table ON account_states; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER on_changed_table ON account_states IS 'Actualiza la tabla sys_table_ts cuando un cambio en la tabla actual es realizado. ';


--
-- TOC entry 2664 (class 2620 OID 42858)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON account_types FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2666 (class 2620 OID 42859)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON attachments FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2650 (class 2620 OID 42860)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON contacts FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2670 (class 2620 OID 42861)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON emails FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2678 (class 2620 OID 42862)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON event_comments FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2654 (class 2620 OID 42863)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2658 (class 2620 OID 42864)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON eventtypes FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2679 (class 2620 OID 42865)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON groups FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2681 (class 2620 OID 42866)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON identification_types FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2686 (class 2620 OID 42867)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON phone_types FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2688 (class 2620 OID 42868)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON phones FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2690 (class 2620 OID 42869)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON phone_providers FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2684 (class 2620 OID 42870)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON notification_area FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2672 (class 2620 OID 42871)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON equipments FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2660 (class 2620 OID 42872)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON account_contacts FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2668 (class 2620 OID 42873)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON contacts_groups FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2675 (class 2620 OID 42874)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON event_comments_attachments FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2695 (class 2620 OID 2443401)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON accounts FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2696 (class 2620 OID 3886497)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_jobs FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2700 (class 2620 OID 3887187)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_dbsizes FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2704 (class 2620 OID 3887234)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_diskspace FOR EACH ROW EXECUTE PROCEDURE on_changed_table();


--
-- TOC entry 2706 (class 2620 OID 3887263)
-- Name: on_changed_table; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_changed_table AFTER INSERT OR DELETE OR UPDATE ON events_device_uptime FOR EACH ROW EXECUTE PROCEDURE on_changed_table();

ALTER TABLE events_device_uptime DISABLE TRIGGER on_changed_table;


--
-- TOC entry 2655 (class 2620 OID 2447072)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 2697 (class 2620 OID 3886547)
-- Name: on_insert_event; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_event AFTER INSERT ON events_jobs FOR EACH ROW EXECUTE PROCEDURE events_on_insert();


--
-- TOC entry 2674 (class 2620 OID 3885082)
-- Name: on_insert_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert_update BEFORE INSERT OR UPDATE ON equipments FOR EACH ROW EXECUTE PROCEDURE equipment_insert_update();


--
-- TOC entry 2937 (class 0 OID 0)
-- Dependencies: 2674
-- Name: TRIGGER on_insert_update ON equipments; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER on_insert_update ON equipments IS 'Valida datos antes de insertar o actualkizar';


--
-- TOC entry 2653 (class 2620 OID 2443725)
-- Name: on_update_admin_pwd; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_admin_pwd BEFORE UPDATE OF admin_pwd ON contacts FOR EACH ROW EXECUTE PROCEDURE contacts_update_admin_pwd();


--
-- TOC entry 2663 (class 2620 OID 42880)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON account_states FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2938 (class 0 OID 0)
-- Dependencies: 2663
-- Name: TRIGGER on_update_row ON account_states; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER on_update_row ON account_states IS 'Actualiza el ts cuando un campo es actualizado.';


--
-- TOC entry 2665 (class 2620 OID 42881)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON account_types FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2667 (class 2620 OID 42882)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON attachments FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2671 (class 2620 OID 42884)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON emails FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2659 (class 2620 OID 42887)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON eventtypes FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2680 (class 2620 OID 42888)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON groups FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2682 (class 2620 OID 42889)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON identification_types FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2687 (class 2620 OID 42890)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON phone_types FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2689 (class 2620 OID 42891)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON phones FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2691 (class 2620 OID 42892)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON phone_providers FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2685 (class 2620 OID 42893)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON notification_area FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2673 (class 2620 OID 42894)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON equipments FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2661 (class 2620 OID 42895)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON account_contacts FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2669 (class 2620 OID 42896)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON contacts_groups FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2676 (class 2620 OID 42897)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON event_comments_attachments FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2656 (class 2620 OID 2447073)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2698 (class 2620 OID 3886498)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_jobs FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2701 (class 2620 OID 3887188)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_dbsizes FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2705 (class 2620 OID 3887235)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_diskspace FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();


--
-- TOC entry 2707 (class 2620 OID 3887264)
-- Name: on_update_row; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update_row BEFORE UPDATE ON events_device_uptime FOR EACH ROW EXECUTE PROCEDURE on_update_row_update_ts();

ALTER TABLE events_device_uptime DISABLE TRIGGER on_update_row;


--
-- TOC entry 2643 (class 2606 OID 42921)
-- Name: fk_contacts_groups_idgroup_groups; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY contacts_groups
    ADD CONSTRAINT fk_contacts_groups_idgroup_groups FOREIGN KEY (idgroup) REFERENCES groups(idgroup) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2641 (class 2606 OID 42926)
-- Name: fk_contacts_ididtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY contacts
    ADD CONSTRAINT fk_contacts_ididtype FOREIGN KEY (ididtype) REFERENCES identification_types(ididtype);


--
-- TOC entry 2644 (class 2606 OID 2443273)
-- Name: fk_equipments_idaccount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY equipments
    ADD CONSTRAINT fk_equipments_idaccount FOREIGN KEY (idaccount) REFERENCES accounts(idcontact) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 2647 (class 2606 OID 5342544)
-- Name: fk_event_comm_idevent; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY event_comments
    ADD CONSTRAINT fk_event_comm_idevent FOREIGN KEY (idevent) REFERENCES events(idevent) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2645 (class 2606 OID 42936)
-- Name: fk_event_comments_attach_idattach; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY event_comments_attachments
    ADD CONSTRAINT fk_event_comments_attach_idattach FOREIGN KEY (idattachment) REFERENCES attachments(idattachment) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2646 (class 2606 OID 42941)
-- Name: fk_event_comments_attach_idevent; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY event_comments_attachments
    ADD CONSTRAINT fk_event_comments_attach_idevent FOREIGN KEY (idevent) REFERENCES events(idevent) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2642 (class 2606 OID 42966)
-- Name: fk_events_ideventtype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY events
    ADD CONSTRAINT fk_events_ideventtype FOREIGN KEY (ideventtype) REFERENCES eventtypes(ideventtype) ON UPDATE CASCADE ON DELETE SET DEFAULT;


--
-- TOC entry 2648 (class 2606 OID 42971)
-- Name: fk_phones_idphonetype; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY phones
    ADD CONSTRAINT fk_phones_idphonetype FOREIGN KEY (idphonetype) REFERENCES phone_types(idphonetype) ON UPDATE CASCADE ON DELETE SET DEFAULT;


--
-- TOC entry 2649 (class 2606 OID 42976)
-- Name: fk_phones_idprovider; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY phones
    ADD CONSTRAINT fk_phones_idprovider FOREIGN KEY (idprovider) REFERENCES phone_providers(idprovider) ON UPDATE CASCADE ON DELETE SET DEFAULT;


-- Completed on 2015-11-03 10:46:51 ECT

--
-- PostgreSQL database dump complete
--

