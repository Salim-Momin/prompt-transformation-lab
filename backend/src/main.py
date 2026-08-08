import json
import re
from datetime import datetime
from pathlib import Path

from pydantic import ValidationError

from src.transformer import PromptTransformer


OUTPUT_DIRECTORY = Path("outputs")


def create_filename(prompt: str) -> str:
    """Create a safe timestamped filename from a prompt."""

    slug = re.sub(r"[^a-zA-Z0-9]+", "-", prompt.lower())
    slug = slug.strip("-")[:40] or "transformation"

    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")

    return f"{timestamp}-{slug}.json"


def save_result(prompt: str, result: dict) -> Path:
    """Save the structured transformation as a JSON file."""

    OUTPUT_DIRECTORY.mkdir(parents=True, exist_ok=True)

    file_path = OUTPUT_DIRECTORY / create_filename(prompt)

    with file_path.open("w", encoding="utf-8") as file:
        json.dump(result, file, indent=2, ensure_ascii=False)

    return file_path


def display_result(result: dict) -> None:
    """Display the most useful transformation fields."""

    print("\n" + "=" * 70)
    print("PROMPT TRANSFORMATION RESULT")
    print("=" * 70)

    print(f"\nCategory:\n{result['category']}")
    print(f"\nIntent:\n{result['intent']}")
    print(f"\nRole:\n{result['role']}")
    print(f"\nAudience:\n{result['audience']}")

    print("\nMissing information:")
    for item in result["missing_information"]:
        print(f"  - {item}")

    print("\nContext questions:")
    for number, question in enumerate(result["context_questions"], start=1):
        print(f"  {number}. {question}")

    print("\nImproved prompt:")
    print("-" * 70)
    print(result["improved_prompt"])
    print("-" * 70)


def main() -> None:
    """Run the Prompt Transformation Lab CLI."""

    print("=" * 70)
    print("PROMPT TRANSFORMATION LAB")
    print("Transform weak prompts into professional prompts using Gemini")
    print("=" * 70)

    weak_prompt = input("\nEnter your weak prompt:\n> ").strip()

    if not weak_prompt:
        print("\nError: You must enter a prompt.")
        return

    try:
        transformer = PromptTransformer()

        print("\nTransforming prompt with Gemini...")

        transformation = transformer.transform(weak_prompt)
        result = transformation.model_dump()

        display_result(result)

        saved_path = save_result(weak_prompt, result)

        print(f"\nResult saved to: {saved_path}")

    except ValueError as error:
        print(f"\nConfiguration error:\n{error}")

    except ValidationError as error:
        print("\nGemini returned data that did not match our schema.")
        print(error)

    except Exception as error:
        print(f"\nTransformation failed: {error}")


if __name__ == "__main__":
    main()