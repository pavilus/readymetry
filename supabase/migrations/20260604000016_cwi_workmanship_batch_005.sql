-- Original CWI Part A workmanship, safety, documents, symbols, and math candidates.
-- Facts were checked against AWS Welding Handbook 7th Ed., Vol. 1 (1976) and general CWI body-of-knowledge topics.
-- Keep in needs_review until independently reviewed.

DO $batch$
DECLARE
  cwi_id UUID := '11111111-0000-0000-0000-000000000001';
  source_url TEXT := 'https://rexresearch1.com/WeldingLibrary/WeldingHandbook1Fundam.pdf';
BEGIN

INSERT INTO questions (
  certification_id, category, subcategory, body, options, correct_answer,
  explanation, difficulty, reference, exam_part, review_status, source_kind,
  source_edition, source_url, question_pool
) VALUES
(cwi_id, 'Safety', 'Arc Radiation',
 'Which hazard is most directly controlled by using proper filter lenses and welding curtains around arc welding?',
 '[{"key":"A","text":"Ultraviolet and intense visible radiation exposure"},{"key":"B","text":"Incorrect electrode classification"},{"key":"C","text":"Excess weld reinforcement"},{"key":"D","text":"Wrong weld symbol placement"}]',
 'A', 'Arc welding produces intense radiation, including ultraviolet radiation, so eye protection and shielding protect welders and nearby personnel.',
 'easy', 'AWS Welding Handbook 7th Ed., Vol. 1, Safety', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Safety', 'Fumes and Ventilation',
 'What is the main purpose of local exhaust ventilation during welding in confined or poorly ventilated areas?',
 '[{"key":"A","text":"To remove fumes and gases from the breathing zone"},{"key":"B","text":"To increase arc voltage automatically"},{"key":"C","text":"To replace visual inspection"},{"key":"D","text":"To increase weld shrinkage"}]',
 'A', 'Ventilation controls welding fumes and gases by moving contaminants away from the worker and the work area.',
 'easy', 'AWS Welding Handbook 7th Ed., Vol. 1, Safety', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Safety', 'Fire Prevention',
 'Before welding near combustible materials, what should be done first?',
 '[{"key":"A","text":"Remove or protect combustibles and provide suitable fire-watch controls when required"},{"key":"B","text":"Increase amperage until sparks stop"},{"key":"C","text":"Skip preweld inspection"},{"key":"D","text":"Cover the weld with slag"}]',
 'A', 'Fire prevention starts by removing, shielding, or controlling combustible hazards before hot work begins.',
 'easy', 'AWS Welding Handbook 7th Ed., Vol. 1, Safety', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Safety', 'Electrical Shock',
 'Why should welding leads and electrode holders be inspected for damaged insulation?',
 '[{"key":"A","text":"Damaged insulation can expose personnel to electric shock"},{"key":"B","text":"Damaged insulation makes all welds too small"},{"key":"C","text":"Insulation damage changes groove angle"},{"key":"D","text":"Insulation damage proves the weld is acceptable"}]',
 'A', 'Damaged electrical insulation can expose live conductors and increase shock risk.',
 'medium', 'AWS Welding Handbook 7th Ed., Vol. 1, Safety', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Codes & Documents', 'WPS Use',
 'What is the primary purpose of a Welding Procedure Specification?',
 '[{"key":"A","text":"To communicate the qualified variables and instructions for making the weld"},{"key":"B","text":"To record only the welder''s home address"},{"key":"C","text":"To replace all inspection acceptance criteria"},{"key":"D","text":"To guarantee every weld has zero discontinuities"}]',
 'A', 'A WPS gives the production welding requirements, including essential variables and working instructions allowed by the governing code or specification.',
 'easy', 'General CWI body of knowledge', 'A', 'needs_review', 'official_outline', 'Current', NULL, 'cwi_core'),

(cwi_id, 'Codes & Documents', 'PQR Use',
 'What does a Procedure Qualification Record normally document?',
 '[{"key":"A","text":"The actual variables and test results used to qualify a welding procedure"},{"key":"B","text":"Daily job-site weather only"},{"key":"C","text":"Only the final paint color"},{"key":"D","text":"The inspector''s travel expenses"}]',
 'A', 'A PQR records the procedure qualification test conditions and results that support a WPS.',
 'easy', 'General CWI body of knowledge', 'A', 'needs_review', 'official_outline', 'Current', NULL, 'cwi_core'),

