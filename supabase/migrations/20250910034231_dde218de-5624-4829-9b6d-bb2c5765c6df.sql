-- Fix function search_path and add critical triggers for auth/profile and timestamps/overlap

-- 1) Secure search_path for functions
create or replace function public.get_current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role::text from public.profiles where user_id = auth.uid();
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, email, first_name, last_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    coalesce(new.raw_user_meta_data->>'role', 'patient')::user_role
  );
  return new;
end;
$$;

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.check_appointment_overlap()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if exists (
    select 1 from public.appointments
    where doctor_id = new.doctor_id
      and appointment_date = new.appointment_date
      and status not in ('cancelled')
      and id != coalesce(new.id, gen_random_uuid())
      and (
        (start_time <= new.start_time and end_time > new.start_time) or
        (start_time < new.end_time and end_time >= new.end_time) or
        (start_time >= new.start_time and end_time <= new.end_time)
      )
  ) then
    raise exception 'Appointment time slot is already booked for this doctor';
  end if;
  return new;
end;
$$;

-- 2) Add missing triggers (idempotent)
-- Trigger to create profile on new auth user
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Update timestamps automatically
drop trigger if exists update_profiles_updated_at on public.profiles;
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at_column();

drop trigger if exists update_appointments_updated_at on public.appointments;
create trigger update_appointments_updated_at
  before update on public.appointments
  for each row execute procedure public.update_updated_at_column();

-- Prevent overlapping appointments for a doctor
drop trigger if exists prevent_appointment_overlap on public.appointments;
create trigger prevent_appointment_overlap
  before insert or update on public.appointments
  for each row execute procedure public.check_appointment_overlap();
