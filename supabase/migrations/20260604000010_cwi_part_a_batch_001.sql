-- Original AWS CWI Part A candidate questions.
-- These remain excluded from user exams until an SME changes review_status to published.

DO $batch$
DECLARE
  cwi_id UUID := '11111111-0000-0000-0000-000000000001';
BEGIN

INSERT INTO questions (certification_id, category, subcategory, body, options, correct_answer, explanation, difficulty, reference, exam_part, review_status, source_kind) VALUES
(cwi_id, 'Safety', 'Ventilation',
 'Why is local exhaust ventilation commonly positioned close to the welding arc?',
 '[{"key":"A","text":"To increase electrode deposition rate"},{"key":"B","text":"To capture fumes near their source before they enter the welder''s breathing zone"},{"key":"C","text":"To cool the completed weld rapidly"},{"key":"D","text":"To prevent magnetic arc blow"}]',
 'B',
 'Local exhaust ventilation is most effective when it captures welding fumes near the point where they are generated, before they spread through the work area or reach the breathing zone.',
 'easy', 'AWS Z49.1', 'A', 'needs_review', 'general_reference'),

(cwi_id, 'Safety', 'Confined Spaces',
 'Before welding begins inside a confined space, which control is most fundamental?',
 '[{"key":"A","text":"Increase welding current"},{"key":"B","text":"Complete atmospheric evaluation and establish the required entry controls"},{"key":"C","text":"Use only stainless steel electrodes"},{"key":"D","text":"Remove all tack welds"}]',
 'B',
 'Confined-space welding requires evaluation of atmospheric and entry hazards before work begins, followed by the controls required by the applicable safety program.',
 'medium', 'AWS Z49.1', 'A', 'needs_review', 'general_reference'),

(cwi_id, 'Safety', 'Compressed Gas',
 'What is the safest method for moving a compressed-gas cylinder a significant distance in a shop?',
 '[{"key":"A","text":"Roll it horizontally on the floor"},{"key":"B","text":"Carry it by the valve-protection cap"},{"key":"C","text":"Secure it upright on an approved cylinder cart"},{"key":"D","text":"Drag it by a connected hose"}]',
 'C',
 'Compressed-gas cylinders should be secured and moved with suitable handling equipment. The valve-protection cap and connected hoses are not lifting or pulling devices.',
 'easy', 'AWS Z49.1', 'A', 'needs_review', 'general_reference'),

(cwi_id, 'Safety', 'Electrical',
 'Which condition most directly increases the risk of electric shock during arc welding?',
 '[{"key":"A","text":"Dry gloves and dry clothing"},{"key":"B","text":"Working in wet clothing while contacting the work circuit"},{"key":"C","text":"Using a clean work lead connection"},{"key":"D","text":"Keeping electrode holders insulated"}]',
 'B',
 'Moisture lowers electrical resistance and can greatly increase shock risk. Dry protective clothing, sound insulation, and proper work practices reduce exposure.',
 'easy', 'AWS Z49.1', 'A', 'needs_review', 'general_reference'),

(cwi_id, 'Destructive Testing', 'Tensile Testing',
 'In a transverse tensile test of a welded joint, what is the primary measured result?',
 '[{"key":"A","text":"Resistance to surface indentation"},{"key":"B","text":"Maximum stress sustained before fracture"},{"key":"C","text":"Depth of weld penetration"},{"key":"D","text":"Amount of diffusible hydrogen"}]',
 'B',
 'A tensile test loads the specimen in tension and determines the stress it can sustain. The fracture location also provides useful information about the joint.',
 'easy', 'AWS B4.0', 'A', 'needs_review', 'general_reference'),

(cwi_id, 'Destructive Testing', 'Bend Testing',
 'What is the main purpose of a guided bend test on a weld qualification specimen?',
 '[{"key":"A","text":"To reveal soundness and ductility by straining the weld and heat-affected zone"},{"key":"B","text":"To measure shielding-gas flow"},{"key":"C","text":"To determine electrode moisture content"},{"key":"D","text":"To measure residual magnetism"}]',
 'A',
 'A guided bend test plastically strains the weld region so open discontinuities and inadequate ductility can be observed on the bent surface.',
 'medium', 'AWS B4.0', 'A', 'needs_review', 'general_reference'),

