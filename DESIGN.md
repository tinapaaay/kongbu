---
version: alpha
name: Hangul Lab
description: A personal EPS-TOPIK study workspace whose colors, section system, and page structure follow the NEW EPS-TOPIK Standard Korean Textbook the learner studies from.

colors:
  primary: "#3F71A8"
  primary-strong: "#2F5A8A"
  primary-subtle: "#DCE6EF"
  surface: "#FEFEFE"
  on-surface: "#232121"
  secondary: "#5E5A55"
  neutral: "#F2EFEB"
  border: "#C9C5BF"
  outline: "#8C8780"
  gloss: "#6C372A"
  example: "#006E8F"
  grammar: "#E1914F"
  vocabulary: "#6995C0"
  culture: "#6EBDB5"
  conversation: "#64568A"
  reading: "#D09196"
  word-bank: "#F9F4D2"
  success: "#19675F"
  success-subtle: "#E1EFEA"
  error: "#A3343A"
  error-subtle: "#F6E6E5"

typography:
  chapter-number:
    fontFamily: Titillium Web
    fontSize: 72px
    fontWeight: 900
    lineHeight: 1
    letterSpacing: -0.02em
  chapter-title:
    fontFamily: Apple SD Gothic Neo
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.2
  chapter-title-mobile:
    fontFamily: Apple SD Gothic Neo
    fontSize: 30px
    fontWeight: 700
    lineHeight: 1.25
  section-title:
    fontFamily: Apple SD Gothic Neo
    fontSize: 26px
    fontWeight: 700
    lineHeight: 1.3
  heading-sm:
    fontFamily: Apple SD Gothic Neo
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.4
  question:
    fontFamily: Apple SD Gothic Neo
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.6
  korean-md:
    fontFamily: Apple SD Gothic Neo
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.7
  body-md:
    fontFamily: Apple SD Gothic Neo
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.7
  body-strong:
    fontFamily: Apple SD Gothic Neo
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.5
  gloss:
    fontFamily: Apple SD Gothic Neo
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  tab-label:
    fontFamily: Titillium Web
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0.08em
  number:
    fontFamily: Titillium Web
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.4

rounded:
  sm: 4px
  md: 10px
  lg: 16px
  full: 9999px

spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  xxl: 64px
  margin: 48px
  margin-mobile: 16px
  touch-target: 44px

components:
  page:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
  page-exam:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
  chapter-banner:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.chapter-title}"
    padding: "{spacing.lg}"
  chapter-number:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.chapter-number}"
  chapter-opener:
    backgroundColor: "{colors.primary-subtle}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
  icon-tile:
    backgroundColor: "{colors.on-surface}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    size: "{spacing.touch-target}"
  section-tab-grammar:
    backgroundColor: "{colors.grammar}"
    textColor: "{colors.on-surface}"
    typography: "{typography.tab-label}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm}"
  section-tab-vocabulary:
    backgroundColor: "{colors.vocabulary}"
    textColor: "{colors.on-surface}"
    typography: "{typography.tab-label}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm}"
  section-tab-conversation:
    backgroundColor: "{colors.conversation}"
    textColor: "{colors.surface}"
    typography: "{typography.tab-label}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm}"
  section-tab-culture:
    backgroundColor: "{colors.culture}"
    textColor: "{colors.on-surface}"
    typography: "{typography.tab-label}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm}"
  section-tab-reading:
    backgroundColor: "{colors.reading}"
    textColor: "{colors.on-surface}"
    typography: "{typography.tab-label}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm}"
  objectives-label:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  content-box:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  tip-box:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  word-bank:
    backgroundColor: "{colors.word-bank}"
    textColor: "{colors.on-surface}"
    typography: "{typography.korean-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  gloss-text:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.gloss}"
    typography: "{typography.gloss}"
  gloss-text-exam:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.gloss}"
    typography: "{typography.gloss}"
  example-highlight:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.example}"
    typography: "{typography.body-strong}"
  example-highlight-tip:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.example}"
    typography: "{typography.body-strong}"
  text-meta:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.secondary}"
    typography: "{typography.gloss}"
  divider:
    backgroundColor: "{colors.border}"
    height: 1px
  divider-strong:
    backgroundColor: "{colors.outline}"
    height: 1px
  focus-ring:
    backgroundColor: "{colors.primary-strong}"
    width: 3px
  nav-link:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.secondary}"
    typography: "{typography.body-strong}"
    height: "{spacing.touch-target}"
  nav-link-active:
    backgroundColor: "{colors.primary-subtle}"
    textColor: "{colors.primary-strong}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.full}"
    height: "{spacing.touch-target}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    height: "{spacing.touch-target}"
  button-primary-hover:
    backgroundColor: "{colors.primary-strong}"
    textColor: "{colors.surface}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary-strong}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    height: "{spacing.touch-target}"
  question-box:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.korean-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  answer-choice:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.korean-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    height: 56px
  answer-choice-hover:
    backgroundColor: "{colors.primary-subtle}"
    textColor: "{colors.on-surface}"
  answer-choice-selected:
    backgroundColor: "{colors.primary-subtle}"
    textColor: "{colors.primary-strong}"
    typography: "{typography.korean-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  answer-choice-correct:
    backgroundColor: "{colors.success-subtle}"
    textColor: "{colors.success}"
    typography: "{typography.korean-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  answer-choice-incorrect:
    backgroundColor: "{colors.error-subtle}"
    textColor: "{colors.error}"
    typography: "{typography.korean-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  status-not-started:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.secondary}"
    typography: "{typography.gloss}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs}"
  status-visited:
    backgroundColor: "{colors.primary-subtle}"
    textColor: "{colors.primary-strong}"
    typography: "{typography.gloss}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs}"
  status-practiced:
    backgroundColor: "{colors.word-bank}"
    textColor: "{colors.on-surface}"
    typography: "{typography.gloss}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs}"
  status-mastered:
    backgroundColor: "{colors.success}"
    textColor: "{colors.surface}"
    typography: "{typography.gloss}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs}"
  label-draft:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.secondary}"
    typography: "{typography.gloss}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: "{spacing.sm}"
    height: "{spacing.touch-target}"
  input-error:
    backgroundColor: "{colors.error-subtle}"
    textColor: "{colors.error}"
    typography: "{typography.gloss}"
    rounded: "{rounded.sm}"
    padding: "{spacing.sm}"
  table-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    padding: "{spacing.sm}"
  score-value:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.number}"
  tooltip:
    backgroundColor: "{colors.on-surface}"
    textColor: "{colors.surface}"
    typography: "{typography.gloss}"
    rounded: "{rounded.sm}"
    padding: "{spacing.sm}"
