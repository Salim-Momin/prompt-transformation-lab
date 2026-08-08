# Weak vs Strong Prompt Examples

This document compares vague prompts with professionally structured prompts.

---

# Example 1: Explain Machine Learning

## Weak Prompt

```text
Explain machine learning.
```

## Prompt Intent

The user wants to understand the basic concept of machine learning.

## Missing Information

* Intended audience
* Existing technical knowledge
* Desired explanation depth
* Preferred examples
* Desired response length
* Output format

## Context Questions

1. Is the explanation for a beginner or an experienced programmer?
2. Should the explanation include mathematics?
3. Should it include practical examples?
4. How detailed should the explanation be?
5. Is the explanation for study, an interview, or general understanding?

## Assumptions

Because the user has not answered the context questions, the following assumptions will be used:

* The audience is a complete beginner.
* No advanced mathematics is required.
* Real-world examples should be included.
* The response should remain below 600 words.
* The explanation should use Markdown.

## Improved Prompt

```text
Role:
You are an experienced machine learning educator who specializes in teaching beginners.

Goal:
Explain the fundamental concept of machine learning clearly and accurately.

Audience:
The explanation is intended for a college student with basic computer knowledge but no previous experience with artificial intelligence or machine learning.

Background:
The student is beginning to study AI and wants to understand machine learning before learning algorithms or writing code.

Requirements:
- Define machine learning in simple language.
- Explain how machine learning differs from traditional programming.
- Introduce supervised, unsupervised and reinforcement learning.
- Include at least three real-world examples.
- Explain the basic machine-learning workflow.
- Include a short summary at the end.

Constraints:
- Avoid advanced mathematics.
- Avoid unexplained technical jargon.
- Keep the explanation under 600 words.
- Do not include implementation code.

Output Format:
Use Markdown with the following sections:

1. What Is Machine Learning?
2. Machine Learning vs Traditional Programming
3. Main Types of Machine Learning
4. Real-World Examples
5. Basic Machine-Learning Workflow
6. Summary

Success Criteria:
- A complete beginner should understand the core idea.
- The explanation should be accurate but not overly technical.
- Every technical term should be explained simply.

Task:
Explain machine learning according to the requirements above.
```

## Structured Result

```json
{
  "weak_prompt": "Explain machine learning.",
  "intent": "Teach the fundamental concept of machine learning.",
  "missing_information": [
    "Intended audience",
    "Existing technical knowledge",
    "Desired explanation depth",
    "Preferred examples",
    "Desired response length",
    "Output format"
  ],
  "context_questions": [
    "Is the explanation for a beginner or an experienced programmer?",
    "Should the explanation include mathematics?",
    "Should practical examples be included?",
    "How detailed should the explanation be?",
    "Is the explanation for study, an interview, or general understanding?"
  ],
  "role": "Experienced machine learning educator",
  "goal": "Explain machine learning clearly and accurately",
  "audience": "College student with no previous machine learning experience",
  "requirements": [
    "Define machine learning",
    "Compare it with traditional programming",
    "Introduce its three main types",
    "Provide real-world examples",
    "Explain the basic workflow",
    "Provide a summary"
  ],
  "constraints": [
    "Avoid advanced mathematics",
    "Avoid unexplained jargon",
    "Stay under 600 words",
    "Do not include code"
  ],
  "output_format": "Markdown with six defined sections",
  "success_criteria": [
    "Understandable to a complete beginner",
    "Technically accurate",
    "Clearly structured"
  ],
  "improved_prompt": "You are an experienced machine learning educator. Explain machine learning to a complete beginner using simple language, real-world examples, clearly defined sections and no advanced mathematics."
}
```

## Evaluation

| Category           | Weak Prompt | Improved Prompt |
| ------------------ | ----------: | --------------: |
| Clarity            |         2/5 |             5/5 |
| Context            |         1/5 |             5/5 |
| Specificity        |         1/5 |             5/5 |
| Constraints        |         1/5 |             5/5 |
| Output structure   |         1/5 |             5/5 |
| Audience alignment |         1/5 |             5/5 |
| Overall usefulness |         2/5 |             5/5 |

### Total Scores

```text
Weak prompt: 9/35
Improved prompt: 35/35
```
