-- Original CWI Part A process-fundamentals candidate questions.
-- Facts were checked against AWS Welding Handbook 9th Ed., Vol. 3, hosted by
-- a third party. Keep in needs_review until independently reviewed.

DO $batch$
DECLARE
  cwi_id UUID := '11111111-0000-0000-0000-000000000001';
  source_url TEXT := 'http://www.aec.org.sy/ndt/pdf/library/books/en/books13.pdf';
BEGIN

INSERT INTO questions (
  certification_id, category, subcategory, body, options, correct_answer,
  explanation, difficulty, reference, exam_part, review_status, source_kind,
  source_edition, source_url, question_pool
) VALUES
(cwi_id, 'Welding Processes', 'Resistance Welding',
 'In resistance welding, which three variables directly determine the electrical heat generated at the joint?',
 '[{"key":"A","text":"Current, resistance, and current duration"},{"key":"B","text":"Voltage, electrode diameter, and travel speed"},{"key":"C","text":"Polarity, shielding gas, and arc length"},{"key":"D","text":"Preheat, filler diameter, and joint angle"}]',
 'A', 'Resistance-heating energy depends on current, electrical resistance, and the duration of current flow.',
 'medium', 'AWS Welding Handbook 9th Ed., Vol. 3, Ch. 1', 'A', 'needs_review', 'third_party_reference', '2007', source_url, 'cwi_core'),

(cwi_id, 'Welding Processes', 'Resistance Welding',
 'If resistance and time remain constant during resistance welding, which change has the greatest effect on heat generation?',
 '[{"key":"A","text":"A small increase in current"},{"key":"B","text":"A small increase in electrode length"},{"key":"C","text":"A small decrease in workpiece width"},{"key":"D","text":"A small increase in electrode cooling-water flow"}]',
 'A', 'Heat generation varies with the square of current, so current changes have a particularly strong effect.',
 'hard', 'AWS Welding Handbook 9th Ed., Vol. 3, Ch. 1', 'A', 'needs_review', 'third_party_reference', '2007', source_url, 'cwi_core'),

(cwi_id, 'Welding Processes', 'Resistance Spot Welding',
 'What is the localized fused region joining the workpieces in a resistance spot weld commonly called?',
 '[{"key":"A","text":"Nugget"},{"key":"B","text":"Keyhole"},{"key":"C","text":"Crater"},{"key":"D","text":"Kerf"}]',
 'A', 'The localized weld metal joining overlapping workpieces in spot welding is called the weld nugget.',
 'easy', 'AWS Welding Handbook 9th Ed., Vol. 3, Ch. 1', 'A', 'needs_review', 'third_party_reference', '2007', source_url, 'cwi_core'),

(cwi_id, 'Welding Processes', 'Resistance Seam Welding',
 'How does resistance seam welding commonly create a continuous leak-tight joint?',
 '[{"key":"A","text":"By producing a series of overlapping weld nuggets"},{"key":"B","text":"By depositing a continuous filler-metal bead"},{"key":"C","text":"By melting flux between the sheets"},{"key":"D","text":"By applying adhesive after spot welding"}]',
 'A', 'Seam welding commonly uses rotating wheel electrodes to produce overlapping nuggets that form a continuous seam.',
 'medium', 'AWS Welding Handbook 9th Ed., Vol. 3, Ch. 1', 'A', 'needs_review', 'third_party_reference', '2007', source_url, 'cwi_core'),

(cwi_id, 'Welding Processes', 'Resistance Welding',
 'Why is electrode force maintained while a resistance weld cools?',
 '[{"key":"A","text":"To hold the joint together and help consolidate the weld as it solidifies"},{"key":"B","text":"To provide shielding gas"},{"key":"C","text":"To reverse the welding current"},{"key":"D","text":"To increase electrode electrical resistance"}]',
 'A', 'Maintaining force during cooling supports the joint and can help consolidate the solidifying weld metal.',
 'medium', 'AWS Welding Handbook 9th Ed., Vol. 3, Ch. 1', 'A', 'needs_review', 'third_party_reference', '2007', source_url, 'cwi_core'),

(cwi_id, 'Welding Processes', 'Resistance Welding',
 'Excessive current density during resistance spot welding is most likely to cause:',
 '[{"key":"A","text":"Molten-metal expulsion"},{"key":"B","text":"Loss of all electrical resistance"},{"key":"C","text":"Automatic reduction of weld time"},{"key":"D","text":"Formation of a shielding slag"}]',
 'A', 'Excessive current density can overheat the weld zone and expel molten metal, reducing weld quality.',
 'medium', 'AWS Welding Handbook 9th Ed., Vol. 3, Ch. 1', 'A', 'needs_review', 'third_party_reference', '2007', source_url, 'cwi_core'),