(cwi_id, 'Destructive Testing', 'Hardness Testing',
 'A hardness test primarily measures a material''s resistance to:',
 '[{"key":"A","text":"Localized indentation"},{"key":"B","text":"Radiation transmission"},{"key":"C","text":"Electrical current flow"},{"key":"D","text":"Chemical corrosion only"}]',
 'A',
 'Common hardness tests evaluate resistance to localized indentation under controlled loading. Hardness can help indicate changes caused by welding thermal cycles.',
 'easy', 'AWS B4.0', 'A', 'needs_review', 'general_reference'),

(cwi_id, 'Destructive Testing', 'Impact Testing',
 'Why is a notch intentionally machined into a Charpy impact specimen?',
 '[{"key":"A","text":"To concentrate stress at a controlled location"},{"key":"B","text":"To prevent the specimen from fracturing"},{"key":"C","text":"To increase specimen thickness"},{"key":"D","text":"To measure weld reinforcement"}]',
 'A',
 'The notch creates a controlled stress concentration so the energy absorbed during rapid fracture can be compared under standardized conditions.',
 'medium', 'AWS B4.0', 'A', 'needs_review', 'general_reference'),

(cwi_id, 'Fabrication Math', 'Unit Conversion',
 'A weld length is specified as 0.75 ft. What is the equivalent length in inches?',
 '[{"key":"A","text":"6 in."},{"key":"B","text":"8 in."},{"key":"C","text":"9 in."},{"key":"D","text":"12 in."}]',
 'C',
 'One foot equals 12 inches. Multiplying 0.75 by 12 gives 9 inches.',
 'easy', 'General fabrication mathematics', 'A', 'needs_review', 'general_reference'),

(cwi_id, 'Fabrication Math', 'Area',
 'What is the cross-sectional area of a rectangular plate that is 2 in. wide and 0.5 in. thick?',
 '[{"key":"A","text":"0.5 sq in."},{"key":"B","text":"1.0 sq in."},{"key":"C","text":"2.5 sq in."},{"key":"D","text":"4.0 sq in."}]',
 'B',
 'The area of a rectangle is width multiplied by thickness: 2 in. times 0.5 in. equals 1.0 square inch.',
 'easy', 'General fabrication mathematics', 'A', 'needs_review', 'general_reference'),

(cwi_id, 'Fabrication Math', 'Travel Speed',
 'A welder completes 18 inches of weld in 3 minutes. What is the average travel speed?',
 '[{"key":"A","text":"3 in./min"},{"key":"B","text":"6 in./min"},{"key":"C","text":"9 in./min"},{"key":"D","text":"54 in./min"}]',
 'B',
 'Average travel speed equals distance divided by time. Eighteen inches divided by three minutes is six inches per minute.',
 'easy', 'General fabrication mathematics', 'A', 'needs_review', 'general_reference'),

(cwi_id, 'Fabrication Math', 'Percentage',
 'Inspection finds 4 rejectable welds among 80 welds examined. What percentage was rejectable?',
 '[{"key":"A","text":"2%"},{"key":"B","text":"4%"},{"key":"C","text":"5%"},{"key":"D","text":"20%"}]',
 'C',
 'The rejectable percentage is 4 divided by 80, multiplied by 100, which equals 5 percent.',
 'easy', 'General fabrication mathematics', 'A', 'needs_review', 'general_reference'),

(cwi_id, 'Weld Symbols', 'Reference Line',
 'On a standard welding symbol, where is the weld symbol placed to distinguish arrow-side from other-side welding?',
 '[{"key":"A","text":"Above or below the reference line"},{"key":"B","text":"Inside the tail only"},{"key":"C","text":"At the arrow tip only"},{"key":"D","text":"In a separate inspection report"}]',
 'A',
 'Placement relative to the reference line communicates whether the required weld applies to the arrow side or the other side of the joint.',
 'easy', 'AWS A2.4', 'A', 'needs_review', 'general_reference'),

