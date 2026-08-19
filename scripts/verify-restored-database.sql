BEGIN READ ONLY;

DO $$
DECLARE
  required_table TEXT;
BEGIN
  FOREACH required_table IN ARRAY ARRAY[
    'public.certifications', 'public.questions', 'public.user_profiles',
    'public.exam_sessions', 'public.user_answers', 'public.stripe_purchases'
  ] LOOP
    IF to_regclass(required_table) IS NULL THEN
      RAISE EXCEPTION 'Required restored table is missing: %', required_table;
    END IF;
  END LOOP;
  IF to_regprocedure('public.create_exam_session_with_access(uuid,uuid,text,text[],uuid[])') IS NULL THEN
    RAISE EXCEPTION 'Atomic exam creation function is missing';
  END IF;
  IF to_regprocedure('public.submit_exam_session_atomic(uuid,uuid,jsonb,integer)') IS NULL THEN
    RAISE EXCEPTION 'Atomic exam submission function is missing';
  END IF;
END $$;

SELECT 'certifications' AS entity, count(*) AS restored_rows FROM public.certifications
UNION ALL SELECT 'questions', count(*) FROM public.questions
UNION ALL SELECT 'user_profiles', count(*) FROM public.user_profiles
UNION ALL SELECT 'exam_sessions', count(*) FROM public.exam_sessions
UNION ALL SELECT 'user_answers', count(*) FROM public.user_answers
UNION ALL SELECT 'stripe_purchases', count(*) FROM public.stripe_purchases;

ROLLBACK;
