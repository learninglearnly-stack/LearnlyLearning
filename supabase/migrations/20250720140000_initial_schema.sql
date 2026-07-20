-- Learnly initial schema
-- Profiles, tutors, subjects, bookings, messages, reviews, favorites, availability, notifications

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- PROFILES (linked to auth.users)
-- =============================================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'tutor', 'admin')),
  city TEXT,
  country TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL)
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- SUBJECTS
-- =============================================================================
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT,
  icon TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subjects_slug ON public.subjects(slug);
CREATE INDEX idx_subjects_category ON public.subjects(category);

-- =============================================================================
-- TUTORS
-- =============================================================================
CREATE TABLE public.tutors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  headline TEXT,
  bio TEXT,
  hourly_rate NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (hourly_rate >= 0),
  experience_years INTEGER NOT NULL DEFAULT 0 CHECK (experience_years >= 0),
  is_online BOOLEAN NOT NULL DEFAULT FALSE,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  rating_avg NUMERIC(3, 2) NOT NULL DEFAULT 0 CHECK (rating_avg >= 0 AND rating_avg <= 5),
  rating_count INTEGER NOT NULL DEFAULT 0 CHECK (rating_count >= 0),
  city TEXT,
  country TEXT,
  specialties TEXT[] NOT NULL DEFAULT '{}',
  languages TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tutors_profile_id ON public.tutors(profile_id);
CREATE INDEX idx_tutors_hourly_rate ON public.tutors(hourly_rate);
CREATE INDEX idx_tutors_rating_avg ON public.tutors(rating_avg DESC);
CREATE INDEX idx_tutors_is_online ON public.tutors(is_online);
CREATE INDEX idx_tutors_city ON public.tutors(city);

CREATE TRIGGER tutors_updated_at
  BEFORE UPDATE ON public.tutors
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create tutor record when profile role is tutor
CREATE OR REPLACE FUNCTION public.handle_tutor_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role = 'tutor' AND NOT EXISTS (SELECT 1 FROM public.tutors WHERE profile_id = NEW.id) THEN
    INSERT INTO public.tutors (profile_id, city, country)
    VALUES (NEW.id, NEW.city, NEW.country);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_tutor_created
  AFTER INSERT OR UPDATE OF role ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_tutor_profile();

-- =============================================================================
-- TUTOR SUBJECTS (junction)
-- =============================================================================
CREATE TABLE public.tutor_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES public.tutors(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  UNIQUE (tutor_id, subject_id)
);

CREATE INDEX idx_tutor_subjects_tutor ON public.tutor_subjects(tutor_id);
CREATE INDEX idx_tutor_subjects_subject ON public.tutor_subjects(subject_id);

-- =============================================================================
-- EDUCATION & EXPERIENCE
-- =============================================================================
CREATE TABLE public.tutor_education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES public.tutors(id) ON DELETE CASCADE,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field TEXT NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tutor_education_tutor ON public.tutor_education(tutor_id);

CREATE TABLE public.tutor_experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES public.tutors(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  start_year INTEGER NOT NULL,
  end_year INTEGER,
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tutor_experience_tutor ON public.tutor_experience(tutor_id);

-- =============================================================================
-- AVAILABILITY
-- =============================================================================
CREATE TABLE public.availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES public.tutors(id) ON DELETE CASCADE,
  day_of_week TEXT NOT NULL CHECK (day_of_week IN (
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  )),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  CHECK (start_time < end_time)
);

CREATE INDEX idx_availability_tutor ON public.availability(tutor_id);
CREATE INDEX idx_availability_day ON public.availability(day_of_week);

-- =============================================================================
-- BOOKINGS
-- =============================================================================
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES public.tutors(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  preferred_date DATE NOT NULL,
  preferred_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60 CHECK (duration_minutes >= 30 AND duration_minutes <= 180),
  message TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'accepted', 'rejected', 'completed', 'cancelled'
  )),
  tutor_response_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookings_tutor ON public.bookings(tutor_id);
