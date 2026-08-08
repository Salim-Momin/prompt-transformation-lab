# Professional Prompt Transformation Template

This template transforms vague or incomplete prompts into structured, professional prompts.

---

## 1. Original Prompt

```text
[Insert the user's original prompt]
```

---

## 2. Prompt Intent

Describe what the user is ultimately trying to achieve.

```text
[Describe the primary objective]
```

---

## 3. Missing Information

Identify important information that is missing from the original prompt.

* Audience level
* Desired depth
* Background context
* Preferred examples
* Tone
* Length
* Constraints
* Output format
* Success criteria

Only include items that are relevant to the original request.

---

## 4. Context Questions

Ask questions that would improve the final prompt.

1. Who is the intended audience?
2. What is the desired outcome?
3. How detailed should the response be?
4. Are there any constraints?
5. What output format should be used?

---

## 5. Structured Prompt Components

### Role

```text
You are a [relevant expert role].
```

### Goal

```text
Your goal is to [describe the required result].
```

### Audience

```text
The response is intended for [target audience].
```

### Background

```text
[Include relevant background information.]
```

### Context

```text
[Explain the situation in which the output will be used.]
```

### Requirements

* [Requirement one]
* [Requirement two]
* [Requirement three]

### Constraints

* [Constraint one]
* [Constraint two]
* [Constraint three]

### Output Format

```text
Specify headings, sections, JSON fields, tables, bullet points, code blocks, or another required format.
```

### Success Criteria

The response is successful when:

* It solves the stated problem.
* It follows all requirements.
* It respects all constraints.
* It is appropriate for the intended audience.
* It uses the requested output format.

---

## 6. Improved Prompt

```text
Role:
You are a [relevant expert].

Goal:
[Clearly state the main task.]

Audience:
[Describe the intended audience.]

Background:
[Provide useful background information.]

Context:
[Explain how or where the result will be used.]

Requirements:
- [Requirement one]
- [Requirement two]
- [Requirement three]

Constraints:
- [Constraint one]
- [Constraint two]
- [Constraint three]

Output Format:
[Define the exact response structure.]

Success Criteria:
- [Success criterion one]
- [Success criterion two]

Task:
[Write the final, direct instruction.]
```

---

## 7. Structured JSON Output

```json
{
  "weak_prompt": "",
  "intent": "",
  "missing_information": [],
  "context_questions": [],
  "role": "",
  "goal": "",
  "audience": "",
  "requirements": [],
  "constraints": [],
  "output_format": "",
  "success_criteria": [],
  "improved_prompt": ""
}
```

---

## 8. Evaluation Checklist

Score each category from 1 to 5.

| Category           | Score |
| ------------------ | ----: |
| Clarity            |    /5 |
| Context            |    /5 |
| Specificity        |    /5 |
| Constraints        |    /5 |
| Output structure   |    /5 |
| Audience alignment |    /5 |
| Overall usefulness |    /5 |

### Total Score

```text
Score: __ / 35
```
