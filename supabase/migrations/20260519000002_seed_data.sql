-- ================================================================
-- Grant table privileges to auth roles
-- ================================================================
grant select on certifications to anon, authenticated;
grant all on user_profiles to authenticated;
grant all on user_certifications to authenticated;
grant select on questions to authenticated;
grant all on exam_sessions to authenticated;
grant all on user_answers to authenticated;
grant usage on schema public to anon, authenticated;

-- ================================================================
-- Seed certifications
-- ================================================================
insert into certifications (id, code, name, body, description, question_count, exam_duration_minutes, passing_score, available)
values
  ('11111111-0000-0000-0000-000000000001', 'AWS CWI', 'Certified Welding Inspector', 'American Welding Society', 'Parts A, B, and C — 150 questions over 3 hours', 150, 180, 72, true),
  ('11111111-0000-0000-0000-000000000002', 'ASNT NDT Level II', 'Non-Destructive Testing Level II', 'ASNT', 'PT · MT · UT · RT methods', 100, 120, 70, true),
  ('11111111-0000-0000-0000-000000000003', 'API 570', 'Piping Inspector', 'API', 'Inspection, repair, alteration of in-service piping systems', 70, 90, 70, false)
on conflict (code) do nothing;

-- ================================================================
-- Seed: user profile for existing auth user
-- ================================================================
insert into user_profiles (id, full_name)
select id, coalesce(raw_user_meta_data->>'full_name', email)
from auth.users
on conflict (id) do nothing;

-- ================================================================
-- AWS CWI Questions (dollar-quoted to avoid escaping issues)
-- ================================================================
do $seed$
declare
  cwi_id uuid := '11111111-0000-0000-0000-000000000001';
begin

-- Welding Processes
insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'Welding Processes',
 'In Shielded Metal Arc Welding (SMAW), what is the primary purpose of the electrode coating (flux)?',
 '[{"key":"A","text":"To increase the current carrying capacity of the electrode"},{"key":"B","text":"To provide shielding gas, slag, and deoxidizers to protect the weld pool"},{"key":"C","text":"To prevent the electrode from overheating"},{"key":"D","text":"To increase the melting rate of the base metal"}]',
 'B',
 'The electrode coating decomposes under heat to produce shielding gas protecting the arc and weld pool from atmospheric contamination, forms a slag to protect the solidifying weld metal, and contains deoxidizers and alloying elements.',
 'easy', 'AWS A5.1');

insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'Welding Processes',
 'Which welding process uses a non-consumable tungsten electrode and an externally supplied filler metal?',
 '[{"key":"A","text":"GMAW (MIG)"},{"key":"B","text":"SMAW (Stick)"},{"key":"C","text":"GTAW (TIG)"},{"key":"D","text":"FCAW (Flux-Cored)"}]',
 'C',
 'Gas Tungsten Arc Welding (GTAW/TIG) uses a non-consumable tungsten electrode to create the arc. Filler metal, when required, is fed separately by hand or mechanically.',
 'easy', 'AWS B2.1');

insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'Welding Processes',
 'What does the term "DCEP" mean in welding?',
 '[{"key":"A","text":"Direct Current Electrode Positive (reverse polarity)"},{"key":"B","text":"Direct Current Electrode Positive (straight polarity)"},{"key":"C","text":"Direct Current Equipment Parameter"},{"key":"D","text":"Duty Cycle Electrode Position"}]',
 'A',
 'DCEP stands for Direct Current Electrode Positive, also called reverse polarity. The electrode is connected to the positive terminal. This produces deeper penetration and is commonly used for most SMAW electrodes.',
 'medium', 'AWS A3.0');

insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'Welding Processes',
 'Which of the following welding processes uses a continuously fed consumable wire electrode and a separate shielding gas?',
 '[{"key":"A","text":"SMAW"},{"key":"B","text":"GMAW"},{"key":"C","text":"GTAW"},{"key":"D","text":"OFW"}]',
 'B',
 'Gas Metal Arc Welding (GMAW/MIG) uses a continuously fed consumable wire electrode and an externally supplied shielding gas (such as CO2 or Argon blends) to protect the weld pool.',
 'easy', 'AWS B2.1');

insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'Welding Processes',
 'In Submerged Arc Welding (SAW), what provides the shielding for the arc and weld pool?',
 '[{"key":"A","text":"A gas nozzle delivering inert gas"},{"key":"B","text":"A granular flux that completely covers the arc"},{"key":"C","text":"The electrode coating"},{"key":"D","text":"A vacuum chamber around the weld zone"}]',
 'B',
 'In SAW, the arc and weld pool are completely submerged under a layer of granular fusible flux. This flux melts and forms a protective slag, completely shielding the weld from atmospheric contamination.',
 'medium', 'AWS A5.17');

insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'Welding Processes',
 'The interpass temperature in a multi-pass weld refers to:',
 '[{"key":"A","text":"The temperature of the first pass before subsequent passes"},{"key":"B","text":"The temperature limit of the weld between passes"},{"key":"C","text":"The temperature of the shielding gas"},{"key":"D","text":"The temperature of the electrode before use"}]',
 'B',
 'Interpass temperature is the temperature of the weld joint immediately before the next pass is applied. Codes specify maximum interpass temperatures to prevent degradation of mechanical properties, particularly toughness, from excessive heat input.',
 'medium', 'AWS D1.1');

insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'Welding Processes',
 'Which mode of metal transfer in GMAW produces a stable spray-like transfer of tiny droplets and is typically used with higher voltage and Argon-rich shielding gas?',
 '[{"key":"A","text":"Short-circuit transfer"},{"key":"B","text":"Globular transfer"},{"key":"C","text":"Spray transfer"},{"key":"D","text":"Pulsed transfer"}]',
 'C',
 'Spray transfer occurs at higher voltages with Argon-rich shielding gas. Metal transfers as fine droplets in an axial spray pattern, producing good penetration and a smooth weld bead. It is best for flat and horizontal positions on thicker material.',
 'hard', 'AWS B2.1');

-- Metallurgy
insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'Metallurgy',
 'Which discontinuity is most likely to occur in the heat-affected zone (HAZ) of a high-carbon or alloy steel weld?',
 '[{"key":"A","text":"Porosity"},{"key":"B","text":"Underfill"},{"key":"C","text":"Hydrogen-induced (cold) cracking"},{"key":"D","text":"Overlap"}]',
 'C',
 'Hydrogen-induced cracking (cold cracking) is most prevalent in the HAZ of high-carbon and alloy steels. It requires three conditions: susceptible microstructure, hydrogen, and tensile stress. Preheat and low-hydrogen processes reduce this risk.',
 'medium', 'AWS D1.1');

insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'Metallurgy',
 'The carbon equivalent (CE) formula is used to predict which of the following?',
 '[{"key":"A","text":"The tensile strength of the deposited weld metal"},{"key":"B","text":"The susceptibility of steel to hydrogen-induced cracking"},{"key":"C","text":"The amount of post-weld heat treatment required"},{"key":"D","text":"The electrode classification for a given base metal"}]',
 'B',
 'Carbon equivalent (CE) is used to assess the hardenability and susceptibility of steel to hydrogen-induced cracking. Higher CE values indicate greater susceptibility and may require preheat, low-hydrogen processes, or post-weld heat treatment.',
 'hard', 'AWS D1.1 Annex I');

insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'Metallurgy',
 'What is the primary purpose of preheating before welding?',
 '[{"key":"A","text":"To increase the travel speed of the weld"},{"key":"B","text":"To reduce the cooling rate and minimize hydrogen-induced cracking and distortion"},{"key":"C","text":"To remove oil and grease from the base metal surface"},{"key":"D","text":"To increase the penetration of the weld"}]',
 'B',
 'Preheat slows the cooling rate of the weld and HAZ, reducing the risk of hydrogen-induced cracking and martensite formation. It also reduces residual stresses and distortion.',
 'medium', 'AWS D1.1');

insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'Metallurgy',
 'Post-weld heat treatment (PWHT) is primarily performed to:',
 '[{"key":"A","text":"Increase the hardness of the weld"},{"key":"B","text":"Relieve residual stresses and improve toughness"},{"key":"C","text":"Increase the carbon content of the HAZ"},{"key":"D","text":"Prevent porosity from forming after cooling"}]',
 'B',
 'PWHT (stress relief heat treatment) reduces residual welding stresses, tempers hard HAZ microstructures, and improves fracture toughness. It also allows hydrogen to diffuse out of the weld.',
 'medium', 'ASME B31.3 / AWS D1.1');

insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'Metallurgy',
 'According to AWS D1.1, what is the minimum preheat temperature required for welding ASTM A36 steel with thickness greater than 1.5 inches?',
 '[{"key":"A","text":"None required"},{"key":"B","text":"150 F (65 C)"},{"key":"C","text":"225 F (107 C)"},{"key":"D","text":"300 F (149 C)"}]',
 'C',
 'AWS D1.1 Table 4.5 requires a minimum preheat of 225 F (107 C) for ASTM A36 (Category I steel) when thickness exceeds 1.5 inches.',
 'hard', 'AWS D1.1 Table 4.5');

insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'Metallurgy',
 'Martensitic transformation in steel occurs when:',
 '[{"key":"A","text":"Steel is cooled very slowly through the transformation range"},{"key":"B","text":"Steel is cooled rapidly (quenched) from the austenite range"},{"key":"C","text":"Steel is heated above 1500 F and held for a long time"},{"key":"D","text":"Carbon is added to the steel during welding"}]',
 'B',
 'Martensite forms when austenite is rapidly quenched, preventing the diffusion-controlled transformation to ferrite and pearlite. Martensite is very hard and brittle, making high-hardenability steels susceptible to hydrogen-induced cracking in the HAZ.',
 'hard', 'AWS D1.1');

insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'Metallurgy',
 'What is the heat-affected zone (HAZ)?',
 '[{"key":"A","text":"The zone where filler metal is deposited"},{"key":"B","text":"The portion of base metal that has not melted but whose microstructure has been altered by welding heat"},{"key":"C","text":"The area of the weld protected by the shielding gas"},{"key":"D","text":"The zone between the two pieces of base metal before welding"}]',
 'B',
 'The HAZ is the portion of base metal adjacent to the fusion zone that has not been melted but has experienced temperatures high enough to alter its microstructure and mechanical properties. HAZ properties differ from both the weld metal and the original base metal.',
 'easy', 'AWS A3.0');

-- Weld Discontinuities
insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'Weld Discontinuities',
 'Incomplete fusion in a weld is best described as:',
 '[{"key":"A","text":"Weld metal that has not fused with adjacent base metal or previously deposited weld metal"},{"key":"B","text":"A crack running parallel to the weld axis"},{"key":"C","text":"Excessive weld reinforcement"},{"key":"D","text":"Undercut along the weld toe"}]',
 'A',
 'Incomplete fusion (lack of fusion) occurs when weld metal fails to fuse with the base metal or previously deposited weld beads. It is a planar defect and is generally unacceptable under most codes.',
 'easy', 'AWS A3.0');

insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'Weld Discontinuities',
 'Porosity in a weld is caused by:',
 '[{"key":"A","text":"Excessive preheat"},{"key":"B","text":"Gases trapped in the solidifying weld metal"},{"key":"C","text":"Insufficient current"},{"key":"D","text":"Improper joint design"}]',
 'B',
 'Porosity results from gases (hydrogen, oxygen, nitrogen) becoming trapped in the solidifying weld metal. Common causes include moisture, contamination, inadequate shielding gas coverage, and improper technique.',
 'easy', 'AWS D1.1');

insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'Weld Discontinuities',
 'Undercut is defined as:',
 '[{"key":"A","text":"A groove melted into the base metal adjacent to the weld toe that is not filled by weld metal"},{"key":"B","text":"Weld metal deposited beyond the weld groove face"},{"key":"C","text":"A void within the weld caused by trapped gas"},{"key":"D","text":"Cracking in the center of the weld bead"}]',
 'A',
 'Undercut is an unfilled groove at the weld toe or weld root caused by improper technique. It acts as a stress concentrator and is typically limited by codes (e.g., 1/32 inch max for structural welds per AWS D1.1).',
 'easy', 'AWS A3.0');

insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'Weld Discontinuities',
 'Lamellar tearing in welded structures typically occurs in:',
 '[{"key":"A","text":"The weld fusion zone"},{"key":"B","text":"The base metal beneath the HAZ, along planes parallel to the plate surface"},{"key":"C","text":"The center of the weld bead"},{"key":"D","text":"The electrode coating"}]',
 'B',
 'Lamellar tearing occurs in the base metal beneath the HAZ, running parallel to the plate surface along planes of low ductility (often associated with sulfide inclusions in the through-thickness direction). It is a base metal defect, not a weld defect.',
 'hard', 'AWS D1.1');

insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'Weld Discontinuities',
 'Which type of crack typically forms during solidification of the weld metal at elevated temperatures?',
 '[{"key":"A","text":"Hydrogen-induced (cold) crack"},{"key":"B","text":"Hot crack (solidification crack)"},{"key":"C","text":"Lamellar tear"},{"key":"D","text":"Stress corrosion crack"}]',
 'B',
 'Hot cracks (solidification cracks) form in the weld metal during or immediately after solidification while the metal is still at elevated temperatures. They are associated with low-melting segregates and high restraint.',
 'medium', 'AWS D1.1');

insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'Weld Discontinuities',
 'Slag inclusions in a weld are caused by:',
 '[{"key":"A","text":"Excessive preheat temperature"},{"key":"B","text":"Entrapped non-metallic material from previous passes not removed before welding"},{"key":"C","text":"Too much filler metal"},{"key":"D","text":"Insufficient shielding gas flow rate"}]',
 'B',
 'Slag inclusions are non-metallic solid materials trapped within the weld metal or at the weld interface. They occur when slag from a previous pass is not completely removed before depositing the next pass, or due to improper technique.',
 'easy', 'AWS D1.1');

insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'Weld Discontinuities',
 'Incomplete joint penetration (IJP) in a groove weld means:',
 '[{"key":"A","text":"The weld bead extends beyond the end of the joint"},{"key":"B","text":"The weld metal does not extend through the full thickness of a joint requiring CJP"},{"key":"C","text":"The weld is undersized in leg length"},{"key":"D","text":"The joint was not preheated"}]',
 'B',
 'Incomplete joint penetration (IJP) occurs when the weld metal does not extend through the full depth of a joint requiring complete joint penetration (CJP). It is a planar defect and is typically rejectable under structural codes.',
 'medium', 'AWS A3.0 / D1.1');

insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'Weld Discontinuities',
 'Overlap in a weld occurs when:',
 '[{"key":"A","text":"Insufficient heat input during welding"},{"key":"B","text":"Excess weld metal flows beyond the weld toe without fusing to the base metal"},{"key":"C","text":"Excessive penetration through the root"},{"key":"D","text":"High travel speed causing incomplete fill"}]',
 'B',
 'Overlap (cold lap) occurs when molten weld metal flows over the base metal at the toe of the weld but does not fuse to it. It is caused by insufficient heat, low current, or improper technique.',
 'medium', 'AWS A3.0');

-- Visual Inspection
insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'Visual Inspection',
 'Per AWS D1.1, the maximum allowable undercut for statically loaded primary members is:',
 '[{"key":"A","text":"1/64 inch (0.4 mm)"},{"key":"B","text":"1/32 inch (0.8 mm)"},{"key":"C","text":"1/16 inch (1.6 mm)"},{"key":"D","text":"1/8 inch (3.2 mm)"}]',
 'B',
 'AWS D1.1 Clause 6.9 permits a maximum undercut of 1/32 inch (0.8 mm) for undercut parallel to the primary stress in statically loaded structures. For dynamically loaded structures the limit is more restrictive.',
 'hard', 'AWS D1.1 Clause 6.9');

insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'Visual Inspection',
 'Which of the following best describes the purpose of visual inspection before welding begins?',
 '[{"key":"A","text":"To verify weld quality after the joint is completed"},{"key":"B","text":"To check base metal condition, joint fit-up, and cleanliness before welding"},{"key":"C","text":"To measure the final weld reinforcement"},{"key":"D","text":"To select the proper NDE method"}]',
 'B',
 'Pre-weld visual inspection verifies the base metal condition (cracks, laminations), joint geometry (root opening, groove angle, fit-up), and cleanliness (removal of scale, oil, moisture). Catching problems before welding prevents costly rework.',
 'easy', 'AWS D1.1 Clause 6.5');

insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'Visual Inspection',
 'A convexity measurement on a fillet weld is taken to determine:',
 '[{"key":"A","text":"The depth of the weld root"},{"key":"B","text":"How much the weld face rises above a line joining the weld toes"},{"key":"C","text":"The angle of the weld face"},{"key":"D","text":"The length of the weld"}]',
 'B',
 'Convexity is the maximum distance from the face of a convex fillet weld to a line joining the weld toes. Excessive convexity creates stress concentrations at the weld toes and is limited by code.',
 'medium', 'AWS D1.1');

insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'Visual Inspection',
 'When visually inspecting a completed groove weld, the inspector should check for all of the following EXCEPT:',
 '[{"key":"A","text":"Cracks in the weld and HAZ"},{"key":"B","text":"Undercut at the weld toe"},{"key":"C","text":"Internal porosity inside the weld"},{"key":"D","text":"Crater cracks at weld stops"}]',
 'C',
 'Visual inspection detects surface-breaking or near-surface discontinuities, but internal porosity is subsurface and requires volumetric NDE methods (RT or UT) to detect. All other listed items are detectable visually.',
 'medium', 'AWS D1.1 Clause 6');

insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'Visual Inspection',
 'The throat of a fillet weld is measured as:',
 '[{"key":"A","text":"The distance from the weld root to the face, measured perpendicular to the hypotenuse"},{"key":"B","text":"The length of the longest leg of the fillet weld"},{"key":"C","text":"The width of the weld face"},{"key":"D","text":"The distance between the two toe points"}]',
 'A',
 'The theoretical throat of a fillet weld is measured from the root of the joint perpendicular to the hypotenuse (face) of the largest right triangle that can be inscribed within the fillet weld cross section.',
 'medium', 'AWS A3.0');

insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'Visual Inspection',
 'A fillet weld gauge is used by a welding inspector to measure:',
 '[{"key":"A","text":"The length of the weld"},{"key":"B","text":"The angle of the weld groove"},{"key":"C","text":"The leg size, throat, and convexity of fillet welds"},{"key":"D","text":"The depth of undercut"}]',
 'C',
 'Fillet weld gauges (bridge cam gauges, etc.) are used to measure the leg length, throat dimension, convexity, and concavity of fillet welds. Separate gauges are used for measuring undercut depth.',
 'easy', 'AWS D1.1');

-- Weld Symbols
insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'Weld Symbols',
 'On a welding symbol, the weld symbol placed below the reference line indicates the weld is on which side?',
 '[{"key":"A","text":"The other side of the joint"},{"key":"B","text":"The arrow side of the joint"},{"key":"C","text":"Both sides of the joint"},{"key":"D","text":"The field weld side"}]',
 'B',
 'Per AWS A2.4, the weld symbol is placed below the reference line when the weld is on the arrow side of the joint. The symbol is placed above the reference line when the weld is on the other side.',
 'medium', 'AWS A2.4');

insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'Weld Symbols',
 'What does the circle symbol at the junction of the arrow and reference line indicate?',
 '[{"key":"A","text":"The weld is to be made in the field"},{"key":"B","text":"The weld is to be made all around the joint"},{"key":"C","text":"The weld requires 100% RT inspection"},{"key":"D","text":"A complete joint penetration weld is required"}]',
 'B',
 'The circle at the bend of the leader line (junction of arrow and reference line) indicates that the weld is to be made all around — on all sides of the piece.',
 'medium', 'AWS A2.4');

insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'Weld Symbols',
 'In a fillet weld symbol, where is the weld size (leg size) shown?',
 '[{"key":"A","text":"To the right of the weld symbol"},{"key":"B","text":"To the left of the weld symbol"},{"key":"C","text":"Above the weld symbol"},{"key":"D","text":"Inside the weld symbol triangle"}]',
 'B',
 'The fillet weld size (leg size) is shown to the left of the fillet weld symbol. The length is shown to the right. For unequal legs, both sizes are shown in parentheses.',
 'medium', 'AWS A2.4');

-- Codes & Documents
insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'Codes & Documents',
 'AWS D1.1 is the structural welding code applicable to which of the following?',
 '[{"key":"A","text":"Pressure vessels and boilers"},{"key":"B","text":"Steel structures (bridges, buildings, and other structural applications)"},{"key":"C","text":"Pipelines and piping systems"},{"key":"D","text":"Aerospace welding applications"}]',
 'B',
 'AWS D1.1 Structural Welding Code governs welding of structural steel for bridges, buildings, and other structures. ASME Section IX covers pressure vessels, ASME B31.3 covers piping.',
 'easy', 'AWS D1.1');

insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'Codes & Documents',
 'A Welding Procedure Specification (WPS) must be:',
 '[{"key":"A","text":"Written by the welding inspector on the job site"},{"key":"B","text":"Qualified by testing and supported by a Procedure Qualification Record (PQR)"},{"key":"C","text":"Approved by the AWS before use"},{"key":"D","text":"Renewed every year regardless of use"}]',
 'B',
 'A WPS must be qualified through testing (tensile, bend, impact as required). The test results are documented in a PQR which supports and validates the WPS. The manufacturer/contractor is responsible for qualification.',
 'medium', 'AWS D1.1 Clause 4');

insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'Codes & Documents',
 'An essential variable in a WPS, if changed beyond limits, requires:',
 '[{"key":"A","text":"Only a revision to the WPS document"},{"key":"B","text":"Requalification of the WPS through testing"},{"key":"C","text":"Only the inspector approval on the job site"},{"key":"D","text":"No action if the change is minor"}]',
 'B',
 'Essential variables are those that, if changed beyond specified limits, affect the mechanical properties of the weld and require requalification of the WPS. Supplementary essential variables relate to notch toughness and also require requalification.',
 'hard', 'AWS D1.1 Clause 4');

insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'Codes & Documents',
 'Who is responsible for ensuring that welders are qualified per the applicable code?',
 '[{"key":"A","text":"The American Welding Society (AWS)"},{"key":"B","text":"The owner of the structure"},{"key":"C","text":"The manufacturer or contractor performing the welding"},{"key":"D","text":"The welding inspector"}]',
 'C',
 'The manufacturer or contractor is responsible for the qualification of welders, welding operators, and tack welders, and for maintaining qualification records. The inspector verifies that qualified procedures and personnel are being used.',
 'medium', 'AWS D1.1 Clause 4');

insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'Codes & Documents',
 'A Procedure Qualification Record (PQR) documents:',
 '[{"key":"A","text":"The required parameters for a welder to follow during production"},{"key":"B","text":"The actual variables used during a qualification test and the test results"},{"key":"C","text":"The welder personal qualification history"},{"key":"D","text":"The quality control plan for a specific project"}]',
 'B',
 'A PQR records the actual welding variables used during a test weld and the results of the mechanical tests performed. The PQR supports and validates the WPS.',
 'medium', 'AWS D1.1 Clause 4');