CREATE INDEX idx_bookings_student ON public.bookings(student_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_created ON public.bookings(created_at DESC);

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- MESSAGES
-- =============================================================================
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tutor_id UUID NOT NULL REFERENCES public.tutors(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (student_id, tutor_id)
);

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT,
  file_url TEXT,
  file_name TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX idx_messages_created ON public.messages(created_at);
CREATE INDEX idx_conversations_student ON public.conversations(student_id);
CREATE INDEX idx_conversations_tutor ON public.conversations(tutor_id);

-- =============================================================================
-- REVIEWS
-- =============================================================================
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES public.tutors(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tutor_id, student_id, booking_id)
);

CREATE INDEX idx_reviews_tutor ON public.reviews(tutor_id);
CREATE INDEX idx_reviews_student ON public.reviews(student_id);

-- Update tutor rating on new review
CREATE OR REPLACE FUNCTION public.update_tutor_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_tutor_id UUID;
BEGIN
  target_tutor_id := COALESCE(NEW.tutor_id, OLD.tutor_id);
  UPDATE public.tutors
  SET
    rating_avg = (SELECT COALESCE(AVG(rating)::NUMERIC, 0) FROM public.reviews WHERE tutor_id = target_tutor_id),
    rating_count = (SELECT COUNT(*)::INTEGER FROM public.reviews WHERE tutor_id = target_tutor_id)
  WHERE id = target_tutor_id;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER on_review_changed
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_tutor_rating();

-- =============================================================================
-- FAVORITES
-- =============================================================================
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tutor_id UUID NOT NULL REFERENCES public.tutors(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (student_id, tutor_id)
);

CREATE INDEX idx_favorites_student ON public.favorites(student_id);
CREATE INDEX idx_favorites_tutor ON public.favorites(tutor_id);

-- =============================================================================
-- NOTIFICATIONS
-- =============================================================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'info',
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, is_read) WHERE is_read = FALSE;

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper: check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Helper: get tutor id for current user
CREATE OR REPLACE FUNCTION public.my_tutor_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.tutors WHERE profile_id = auth.uid() LIMIT 1;
$$;

-- PROFILES policies
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE USING (public.is_admin());

-- SUBJECTS policies (public read)
CREATE POLICY "Subjects are viewable by everyone"
  ON public.subjects FOR SELECT USING (true);

CREATE POLICY "Admins can manage subjects"
  ON public.subjects FOR ALL USING (public.is_admin());

-- TUTORS policies
CREATE POLICY "Tutors are viewable by everyone"
  ON public.tutors FOR SELECT USING (true);

CREATE POLICY "Tutors can update own record"
  ON public.tutors FOR UPDATE USING (profile_id = auth.uid());

CREATE POLICY "Tutors can insert own record"
  ON public.tutors FOR INSERT WITH CHECK (profile_id = auth.uid());

-- TUTOR SUBJECTS policies
CREATE POLICY "Tutor subjects viewable by everyone"
  ON public.tutor_subjects FOR SELECT USING (true);

CREATE POLICY "Tutors manage own subjects"
  ON public.tutor_subjects FOR ALL
  USING (tutor_id = public.my_tutor_id());

-- EDUCATION policies
CREATE POLICY "Education viewable by everyone"
  ON public.tutor_education FOR SELECT USING (true);

CREATE POLICY "Tutors manage own education"
  ON public.tutor_education FOR ALL
  USING (tutor_id = public.my_tutor_id());

-- EXPERIENCE policies
CREATE POLICY "Experience viewable by everyone"
  ON public.tutor_experience FOR SELECT USING (true);

CREATE POLICY "Tutors manage own experience"
  ON public.tutor_experience FOR ALL
  USING (tutor_id = public.my_tutor_id());

-- AVAILABILITY policies
CREATE POLICY "Availability viewable by everyone"
  ON public.availability FOR SELECT USING (true);

CREATE POLICY "Tutors manage own availability"
  ON public.availability FOR ALL
  USING (tutor_id = public.my_tutor_id());

