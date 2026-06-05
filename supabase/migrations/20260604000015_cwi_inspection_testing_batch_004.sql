-- Original CWI Part A inspection, testing, symbols, and math candidates.
-- Facts were checked against AWS Welding Handbook 7th Ed., Vol. 1 (1976).
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
(cwi_id, 'Destructive Testing', 'Tension Testing',
 'What property is most directly determined by pulling a welded specimen in a tensile test until it fails?',
 '[{"key":"A","text":"Tensile strength"},{"key":"B","text":"Magnetic field strength"},{"key":"C","text":"Surface roughness"},{"key":"D","text":"Arc voltage"}]',
 'A', 'A tensile test loads the specimen in tension and is used to determine strength-related behavior such as tensile strength and fracture location.',
 'easy', 'AWS Welding Handbook 7th Ed., Vol. 1, Ch. 5', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Destructive Testing', 'Bend Testing',
 'Why are guided bend tests commonly used for weld qualification?',
 '[{"key":"A","text":"They strain the weld region to reveal lack of soundness or ductility"},{"key":"B","text":"They measure shielding-gas flow rate"},{"key":"C","text":"They determine electrode polarity"},{"key":"D","text":"They calculate weld travel speed directly"}]',
 'A', 'Bend tests plastically strain the weld and adjacent material so discontinuities or inadequate ductility can be exposed.',
 'medium', 'AWS Welding Handbook 7th Ed., Vol. 1, Ch. 5', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Destructive Testing', 'Bend Testing',
 'In bend testing, which specimen orientation places the weld face in tension?',
 '[{"key":"A","text":"Face bend"},{"key":"B","text":"Root bend"},{"key":"C","text":"Macroetch only"},{"key":"D","text":"Hardness traverse"}]',
 'A', 'A face-bend specimen is bent so the face side of the weld is on the tensile surface.',
 'medium', 'AWS Welding Handbook 7th Ed., Vol. 1, Ch. 5', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Destructive Testing', 'Bend Testing',
 'In bend testing, which specimen orientation places the weld root in tension?',
 '[{"key":"A","text":"Root bend"},{"key":"B","text":"Face bend"},{"key":"C","text":"Longitudinal tension only"},{"key":"D","text":"Charpy impact"}]',
 'A', 'A root-bend specimen is bent so the root side of the weld is on the tensile surface.',
 'medium', 'AWS Welding Handbook 7th Ed., Vol. 1, Ch. 5', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Destructive Testing', 'Impact Testing',
 'What does a Charpy V-notch impact test primarily measure?',
 '[{"key":"A","text":"Energy absorbed during fracture of a notched specimen"},{"key":"B","text":"Electrode deposition efficiency"},{"key":"C","text":"Weld length per minute"},{"key":"D","text":"Shielding-gas purity"}]',
 'A', 'The Charpy V-notch test measures the energy absorbed when a notched specimen fractures under impact loading.',
 'medium', 'AWS Welding Handbook 7th Ed., Vol. 1, Ch. 5', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Destructive Testing', 'Hardness Testing',
 'Why might a welding inspector request hardness testing across a weld and heat-affected zone?',
 '[{"key":"A","text":"To identify unusually hard areas that may indicate brittle microstructures"},{"key":"B","text":"To directly measure weld length"},{"key":"C","text":"To prove shielding gas was argon"},{"key":"D","text":"To determine the exact weld symbol used"}]',
 'A', 'Hardness traverses can help detect hard regions associated with thermal cycles and possible brittle microstructures.',
 'hard', 'AWS Welding Handbook 7th Ed., Vol. 1, Ch. 5', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Visual Inspection', 'Surface Discontinuities',
 'Which discontinuity is most readily detected by direct visual inspection?',
 '[{"key":"A","text":"Surface undercut at the weld toe"},{"key":"B","text":"A small buried slag inclusion"},{"key":"C","text":"A deep internal lack of fusion hidden by sound surface metal"},{"key":"D","text":"A subsurface pore completely enclosed in weld metal"}]',
 'A', 'Visual inspection is best suited to surface conditions such as undercut, overlap, profile, cracks open to the surface, and dimensional issues.',
 'easy', 'AWS Welding Handbook 7th Ed., Vol. 1, Ch. 5', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Visual Inspection', 'Weld Profile',
 'Why can an abrupt weld reinforcement transition be significant?',
 '[{"key":"A","text":"It can increase stress concentration at the weld toe"},{"key":"B","text":"It always makes the weld stronger"},{"key":"C","text":"It eliminates fatigue concerns"},{"key":"D","text":"It proves the weld was made with GTAW"}]',
 'A', 'Abrupt profile transitions can concentrate stress, especially at toes and surface discontinuities.',
 'medium', 'AWS Welding Handbook 7th Ed., Vol. 1, Ch. 5', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Visual Inspection', 'Dimensional Inspection',
 'Which item is a normal part of visual and dimensional weld inspection?',
 '[{"key":"A","text":"Checking weld size and location against requirements"},{"key":"B","text":"Determining alloy chemistry by eyesight alone"},{"key":"C","text":"Measuring internal flaws without equipment"},{"key":"D","text":"Replacing the WPS"}]',
 'A', 'Visual inspection includes verifying observable workmanship and dimensional requirements such as size, length, location, and profile.',
 'easy', 'AWS Welding Handbook 7th Ed., Vol. 1, Ch. 5', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Weld Discontinuities', 'Incomplete Fusion',
 'Incomplete fusion is best described as:',
 '[{"key":"A","text":"Failure of weld metal to fuse with adjacent weld metal or base metal"},{"key":"B","text":"A rounded gas cavity"},{"key":"C","text":"A smooth convex weld face"},{"key":"D","text":"Excess penetration beyond the root"}]',
 'A', 'Incomplete fusion occurs when adjacent weld metal or base metal surfaces are not properly fused.',
 'easy', 'AWS Welding Handbook 7th Ed., Vol. 1, Ch. 5', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Weld Discontinuities', 'Incomplete Penetration',
 'Incomplete joint penetration most directly means:',
 '[{"key":"A","text":"The weld metal did not extend through the required joint thickness at the root"},{"key":"B","text":"The weld face is too smooth"},{"key":"C","text":"The electrode coating was too thick"},{"key":"D","text":"The weld was inspected visually"}]',
 'A', 'Incomplete joint penetration is a root or joint condition where the required penetration was not achieved.',
 'medium', 'AWS Welding Handbook 7th Ed., Vol. 1, Ch. 5', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Weld Discontinuities', 'Slag Inclusion',
 'A slag inclusion is most likely associated with which situation?',
 '[{"key":"A","text":"Nonmetallic slag trapped in weld metal between passes or at the root"},{"key":"B","text":"A perfectly cleaned GTAW autogenous weld"},{"key":"C","text":"A tensile specimen elongating uniformly"},{"key":"D","text":"A weld symbol arrow changing direction"}]',
 'A', 'Slag inclusions are nonmetallic trapped materials that can remain when slag is not removed or is trapped by poor technique.',
 'medium', 'AWS Welding Handbook 7th Ed., Vol. 1, Ch. 5', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'NDE Methods', 'Liquid Penetrant Testing',
 'Liquid penetrant testing is primarily used to find:',
 '[{"key":"A","text":"Surface-breaking discontinuities"},{"key":"B","text":"Only deeply buried volumetric flaws"},{"key":"C","text":"Chemical composition"},{"key":"D","text":"Exact residual stress distribution"}]',
 'A', 'Liquid penetrant testing reveals discontinuities open to the surface by drawing penetrant back out during development.',
 'easy', 'AWS Welding Handbook 7th Ed., Vol. 1, Ch. 5', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'NDE Methods', 'Magnetic Particle Testing',
 'Magnetic particle testing is most appropriate for detecting surface or near-surface discontinuities in:',
 '[{"key":"A","text":"Ferromagnetic materials"},{"key":"B","text":"Transparent plastics only"},{"key":"C","text":"Any nonmagnetic metal without limitation"},{"key":"D","text":"Liquid weld pools"}]',
 'A', 'Magnetic particle testing relies on magnetization and is therefore used on ferromagnetic materials.',
 'easy', 'AWS Welding Handbook 7th Ed., Vol. 1, Ch. 5', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'NDE Methods', 'Radiographic Testing',
 'Radiographic testing is especially useful for detecting which type of weld discontinuity?',
 '[{"key":"A","text":"Internal volumetric discontinuities such as porosity"},{"key":"B","text":"Only surface color changes"},{"key":"C","text":"Weld symbol errors"},{"key":"D","text":"Incorrect WPS formatting"}]',
 'A', 'Radiography is commonly effective for internal volumetric discontinuities, including porosity and some slag inclusions.',
 'medium', 'AWS Welding Handbook 7th Ed., Vol. 1, Ch. 5', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'NDE Methods', 'Ultrasonic Testing',
 'Ultrasonic testing uses which physical principle?',
 '[{"key":"A","text":"High-frequency sound waves reflected by material boundaries or discontinuities"},{"key":"B","text":"Visible dye bleeding only"},{"key":"C","text":"Magnetic attraction of powder to every metal"},{"key":"D","text":"Direct measurement of carbon equivalent"}]',
 'A', 'Ultrasonic testing sends high-frequency sound into material and evaluates reflected or transmitted sound energy.',
 'medium', 'AWS Welding Handbook 7th Ed., Vol. 1, Ch. 5', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Weld Symbols', 'Fillet Weld Size',
 'On a fillet weld, what is the leg size?',
 '[{"key":"A","text":"The distance from the root of the joint to the toe of the fillet weld"},{"key":"B","text":"The distance between two separate weld symbols"},{"key":"C","text":"The length of the electrode holder"},{"key":"D","text":"The amount of shielding gas flow"}]',
 'A', 'Fillet weld leg size is measured from the root to the toe along a member surface.',
 'easy', 'AWS Welding Handbook 7th Ed., Vol. 1, Terms and Definitions', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Weld Symbols', 'Groove Welds',
 'Which weld type is made in a groove between members to be joined?',
 '[{"key":"A","text":"Groove weld"},{"key":"B","text":"Spot weld only"},{"key":"C","text":"Surfacing weld only"},{"key":"D","text":"Plug weld only"}]',
 'A', 'A groove weld is deposited in a groove prepared or existing between members.',
 'easy', 'AWS Welding Handbook 7th Ed., Vol. 1, Terms and Definitions', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Fabrication Math', 'Heat Input Concept',
 'When voltage and current are constant, increasing travel speed generally has what effect on heat input per unit length?',
 '[{"key":"A","text":"It decreases heat input per unit length"},{"key":"B","text":"It increases heat input per unit length without limit"},{"key":"C","text":"It has no effect"},{"key":"D","text":"It changes direct current to alternating current"}]',
 'A', 'Heat input per unit length is inversely related to travel speed when voltage, current, and efficiency are otherwise constant.',
 'medium', 'AWS Welding Handbook 7th Ed., Vol. 1, Ch. 3', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Fabrication Math', 'Distortion Concept',
 'A wider root opening in a groove weld often increases distortion risk because it can:',
 '[{"key":"A","text":"Increase the amount of weld metal required"},{"key":"B","text":"Remove all shrinkage stresses"},{"key":"C","text":"Prevent any weld from cooling"},{"key":"D","text":"Eliminate the need for fit-up inspection"}]',
 'A', 'More root opening can require more deposited weld metal; more weld metal usually means more shrinkage to manage.',
 'medium', 'AWS Welding Handbook 7th Ed., Vol. 1, Ch. 6', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core');

END
$batch$;
