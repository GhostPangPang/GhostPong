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
-- Name: auth_status_enum; Type: TYPE; Schema: public; Owner: jisukim
--

CREATE TYPE public.auth_status_enum AS ENUM (
    'REGISTERD',
    'UNREGISTERD'
);


ALTER TYPE public.auth_status_enum OWNER TO jisukim;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: achievement; Type: TABLE; Schema: public; Owner: jisukim
--

CREATE TABLE public.achievement (
    user_id integer NOT NULL,
    achievement integer NOT NULL,
    user_id_id integer
);


ALTER TABLE public.achievement OWNER TO jisukim;

--
-- Name: auth; Type: TABLE; Schema: public; Owner: jisukim
--

CREATE TABLE public.auth (
    id integer NOT NULL,
    email character varying(320) NOT NULL,
    two_fa character varying(320),
    status public.auth_status_enum DEFAULT 'UNREGISTERD'::public.auth_status_enum NOT NULL
);


ALTER TABLE public.auth OWNER TO jisukim;

--
-- Name: auth_id_seq; Type: SEQUENCE; Schema: public; Owner: jisukim
--

CREATE SEQUENCE public.auth_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_id_seq OWNER TO jisukim;

--
-- Name: auth_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jisukim
--

ALTER SEQUENCE public.auth_id_seq OWNED BY public.auth.id;


--
-- Name: blocked_user; Type: TABLE; Schema: public; Owner: jisukim
--

CREATE TABLE public.blocked_user (
    user_id integer NOT NULL,
    blocked_user_id integer NOT NULL,
    user_id_id integer,
    blocked_user_id_id integer
);


ALTER TABLE public.blocked_user OWNER TO jisukim;

--
-- Name: friendship; Type: TABLE; Schema: public; Owner: jisukim
--

CREATE TABLE public.friendship (
    id integer NOT NULL,
    accept boolean DEFAULT false NOT NULL,
    last_messege_time timestamp without time zone DEFAULT '-infinity'::timestamp without time zone NOT NULL,
    sender_id_id integer,
    receiver_id_id integer
);


ALTER TABLE public.friendship OWNER TO jisukim;

--
-- Name: friendship_id_seq; Type: SEQUENCE; Schema: public; Owner: jisukim
--

CREATE SEQUENCE public.friendship_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.friendship_id_seq OWNER TO jisukim;

--
-- Name: friendship_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jisukim
--

ALTER SEQUENCE public.friendship_id_seq OWNED BY public.friendship.id;


--
-- Name: game_history; Type: TABLE; Schema: public; Owner: jisukim
--

CREATE TABLE public.game_history (
    id integer NOT NULL,
    winner_score integer NOT NULL,
    loser_score integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    winner_id_id integer,
    loser_id_id integer
);


ALTER TABLE public.game_history OWNER TO jisukim;

--
-- Name: game_history_id_seq; Type: SEQUENCE; Schema: public; Owner: jisukim
--

CREATE SEQUENCE public.game_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.game_history_id_seq OWNER TO jisukim;

--
-- Name: game_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jisukim
--

ALTER SEQUENCE public.game_history_id_seq OWNED BY public.game_history.id;


--
-- Name: message; Type: TABLE; Schema: public; Owner: jisukim
--

CREATE TABLE public.message (
    id integer NOT NULL,
    contents character varying(512) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    sender_id_id integer,
    friend_id_id integer
);


ALTER TABLE public.message OWNER TO jisukim;

--
-- Name: message_id_seq; Type: SEQUENCE; Schema: public; Owner: jisukim
--

CREATE SEQUENCE public.message_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.message_id_seq OWNER TO jisukim;

--
-- Name: message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jisukim
--

ALTER SEQUENCE public.message_id_seq OWNED BY public.message.id;


--
-- Name: message_view; Type: TABLE; Schema: public; Owner: jisukim
--

