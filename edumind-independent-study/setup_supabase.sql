-- 1. Create Profiles table (Optional, but good for storing name/lastName)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. Create Courses table
CREATE TABLE public.courses (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  link_drive TEXT,
  file_type TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Turn on RLS for courses (optional but recommended)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Allow anyone (even anonymous if you want, but here we restrict to authenticated) to read courses
CREATE POLICY "Allow authenticated to read courses" ON public.courses
  FOR SELECT USING (auth.role() = 'authenticated');


-- 3. Insert initial data (The exact same data you had in server.ts)
INSERT INTO public.courses (id, title, description, category, link_drive, file_type, thumbnail_url) VALUES
(1, 'Fundamentos de Python e Algoritmos', 'Uma introdução acadêmica aos fundamentos da programação utilizando Python. Ideal para iniciantes.', 'Programação', 'https://drive.google.com/file/d/1yR7QMTThw-L6t8Hbremnp4-Q_vhMu6br/preview', 'pdf', 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&q=80'),
(2, 'Arquitetura de Software Moderna', 'Estudo aprofundado sobre padrões de design, microsserviços e sistemas distribuídos.', 'Engenharia de Software', 'https://drive.google.com/file/d/1uNsFp9c6Wv9x8JWmPNMoUwBpJbrJu0tK/preview', 'pdf', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80'),
(3, 'Machine Learning em Prática', 'Modelos preditivos, regressões e redes neurais explicadas com exemplos práticos.', 'Inteligência Artificial', 'https://drive.google.com/file/d/13b3lCUBCLjmbQkObHiNXYxiLNrJuECKr/preview', 'pdf', 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&q=80'),
(4, 'Introdução ao React e Tailwind', 'Aula gravada mostrando passo a passo como construir interfaces limpas e responsivas.', 'Frontend', 'https://drive.google.com/file/d/16le-GZYezQf045KhNtdsMdf2t2EqV40L/preview', 'video', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80');

-- Since we forced the IDs in the insert, we need to reset the SERIAL sequence
SELECT setval('courses_id_seq', (SELECT MAX(id) FROM public.courses));
