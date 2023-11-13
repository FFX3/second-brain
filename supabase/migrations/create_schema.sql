create extension if not exists "vector" with schema "extensions";


create sequence "public"."documents_id_seq";

create table "public"."documents" (
    "id" bigint not null default nextval('documents_id_seq'::regclass),
    "content" text not null,
    "metadata" jsonb not null,
    "embedding" vector(384) not null,
    "owner" uuid not null default auth.uid()
);


alter table "public"."documents" enable row level security;

alter sequence "public"."documents_id_seq" owned by "public"."documents"."id";

CREATE UNIQUE INDEX documents_pkey ON public.documents USING btree (id);

alter table "public"."documents" add constraint "documents_pkey" PRIMARY KEY using index "documents_pkey";

alter table "public"."documents" add constraint "documents_owner_fkey" FOREIGN KEY (owner) REFERENCES auth.users(id) not valid;

alter table "public"."documents" validate constraint "documents_owner_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.kw_match_documents(query_text text, match_count integer)
 RETURNS TABLE(id bigint, content text, metadata jsonb, similarity real)
 LANGUAGE plpgsql
AS $function$

begin
return query execute
format('select id, content, metadata, ts_rank(to_tsvector(content), plainto_tsquery($1)) as similarity
from documents
where to_tsvector(content) @@ plainto_tsquery($1)
order by similarity desc
limit $2')
using query_text, match_count;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.match_documents(query_embedding vector, match_count integer DEFAULT NULL::integer, filter jsonb DEFAULT '{}'::jsonb)
 RETURNS TABLE(id bigint, content text, metadata jsonb, similarity double precision)
 LANGUAGE plpgsql
AS $function$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where metadata @> filter
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$function$
;

create policy "user can do whatever to docs they own"
on "public"."documents"
as permissive
for all
to authenticated
using ((owner = auth.uid()))
with check ((owner = auth.uid()));