CREATE TABLE public.message_view (
    user_id integer NOT NULL,
    friend_id integer NOT NULL,
    last_view_time timestamp without time zone DEFAULT '-infinity'::timestamp without time zone NOT NULL,
    user_id_id integer,
    friend_id_id integer
);


ALTER TABLE public.message_view OWNER TO jisukim;

--
-- Name: user_record; Type: TABLE; Schema: public; Owner: jisukim
--

CREATE TABLE public.user_record (
    id integer NOT NULL,
    win_count integer DEFAULT 0 NOT NULL,
    lose_count integer DEFAULT 0 NOT NULL,
    id_id integer
);


ALTER TABLE public.user_record OWNER TO jisukim;

--
-- Name: users; Type: TABLE; Schema: public; Owner: jisukim
--

CREATE TABLE public.users (
    id integer NOT NULL,
    nickname character varying(8) NOT NULL,
    exp integer DEFAULT 0 NOT NULL,
    image character varying(256) NOT NULL,
    id_id integer
);


ALTER TABLE public.users OWNER TO jisukim;

--
-- Name: auth id; Type: DEFAULT; Schema: public; Owner: jisukim
--

ALTER TABLE ONLY public.auth ALTER COLUMN id SET DEFAULT nextval('public.auth_id_seq'::regclass);


--
-- Name: friendship id; Type: DEFAULT; Schema: public; Owner: jisukim
--

ALTER TABLE ONLY public.friendship ALTER COLUMN id SET DEFAULT nextval('public.friendship_id_seq'::regclass);


--
-- Name: game_history id; Type: DEFAULT; Schema: public; Owner: jisukim
--

ALTER TABLE ONLY public.game_history ALTER COLUMN id SET DEFAULT nextval('public.game_history_id_seq'::regclass);


--
-- Name: message id; Type: DEFAULT; Schema: public; Owner: jisukim
--

ALTER TABLE ONLY public.message ALTER COLUMN id SET DEFAULT nextval('public.message_id_seq'::regclass);


--
-- Data for Name: achievement; Type: TABLE DATA; Schema: public; Owner: jisukim
--

COPY public.achievement (user_id, achievement, user_id_id) FROM stdin;
\.


--
-- Data for Name: auth; Type: TABLE DATA; Schema: public; Owner: jisukim
--

COPY public.auth (id, email, two_fa, status) FROM stdin;
\.


--
-- Data for Name: blocked_user; Type: TABLE DATA; Schema: public; Owner: jisukim
--

COPY public.blocked_user (user_id, blocked_user_id, user_id_id, blocked_user_id_id) FROM stdin;
\.


--
-- Data for Name: friendship; Type: TABLE DATA; Schema: public; Owner: jisukim
--

COPY public.friendship (id, accept, last_messege_time, sender_id_id, receiver_id_id) FROM stdin;
\.


--
-- Data for Name: game_history; Type: TABLE DATA; Schema: public; Owner: jisukim
--

COPY public.game_history (id, winner_score, loser_score, created_at, winner_id_id, loser_id_id) FROM stdin;
\.


--
-- Data for Name: message; Type: TABLE DATA; Schema: public; Owner: jisukim
--

COPY public.message (id, contents, created_at, sender_id_id, friend_id_id) FROM stdin;
\.


--
-- Data for Name: message_view; Type: TABLE DATA; Schema: public; Owner: jisukim
--

COPY public.message_view (user_id, friend_id, last_view_time, user_id_id, friend_id_id) FROM stdin;
\.


--
-- Data for Name: user_record; Type: TABLE DATA; Schema: public; Owner: jisukim
--

COPY public.user_record (id, win_count, lose_count, id_id) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: jisukim
--

COPY public.users (id, nickname, exp, image, id_id) FROM stdin;
\.


--
-- Name: auth_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jisukim
--

SELECT pg_catalog.setval('public.auth_id_seq', 1, false);


--
-- Name: friendship_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jisukim
--

SELECT pg_catalog.setval('public.friendship_id_seq', 1, false);


