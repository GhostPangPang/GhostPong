--
-- PostgreSQL database dump
--

-- Dumped from database version 14.7 (Homebrew)
-- Dumped by pg_dump version 14.7 (Homebrew)

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
-- Name: auth_status_enum; Type: TYPE; Schema: public;
--

CREATE TYPE public.auth_status_enum AS ENUM (
    'REGISTERD',
    'UNREGISTERD'
);



SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: achievement; Type: TABLE; Schema: public;
--

CREATE TABLE public.achievement (
    achievement integer NOT NULL,
    user_id integer NOT NULL
);


--
-- Name: auth; Type: TABLE; Schema: public;
--

CREATE TABLE public.auth (
    id integer NOT NULL,
    email character varying(320) NOT NULL,
    two_fa character varying(320),
    status public.auth_status_enum DEFAULT 'UNREGISTERD'::public.auth_status_enum NOT NULL
);


--
-- Name: auth_id_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE public.auth_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: auth_id_seq; Type: SEQUENCE OWNED BY; Schema: public;
--

ALTER SEQUENCE public.auth_id_seq OWNED BY public.auth.id;


--
-- Name: blocked_user; Type: TABLE; Schema: public;

CREATE TABLE public.blocked_user (
    user_id integer NOT NULL,
    blocked_user_id integer NOT NULL
);



--
-- Name: friendship; Type: TABLE; Schema: public;
--

CREATE TABLE public.friendship (
    id integer NOT NULL,
    accept boolean DEFAULT false NOT NULL,
    last_messege_time timestamp without time zone DEFAULT '-infinity'::timestamp without time zone NOT NULL,
    sender_id integer,
    receiver_id integer
);


--
-- Name: friendship_id_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE public.friendship_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: friendship_id_seq; Type: SEQUENCE OWNED BY; Schema: public;
--

ALTER SEQUENCE public.friendship_id_seq OWNED BY public.friendship.id;


--
-- Name: game_history; Type: TABLE; Schema: public;
--

CREATE TABLE public.game_history (
    id integer NOT NULL,
    winner_score integer NOT NULL,
    loser_score integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    winner_id integer,
    loser_id integer
);



--
-- Name: game_history_id_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE public.game_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: game_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public;
--

ALTER SEQUENCE public.game_history_id_seq OWNED BY public.game_history.id;


--
-- Name: message; Type: TABLE; Schema: public;
--

CREATE TABLE public.message (
    id integer NOT NULL,
    contents character varying(512) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    sender_id integer,
    friend_id integer
);



--
-- Name: message_id_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE public.message_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: message_id_seq; Type: SEQUENCE OWNED BY; Schema: public;
--

ALTER SEQUENCE public.message_id_seq OWNED BY public.message.id;


--
-- Name: message_view; Type: TABLE; Schema: public;
--

CREATE TABLE public.message_view (
    user_id integer NOT NULL,
    friend_id integer NOT NULL,
    last_view_time timestamp without time zone DEFAULT '-infinity'::timestamp without time zone NOT NULL
);



--
-- Name: user_record; Type: TABLE; Schema: public;
--

CREATE TABLE public.user_record (
    id integer NOT NULL,
    win_count integer DEFAULT 0 NOT NULL,
    lose_count integer DEFAULT 0 NOT NULL
);



--
-- Name: users; Type: TABLE; Schema: public;
--

CREATE TABLE public.users (
    id integer NOT NULL,
    nickname character varying(8) NOT NULL,
    exp integer DEFAULT 0 NOT NULL,
    image character varying(256) NOT NULL
);


--
-- Name: auth id; Type: DEFAULT; Schema: public;
--

ALTER TABLE ONLY public.auth ALTER COLUMN id SET DEFAULT nextval('public.auth_id_seq'::regclass);


--
-- Name: friendship id; Type: DEFAULT; Schema: public;
--

ALTER TABLE ONLY public.friendship ALTER COLUMN id SET DEFAULT nextval('public.friendship_id_seq'::regclass);


--
-- Name: game_history id; Type: DEFAULT; Schema: public;
--

ALTER TABLE ONLY public.game_history ALTER COLUMN id SET DEFAULT nextval('public.game_history_id_seq'::regclass);


--
-- Name: message id; Type: DEFAULT; Schema: public;
--

ALTER TABLE ONLY public.message ALTER COLUMN id SET DEFAULT nextval('public.message_id_seq'::regclass);


--
-- Data for Name: achievement; Type: TABLE DATA; Schema: public;
--

COPY public.achievement (achievement, user_id) FROM stdin;
\.


--
-- Data for Name: auth; Type: TABLE DATA; Schema: public;
--

COPY public.auth (id, email, two_fa, status) FROM stdin;
\.


--
-- Data for Name: blocked_user; Type: TABLE DATA; Schema: public;
--

COPY public.blocked_user (user_id, blocked_user_id) FROM stdin;
\.


--
-- Data for Name: friendship; Type: TABLE DATA; Schema: public;
--

COPY public.friendship (id, accept, last_messege_time, sender_id, receiver_id) FROM stdin;
\.


--
-- Data for Name: game_history; Type: TABLE DATA; Schema: public;
--

COPY public.game_history (id, winner_score, loser_score, created_at, winner_id, loser_id) FROM stdin;
\.


--
-- Data for Name: message; Type: TABLE DATA; Schema: public;
--

COPY public.message (id, contents, created_at, sender_id, friend_id) FROM stdin;
\.


--
-- Data for Name: message_view; Type: TABLE DATA; Schema: public;
--

COPY public.message_view (user_id, friend_id, last_view_time) FROM stdin;
\.


--
-- Data for Name: user_record; Type: TABLE DATA; Schema: public;
--