(cwi_id, 'Weld Symbols', 'Tail',
 'What information is commonly placed in the tail of a welding symbol when needed?',
 '[{"key":"A","text":"Only the welder''s name"},{"key":"B","text":"Process, specification, or other reference information"},{"key":"C","text":"The measured plate thickness only"},{"key":"D","text":"The inspection acceptance result"}]',
 'B',
 'The tail can contain process, specification, procedure, or other reference information needed to clarify the welding requirement.',
 'easy', 'AWS A2.4', 'A', 'needs_review', 'general_reference'),

(cwi_id, 'Weld Symbols', 'Contour',
 'A contour symbol on a welding symbol communicates the required:',
 '[{"key":"A","text":"Final weld-face shape"},{"key":"B","text":"Base-metal chemistry"},{"key":"C","text":"Welder certification number"},{"key":"D","text":"Electrode storage temperature"}]',
 'A',
 'Contour symbols specify the desired finished weld-face shape, such as flush, convex, or concave.',
 'medium', 'AWS A2.4', 'A', 'needs_review', 'general_reference'),

(cwi_id, 'Weld Symbols', 'All-Around',
 'What does an all-around symbol indicate?',
 '[{"key":"A","text":"Weld only at the arrow location"},{"key":"B","text":"Weld continuously around the joint where applicable"},{"key":"C","text":"Inspect the weld from every direction"},{"key":"D","text":"Use a circular electrode"}]',
 'B',
 'The all-around symbol indicates that the weld requirement continues around the joint at the indicated location.',
 'medium', 'AWS A2.4', 'A', 'needs_review', 'general_reference'),

(cwi_id, 'Codes & Documents', 'WPS',
 'Which document gives the welder the required variables and instructions for producing a specific weld?',
 '[{"key":"A","text":"Welder continuity log"},{"key":"B","text":"Welding Procedure Specification"},{"key":"C","text":"Material test report only"},{"key":"D","text":"Inspection invoice"}]',
 'B',
 'A Welding Procedure Specification communicates the welding variables and instructions required to make the production weld.',
 'easy', 'AWS B5.1', 'A', 'needs_review', 'general_reference'),

(cwi_id, 'Codes & Documents', 'PQR',
 'What is the principal purpose of a Procedure Qualification Record?',
 '[{"key":"A","text":"To document the actual variables and test results used to qualify a welding procedure"},{"key":"B","text":"To list every welder employed by a company"},{"key":"C","text":"To replace the applicable construction code"},{"key":"D","text":"To record only visual inspection results from production welds"}]',
 'A',
 'A Procedure Qualification Record documents the variables used on the qualification test weld and the resulting test results that support the procedure.',
 'medium', 'AWS B5.1', 'A', 'needs_review', 'general_reference'),

(cwi_id, 'Codes & Documents', 'Welder Qualification',
 'A welder performance qualification primarily demonstrates that the welder can:',
 '[{"key":"A","text":"Write a construction code"},{"key":"B","text":"Produce an acceptable weld using the qualified process and conditions"},{"key":"C","text":"Approve their own inspection reports"},{"key":"D","text":"Select any filler metal without restriction"}]',
 'B',
 'Welder performance qualification demonstrates the individual''s ability to deposit acceptable weld metal within the variables covered by the qualification.',
 'medium', 'AWS B5.1', 'A', 'needs_review', 'general_reference'),

(cwi_id, 'Codes & Documents', 'Document Control',
 'Why should a welding inspector verify the revision or edition of a governing document before using it?',
 '[{"key":"A","text":"Requirements may differ between revisions or editions"},{"key":"B","text":"Older documents contain no technical information"},{"key":"C","text":"Document editions affect only page numbering"},{"key":"D","text":"Only the newest edition is always contractually required"}]',
 'A',
 'Technical and acceptance requirements can change. The inspector must use the edition invoked by the contract or governing documents, not simply assume the newest edition applies.',
 'medium', 'AWS B5.1', 'A', 'needs_review', 'general_reference');

END
$batch$;