--
-- Name: game_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jisukim
--

SELECT pg_catalog.setval('public.game_history_id_seq', 1, false);


--
-- Name: message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jisukim
--

SELECT pg_catalog.setval('public.message_id_seq', 1, false);


--
-- Name: game_history PK_0e74b90c56b815ed54e90a29f1a; Type: CONSTRAINT; Schema: public; Owner: jisukim
--

ALTER TABLE ONLY public.game_history
    ADD CONSTRAINT "PK_0e74b90c56b815ed54e90a29f1a" PRIMARY KEY (id);


--
-- Name: blocked_user PK_5e9407ddba716fe853c8d8e8ae8; Type: CONSTRAINT; Schema: public; Owner: jisukim
--

ALTER TABLE ONLY public.blocked_user
    ADD CONSTRAINT "PK_5e9407ddba716fe853c8d8e8ae8" PRIMARY KEY (user_id, blocked_user_id);


--
-- Name: auth PK_7e416cf6172bc5aec04244f6459; Type: CONSTRAINT; Schema: public; Owner: jisukim
--

ALTER TABLE ONLY public.auth
    ADD CONSTRAINT "PK_7e416cf6172bc5aec04244f6459" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: jisukim
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: message_view PK_a69f8288f28c3e46f5667e6ae77; Type: CONSTRAINT; Schema: public; Owner: jisukim
--

ALTER TABLE ONLY public.message_view
    ADD CONSTRAINT "PK_a69f8288f28c3e46f5667e6ae77" PRIMARY KEY (user_id, friend_id);


--
-- Name: message PK_ba01f0a3e0123651915008bc578; Type: CONSTRAINT; Schema: public; Owner: jisukim
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY (id);


--
-- Name: user_record PK_d0c1972a0031748dfb3c0cba1e1; Type: CONSTRAINT; Schema: public; Owner: jisukim
--

ALTER TABLE ONLY public.user_record
    ADD CONSTRAINT "PK_d0c1972a0031748dfb3c0cba1e1" PRIMARY KEY (id);


--
-- Name: achievement PK_d1561e1c8475065dc4794b2514e; Type: CONSTRAINT; Schema: public; Owner: jisukim
--

ALTER TABLE ONLY public.achievement
    ADD CONSTRAINT "PK_d1561e1c8475065dc4794b2514e" PRIMARY KEY (user_id, achievement);


--
-- Name: friendship PK_dbd6fb568cd912c5140307075cc; Type: CONSTRAINT; Schema: public; Owner: jisukim
--

ALTER TABLE ONLY public.friendship
    ADD CONSTRAINT "PK_dbd6fb568cd912c5140307075cc" PRIMARY KEY (id);


--
-- Name: users REL_4e1a9b2e94b013bd2cd1b211e3; Type: CONSTRAINT; Schema: public; Owner: jisukim
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "REL_4e1a9b2e94b013bd2cd1b211e3" UNIQUE (id_id);


--
-- Name: user_record REL_8ff36382a525f9ae9d8cec514d; Type: CONSTRAINT; Schema: public; Owner: jisukim
--

ALTER TABLE ONLY public.user_record
    ADD CONSTRAINT "REL_8ff36382a525f9ae9d8cec514d" UNIQUE (id_id);


--
-- Name: message FK_370a46a36b3a5169c0335311471; Type: FK CONSTRAINT; Schema: public; Owner: jisukim
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT "FK_370a46a36b3a5169c0335311471" FOREIGN KEY (sender_id_id) REFERENCES public.users(id);


--
-- Name: users FK_4e1a9b2e94b013bd2cd1b211e34; Type: FK CONSTRAINT; Schema: public; Owner: jisukim
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "FK_4e1a9b2e94b013bd2cd1b211e34" FOREIGN KEY (id_id) REFERENCES public.auth(id);