COPY public.user_record (id, win_count, lose_count) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public;
--

COPY public.users (id, nickname, exp, image) FROM stdin;
\.


--
-- Name: auth_id_seq; Type: SEQUENCE SET; Schema: public;
--

SELECT pg_catalog.setval('public.auth_id_seq', 1, false);


--
-- Name: friendship_id_seq; Type: SEQUENCE SET; Schema: public;
--

SELECT pg_catalog.setval('public.friendship_id_seq', 1, false);


--
-- Name: game_history_id_seq; Type: SEQUENCE SET; Schema: public;
--

SELECT pg_catalog.setval('public.game_history_id_seq', 1, false);


--
-- Name: message_id_seq; Type: SEQUENCE SET; Schema: public;
--

SELECT pg_catalog.setval('public.message_id_seq', 1, false);


--
-- Name: game_history PK_0e74b90c56b815ed54e90a29f1a; Type: CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.game_history
    ADD CONSTRAINT "PK_0e74b90c56b815ed54e90a29f1a" PRIMARY KEY (id);


--
-- Name: blocked_user PK_5e9407ddba716fe853c8d8e8ae8; Type: CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.blocked_user
    ADD CONSTRAINT "PK_5e9407ddba716fe853c8d8e8ae8" PRIMARY KEY (user_id, blocked_user_id);


--
-- Name: auth PK_7e416cf6172bc5aec04244f6459; Type: CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.auth
    ADD CONSTRAINT "PK_7e416cf6172bc5aec04244f6459" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: message_view PK_a69f8288f28c3e46f5667e6ae77; Type: CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.message_view
    ADD CONSTRAINT "PK_a69f8288f28c3e46f5667e6ae77" PRIMARY KEY (user_id, friend_id);


--
-- Name: message PK_ba01f0a3e0123651915008bc578; Type: CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY (id);


--
-- Name: user_record PK_d0c1972a0031748dfb3c0cba1e1; Type: CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.user_record
    ADD CONSTRAINT "PK_d0c1972a0031748dfb3c0cba1e1" PRIMARY KEY (id);


--
-- Name: achievement PK_d1561e1c8475065dc4794b2514e; Type: CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.achievement
    ADD CONSTRAINT "PK_d1561e1c8475065dc4794b2514e" PRIMARY KEY (user_id, achievement);


--
-- Name: friendship PK_dbd6fb568cd912c5140307075cc; Type: CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.friendship
    ADD CONSTRAINT "PK_dbd6fb568cd912c5140307075cc" PRIMARY KEY (id);


--
-- Name: achievement FK_635944ebf4aa97cae0cf6ca1ac9; Type: FK CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.achievement
    ADD CONSTRAINT "FK_635944ebf4aa97cae0cf6ca1ac9" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: message_view FK_6793de42c3eca75d3ef9b97a88b; Type: FK CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.message_view
    ADD CONSTRAINT "FK_6793de42c3eca75d3ef9b97a88b" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: game_history FK_7019e74ea4d02635745a61c58e1; Type: FK CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.game_history
    ADD CONSTRAINT "FK_7019e74ea4d02635745a61c58e1" FOREIGN KEY (winner_id) REFERENCES public.users(id);


--
-- Name: friendship FK_86463167c10dc37dbf9d39728bd; Type: FK CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.friendship
    ADD CONSTRAINT "FK_86463167c10dc37dbf9d39728bd" FOREIGN KEY (sender_id) REFERENCES public.users(id);


--
-- Name: friendship FK_8cced01afb7c006b9643aed97bf; Type: FK CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.friendship
    ADD CONSTRAINT "FK_8cced01afb7c006b9643aed97bf" FOREIGN KEY (receiver_id) REFERENCES public.users(id);


--
-- Name: users FK_a3ffb1c0c8416b9fc6f907b7433; Type: FK CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "FK_a3ffb1c0c8416b9fc6f907b7433" FOREIGN KEY (id) REFERENCES public.auth(id);


--
-- Name: message_view FK_a8ae0ad544f2eba7e32e566d4f1; Type: FK CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.message_view
    ADD CONSTRAINT "FK_a8ae0ad544f2eba7e32e566d4f1" FOREIGN KEY (friend_id) REFERENCES public.users(id);


--
-- Name: game_history FK_bfbf49da476f5a8a3e25ed5e1d3; Type: FK CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.game_history
    ADD CONSTRAINT "FK_bfbf49da476f5a8a3e25ed5e1d3" FOREIGN KEY (loser_id) REFERENCES public.users(id);


--
-- Name: message FK_c0ab99d9dfc61172871277b52f6; Type: FK CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT "FK_c0ab99d9dfc61172871277b52f6" FOREIGN KEY (sender_id) REFERENCES public.users(id);


--
-- Name: message FK_cba26a3eec7d3d131f17d4efdae; Type: FK CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT "FK_cba26a3eec7d3d131f17d4efdae" FOREIGN KEY (friend_id) REFERENCES public.friendship(id);


--
-- Name: blocked_user FK_cd5ab0713578c02d22dc896b994; Type: FK CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.blocked_user
    ADD CONSTRAINT "FK_cd5ab0713578c02d22dc896b994" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_record FK_d0c1972a0031748dfb3c0cba1e1; Type: FK CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.user_record
    ADD CONSTRAINT "FK_d0c1972a0031748dfb3c0cba1e1" FOREIGN KEY (id) REFERENCES public.users(id);


--
-- Name: blocked_user FK_f88699f6ba7d51f7765849a73b9; Type: FK CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.blocked_user
    ADD CONSTRAINT "FK_f88699f6ba7d51f7765849a73b9" FOREIGN KEY (blocked_user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