---

# Hangul Lab

## Overview

Hangul Lab should feel like the **NEW EPS-TOPIK Standard Korean Textbook (Books 1 and 2) turned into a study app**. The learner already spends hours with these books, so the app adopts their visual language: a royal-blue chapter banner, colored tabs that identify each kind of section, white rounded boxes on softly tinted pages, maroon English translations under Korean, and highlighted examples.

This was a deliberate choice to match the learner's material instead of inventing a separate style. Moving between the book and the app should feel continuous. When the app says **문법 GRAMMAR** on an orange tab, the learner should recognize it at once.

The app copies the book's **colors, section system, and page structure**. It does not copy the book's photographs, illustrations, cartoon characters, cover, logos, or text. All lesson explanations and questions are original. This is appropriate for a private study tool. If Hangul Lab ever becomes public, this direction must be reviewed so the app is not mistaken for an official publication.

Where the printed book conflicts with screen accessibility, accessibility wins. The book uses white text on light orange, teal, and rose, and uses bright cyan text for examples. Those pairs are too faint on screens, so Hangul Lab keeps the exact book colors for fills and uses near-black text on them, or uses slightly darker versions of the colors for text.

The first release has a light theme only.

## Colors

These values were measured from rendered pages of Book 1, Chapter 11 (pages 150–158).

