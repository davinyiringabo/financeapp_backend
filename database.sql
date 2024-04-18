-- BUDGET TABLE

CREATE TABLE IF NOT EXISTS public.budget
(
    id character varying(100) COLLATE pg_catalog."default" NOT NULL,
    weekly integer NOT NULL,
    monthly integer NOT NULL,
    CONSTRAINT budget_pkey PRIMARY KEY (id)
)

-- EXPENSES TABLE
CREATE TABLE IF NOT EXISTS public.expenses
(
    id integer NOT NULL DEFAULT nextval('expenses_id_seq'::regclass),
    category character varying(100) COLLATE pg_catalog."default" NOT NULL,
    amount integer NOT NULL,
    date character varying(200) COLLATE pg_catalog."default" NOT NULL,
    "time" character varying(30) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT expenses_pkey PRIMARY KEY (id)
)

-- INCOMES TABLE

CREATE TABLE IF NOT EXISTS public.incomes
(
    id integer NOT NULL DEFAULT nextval('incomes_id_seq'::regclass),
    amount integer NOT NULL,
    "time" character varying(20) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT incomes_pkey PRIMARY KEY (id)
)