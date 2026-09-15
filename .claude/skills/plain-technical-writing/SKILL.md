---
name: plain-technical-writing
description:
  Write and revise technical prose in plain language. Use when writing or
  editing documentation, code comments, doc strings, commit messages, pull
  request descriptions, changelog entries, tickets or UI text. Also use when
  asked to make writing clearer, shorter, less convoluted or less AI-sounding.
  ALWAYS LOAD THIS SKILL, even if other skills load. Also for all commit
  messages.
---

# Plain technical writing

Write so the reader gets it on one pass. These rules apply to everything: docs,
comments, doc strings, commit messages, MR descriptions, changelog entries,
tickets and UI text.

## Simple and short

- One idea per sentence. Cut any sentence that runs over two lines.
- Plain words. "dev server", not "development environment instance".
- No filler ("it is worth noting that", "which is what"), no em-dash asides, no
  stacked subclauses.
- Say only what matters. The code is the truth: give the reason, the trade-off
  and the rejected alternative, not details a reader can get from the code.
- Say each point once, then stop.
- Short does not mean vague. Keep the reasoning, just state it plainly.
- When you edit a file, rewrite the paragraph you touched in this style too.
  That is how old text gets better.

Instead of:

> The importer honours the supplied value only when it falls within the
> permitted range, which lets it fail fast rather than proceed with a setting
> that would produce results nobody could trust; a value outside the range
> remains an ordinary validation error worth surfacing to the user.

write:

> The importer uses the value only if it is in range. Otherwise it stops at
> once. An out-of-range value is a normal validation error, and the user sees
> it.

## Nothing clever or flowery

A metaphor feels good to write and costs the reader time. Say the mechanism.

| Flowery                                                       | Plain                                                               |
| ------------------------------------------------------------- | ------------------------------------------------------------------- |
| A duplicate never reaches the work queue.                     | A second server cannot take jobs.                                   |
| This guard stops a rogue client poisoning the cache.          | The guard stops a client writing an old value over a newer one.     |
| Validation happens early, so bad input never travels deeper.  | The API validates input at the edge. Nothing after it checks again. |
| The worker gracefully surrenders its lease.                   | The worker releases its lease before it exits.                      |
| The retry logic forgives transient hiccups but not real ones. | The client retries a timeout. It does not retry an error response.  |
| A planted cookie cannot put words in the server's mouth.      | A planted cookie cannot make the server say something it did not.   |

## Name the actor

Short is not the same as easy. A short sentence built out of abstract nouns
still makes the reader unpack it before they know what to do.

- Give the sentence a real subject: a person, the server, the client, the code.
  Not "the deletion", "the validation", "cache invalidation".
- Put a condition in an `if` clause, not inside a noun. Write "If the file is
  read-only, you can't save", not "A read-only file blocks saving".
- Say what the reader can or cannot do, in that order: condition first, then
  consequence.
- Use the active voice wherever a real actor exists.
- This is not a word count rule. The plain version is often longer. The test is
  whether the reader gets it on one pass.

Instead of:

> Cache invalidation is eventually consistent. Eviction propagation is bounded
> by the refresh interval.

write:

> Servers drop a stale entry a moment late. A client can read an old value for
> up to one refresh interval.

More pairs:

| Abstract                                     | Plain                                                        |
| -------------------------------------------- | ------------------------------------------------------------ |
| A read-only file blocks saving.              | If the file is read-only, you can't save.                    |
| A mismatched version returns a conflict.     | If the version does not match, the write returns a conflict. |
| Session expiry has no server-side hook.      | Nothing on the server runs when a session expires.           |
| The retry header is optional.                | You can send a retry header, but you don't have to.          |
| Cache invalidation is eventually consistent. | Servers drop a stale entry a moment late.                    |
| Email is sent from the queue worker.         | The queue worker sends the email.                            |

## One job per paragraph

Short sentences are not enough. A paragraph that does several jobs at once is
still too much, even when every sentence in it is short.

- One job per paragraph: the problem, the fix, the trade-off, the rejected
  alternative. Split a paragraph that does more.
- Cut sentences that only emphasize a point already made, like "That is what
  stops a second worker taking the job at all."
- Cut a reason when the next sentence already gives it.
- Watch for a warning buried in the middle of a long paragraph. A reader will
  miss it. Give it its own paragraph.
- A bold lead-in should be a sentence with an actor, not a label. "**The pool
  holds one worker per CPU.**", not "**How many workers.**"
- If a sentence hides a list of steps or items, make it a list.

## Read it again before you finish

When you have finished writing, stop and read the whole thing again against
these rules. Rewrite what does not hold up. Do this every time, even when you
had the rules in mind while writing.

Writing and editing pull in different directions, so a lot slips through the
first time. These keep coming back:

- An abstract noun as the subject.
- A condition packed into a noun phrase.
- A flowery turn of phrase that felt good while writing.
- A paragraph doing three jobs at once.
- A bold lead-in that is a sentence fragment doing a heading's job.
- Passive voice where a real actor exists.

Two rules for this second read:

- Do not change facts. If a sentence reads badly because the subject is hard,
  rewrite the sentence. Do not soften a claim to make it flow.
- Do not cut. A hard sentence that carries real content gets rewritten, not
  deleted.

Leave a sentence alone if fixing it means guessing. Naming an actor you would
have to invent, or changing "would" to "might", is a factual change wearing a
style fix as a disguise.

## Comments in code

- Say why the code exists, and give background on the solution.
- Do not say what the code does, especially for trivial cases.
- Do not document the self-evident, such as getters and setters.
- Never use divider comments like `-----`. They are noise.

## Documentation and UI text

- No emojis.
- Use sentence case everywhere: comments, doc strings, error messages, UI
  labels, headings, commit messages.
    - RIGHT: "User settings", "Billing history", "Create new project"
    - WRONG: "User Settings", "Billing History", "Create New Project"
    - Exceptions: proper nouns, acronyms and product names.
- Use "time zone" as two words in prose. Identifiers stay one word (`timezone`
  field, `Timezone` type).

## What good looks like

A page or a comment earns its place by giving the reader what the code cannot:
the shape of the subject, and the reasons behind it. Decisions, trade-offs and
rejected alternatives are the most valuable thing you can write down, because
nobody can recover them by reading the code.

Length follows the subject. A big subject earns a long page. What makes writing
too long is detail the reader could have got from the code, not the line count.
If you are cutting for length, cut that first.
