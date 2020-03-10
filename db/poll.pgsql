CREATE TABLE public.poll (
    id serial NOT NULL PRIMARY KEY,
    post_id integer REFERENCES post (id) ON DELETE CASCADE,
    answer_id integer NOT NULL,
    vote integer NOT NULL
);