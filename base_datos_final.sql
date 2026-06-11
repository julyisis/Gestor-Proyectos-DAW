--
-- PostgreSQL database dump
--

\restrict ApXfvZgxD79FxL65DP5KryIBCREUxLZbE0OQIo2AexoXmeru9dfbEhb5fpCF0Bb

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: clientes_estado_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.clientes_estado_enum AS ENUM (
    'ACTIVO',
    'BAJA'
);


ALTER TYPE public.clientes_estado_enum OWNER TO postgres;

--
-- Name: estados_usuarios; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estados_usuarios AS ENUM (
    'ACTIVO',
    'BAJA'
);


ALTER TYPE public.estados_usuarios OWNER TO postgres;

--
-- Name: proyectos_estado_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.proyectos_estado_enum AS ENUM (
    'ACTIVO',
    'FINALIZADO',
    'BAJA'
);


ALTER TYPE public.proyectos_estado_enum OWNER TO postgres;

--
-- Name: tareas_estado_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tareas_estado_enum AS ENUM (
    'PENDIENTE',
    'FINALIZADO',
    'BAJA'
);


ALTER TYPE public.tareas_estado_enum OWNER TO postgres;

--
-- Name: usuarios_estado_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.usuarios_estado_enum AS ENUM (
    'ACTIVO',
    'BAJA'
);


ALTER TYPE public.usuarios_estado_enum OWNER TO postgres;

--
-- Name: usuarios_rol_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.usuarios_rol_enum AS ENUM (
    'user',
    'admin'
);


ALTER TYPE public.usuarios_rol_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: clientes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clientes (
    id integer NOT NULL,
    estado public.clientes_estado_enum DEFAULT 'ACTIVO'::public.clientes_estado_enum NOT NULL,
    "nombreCliente" character varying NOT NULL,
    telefono character varying,
    email character varying
);


ALTER TABLE public.clientes OWNER TO postgres;

--
-- Name: clientes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clientes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clientes_id_seq OWNER TO postgres;

--
-- Name: clientes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clientes_id_seq OWNED BY public.clientes.id;


--
-- Name: proyectos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.proyectos (
    id integer NOT NULL,
    estado public.proyectos_estado_enum DEFAULT 'ACTIVO'::public.proyectos_estado_enum NOT NULL,
    "nombreProyecto" character varying NOT NULL,
    "clienteId" integer
);


ALTER TABLE public.proyectos OWNER TO postgres;

--
-- Name: proyectos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.proyectos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.proyectos_id_seq OWNER TO postgres;

--
-- Name: proyectos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.proyectos_id_seq OWNED BY public.proyectos.id;


--
-- Name: tareas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tareas (
    id integer NOT NULL,
    descripcion text NOT NULL,
    estado public.tareas_estado_enum DEFAULT 'PENDIENTE'::public.tareas_estado_enum NOT NULL,
    "proyectoId" integer
);


ALTER TABLE public.tareas OWNER TO postgres;

--
-- Name: tareas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tareas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tareas_id_seq OWNER TO postgres;

--
-- Name: tareas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tareas_id_seq OWNED BY public.tareas.id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    "nombreUsuario" character varying NOT NULL,
    estado public.usuarios_estado_enum DEFAULT 'ACTIVO'::public.usuarios_estado_enum NOT NULL,
    password character varying CONSTRAINT usuarios_clave_not_null NOT NULL,
    rol public.usuarios_rol_enum DEFAULT 'user'::public.usuarios_rol_enum CONSTRAINT usuarios_role_not_null NOT NULL
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: clientes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes ALTER COLUMN id SET DEFAULT nextval('public.clientes_id_seq'::regclass);


--
-- Name: proyectos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyectos ALTER COLUMN id SET DEFAULT nextval('public.proyectos_id_seq'::regclass);


--
-- Name: tareas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tareas ALTER COLUMN id SET DEFAULT nextval('public.tareas_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Data for Name: clientes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clientes (id, estado, "nombreCliente", telefono, email) FROM stdin;
1	ACTIVO	juli Gutierrez	\N	\N
3	ACTIVO	Empresa Bodega Juli	\N	\N
6	ACTIVO	Cliente Test	\N	\N
8	BAJA	Cliente Bodega 2	\N	\N
10	ACTIVO	Test API Cliente	\N	\N
\.


--
-- Data for Name: proyectos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.proyectos (id, estado, "nombreProyecto", "clienteId") FROM stdin;
2	ACTIVO	Control de Stock DAW	1
\.


--
-- Data for Name: tareas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tareas (id, descripcion, estado, "proyectoId") FROM stdin;
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, "nombreUsuario", estado, password, rol) FROM stdin;
1	juli_admin	ACTIVO	$2b$10$bpJST/CQoLz.XKflaMZJbeOppYIK37gRZqvV95wscfYtHw.cvXtNm	admin
4	juli_gutierrez	ACTIVO	$2b$10$ScMMkGFvSvqM4577GQVyC.BkooQlWYXxQinkh..VpxYQT2A1FHjhm	admin
\.


--
-- Name: clientes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.clientes_id_seq', 10, true);


--
-- Name: proyectos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.proyectos_id_seq', 2, true);


--
-- Name: tareas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tareas_id_seq', 1, false);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 4, true);


--
-- Name: usuarios PK_d7281c63c176e152e4c531594a8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY (id);


--
-- Name: clientes UQ_959daa0558cd996e88511a0532c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT "UQ_959daa0558cd996e88511a0532c" UNIQUE ("nombreCliente");


--
-- Name: usuarios UQ_b948c9bc89671151c8ab12d409d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT "UQ_b948c9bc89671151c8ab12d409d" UNIQUE ("nombreUsuario");


--
-- Name: proyectos UQ_df8e581ba7faf683bf7b1a8d90e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyectos
    ADD CONSTRAINT "UQ_df8e581ba7faf683bf7b1a8d90e" UNIQUE ("nombreProyecto");


--
-- Name: clientes clientes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_pkey PRIMARY KEY (id);


--
-- Name: proyectos proyectos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyectos
    ADD CONSTRAINT proyectos_pkey PRIMARY KEY (id);


--
-- Name: tareas tareas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tareas
    ADD CONSTRAINT tareas_pkey PRIMARY KEY (id);


--
-- Name: tareas FK_616e0a706d4308df7dc8addc87a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tareas
    ADD CONSTRAINT "FK_616e0a706d4308df7dc8addc87a" FOREIGN KEY ("proyectoId") REFERENCES public.proyectos(id);


--
-- Name: proyectos FK_e3c8dbc966209b56cc53c81ddb1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyectos
    ADD CONSTRAINT "FK_e3c8dbc966209b56cc53c81ddb1" FOREIGN KEY ("clienteId") REFERENCES public.clientes(id);


--
-- PostgreSQL database dump complete
--

\unrestrict ApXfvZgxD79FxL65DP5KryIBCREUxLZbE0OQIo2AexoXmeru9dfbEhb5fpCF0Bb

