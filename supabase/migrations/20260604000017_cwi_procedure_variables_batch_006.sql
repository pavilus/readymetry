-- Original CWI Part A procedure-variable, inspection, and discontinuity candidates.
-- Questions are aligned to general current CWI body-of-knowledge topics.
-- Keep in needs_review until independently reviewed.

DO $batch$
DECLARE
  cwi_id UUID := '11111111-0000-0000-0000-000000000001';
BEGIN

INSERT INTO questions (
  certification_id, category, subcategory, body, options, correct_answer,
  explanation, difficulty, reference, exam_part, review_status, source_kind,
  source_edition, source_url, question_pool
) VALUES
(cwi_id, 'Codes & Documents', 'WPS Variables',
 'Which item is most likely to be controlled as a welding procedure variable?',
 '[{"key":"A","text":"Welding process"},{"key":"B","text":"Inspector shoe size"},{"key":"C","text":"Shop parking location"},{"key":"D","text":"Lunch break duration"}]',
 'A', 'The welding process is a procedure variable because changing it can affect weld characteristics and qualification requirements.',
 'easy', 'General CWI body of knowledge', 'A', 'needs_review', 'official_outline', 'Current', NULL, 'cwi_core'),

(cwi_id, 'Codes & Documents', 'WPS Variables',
 'Why should an inspector compare production welding against the approved WPS?',
 '[{"key":"A","text":"To verify that the required variables and instructions are being followed"},{"key":"B","text":"To rewrite the governing code during production"},{"key":"C","text":"To choose acceptance criteria by preference"},{"key":"D","text":"To avoid documenting observations"}]',
 'A', 'A key inspection function is confirming that production welding follows the approved procedure requirements.',
 'easy', 'General CWI body of knowledge', 'A', 'needs_review', 'official_outline', 'Current', NULL, 'cwi_core'),

(cwi_id, 'Codes & Documents', 'Material Control',
 'Why is base-metal identification important before welding?',
 '[{"key":"A","text":"The WPS, filler metal, preheat, and acceptance requirements may depend on the material"},{"key":"B","text":"It determines only the painter''s name"},{"key":"C","text":"It eliminates the need for fit-up inspection"},{"key":"D","text":"It proves no discontinuities can occur"}]',
 'A', 'Material identity affects procedure selection and welding controls, so it must match the job requirements.',
 'medium', 'General CWI body of knowledge', 'A', 'needs_review', 'official_outline', 'Current', NULL, 'cwi_core'),

(cwi_id, 'Codes & Documents', 'Filler Metal Control',
 'What is a common reason for controlling filler-metal classification in production welding?',
 '[{"key":"A","text":"To ensure the filler metal matches the approved procedure and required properties"},{"key":"B","text":"To change weld symbols automatically"},{"key":"C","text":"To replace joint preparation"},{"key":"D","text":"To prevent all angular distortion"}]',
 'A', 'Filler-metal classification is tied to procedure qualification, weld metal properties, and production requirements.',
 'medium', 'General CWI body of knowledge', 'A', 'needs_review', 'official_outline', 'Current', NULL, 'cwi_core'),

(cwi_id, 'Codes & Documents', 'Preheat Control',
 'If a WPS specifies minimum preheat, when should that minimum be satisfied?',
 '[{"key":"A","text":"Before welding begins and maintained as required during welding"},{"key":"B","text":"Only after final visual inspection"},{"key":"C","text":"Only after painting"},{"key":"D","text":"Only when the welder requests it"}]',
 'A', 'Minimum preheat is a production control that must be established before welding and maintained according to the procedure.',
 'medium', 'General CWI body of knowledge', 'A', 'needs_review', 'official_outline', 'Current', NULL, 'cwi_core'),

(cwi_id, 'Codes & Documents', 'Interpass Temperature',
 'Why can maximum interpass temperature be specified on a WPS?',
 '[{"key":"A","text":"To control thermal effects on weld and base-metal properties"},{"key":"B","text":"To increase weld size without limit"},{"key":"C","text":"To eliminate the need for shielding"},{"key":"D","text":"To make all weld symbols unnecessary"}]',
 'A', 'Maximum interpass temperature limits heat accumulation that may affect microstructure, toughness, or other required properties.',
 'hard', 'General CWI body of knowledge', 'A', 'needs_review', 'official_outline', 'Current', NULL, 'cwi_core'),