(cwi_id, 'Welding Processes', 'Friction Welding',
 'Which statement best describes conventional friction welding?',
 '[{"key":"A","text":"It is a solid-state process using heat from relative motion and pressure"},{"key":"B","text":"It is an arc process using a continuously fed electrode"},{"key":"C","text":"It uses a laser to melt both faying surfaces"},{"key":"D","text":"It requires a granular flux blanket"}]',
 'A', 'Friction welding produces a solid-state joint using frictional heating and compressive force.',
 'easy', 'AWS Welding Handbook 9th Ed., Vol. 3, Ch. 6', 'A', 'needs_review', 'third_party_reference', '2007', source_url, 'cwi_core'),

(cwi_id, 'Welding Processes', 'Friction Stir Welding',
 'What tool characteristic distinguishes friction stir welding from fusion welding processes?',
 '[{"key":"A","text":"A rotating nonconsumable tool plastically works the joint"},{"key":"B","text":"A consumable flux-coated electrode forms the joint"},{"key":"C","text":"A flame melts a separate filler rod"},{"key":"D","text":"An electron beam vaporizes the joint"}]',
 'A', 'Friction stir welding uses a rotating nonconsumable tool to heat and plastically move material without conventional fusion.',
 'easy', 'AWS Welding Handbook 9th Ed., Vol. 3, Ch. 7', 'A', 'needs_review', 'third_party_reference', '2007', source_url, 'cwi_core'),

(cwi_id, 'Welding Processes', 'Friction Stir Welding',
 'Which characteristic is commonly associated with friction stir welding?',
 '[{"key":"A","text":"It is normally a solid-state joining process"},{"key":"B","text":"It requires shielding flux to create slag"},{"key":"C","text":"It always requires filler metal"},{"key":"D","text":"It depends on electrical resistance through the workpieces"}]',
 'A', 'Friction stir welding is normally performed below the melting point as a solid-state process.',
 'medium', 'AWS Welding Handbook 9th Ed., Vol. 3, Ch. 7', 'A', 'needs_review', 'third_party_reference', '2007', source_url, 'cwi_core'),

(cwi_id, 'Welding Processes', 'Ultrasonic Welding',
 'Ultrasonic welding of metals is primarily classified as which type of process?',
 '[{"key":"A","text":"Solid-state welding"},{"key":"B","text":"Consumable-electrode arc welding"},{"key":"C","text":"Oxyfuel welding"},{"key":"D","text":"Thermal cutting"}]',
 'A', 'Ultrasonic welding creates a solid-state joint through mechanical vibration and applied force.',
 'easy', 'AWS Welding Handbook 9th Ed., Vol. 3, Ch. 8', 'A', 'needs_review', 'third_party_reference', '2007', source_url, 'cwi_core'),

(cwi_id, 'Welding Processes', 'Explosion Welding',
 'Explosion welding is most often used to:',
 '[{"key":"A","text":"Join or clad metals through a high-velocity solid-state impact"},{"key":"B","text":"Produce resistance spot welds on sheet metal"},{"key":"C","text":"Deposit a shielding slag over an arc"},{"key":"D","text":"Cut plate with an oxygen jet"}]',
 'A', 'Explosion welding uses controlled high-velocity impact to create a solid-state bond and is frequently applied to cladding and dissimilar-metal joining.',
 'medium', 'AWS Welding Handbook 9th Ed., Vol. 3, Ch. 9', 'A', 'needs_review', 'third_party_reference', '2007', source_url, 'cwi_core'),

(cwi_id, 'Welding Processes', 'Thermal Spraying',
 'What is the primary product of a thermal spraying operation?',
 '[{"key":"A","text":"A coating deposited on a substrate"},{"key":"B","text":"A full-penetration groove weld"},{"key":"C","text":"A resistance weld nugget"},{"key":"D","text":"A mechanically cut kerf"}]',
 'A', 'Thermal spraying deposits material onto a prepared substrate to form a coating rather than a conventional welded joint.',
 'easy', 'AWS Welding Handbook 9th Ed., Vol. 3, Ch. 11', 'A', 'needs_review', 'third_party_reference', '2007', source_url, 'cwi_core'),

(cwi_id, 'Welding Processes', 'Cold Spraying',
 'Compared with conventional thermal spraying, cold spraying is distinguished by:',
 '[{"key":"A","text":"Depositing particles in the solid state at relatively low temperature"},{"key":"B","text":"Using a submerged arc and granular flux"},{"key":"C","text":"Melting the substrate through electrical resistance"},{"key":"D","text":"Requiring a vacuum around every workpiece"}]',
 'A', 'Cold spraying accelerates particles for solid-state deposition while using relatively low thermal input.',
 'medium', 'AWS Welding Handbook 9th Ed., Vol. 3, Ch. 11', 'A', 'needs_review', 'third_party_reference', '2007', source_url, 'cwi_core'),

