alter table public.adhesions
    add column if not exists mode_paiement text;

do $$
begin
    if not exists (
        select 1
        from pg_constraint
        where conname = 'adhesions_mode_paiement_check'
          and conrelid = 'public.adhesions'::regclass
    ) then
        alter table public.adhesions
            add constraint adhesions_mode_paiement_check
            check (mode_paiement in ('especes', 'cheque', 'cb', 'virement'));
    end if;
end
$$;