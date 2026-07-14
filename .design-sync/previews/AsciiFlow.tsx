import { Essay, Kicker, AsciiFlow } from 'ajency-design';

export const TokenRouting = () => (
  <Essay>
    <Kicker>Why it barely costs a token to run</Kicker>
    <p>Only the part that needs judgment runs on the pricey model; everything repeatable is pushed down to things that run for free:</p>
    <AsciiFlow>{`┌────────────────────────────────────────────────────────┐
│ Claude · frontier · ONE-TIME                            │
│ writes the test once, as plain intent                   │
└────────────────────────────────────────────────────────┘
                             │
                             ▼ test spec
┌────────────────────────────────────────────────────────┐
│ Python · EVERY RUN — the runner                         │
│ drives Chrome · screenshots · highlights · PASS/FAIL    │
└────────────────────────────────────────────────────────┘
                             │
                             ▼ novel surprise Qwen can't resolve
┌────────────────────────────────────────────────────────┐
│ Claude · ESCALATION ONLY (rare)                          │
│ gets Qwen's 2-line text — NOT the image — decides        │
└────────────────────────────────────────────────────────┘`}</AsciiFlow>
  </Essay>
);
