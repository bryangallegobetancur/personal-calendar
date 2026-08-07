-- ============ EXTENSIONES ============
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============ EVENTOS: RECURRENCIA + ALL-DAY + MULTI-DIA + CATEGORIAS ============
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS parent_event_id UUID DEFAULT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS recurrence_rule TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS recurrence_end_date DATE DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS end_date DATE DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS is_all_day BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'default',
  ADD COLUMN IF NOT EXISTS color TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS email_reminder BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_events_parent ON public.events(parent_event_id);
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(user_id, category);

-- ============ FUNCION PARA GENERAR INSTANCIAS RECURRENTES ============
CREATE OR REPLACE FUNCTION generate_recurring_instances(
  p_start_date DATE,
  p_rule TEXT,
  p_end_date DATE,
  p_limit INT DEFAULT 366
) RETURNS TABLE(instance_date DATE) AS $$
DECLARE
  freq TEXT;
  interval_val INT;
  v_date DATE := p_start_date;
  v_count INT := 0;
BEGIN
  freq := lower(split_part(p_rule, ':', 1));
  interval_val := COALESCE(NULLIF(split_part(p_rule, ':', 2), '')::int, 1);

  WHILE v_date <= COALESCE(p_end_date, p_start_date + p_limit) AND v_count < 366 LOOP
    IF v_date > p_start_date THEN
      instance_date := v_date;
      v_count := v_count + 1;
      RETURN NEXT;
    END IF;

    CASE freq
      WHEN 'daily' THEN v_date := v_date + interval_val;
      WHEN 'weekly' THEN v_date := v_date + (7 * interval_val);
      WHEN 'monthly' THEN v_date := v_date + (interval_val * INTERVAL '1 month');
      WHEN 'yearly' THEN v_date := v_date + (interval_val * INTERVAL '1 year');
      ELSE RETURN;
    END CASE;
  END LOOP;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