(cwi_id, 'Codes & Documents', 'Welder Qualification',
 'A welder performance qualification test primarily demonstrates that the welder can:',
 '[{"key":"A","text":"Deposit sound weld metal within the qualified conditions"},{"key":"B","text":"Write the project specification"},{"key":"C","text":"Approve code changes"},{"key":"D","text":"Eliminate all NDE"}]',
 'A', 'Welder qualification focuses on the welder''s ability to make acceptable welds under specified test conditions.',
 'medium', 'General CWI body of knowledge', 'A', 'needs_review', 'official_outline', 'Current', NULL, 'cwi_core'),

(cwi_id, 'Codes & Documents', 'Acceptance Criteria',
 'When an inspector evaluates a discontinuity, acceptance is normally determined by:',
 '[{"key":"A","text":"The applicable code, standard, specification, or contract requirement"},{"key":"B","text":"Whether the discontinuity has an unusual name"},{"key":"C","text":"The inspector''s preference without project criteria"},{"key":"D","text":"The color of the welding helmet"}]',
 'A', 'A discontinuity becomes rejectable only when it exceeds the applicable acceptance criteria.',
 'medium', 'General CWI body of knowledge', 'A', 'needs_review', 'official_outline', 'Current', NULL, 'cwi_core'),

(cwi_id, 'Codes & Documents', 'Essential Variables',
 'Why are essential variables important in welding procedure control?',
 '[{"key":"A","text":"Changing them beyond allowed limits may require requalification"},{"key":"B","text":"They are optional notes with no effect"},{"key":"C","text":"They apply only to office furniture"},{"key":"D","text":"They replace base-metal identification"}]',
 'A', 'Essential variables are controlled because significant changes can affect mechanical properties or weld soundness.',
 'medium', 'General CWI body of knowledge', 'A', 'needs_review', 'official_outline', 'Current', NULL, 'cwi_core'),

(cwi_id, 'Weld Symbols', 'Reference Line',
 'On a standard welding symbol, where is the weld symbol placed to show arrow-side welding?',
 '[{"key":"A","text":"Below the reference line"},{"key":"B","text":"Above the reference line"},{"key":"C","text":"Inside the tail only"},{"key":"D","text":"On a separate drawing sheet only"}]',
 'A', 'In AWS welding-symbol convention, weld symbols below the reference line indicate arrow-side welding.',
 'easy', 'General CWI body of knowledge', 'A', 'needs_review', 'official_outline', 'Current', NULL, 'cwi_core'),

(cwi_id, 'Weld Symbols', 'Other Side',
 'On a standard welding symbol, where is the weld symbol placed to show other-side welding?',
 '[{"key":"A","text":"Above the reference line"},{"key":"B","text":"Below the reference line"},{"key":"C","text":"Only at the arrow tip"},{"key":"D","text":"Only in the title block"}]',
 'A', 'In AWS welding-symbol convention, weld symbols above the reference line indicate welding on the other side of the joint.',
 'easy', 'General CWI body of knowledge', 'A', 'needs_review', 'official_outline', 'Current', NULL, 'cwi_core'),

(cwi_id, 'Weld Symbols', 'All-Around Symbol',
 'What does the all-around symbol indicate when used on a welding symbol?',
 '[{"key":"A","text":"The weld is to be made all around the joint or member as applicable"},{"key":"B","text":"The weld is optional"},{"key":"C","text":"The weld is to be ground only"},{"key":"D","text":"The weld must be inspected by radiography only"}]',
 'A', 'The all-around symbol communicates that the specified weld continues around the joint where applicable.',
 'medium', 'General CWI body of knowledge', 'A', 'needs_review', 'official_outline', 'Current', NULL, 'cwi_core'),

(cwi_id, 'Weld Symbols', 'Tail Information',
 'What information is often placed in the tail of a welding symbol?',
 '[{"key":"A","text":"Process, specification, or other supplementary reference information"},{"key":"B","text":"Only the welder''s signature"},{"key":"C","text":"Only the base metal thickness"},{"key":"D","text":"The inspector''s phone number"}]',
 'A', 'The tail can be used for supplementary information such as process or specification references when needed.',
 'medium', 'General CWI body of knowledge', 'A', 'needs_review', 'official_outline', 'Current', NULL, 'cwi_core'),