(cwi_id, 'Welding Processes', 'Diffusion Welding',
 'Which condition is central to diffusion welding?',
 '[{"key":"A","text":"Intimate surface contact under pressure, usually with elevated temperature"},{"key":"B","text":"A continuously fed consumable wire and shielding gas"},{"key":"C","text":"An open arc beneath granular flux"},{"key":"D","text":"Rapid solidification of a large molten pool"}]',
 'A', 'Diffusion welding promotes bonding through intimate contact, pressure, time, and usually elevated temperature.',
 'hard', 'AWS Welding Handbook 9th Ed., Vol. 3, Ch. 12', 'A', 'needs_review', 'third_party_reference', '2007', source_url, 'cwi_core'),

(cwi_id, 'Welding Processes', 'Electron Beam Welding',
 'Which statement about electron beam welding process variations is correct?',
 '[{"key":"A","text":"It can be performed in high-vacuum, medium-vacuum, or nonvacuum modes"},{"key":"B","text":"It can only be performed in open air"},{"key":"C","text":"It always requires a consumable electrode"},{"key":"D","text":"It cannot produce fusion welds"}]',
 'A', 'Electron beam welding equipment and procedures include high-vacuum, medium-vacuum, and nonvacuum variations.',
 'medium', 'AWS Welding Handbook 9th Ed., Vol. 3, Ch. 13', 'A', 'needs_review', 'third_party_reference', '2007', source_url, 'cwi_core'),

(cwi_id, 'Welding Processes', 'Electron Beam Welding',
 'Why is high-vacuum electron beam welding useful for reactive metals?',
 '[{"key":"A","text":"The vacuum reduces exposure of the hot weld zone to atmospheric contamination"},{"key":"B","text":"The vacuum increases slag formation"},{"key":"C","text":"The vacuum supplies filler metal"},{"key":"D","text":"The vacuum eliminates the need for joint alignment"}]',
 'A', 'A high-vacuum environment minimizes atmospheric contamination of the heated weld region.',
 'hard', 'AWS Welding Handbook 9th Ed., Vol. 3, Ch. 13', 'A', 'needs_review', 'third_party_reference', '2007', source_url, 'cwi_core'),

(cwi_id, 'Welding Processes', 'Electron Beam Welding',
 'Compared with equal-power electron beam welds made in vacuum, nonvacuum electron beam welds are generally:',
 '[{"key":"A","text":"Wider and shallower"},{"key":"B","text":"Narrower and deeper"},{"key":"C","text":"Identical in every respect"},{"key":"D","text":"Always solid-state joints"}]',
 'A', 'Atmospheric scattering reduces beam power density, generally producing wider and shallower welds than vacuum modes at equal power.',
 'hard', 'AWS Welding Handbook 9th Ed., Vol. 3, Ch. 13', 'A', 'needs_review', 'third_party_reference', '2007', source_url, 'cwi_core'),

(cwi_id, 'Welding Processes', 'Process Identification',
 'Which process uses a focused beam of electrons as the heat source?',
 '[{"key":"A","text":"Electron beam welding"},{"key":"B","text":"Friction stir welding"},{"key":"C","text":"Resistance seam welding"},{"key":"D","text":"Ultrasonic welding"}]',
 'A', 'Electron beam welding focuses accelerated electrons onto the joint to create fusion heating.',
 'easy', 'AWS Welding Handbook 9th Ed., Vol. 3, Ch. 13', 'A', 'needs_review', 'third_party_reference', '2007', source_url, 'cwi_core'),

(cwi_id, 'Welding Processes', 'Process Identification',
 'Which process joins metals using controlled high-frequency mechanical vibration and force?',
 '[{"key":"A","text":"Ultrasonic welding"},{"key":"B","text":"Electron beam welding"},{"key":"C","text":"Thermal spraying"},{"key":"D","text":"Resistance seam welding"}]',
 'A', 'Ultrasonic welding uses high-frequency mechanical vibration together with force to create a solid-state joint.',
 'medium', 'AWS Welding Handbook 9th Ed., Vol. 3, Ch. 8', 'A', 'needs_review', 'third_party_reference', '2007', source_url, 'cwi_core'),

(cwi_id, 'Welding Processes', 'Process Selection',
 'Which process is specifically intended to apply wear-resistant or corrosion-resistant material as a surface coating?',
 '[{"key":"A","text":"Thermal spraying"},{"key":"B","text":"Resistance spot welding"},{"key":"C","text":"Friction stir welding"},{"key":"D","text":"Electron beam welding"}]',
 'A', 'Thermal spraying is used to deposit functional coatings, including wear- and corrosion-resistant surfaces.',
 'medium', 'AWS Welding Handbook 9th Ed., Vol. 3, Ch. 11', 'A', 'needs_review', 'third_party_reference', '2007', source_url, 'cwi_core');

END
$batch$;