- **Primary (#3F71A8):** *Textbook blue.* The chapter banner, learning objectives label, vocabulary tab, and primary actions all use it. In the app it means "main path forward." White text on it passes at 5.1:1.
- **Primary Strong (#2F5A8A):** A darker version of textbook blue for hover, focus, and blue text on light-blue backgrounds.
- **Primary Subtle (#DCE6EF):** *Chapter opener blue.* The pale blue behind the book's chapter opener. Used for the app's chapter opener, the active navigation item, visited status, and selected answers.
- **Surface (#FEFEFE):** *Book page white.* The book's near-white content boxes.
- **Neutral (#F2EFEB):** *Exam page beige.* The background of the book's reading and listening test pages and its tip boxes. Used for mock-exam pages and side notes.
- **On-surface (#232121):** *Book black.* The text color and the black icon tile beside each section tab.
- **Secondary (#5E5A55):** Muted text for metadata and labels that do not need emphasis.
- **Border (#C9C5BF) and Outline (#8C8780):** Light rules divide content. Outline marks controls such as answer choices and inputs, with at least 3:1 contrast.
- **Gloss (#6C372A):** *Translation maroon.* The book prints English translations in this color under Korean. Hangul Lab does the same for every English gloss.
- **Example (#006E8F):** *Darkened example cyan.* The book highlights target grammar in examples with bright cyan (#00AFDD). This darker version keeps the meaning while staying readable.
- **Section colors:** each section type keeps the book's color.
  - **Grammar (#E1914F):** orange.
  - **Vocabulary (#6995C0):** light blue.
  - **Culture (#6EBDB5):** teal.
  - **Reading (#D09196):** rose.
  - **Conversation (#64568A):** a slightly darkened version of the book's purple (#8070A3), so white text on it remains readable.
- **Word Bank (#F9F4D2):** *Choice-box yellow.* The book's pale yellow band for word choices. Also used for Practiced status.
- **Success (#19675F) and Success Subtle (#E1EFEA):** derived from the culture teal and the culture page's mint background. Used for correct answers and Mastered status.
- **Error (#A3343A) and Error Subtle (#F6E6E5):** derived from the reading rose. Used for wrong answers and problems. Error must never be used for English glosses.

Section colors only identify section type. They are not decoration and do not indicate success, failure, or action.

## Typography

The book uses **Apple SD Gothic Neo** for Korean and **Titillium Web** for its English section labels and large numbers. Hangul Lab uses the same families.

**Apple SD Gothic Neo** is built into macOS and iOS, so it needs no download there. Other systems use their own built-in Korean font, so no Korean web font is downloaded. A Korean web font would add about 178 KB of CSS to every page for devices that already have Korean fonts. Font stack: `"Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans CJK KR", "Noto Sans KR", sans-serif`. Use only weights 400 and 700.

**Titillium Web** is open-licensed and self-hosted through Fontsource. It is used for uppercase English tab labels, large chapter numbers, question numbers, and scores. It is not used for Korean or paragraphs. Labels use weight 700 at 14px or larger with 0.08em letter spacing. Weight 900 is reserved for numbers 28px and larger, because it closes up the letter shapes at small sizes. Font stack: `"Titillium Web", "Arial Narrow", sans-serif`.

Korean content follows the book's hierarchy:

- Question instructions are bold.
- Answer choices and passages use regular weight.
- English translations sit directly underneath, smaller and maroon.

Use `lang="ko"` and `word-break: keep-all` for Korean text. Keep paragraphs near 68 characters wide.

## Layout

The app reproduces the book's page structure on screen.

**Chapter opener.** A full-width textbook-blue banner holds the large chapter number, Korean title, and English title. Below it, a pale-blue area shows the chapter's grammar, vocabulary, and culture topics in their section colors. Then comes a learning objectives row with a blue label on the left and white rows on the right.

**Section header.** Each section starts with a black rounded icon tile, then a colored tab containing the Korean label and uppercase English label, such as **어휘 VOCABULARY**. A light rule continues to the right edge.

**Content.** Content sits in white rounded boxes. Tip and note boxes use exam beige. Word choices sit in a yellow band. Tables use simple gray rules.

**Mock exams.** Exam pages use exam beige, the reading tab, and an `EPS-TOPIK` style label. Each passage or prompt sits in a white rounded box, and answer choices are numbered ①–④.

Desktop pages have a maximum width of 1040px and 48px margins. Below 768px, the layout is one column with 16px margins, and answer choices stack vertically. Spacing uses a 4px base, and touch targets are at least 44px tall.

## Elevation & Depth

The book is flat, so the app is flat. Depth comes from colored page backgrounds, white boxes, rules, and spacing. Do not use shadows. Dialogs use a white box, an outline border, and a dark overlay at 40% opacity.

## Shapes

The book uses soft rounded boxes. Content boxes, tabs, buttons, and answer choices use a 10px radius. Tip boxes use 16px. Inputs use 4px. Status labels and navigation pills use a full radius.

Boxes have a 1px Border rule. Answer choices and inputs use a 1px Outline rule. Selected, correct, and incorrect answers use a 2px border in their text color. Every focus state uses a 3px Primary Strong outline with a 2px offset.

## Components

**Navigation.** A white bar with the app name and text links. The active item is a pale-blue pill with Primary Strong text and `aria-current="page"`.

**Chapter banner.** Textbook blue with the chapter number and title in white. The book prints the number in light blue, but that is too faint on screen. The banner must not include book photos or characters.

**Section tabs.** Grammar, vocabulary, conversation, culture, and reading each use their book color. The tab includes both Korean and English. Do not invent new section colors.

**Vocabulary entries.** Korean term in bold, English gloss beneath it in maroon. Group related terms under colored headings that follow the book's category style.

**Grammar entries.** Pattern title, short explanation, a conjugation table with gray rules, and examples where the target form is highlighted in Example color.

**Answer choices.** Full-width white rounded rows with ①, ②, ③, or ④ at the left. Before submission only Selected appears, with pale-blue fill and the word "Selected." After submission, correct and wrong answers use their colors plus "Correct answer" and "Your answer."

**Status labels.** Not Started, Visited, Practiced, and Mastered are rounded pills that always contain the status word. Scores show their sample, such as `8/10`.

**Draft label.** "Draft question" appears as a quiet outlined pill until a question is reviewed.

## Do's and Don'ts

- **Do** match the book's section colors exactly for fills and tabs.
- **Don't** use white text on orange, teal, rose, light-blue vocabulary, or yellow. Use Book Black.
- **Do** put English translations under Korean in Gloss maroon.
- **Don't** use bright book cyan (#00AFDD) as text. Use Example (#006E8F).
- **Do** use textbook blue for the main action on each screen.
- **Don't** use section colors to mean correct, wrong, selected, or clickable.
- **Do** use exam beige for mock exams so they feel distinct from lessons.
- **Don't** add shadows, gradients, glass effects, or decorative patterns.
- **Do** pair every status and answer color with a written label.
- **Don't** reveal answer colors before submission.
- **Do** use original explanations, examples, and questions.
- **Don't** reproduce textbook photos, illustrations, characters, logos, page scans, or exam questions.
