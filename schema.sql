-- Create Users table
create table public.users (
  id uuid references auth.users not null primary key,
  name text,
  email text,
  role text check (role in ('admin', 'participant')),
  approval_status text check (approval_status in ('pending', 'approved', 'rejected')) default 'pending',
  checked_in boolean default false,
  assigned_event_id uuid,
  approved_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.users enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone."
  on users for select
  using ( true );

create policy "Users can insert their own profile."
  on users for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on users for update
  using ( auth.uid() = id );

-- Create a trigger to handle updated_at
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_auth_user_updated
  before update on public.users
  for each row execute procedure handle_updated_at();

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, role, approval_status)
  values (new.id, new.email, 'participant', 'pending');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
