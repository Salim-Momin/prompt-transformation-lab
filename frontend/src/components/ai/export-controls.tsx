"use client";

import {
  Check,
  Clipboard,
  FileJson,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { PromptTransformation } from "@/types/prompt";

interface ExportControlsProps {
  result: PromptTransformation;
}

function createMarkdown(
  result: PromptTransformation,
) {
  const list = (items: string[]) =>
    items.length > 0
      ? items.map((item) => `- ${item}`).join("\n")
      : "- None";

  return `# PromptForge Transformation

## Original Prompt

${result.weak_prompt}

## Intent

${result.intent}

## Category

${result.category}

## Role

${result.role}

## Goal

${result.goal}

## Audience

${result.audience}

## Missing Information

${list(result.missing_information)}

## Context Questions

${result.context_questions
  .map((question, index) => `${index + 1}. ${question}`)
  .join("\n")}

## Assumptions

${list(result.assumptions)}

## Requirements

${list(result.requirements)}

## Constraints

${list(result.constraints)}

## Output Format

${result.output_format}

## Success Criteria

${list(result.success_criteria)}

## Improved Prompt

\`\`\`text
${result.improved_prompt}
\`\`\`

---

Generated with PromptForge AI.
`;
}

function createFileName(
  prompt: string,
  extension: "json" | "md",
) {
  const slug = prompt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 45);

  return `promptforge-${slug || "transformation"}.${extension}`;
}

function downloadFile(
  content: string,
  fileName: string,
  mimeType: string,
) {
  const blob = new Blob([content], {
    type: mimeType,
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

export function ExportControls({
  result,
}: ExportControlsProps) {
  const [copied, setCopied] = useState(false);

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(
        result.improved_prompt,
      );

      setCopied(true);
      toast.success("Improved prompt copied");

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      toast.error("The prompt could not be copied");
    }
  }

  function downloadJson() {
    const content = JSON.stringify(
      result,
      null,
      2,
    );

    downloadFile(
      content,
      createFileName(result.weak_prompt, "json"),
      "application/json;charset=utf-8",
    );

    toast.success("JSON file downloaded");
  }

  function downloadMarkdown() {
    const content = createMarkdown(result);

    downloadFile(
      content,
      createFileName(result.weak_prompt, "md"),
      "text/markdown;charset=utf-8",
    );

    toast.success("Markdown file downloaded");
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <Button
        onClick={copyPrompt}
        className="w-full sm:w-auto"
      >
        {copied ? (
          <Check className="size-4" />
        ) : (
          <Clipboard className="size-4" />
        )}

        {copied
          ? "Copied"
          : "Copy improved prompt"}
      </Button>

      <Button
        variant="secondary"
        onClick={downloadJson}
        className="w-full sm:w-auto"
      >
        <FileJson className="size-4" />
        Download JSON
      </Button>

      <Button
        variant="secondary"
        onClick={downloadMarkdown}
        className="w-full sm:w-auto"
      >
        <FileText className="size-4" />
        Download Markdown
      </Button>

    </div>
  );
}