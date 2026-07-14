# AI-copy rules — keeping AI-drafted copy from reading as AI-written

Distilled from the Reddit/HN discourse on AI tells (r/ChatGPT "words that scream
ChatGPT", the em-dash threads), Wikipedia's community-maintained **"Signs of AI
writing"** page, and practitioner editing guides. Two meta-findings shape the
ordering:

1. **Word ban-lists decay; structural templates persist.** "Delve" is already
   passé (models dropped it mid-2025), but negative parallelism, rule-of-three,
   and significance-inflation survive every model generation. Rules about
   structure age better than rules about words.
2. **No single tell is proof.** Readers (and the heavy-LLM-user readers who
   detect at ~90% accuracy) react to **density of tells**, not any one. The goal
   is to keep the count per page near zero, because each instance makes the
   others more visible.

## Tier 1 — Structural templates (the durable tells; police these hardest)

1. **Negative parallelism — "It's not X, it's Y."** The single most-cited AI
   tell, in all its costumes: "It isn't about X — it's Y", "Not X. Y.",
   "X, not Y", "You don't need X. You need Y.", "more than just X",
   "not just X, but Y". Grep drafts for `not`, `isn't`, `wasn't`, `more than`,
   `just`. A contrast survives only when the negated half carries real
   information the reader needed (a genuine misconception being corrected) —
   never as a rhythm device. Default fix: delete the rejected frame and state
   the claim directly. **Budget: at most one true contrast per page.**
2. **Rule of three.** Reflexive triads — three adjectives, three parallel
   phrases, three short fragments ("Slower. Calmer. Curiosity-led.") — read as
   template, not thought. Use however many items are actually true, and break
   the parallelism (vary the grammar of the items). Concrete triads (three real
   nouns doing work) are safer than abstract ones, but two triads on one page
   is already a pattern.
3. **Mirrored/chiastic aphorisms.** "Nothing is handed off, so nothing is lost
   in the handoff" — perfectly symmetrical sentences that snap shut. One per
   page can be the payoff line; several is the "every paragraph tied with a
   bow" tell. If two sentences on a page share the same mirror structure, keep
   the better one.
4. **The section-closing bow.** Ending every section on a polished aphorism
   (highlight lines included) creates the fractal-summary feel. Some sections
   should just stop on a fact.
5. **Windups and meta-commentary.** "It's important to note", "Here's the
   thing", "Here's where it gets interesting", "Let's break this down",
   question-then-instant-answer ("The solution? Simpler than you think.").
   Delete the announcement; make the point.
6. **Manufactured openers and closers.** No "In today's fast-paced world"
   openers; no conclusions that restate the piece; no "the future looks
   bright" redemption endings. Open on the specific; end on the last real
   thought.
7. **Trailing "-ing" significance clauses.** "…, highlighting the importance
   of", "…, underscoring", "…, cementing" — fake analysis bolted to a fact.
   If the consequence matters, give it its own sentence with evidence.

## Tier 2 — Rhythm and punctuation

8. **Ration em dashes.** The mark is socially radioactive regardless of ground
   truth ("the ChatGPT hyphen"). Target: **one em dash per ~150–200 words,
   never two in one sentence**, and never as the hinge of an "isn't X — it's
   Y" (that combination is the exact signature). Commas, periods, and
   parentheses absorb most of them without loss.
9. **Vary sentence length on purpose.** AI clusters at 12–18 words with uniform
   paragraphs. Follow a long sentence with a short one; allow a fragment;
   start with And/But. But don't fake it with staccato clusters
   ("Short. Punchy. Sentences.") — that's its own tell.
10. **Break the paragraph template.** Topic sentence → explanation → example →
    mini-summary, repeated, is machine cadence. Let some paragraphs be one
    line and some meander.
11. **Repeat the plain word.** Synonym-cycling ("the studio… the firm… the
    practice") is a repetition-penalty artifact. Humans say the same word
    again.

## Tier 3 — Substance (the unfakeable layer; already house strength)

12. **One detail per section only you could know.** Named clients, real
    numbers, places, dates (₹1,000-crore, Jharkhand, 70k tokens, four months).
    This is the fastest humanizing move and the hardest to fake.
13. **Take a position; don't hedge.** "Arguably", "worth noting", stacked
    qualifiers, false balance — cut. Make the claim or drop it.
14. **Demonstrate significance, never label it.** No "pivotal", "crucial",
    "testament", "game-changer". Show the consequence and let it argue.
15. **Match tone to stakes.** No uniform enthusiasm; some things just went
    badly; a small win is described as a small win.
16. **Say "is".** AI dodges plain copulas: "serves as", "stands as",
    "represents", "boasts", "features". Just say is/has/does.

## Tier 4 — Vocabulary (weakest signal alone, still worth a grep)

17. **Banned cluster** (any one is noise, three on a page is a flag): delve,
    tapestry, landscape, testament, pivotal, crucial, intricate, robust,
    seamless, leverage, harness, unlock, elevate, empower, foster, showcase,
    underscore, vibrant, meticulous, navigate, realm, journey, transform,
    game-changer, cutting-edge, "diverse array", "rich heritage".
18. **Deflate verbs.** leverage→use, craft→make, delve→look into. The simplest
    accurate verb wins.
19. **Watch the filler tics**: "genuinely", "actually", "truly", "quietly",
    "deeply", "fundamentally" — cut 90% of them.

## Process rules (how the AI drafting happens)

20. **Prompting reduces cleanup; editing does the work.** Negative guardrails
    in the prompt help but models revert. Always run an edit pass against
    Tiers 1–2 specifically — search-and-destroy, not vibes.
21. **Read it aloud.** The single most-repeated practitioner technique. Every
    gap between how-you'd-say-it and how-it's-written is the rewrite spot.
22. **Feed voice, not adjectives.** Give the model real finished pieces and
    before/after edit pairs, not "be conversational". Tell it who is writing
    and who is reading, or it defaults to a voice that sounds like nobody.
23. **The tells are also just bad writing.** Wikipedia's deeper point: editing
    them out improves the prose regardless of who drafted it. These rules
    don't fight the existing copy principles in CLAUDE.md — they're the same
    instinct (cringe test, fewer words, specifics) made mechanical.