-- BOOKINGS policies
CREATE POLICY "Students and tutors view own bookings"
  ON public.bookings FOR SELECT
  USING (
    student_id = auth.uid()
    OR tutor_id = public.my_tutor_id()
    OR public.is_admin()
  );

CREATE POLICY "Students create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students cancel own pending bookings"
  ON public.bookings FOR UPDATE
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Tutors respond to bookings"
  ON public.bookings FOR UPDATE
  USING (tutor_id = public.my_tutor_id());

-- CONVERSATIONS policies
CREATE POLICY "Participants view conversations"
  ON public.conversations FOR SELECT
  USING (
    student_id = auth.uid()
    OR tutor_id = public.my_tutor_id()
  );

CREATE POLICY "Participants create conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (
    student_id = auth.uid()
    OR tutor_id = public.my_tutor_id()
  );

-- MESSAGES policies
CREATE POLICY "Participants view messages"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
      AND (c.student_id = auth.uid() OR c.tutor_id = public.my_tutor_id())
    )
  );

CREATE POLICY "Participants send messages"
  ON public.messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
      AND (c.student_id = auth.uid() OR c.tutor_id = public.my_tutor_id())
    )
  );

CREATE POLICY "Participants mark messages read"
  ON public.messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
      AND (c.student_id = auth.uid() OR c.tutor_id = public.my_tutor_id())
    )
  );

-- REVIEWS policies
CREATE POLICY "Reviews viewable by everyone"
  ON public.reviews FOR SELECT USING (true);

CREATE POLICY "Students create reviews for completed bookings"
  ON public.reviews FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students update own reviews"
  ON public.reviews FOR UPDATE USING (student_id = auth.uid());

-- FAVORITES policies
CREATE POLICY "Students view own favorites"
  ON public.favorites FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Students manage own favorites"
  ON public.favorites FOR ALL USING (student_id = auth.uid());

-- NOTIFICATIONS policies
CREATE POLICY "Users view own notifications"
  ON public.notifications FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users update own notifications"
  ON public.notifications FOR UPDATE USING (user_id = auth.uid());

-- =============================================================================
-- SEED SUBJECTS
-- =============================================================================
INSERT INTO public.subjects (name, slug, category, icon, description) VALUES
  ('Mathematics', 'mathematics', 'STEM', 'calculator', 'Algebra, calculus, geometry, statistics, and exam preparation.'),
  ('English', 'english', 'Languages', 'book-open', 'Grammar, writing, literature, IELTS, TOEFL, and business English.'),
  ('Spanish', 'spanish', 'Languages', 'globe', 'Conversational Spanish, DELE prep, and Latin American dialects.'),
  ('Physics', 'physics', 'STEM', 'atom', 'Mechanics, electromagnetism, thermodynamics, and AP Physics.'),
  ('Programming', 'programming', 'Technology', 'code', 'Python, JavaScript, web development, algorithms, and data structures.'),
  ('Chemistry', 'chemistry', 'STEM', 'flask', 'Organic chemistry, biochemistry, lab techniques, and AP Chemistry.'),
  ('Music', 'music', 'Arts', 'music', 'Piano, guitar, music theory, composition, and vocal training.'),
  ('Business', 'business', 'Professional', 'briefcase', 'MBA prep, finance, marketing, entrepreneurship, and case studies.'),
  ('French', 'french', 'Languages', 'globe', 'Conversational French, DELF/DALF preparation, and business French.'),
  ('Biology', 'biology', 'STEM', 'leaf', 'Cell biology, genetics, ecology, anatomy, and MCAT prep.'),
  ('History', 'history', 'Humanities', 'landmark', 'World history, US history, European history, and essay writing.'),
  ('Psychology', 'psychology', 'Humanities', 'brain', 'Cognitive psychology, research methods, AP Psychology, and counseling basics.')
ON CONFLICT (slug) DO NOTHING;

-- Enable Realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