(cwi_id, 'Visual Inspection', 'Before Welding',
 'Which inspection activity is normally performed before welding starts?',
 '[{"key":"A","text":"Verify joint preparation, fit-up, material, and WPS availability"},{"key":"B","text":"Measure final weld reinforcement after completion only"},{"key":"C","text":"Perform final leak testing only"},{"key":"D","text":"Approve undocumented procedure changes"}]',
 'A', 'Preweld inspection checks conditions that are difficult or impossible to correct after welding begins.',
 'easy', 'General CWI body of knowledge', 'A', 'needs_review', 'official_outline', 'Current', NULL, 'cwi_core'),

(cwi_id, 'Visual Inspection', 'During Welding',
 'Which item is most appropriate for inspection during multipass welding?',
 '[{"key":"A","text":"Interpass cleaning and interpass temperature"},{"key":"B","text":"Final coating color only"},{"key":"C","text":"Service-life fatigue history"},{"key":"D","text":"Post-production invoice approval"}]',
 'A', 'During welding, an inspector may verify interpass conditions such as cleaning, temperature, bead placement, and procedural compliance.',
 'easy', 'General CWI body of knowledge', 'A', 'needs_review', 'official_outline', 'Current', NULL, 'cwi_core'),

(cwi_id, 'Visual Inspection', 'After Welding',
 'Which item is normally checked during final visual inspection?',
 '[{"key":"A","text":"Weld size, contour, surface condition, and completeness"},{"key":"B","text":"Only the shipping address"},{"key":"C","text":"Only the arc sound during welding"},{"key":"D","text":"Only the purchase order number"}]',
 'A', 'Final visual inspection evaluates observable completed-weld requirements, including size, profile, surface discontinuities, and completion.',
 'easy', 'General CWI body of knowledge', 'A', 'needs_review', 'official_outline', 'Current', NULL, 'cwi_core'),

(cwi_id, 'Visual Inspection', 'Repair Verification',
 'After a weld repair is completed, what should the inspector verify?',
 '[{"key":"A","text":"The repair was made to the approved requirements and reinspected as required"},{"key":"B","text":"The original rejection can be ignored"},{"key":"C","text":"No records are needed for any repair"},{"key":"D","text":"The repaired area is automatically acceptable"}]',
 'A', 'Repairs require control and follow-up inspection to verify the corrected weld meets applicable requirements.',
 'medium', 'General CWI body of knowledge', 'A', 'needs_review', 'official_outline', 'Current', NULL, 'cwi_core'),

(cwi_id, 'Weld Discontinuities', 'Undercut',
 'Undercut is best described as:',
 '[{"key":"A","text":"A groove melted into base metal adjacent to the weld toe or root and left unfilled"},{"key":"B","text":"Extra weld metal smoothly blended into the joint"},{"key":"C","text":"A rounded internal gas cavity only"},{"key":"D","text":"A planned backing bar"}]',
 'A', 'Undercut is a surface discontinuity where base metal has been melted away and not filled with weld metal.',
 'easy', 'General CWI body of knowledge', 'A', 'needs_review', 'official_outline', 'Current', NULL, 'cwi_core'),

(cwi_id, 'Weld Discontinuities', 'Porosity',
 'Which appearance is most typical of porosity exposed on a weld surface?',
 '[{"key":"A","text":"Rounded holes or pits caused by gas cavities"},{"key":"B","text":"A straight reference line"},{"key":"C","text":"A smooth machined bevel only"},{"key":"D","text":"A required all-around symbol"}]',
 'A', 'Porosity is caused by gas cavities and may appear as rounded holes or pits when open to the surface.',
 'easy', 'General CWI body of knowledge', 'A', 'needs_review', 'official_outline', 'Current', NULL, 'cwi_core'),

(cwi_id, 'Weld Discontinuities', 'Arc Strikes',
 'Why can an arc strike outside the weld area be rejectable?',
 '[{"key":"A","text":"It can create a localized hardened or cracked area on the base metal"},{"key":"B","text":"It improves every base-metal property"},{"key":"C","text":"It removes the need for preheat"},{"key":"D","text":"It is only a drawing note"}]',
 'A', 'Arc strikes can locally heat and rapidly cool base metal, potentially creating cracks or hard areas.',
 'medium', 'General CWI body of knowledge', 'A', 'needs_review', 'official_outline', 'Current', NULL, 'cwi_core'),