--
-- Name: blocked_user FK_5444d3185eb813e2bd16ec8552f; Type: FK CONSTRAINT; Schema: public; Owner: jisukim
--

ALTER TABLE ONLY public.blocked_user
    ADD CONSTRAINT "FK_5444d3185eb813e2bd16ec8552f" FOREIGN KEY (user_id_id) REFERENCES public.users(id);


--
-- Name: blocked_user FK_59e829478b1782d1bacbc17294e; Type: FK CONSTRAINT; Schema: public; Owner: jisukim
--

ALTER TABLE ONLY public.blocked_user
    ADD CONSTRAINT "FK_59e829478b1782d1bacbc17294e" FOREIGN KEY (blocked_user_id_id) REFERENCES public.users(id);


--
-- Name: friendship FK_6d8618e80b7c41b76fb9a087933; Type: FK CONSTRAINT; Schema: public; Owner: jisukim
--

ALTER TABLE ONLY public.friendship
    ADD CONSTRAINT "FK_6d8618e80b7c41b76fb9a087933" FOREIGN KEY (receiver_id_id) REFERENCES public.users(id);


--
-- Name: game_history FK_75ca9a755af3f8b55db66c7c802; Type: FK CONSTRAINT; Schema: public; Owner: jisukim
--

ALTER TABLE ONLY public.game_history
    ADD CONSTRAINT "FK_75ca9a755af3f8b55db66c7c802" FOREIGN KEY (loser_id_id) REFERENCES public.users(id);


--
-- Name: message_view FK_79ed4aa2c8f4ab4fa95ab5513b2; Type: FK CONSTRAINT; Schema: public; Owner: jisukim
--

ALTER TABLE ONLY public.message_view
    ADD CONSTRAINT "FK_79ed4aa2c8f4ab4fa95ab5513b2" FOREIGN KEY (friend_id_id) REFERENCES public.users(id);


--
-- Name: user_record FK_8ff36382a525f9ae9d8cec514d9; Type: FK CONSTRAINT; Schema: public; Owner: jisukim
--

ALTER TABLE ONLY public.user_record
    ADD CONSTRAINT "FK_8ff36382a525f9ae9d8cec514d9" FOREIGN KEY (id_id) REFERENCES public.users(id);


--
-- Name: achievement FK_a8284a3bb76decdffde2afd9872; Type: FK CONSTRAINT; Schema: public; Owner: jisukim
--

ALTER TABLE ONLY public.achievement
    ADD CONSTRAINT "FK_a8284a3bb76decdffde2afd9872" FOREIGN KEY (user_id_id) REFERENCES public.users(id);


--
-- Name: friendship FK_eaa4e4be5796f6dad7c1e516ec1; Type: FK CONSTRAINT; Schema: public; Owner: jisukim
--

ALTER TABLE ONLY public.friendship
    ADD CONSTRAINT "FK_eaa4e4be5796f6dad7c1e516ec1" FOREIGN KEY (sender_id_id) REFERENCES public.users(id);


--
-- Name: message FK_f77d084284dc778ae53b0f8eb87; Type: FK CONSTRAINT; Schema: public; Owner: jisukim
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT "FK_f77d084284dc778ae53b0f8eb87" FOREIGN KEY (friend_id_id) REFERENCES public.friendship(id);


--
-- Name: game_history FK_fb06db9d7fa36ec76e0f9d94b72; Type: FK CONSTRAINT; Schema: public; Owner: jisukim
--

ALTER TABLE ONLY public.game_history
    ADD CONSTRAINT "FK_fb06db9d7fa36ec76e0f9d94b72" FOREIGN KEY (winner_id_id) REFERENCES public.users(id);


--
-- Name: message_view FK_fc6af45653b20066c1eb739553f; Type: FK CONSTRAINT; Schema: public; Owner: jisukim
--

ALTER TABLE ONLY public.message_view
    ADD CONSTRAINT "FK_fc6af45653b20066c1eb739553f" FOREIGN KEY (user_id_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

