# Question Bank Plan

## Product rule

Each certification should have a large reviewed pool. A user exam pulls a balanced,
randomized subset from that pool and avoids questions seen in the user's five most
recent completed sessions when enough unseen questions are available.

Only questions with `review_status = published` are eligible for user exams.

## AWS CWI structure

Readymetry models AWS CWI as three separate bodies of knowledge:

- Part A, Fundamentals: destructive testing, fabrication math, safety, metallurgy,
  nondestructive testing, welding symbols, WPS/PQR, and welding fundamentals.
- Part B, Practical: specification use, WPS/PQR application, inspection tools,
  measurements, and evaluation of representative weld discontinuities.
- Part C, Code Book: locating and applying requirements from a selected permitted
  codebook and edition.

Part C questions must name the codebook and edition in `source_edition`. Do not
publish Part C questions without access to that licensed edition and SME review.

## Target pool

| Pool | Initial target | Publication requirement |
| --- | ---: | --- |
| Part A Fundamentals | 300 | Technical review and reference check |
| Part B Practical | 150 | Technical review plus visual/tool validation |
| Part C Code Book | 150 per supported codebook | Licensed edition and clause check |

The first 500-question milestone should therefore be Part A plus Part B. Part C is
maintained as a separate edition-specific pool.

## Batch workflow

1. Author 25-50 original questions in a batch.
2. Run `npm run questions:audit`.
3. Resolve duplicate stems, missing explanations, weak distractors, and coverage gaps.
4. Have a qualified welding-inspection SME verify the answer and reference.
5. Change approved rows from `needs_review` to `published`.
6. Apply the reviewed migration and verify live category counts.

Never copy questions or explanations from AWS publications, books, or exam-prep
products. References support factual verification only.

Track the access level and permitted use of each reference in
`docs/question-sources.md`. A preview or table of contents may guide coverage, but
it is not sufficient evidence for publishing detailed technical questions.
