-- Original CWI Part A fundamentals candidate questions.
-- Facts were checked against AWS Welding Handbook 7th Ed., Vol. 1 (1976).
-- Keep in needs_review and avoid edition-sensitive use.

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
(cwi_id, 'Metallurgy', 'Heat Flow',
 'What is the usual effect of preheating a steel joint before welding?',
 '[{"key":"A","text":"It slows the cooling rate after welding"},{"key":"B","text":"It eliminates all residual stress"},{"key":"C","text":"It increases the carbon content"},{"key":"D","text":"It prevents formation of a heat-affected zone"}]',
 'A', 'Preheat raises the initial temperature of the joint and generally slows cooling through critical temperature ranges.',
 'easy', 'AWS Welding Handbook 7th Ed., Vol. 1, Ch. 3', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Metallurgy', 'Heat Flow',
 'For otherwise similar welds, increasing net heat input generally has what effect on the heat-affected zone?',
 '[{"key":"A","text":"It tends to widen the heat-affected zone"},{"key":"B","text":"It eliminates the heat-affected zone"},{"key":"C","text":"It always reduces grain growth"},{"key":"D","text":"It prevents all phase transformations"}]',
 'A', 'More net heat input exposes a larger surrounding region to elevated temperatures and generally widens the heat-affected zone.',
 'medium', 'AWS Welding Handbook 7th Ed., Vol. 1, Ch. 3', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Metallurgy', 'Heat-Affected Zone',
 'Which statement best describes the heat-affected zone of a fusion weld?',
 '[{"key":"A","text":"Base metal that did not melt but experienced property-changing thermal cycles"},{"key":"B","text":"Only the deposited filler metal"},{"key":"C","text":"The portion of slag covering the weld"},{"key":"D","text":"Base metal completely unaffected by welding heat"}]',
 'A', 'The heat-affected zone remains solid but experiences welding temperatures capable of changing its microstructure and properties.',
 'easy', 'AWS Welding Handbook 7th Ed., Vol. 1, Ch. 4', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Metallurgy', 'Phase Transformations',
 'Martensite in steel is most likely to form when austenite is:',
 '[{"key":"A","text":"Cooled rapidly"},{"key":"B","text":"Held indefinitely at room temperature"},{"key":"C","text":"Mixed with shielding gas"},{"key":"D","text":"Heated only below the transformation range"}]',
 'A', 'Rapid cooling can suppress slower transformations and promote formation of martensite in hardenable steels.',
 'easy', 'AWS Welding Handbook 7th Ed., Vol. 1, Ch. 4', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Metallurgy', 'Phase Transformations',
 'Why can untempered martensite be undesirable in a steel weld heat-affected zone?',
 '[{"key":"A","text":"It can be hard and brittle"},{"key":"B","text":"It always improves ductility"},{"key":"C","text":"It prevents hydrogen entry"},{"key":"D","text":"It eliminates residual stress"}]',
 'A', 'Untempered martensite can have high hardness and low ductility, increasing susceptibility to cracking under unfavorable conditions.',
 'medium', 'AWS Welding Handbook 7th Ed., Vol. 1, Ch. 4', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Metallurgy', 'Hydrogen Cracking',
 'Which combination most strongly promotes delayed hydrogen cracking in a hardenable steel weld?',
 '[{"key":"A","text":"A susceptible hard microstructure, hydrogen, and tensile stress"},{"key":"B","text":"Low hardness, no hydrogen, and compressive stress"},{"key":"C","text":"High ductility, low restraint, and dry consumables"},{"key":"D","text":"Slow cooling, low hydrogen, and low restraint"}]',
 'A', 'Hydrogen cracking requires a susceptible microstructure, a source of hydrogen, and sufficient tensile stress.',
 'hard', 'AWS Welding Handbook 7th Ed., Vol. 1, Ch. 4', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Metallurgy', 'Hydrogen Cracking',
 'How can preheat help reduce hydrogen-cracking risk in hardenable steel?',
 '[{"key":"A","text":"By slowing cooling and allowing more time for hydrogen to diffuse"},{"key":"B","text":"By adding hydrogen to the weld"},{"key":"C","text":"By increasing joint restraint"},{"key":"D","text":"By forming a sharper notch"}]',
 'A', 'Preheat slows cooling, can reduce hard microstructure formation, and gives diffusible hydrogen more time to escape.',
 'medium', 'AWS Welding Handbook 7th Ed., Vol. 1, Ch. 4', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Metallurgy', 'Weldability',
 'What does hardenability describe in steel?',
 '[{"key":"A","text":"The tendency to form hard microstructures through a section during cooling"},{"key":"B","text":"The resistance of a surface to indentation only"},{"key":"C","text":"The ability to resist corrosion in seawater"},{"key":"D","text":"The amount of filler metal required"}]',
 'A', 'Hardenability describes how readily and deeply a steel can transform to hard microstructures under a given cooling condition.',
 'medium', 'AWS Welding Handbook 7th Ed., Vol. 1, Ch. 4', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Metallurgy', 'Weldability',
 'Why is carbon equivalent useful when evaluating steel weldability?',
 '[{"key":"A","text":"It estimates the combined effect of composition on hardenability and cracking tendency"},{"key":"B","text":"It directly measures weld length"},{"key":"C","text":"It identifies the welder who made the joint"},{"key":"D","text":"It replaces procedure qualification testing in every case"}]',
 'A', 'Carbon-equivalent relationships combine the effects of carbon and alloying elements to help estimate hardenability and weld-cracking susceptibility.',
 'hard', 'AWS Welding Handbook 7th Ed., Vol. 1, Ch. 4', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Metallurgy', 'Porosity',
 'What causes porosity in solidified weld metal?',
 '[{"key":"A","text":"Gas that becomes trapped as the weld solidifies"},{"key":"B","text":"Excessive mechanical polishing after welding"},{"key":"C","text":"Complete removal of all dissolved gas"},{"key":"D","text":"Uniform compressive stress only"}]',
 'A', 'Porosity forms when gas is present in the molten weld metal and becomes trapped during solidification.',
 'easy', 'AWS Welding Handbook 7th Ed., Vol. 1, Ch. 4', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Weld Discontinuities', 'Cracking',
 'Why are cracks generally considered more severe than rounded porosity?',
 '[{"key":"A","text":"Cracks are sharp planar discontinuities that strongly concentrate stress"},{"key":"B","text":"Cracks are always visible without inspection"},{"key":"C","text":"Rounded porosity always grows during service"},{"key":"D","text":"Cracks cannot occur in base metal"}]',
 'A', 'The sharp geometry and planar nature of cracks create severe stress concentration and make them especially significant.',
 'medium', 'AWS Welding Handbook 7th Ed., Vol. 1, Ch. 5', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Weld Discontinuities', 'Geometry',
 'Which discontinuity geometry generally creates the greatest stress concentration?',
 '[{"key":"A","text":"A sharp crack-like indication"},{"key":"B","text":"A smooth shallow depression"},{"key":"C","text":"A rounded isolated pore"},{"key":"D","text":"A gradual contour transition"}]',
 'A', 'Sharper discontinuities have smaller tip radii and generally create greater local stress concentration.',
 'medium', 'AWS Welding Handbook 7th Ed., Vol. 1, Ch. 5', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Fabrication', 'Residual Stress',
 'What is a primary source of residual stress in a welded joint?',
 '[{"key":"A","text":"Nonuniform heating and cooling followed by restrained contraction"},{"key":"B","text":"Uniform room-temperature storage"},{"key":"C","text":"Removal of all restraint before welding"},{"key":"D","text":"Using identical base-metal thicknesses"}]',
 'A', 'Localized heating and subsequent nonuniform contraction create internal stresses that can remain after the weld cools.',
 'medium', 'AWS Welding Handbook 7th Ed., Vol. 1, Ch. 6', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Fabrication', 'Distortion',
 'Angular distortion in a welded joint primarily results from:',
 '[{"key":"A","text":"Unequal shrinkage through the joint thickness"},{"key":"B","text":"Perfectly balanced shrinkage on both sides"},{"key":"C","text":"Complete absence of welding heat"},{"key":"D","text":"Uniform cooling with no contraction"}]',
 'A', 'Unequal contraction through the thickness rotates the joined parts and produces angular distortion.',
 'medium', 'AWS Welding Handbook 7th Ed., Vol. 1, Ch. 6', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Fabrication', 'Distortion Control',
 'Which welding approach can help reduce angular distortion?',
 '[{"key":"A","text":"Balance welding on opposite sides of the joint where practical"},{"key":"B","text":"Place all weld metal on one side regardless of design"},{"key":"C","text":"Increase the root opening without limit"},{"key":"D","text":"Maximize deposited weld-metal volume"}]',
 'A', 'Balancing weld deposition can counteract unequal shrinkage and reduce angular movement.',
 'medium', 'AWS Welding Handbook 7th Ed., Vol. 1, Ch. 6', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Fabrication', 'Distortion Control',
 'Why can minimizing unnecessary weld-metal volume help control distortion?',
 '[{"key":"A","text":"Less heated and contracting weld metal generally produces less shrinkage"},{"key":"B","text":"It guarantees zero residual stress"},{"key":"C","text":"It increases the number of thermal cycles"},{"key":"D","text":"It eliminates the need for joint design"}]',
 'A', 'Reducing unnecessary weld-metal volume reduces the amount of material heated and subsequently contracting.',
 'medium', 'AWS Welding Handbook 7th Ed., Vol. 1, Ch. 6', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Fabrication', 'Distortion Control',
 'What is one purpose of a planned welding sequence?',
 '[{"key":"A","text":"To manage shrinkage and distortion during fabrication"},{"key":"B","text":"To eliminate all inspection requirements"},{"key":"C","text":"To make every weld use the same position"},{"key":"D","text":"To avoid using an approved procedure"}]',
 'A', 'A planned sequence distributes welding and contraction in a controlled way to help manage distortion.',
 'easy', 'AWS Welding Handbook 7th Ed., Vol. 1, Ch. 6', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Fabrication', 'Residual Stress',
 'Residual stress is best described as stress that:',
 '[{"key":"A","text":"Remains in a component without an applied external load"},{"key":"B","text":"Exists only while an external load is applied"},{"key":"C","text":"Can occur only in castings"},{"key":"D","text":"Always causes immediate fracture"}]',
 'A', 'Residual stresses remain self-balanced within a component after the original cause, such as welding thermal contraction, is removed.',
 'easy', 'AWS Welding Handbook 7th Ed., Vol. 1, Ch. 6', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Metallurgy', 'Solidification',
 'What happens to the weld pool during solidification?',
 '[{"key":"A","text":"Liquid weld metal transforms into solid weld metal"},{"key":"B","text":"Base metal becomes shielding gas"},{"key":"C","text":"Residual stress immediately becomes zero"},{"key":"D","text":"All alloying elements leave the weld"}]',
 'A', 'Solidification is the transformation of the molten weld pool into solid weld metal.',
 'easy', 'AWS Welding Handbook 7th Ed., Vol. 1, Ch. 3-4', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core'),

(cwi_id, 'Metallurgy', 'Grain Growth',
 'Excessive peak temperature and time at high temperature in a steel heat-affected zone can promote:',
 '[{"key":"A","text":"Grain growth"},{"key":"B","text":"Complete removal of all grains"},{"key":"C","text":"Elimination of thermal expansion"},{"key":"D","text":"Automatic stress relief of every joint"}]',
 'A', 'High thermal exposure can allow grains in portions of the heat-affected zone to grow, which may affect properties.',
 'hard', 'AWS Welding Handbook 7th Ed., Vol. 1, Ch. 4', 'A', 'needs_review', 'third_party_reference', '1976', source_url, 'cwi_core');

END
$batch$;