(cwi_id, 'Visual Inspection', 'Fit-Up',
 'During fit-up inspection, which condition should be checked before welding starts?',
 '[{"key":"A","text":"Joint alignment, root opening, and cleanliness against requirements"},{"key":"B","text":"Final paint thickness only"},{"key":"C","text":"Postweld radiographic density only"},{"key":"D","text":"Tensile-test elongation after fracture"}]',
 'A', 'Preweld inspection verifies that joint preparation and fit-up meet the drawings, WPS, and applicable requirements before weld metal is deposited.',
 'easy', 'AWS Welding Handbook 7th Ed., Vol. 1, Inspection', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Visual Inspection', 'Root Opening',
 'Why can an excessive root opening be a workmanship concern?',
 '[{"key":"A","text":"It can change penetration behavior and require extra weld metal"},{"key":"B","text":"It always eliminates distortion"},{"key":"C","text":"It proves the WPS was followed"},{"key":"D","text":"It prevents burn-through in every case"}]',
 'A', 'Root opening affects weld penetration, fit-up, weld-metal volume, and distortion risk, so it must be controlled to requirements.',
 'medium', 'AWS Welding Handbook 7th Ed., Vol. 1, Inspection', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Visual Inspection', 'Interpass Cleaning',
 'Why is interpass cleaning important in multipass welding?',
 '[{"key":"A","text":"It helps prevent slag or other material from being trapped between passes"},{"key":"B","text":"It makes preheat unnecessary in every procedure"},{"key":"C","text":"It changes DC current to AC current"},{"key":"D","text":"It removes all residual stress"}]',
 'A', 'Cleaning between passes removes slag and contaminants that could otherwise become trapped as inclusions.',
 'easy', 'AWS Welding Handbook 7th Ed., Vol. 1, Inspection', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Fabrication Math', 'Fillet Weld Area',
 'For an equal-leg fillet weld, which change increases theoretical throat area per unit length?',
 '[{"key":"A","text":"Increasing the fillet weld leg size"},{"key":"B","text":"Reducing the leg size"},{"key":"C","text":"Removing one leg of the weld"},{"key":"D","text":"Changing the drawing scale only"}]',
 'A', 'For an equal-leg fillet weld, larger leg size increases the effective throat and cross-sectional area per unit length.',
 'medium', 'General CWI body of knowledge', 'A', 'needs_review', 'official_outline', 'Current', NULL, 'cwi_core'),

(cwi_id, 'Fabrication Math', 'Unit Conversion',
 'A 3/8 in fillet weld is closest to which decimal inch value?',
 '[{"key":"A","text":"0.375 in"},{"key":"B","text":"0.125 in"},{"key":"C","text":"0.250 in"},{"key":"D","text":"0.875 in"}]',
 'A', 'Three-eighths equals 3 divided by 8, or 0.375.',
 'easy', 'General CWI body of knowledge', 'A', 'needs_review', 'official_outline', 'Current', NULL, 'cwi_core'),

(cwi_id, 'Fabrication Math', 'Weld Length',
 'If a drawing requires four 6 in intermittent weld segments, what total weld length is required?',
 '[{"key":"A","text":"24 in"},{"key":"B","text":"10 in"},{"key":"C","text":"12 in"},{"key":"D","text":"30 in"}]',
 'A', 'Four segments multiplied by 6 inches per segment equals 24 inches of total weld length.',
 'easy', 'General CWI body of knowledge', 'A', 'needs_review', 'official_outline', 'Current', NULL, 'cwi_core'),

(cwi_id, 'Weld Discontinuities', 'Overlap',
 'Overlap at the weld toe is best described as:',
 '[{"key":"A","text":"Weld metal that rolls onto the base metal surface without proper fusion"},{"key":"B","text":"A specified groove angle"},{"key":"C","text":"A rounded gas pore below the surface"},{"key":"D","text":"A properly blended weld contour"}]',
 'A', 'Overlap is weld metal protruding beyond the weld toe or root without fusing to the adjacent base metal.',
 'medium', 'AWS Welding Handbook 7th Ed., Vol. 1, Ch. 5', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core');

END
$batch$;
