-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  full_name text,
  email text unique,
  is_premium boolean default false,
  summarize_count int default 0,
  chat_count int default 0,
  last_summarize_reset timestamp with time zone default now(),
  last_chat_reset timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table profiles enable row level security;

-- Create policies
create policy "Users can view their own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, username)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email, new.raw_user_meta_data->>'username');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Documents table
create table documents (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  content text, -- Store text content for simple RAG
  storage_path text,
  created_at timestamp with time zone default now()
);

alter table documents enable row level security;
create policy "Users can manage their own documents" on documents for all using (auth.uid() = user_id);

-- Chat history table
create table chat_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  document_id uuid references documents on delete cascade,
  message text not null,
  role text not null, -- 'user' or 'assistant'
  created_at timestamp with time zone default now()
);

alter table chat_history enable row level security;
create policy "Users can view their own chat history" on chat_history for select using (auth.uid() = user_id);
create policy "Users can insert their own chat history" on chat_history for insert with check (auth.uid() = user_id);