(cwi_id, 'NDE Methods', 'Method Selection',
 'Which factor helps determine the appropriate NDE method for a weld?',
 '[{"key":"A","text":"The type and location of discontinuity to be detected"},{"key":"B","text":"The inspector''s favorite acronym only"},{"key":"C","text":"The color of the shop floor"},{"key":"D","text":"Whether the weld symbol has a tail"}]',
 'A', 'NDE method selection depends on material, geometry, accessibility, and whether expected discontinuities are surface, near-surface, or internal.',
 'medium', 'General CWI body of knowledge', 'A', 'needs_review', 'official_outline', 'Current', NULL, 'cwi_core'),

(cwi_id, 'NDE Methods', 'Surface Methods',
 'Which two NDE methods are commonly used for surface-breaking discontinuities?',
 '[{"key":"A","text":"Liquid penetrant testing and magnetic particle testing"},{"key":"B","text":"Tension testing and bend testing"},{"key":"C","text":"Macroetching and chemical analysis only"},{"key":"D","text":"Hardness testing and weighing"}]',
 'A', 'Liquid penetrant testing finds surface-breaking indications, and magnetic particle testing can find surface and near-surface indications in ferromagnetic materials.',
 'easy', 'General CWI body of knowledge', 'A', 'needs_review', 'official_outline', 'Current', NULL, 'cwi_core'),

(cwi_id, 'NDE Methods', 'Volumetric Methods',
 'Which NDE methods are commonly considered volumetric methods for weld examination?',
 '[{"key":"A","text":"Radiographic testing and ultrasonic testing"},{"key":"B","text":"Visual testing and tape measurement only"},{"key":"C","text":"Liquid penetrant testing and final painting"},{"key":"D","text":"Magnetic particle testing and hardness conversion only"}]',
 'A', 'Radiographic and ultrasonic testing are commonly used to examine weld volume for internal discontinuities.',
 'medium', 'General CWI body of knowledge', 'A', 'needs_review', 'official_outline', 'Current', NULL, 'cwi_core'),

(cwi_id, 'Fabrication Math', 'Heat Input',
 'Using the common heat-input relationship, what happens if amperage increases while voltage and travel speed remain constant?',
 '[{"key":"A","text":"Heat input per unit length increases"},{"key":"B","text":"Heat input per unit length decreases to zero"},{"key":"C","text":"Travel speed automatically doubles"},{"key":"D","text":"The weld symbol changes side"}]',
 'A', 'Heat input is proportional to current when voltage and travel speed are unchanged.',
 'medium', 'General CWI body of knowledge', 'A', 'needs_review', 'official_outline', 'Current', NULL, 'cwi_core'),

(cwi_id, 'Fabrication Math', 'Decimal Conversion',
 'A 1/4 in fillet weld is equal to which decimal inch value?',
 '[{"key":"A","text":"0.250 in"},{"key":"B","text":"0.125 in"},{"key":"C","text":"0.375 in"},{"key":"D","text":"0.500 in"}]',
 'A', 'One-fourth equals 1 divided by 4, or 0.250.',
 'easy', 'General CWI body of knowledge', 'A', 'needs_review', 'official_outline', 'Current', NULL, 'cwi_core'),

(cwi_id, 'Weld Symbols', 'Groove Angle',
 'On a groove-weld symbol, a number associated with groove angle communicates:',
 '[{"key":"A","text":"The included angle or groove angle required by the symbol"},{"key":"B","text":"The welder''s badge number"},{"key":"C","text":"The final paint thickness"},{"key":"D","text":"The number of inspectors required"}]',
 'A', 'Groove-weld symbols can include dimensional information such as groove angle where required.',
 'medium', 'General CWI body of knowledge', 'A', 'needs_review', 'official_outline', 'Current', NULL, 'cwi_core'),

(cwi_id, 'Weld Symbols', 'Intermittent Welds',
 'For an intermittent fillet weld symbol, what does pitch usually describe?',
 '[{"key":"A","text":"The center-to-center spacing of weld segments"},{"key":"B","text":"The electrode coating thickness"},{"key":"C","text":"The sound frequency of ultrasonic testing"},{"key":"D","text":"The hardness value of the base metal"}]',
 'A', 'Pitch for intermittent welds is commonly the center-to-center spacing between weld increments.',
 'medium', 'General CWI body of knowledge', 'A', 'needs_review', 'official_outline', 'Current', NULL, 'cwi_core');

END
$batch$;