-- NDE Methods
insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'NDE Methods',
 'Radiographic Testing (RT) is primarily used to detect:',
 '[{"key":"A","text":"Surface cracks only"},{"key":"B","text":"Volumetric (internal) discontinuities such as porosity and inclusions"},{"key":"C","text":"Hardness variations in the HAZ"},{"key":"D","text":"Surface cleanliness before welding"}]',
 'B',
 'RT uses X-rays or gamma rays to produce an image of the internal structure of a weld. It is a volumetric method effective for detecting porosity, inclusions, and lack of fusion/penetration.',
 'medium', 'SNT-TC-1A');

insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'NDE Methods',
 'Magnetic Particle Testing (MT) is limited to inspection of:',
 '[{"key":"A","text":"Ferromagnetic materials"},{"key":"B","text":"Non-magnetic materials only"},{"key":"C","text":"Austenitic stainless steel"},{"key":"D","text":"Aluminum and titanium alloys"}]',
 'A',
 'MT can only be applied to ferromagnetic materials (iron, nickel, cobalt and their alloys) because the method relies on magnetic flux leakage at discontinuities. It cannot be used on non-magnetic materials.',
 'easy', 'ASNT SNT-TC-1A');

insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'NDE Methods',
 'Liquid Penetrant Testing (PT) is effective for detecting:',
 '[{"key":"A","text":"Internal porosity"},{"key":"B","text":"Subsurface cracks 1/4 inch below the surface"},{"key":"C","text":"Surface-open discontinuities on non-porous materials"},{"key":"D","text":"Wall thickness measurements"}]',
 'C',
 'Liquid penetrant testing detects surface-open discontinuities on essentially non-porous materials. It cannot detect subsurface defects. It is applicable to both ferromagnetic and non-ferromagnetic materials.',
 'easy', 'ASNT SNT-TC-1A');

insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'NDE Methods',
 'The primary advantage of Ultrasonic Testing (UT) over Radiographic Testing (RT) is:',
 '[{"key":"A","text":"UT requires no operator training"},{"key":"B","text":"UT produces a permanent photographic record"},{"key":"C","text":"UT is more sensitive to planar discontinuities such as cracks and can determine depth"},{"key":"D","text":"UT can be used on all materials including wood and plastic"}]',
 'C',
 'UT is more sensitive than RT for detecting planar discontinuities (cracks, lack of fusion) and can determine both the size and depth of indications. UT also has advantages in speed, safety (no radiation), and inspecting from one side.',
 'medium', 'ASNT SNT-TC-1A');

insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'NDE Methods',
 'What is the primary purpose of the Charpy V-notch impact test?',
 '[{"key":"A","text":"To measure tensile strength of the weld metal"},{"key":"B","text":"To evaluate notch toughness (fracture energy) at specified temperatures"},{"key":"C","text":"To assess the hardness of the HAZ"},{"key":"D","text":"To determine the fatigue life of the weldment"}]',
 'B',
 'The Charpy V-notch (CVN) test measures the energy absorbed by a notched specimen when struck by a pendulum hammer at a specified temperature. It assesses notch toughness and resistance to brittle fracture, critical for structures in low-temperature service.',
 'medium', 'ASTM E23');

insert into questions (certification_id, category, body, options, correct_answer, explanation, difficulty, reference) values
(cwi_id, 'NDE Methods',
 'In RT, the image quality indicator (IQI or penetrameter) is used to:',
 '[{"key":"A","text":"Measure the actual size of discontinuities in the weld"},{"key":"B","text":"Verify the sensitivity and quality of the radiographic technique"},{"key":"C","text":"Indicate the pass/fail criterion for the weld"},{"key":"D","text":"Mark the weld location on the film"}]',
 'B',
 'The IQI (penetrameter) is placed on the part during radiography to verify that the technique has the required sensitivity. It does not measure discontinuity size directly but confirms the technique can detect a specified wire or hole size.',
 'hard', 'ASTM E1025');

end $seed$;
