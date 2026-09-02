--
-- PostgreSQL database dump
--

\restrict rR3GZ7ftt4p9KqEuKz3HsboohY2bKnoHiMpRvclGFCKIaEDHp1emtXS3f4t4D56

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum_orders_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_orders_status AS ENUM (
    'pendiente',
    'en_transito',
    'entregada'
);


--
-- Name: enum_users_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_users_role AS ENUM (
    'Admin',
    'Analyst'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: addresses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.addresses (
    id uuid NOT NULL,
    client_id uuid NOT NULL,
    address_line character varying(255) NOT NULL,
    city character varying(255) NOT NULL,
    reference character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: clients; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.clients (
    id uuid NOT NULL,
    document_id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_items (
    id uuid NOT NULL,
    order_id uuid NOT NULL,
    product_id uuid NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id uuid NOT NULL,
    client_id uuid NOT NULL,
    warehouse_id uuid NOT NULL,
    status public.enum_orders_status DEFAULT 'pendiente'::public.enum_orders_status NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: product_warehouses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_warehouses (
    id uuid NOT NULL,
    product_id uuid NOT NULL,
    warehouse_id uuid NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id uuid NOT NULL,
    code character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    price numeric(10,2) NOT NULL,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role public.enum_users_role NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: warehouses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.warehouses (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    location character varying(255) NOT NULL,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.addresses (id, client_id, address_line, city, reference, "createdAt", "updatedAt") FROM stdin;
a04af2fd-d06b-42f4-98fd-ce6b492fae07	30cbd660-39e0-4453-9d76-9b1f621b57e5	Calle 45 # 12-34	Bogota	Cerca al parque principal	2026-09-01 22:28:41.84+00	2026-09-01 22:28:41.84+00
24e29632-8f4e-4827-964c-009b81869b55	1eac45e4-6902-4d88-b212-5cab06b8fe4f	Carrera 10 # 20-15	Medellin	Edificio Torre Azul, apto 502	2026-09-01 22:28:41.845+00	2026-09-01 22:28:41.845+00
\.


--
-- Data for Name: clients; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.clients (id, document_id, name, email, "createdAt", "updatedAt") FROM stdin;
30cbd660-39e0-4453-9d76-9b1f621b57e5	1000123456	Laura Gomez	laura.gomez@example.com	2026-09-01 22:28:41.837+00	2026-09-01 22:28:41.837+00
1eac45e4-6902-4d88-b212-5cab06b8fe4f	1000654321	Carlos Ramirez	carlos.ramirez@example.com	2026-09-01 22:28:41.843+00	2026-09-01 22:28:41.843+00
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_items (id, order_id, product_id, quantity, unit_price, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders (id, client_id, warehouse_id, status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: product_warehouses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_warehouses (id, product_id, warehouse_id, stock, "createdAt", "updatedAt") FROM stdin;
1dddc60c-5b47-4d04-8de5-48a8e9c0d3ff	98841591-cd04-4c66-9db0-4ce9a9cbd5e8	c2034fd9-c83d-45da-8996-fbc6ae0c043e	50	2026-09-01 22:28:41.823+00	2026-09-01 22:28:41.823+00
0dbc4fa8-c281-4fe5-8f6b-fde408742f40	98841591-cd04-4c66-9db0-4ce9a9cbd5e8	35642c9d-c6b9-4450-a3e9-b74ce45cb2a8	20	2026-09-01 22:28:41.827+00	2026-09-01 22:28:41.827+00
fd4bb022-238e-4f62-8d24-e92ca2006c47	5b031700-2fea-4ff7-b1e2-aac15fbe3b51	c2034fd9-c83d-45da-8996-fbc6ae0c043e	15	2026-09-01 22:28:41.829+00	2026-09-01 22:28:41.829+00
82152756-3ee1-41c3-bde9-ac40405489ce	5b031700-2fea-4ff7-b1e2-aac15fbe3b51	35642c9d-c6b9-4450-a3e9-b74ce45cb2a8	0	2026-09-01 22:28:41.832+00	2026-09-01 22:28:41.832+00
361bd66a-7f01-4dc1-b7ba-445eda412cf2	9f1541ab-a869-4828-81e7-68ad34a7b342	35642c9d-c6b9-4450-a3e9-b74ce45cb2a8	8	2026-09-01 22:28:41.834+00	2026-09-01 22:28:41.834+00
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products (id, code, name, description, price, active, "createdAt", "updatedAt") FROM stdin;
98841591-cd04-4c66-9db0-4ce9a9cbd5e8	PRD-001	Caja de herramientas	Caja metalica 20 piezas	45.50	t	2026-09-01 22:28:41.815+00	2026-09-01 22:28:41.815+00
5b031700-2fea-4ff7-b1e2-aac15fbe3b51	PRD-002	Router WiFi	Router doble banda	89.90	t	2026-09-01 22:28:41.818+00	2026-09-01 22:28:41.818+00
9f1541ab-a869-4828-81e7-68ad34a7b342	PRD-003	Silla ergonomica	Silla de oficina ajustable	120.00	t	2026-09-01 22:28:41.82+00	2026-09-01 22:28:41.82+00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, email, password, role, "createdAt", "updatedAt") FROM stdin;
75ceafa9-ad26-4bc1-8c9a-f0b328a3d70f	Admin FHL	admin@fhl.com	$2a$10$UALpqrncTrBIcSlyRIPW1OKouuBRstYzWgltpctkmWp2v6RSoYcGu	Admin	2026-09-01 22:28:41.796+00	2026-09-01 22:28:41.796+00
6cd54613-051b-47f7-abaa-ff521fda173c	Analista FHL	analista@fhl.com	$2a$10$UALpqrncTrBIcSlyRIPW1OKouuBRstYzWgltpctkmWp2v6RSoYcGu	Analyst	2026-09-01 22:28:41.804+00	2026-09-01 22:28:41.804+00
aefa7f8c-d4a9-4354-ab76-9a49f1596236	Juan	Juan@correo.com	$2a$10$bJrRLFKBdARwxe8NMkR8puUXiCzdbibQGOwOER/DnTtM.d9sBySIG	Admin	2026-09-02 00:18:50.117+00	2026-09-02 00:18:50.117+00
\.


--
-- Data for Name: warehouses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.warehouses (id, name, location, active, "createdAt", "updatedAt") FROM stdin;
c2034fd9-c83d-45da-8996-fbc6ae0c043e	Bodega Norte	Zona Industrial Norte	t	2026-09-01 22:28:41.809+00	2026-09-01 22:28:41.809+00
35642c9d-c6b9-4450-a3e9-b74ce45cb2a8	Bodega Sur	Zona Industrial Sur	t	2026-09-01 22:28:41.812+00	2026-09-01 22:28:41.812+00
\.


--
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);


--
-- Name: clients clients_document_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_document_id_key UNIQUE (document_id);


--
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: product_warehouses product_warehouses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_warehouses
    ADD CONSTRAINT product_warehouses_pkey PRIMARY KEY (id);


--
-- Name: product_warehouses product_warehouses_product_id_warehouse_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_warehouses
    ADD CONSTRAINT product_warehouses_product_id_warehouse_id_key UNIQUE (product_id, warehouse_id);


--
-- Name: products products_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_code_key UNIQUE (code);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: warehouses warehouses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.warehouses
    ADD CONSTRAINT warehouses_pkey PRIMARY KEY (id);


--
-- Name: product_warehouses_product_id_warehouse_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX product_warehouses_product_id_warehouse_id ON public.product_warehouses USING btree (product_id, warehouse_id);


--
-- Name: addresses addresses_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: orders orders_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: orders orders_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_warehouses product_warehouses_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_warehouses
    ADD CONSTRAINT product_warehouses_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_warehouses product_warehouses_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_warehouses
    ADD CONSTRAINT product_warehouses_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict rR3GZ7ftt4p9KqEuKz3HsboohY2bKnoHiMpRvclGFCKIaEDHp1emtXS3f4t4D56

