create table libros(
	id serial primary key,
	titulo varchar not null,
	autor varchar not null,
	disponible boolean not null default true
);