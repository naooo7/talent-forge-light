# Complete Kecukupan Data question bank

## Scope
- Replace the three-record test bank with the complete 60-row `Questions` sheet, preserving every supplied cell exactly and keeping Q1–Q3 as the same canonical records rather than duplicates.
- Keep every record under `SKD → TIU → Numerik → Kecukupan Data`; source-document headings will not be added to the application hierarchy.
- Change only the Kecukupan Data question-stem rendering: split existing `(1)` and `(2)` text at display time into a short prompt plus two clearly spaced numbered lines. Stored question text remains unchanged, and answer choices, header, feedback, timer, scoring, and results remain untouched.

## Verification
- Compare all imported fields against the workbook and check exactly 60 unique IDs/source numbers, Q1–Q60 coverage, five choices each, answers, explanations, difficulty distribution, and taxonomy.
- Run the code check and inspect current preview diagnostics.
- Play through the existing Drill path to Kecukupan Data in the preview, confirm 60-question availability and visually inspect numbered-statement formatting at desktop and mobile-sized viewports.

## Source-file note
- The available workbook is named `Fundamental_Question_Bank_SKD_TIU_Kecukupan_Data_60_with_Difficulty.xlsx`. Its `Questions` sheet has 60 rows and 24 columns, but no `curriculum_version`, `curriculum_status`, or `curriculum_note` columns. The import will preserve every field actually present and will not invent values for absent columns.
