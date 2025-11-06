-- Create students table (like the Student model)
CREATE TABLE public.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  contact_no text NOT NULL,
  usn text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  date timestamptz NOT NULL,
  venue text NOT NULL,
  description text NOT NULL,
  type text NOT NULL CHECK (type IN ('Cultural', 'Sports')),
  sub_events jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create registrations table
CREATE TABLE public.registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  sub_event text,
  registered_at timestamptz DEFAULT now(),
  UNIQUE(student_id, event_id, sub_event)
);

-- Enable Row Level Security
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for students (users can view and update their own data)
CREATE POLICY "Students can view all students"
  ON public.students FOR SELECT
  USING (true);

CREATE POLICY "Students can insert their own data"
  ON public.students FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Students can update their own data"
  ON public.students FOR UPDATE
  USING (id = (SELECT id FROM public.students WHERE email = auth.jwt()->>'email'));

-- RLS Policies for events (everyone can view)
CREATE POLICY "Anyone can view events"
  ON public.events FOR SELECT
  USING (true);

-- RLS Policies for registrations
CREATE POLICY "Students can view all registrations"
  ON public.registrations FOR SELECT
  USING (true);

CREATE POLICY "Students can create registrations"
  ON public.registrations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Students can delete their own registrations"
  ON public.registrations FOR DELETE
  USING (student_id IN (SELECT id FROM public.students WHERE email = auth.jwt()->>'email'));

-- Insert sample events
INSERT INTO public.events (title, date, venue, description, type, sub_events) VALUES
('Tech Fest 2025', '2025-11-15 09:00:00+00', 'Main Auditorium', 'Annual technology festival featuring coding competitions and tech talks', 'Cultural', '[
  {"name": "Hackathon", "time": "09:00 AM", "details": "24-hour coding competition"},
  {"name": "Tech Quiz", "time": "02:00 PM", "details": "Technology trivia competition"},
  {"name": "Project Exhibition", "time": "04:00 PM", "details": "Display your innovative projects"}
]'::jsonb),
('Sports Day 2025', '2025-12-01 08:00:00+00', 'Sports Complex', 'Inter-college sports tournament with various athletic events', 'Sports', '[
  {"name": "Cricket", "time": "08:00 AM", "details": "Cricket tournament"},
  {"name": "Football", "time": "10:00 AM", "details": "Football matches"},
  {"name": "Athletics", "time": "01:00 PM", "details": "Track and field events"}
]'::jsonb),
('Cultural Night', '2024-10-15 06:00:00+00', 'College Grounds', 'Evening of music, dance, and cultural performances', 'Cultural', '[
  {"name": "Dance Competition", "time": "06:00 PM", "details": "Solo and group dance performances"},
  {"name": "Music Concert", "time": "08:00 PM", "details": "Live band performances"}
]'::jsonb);