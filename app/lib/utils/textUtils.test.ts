// This file has been moved from app/utils/textUtils.test.ts to app/lib/utils/textUtils.test.ts
// Any imports from app/utils/* should be updated to app/lib/utils/*

import { cleanDescription, toTitleCase } from "@/app/lib/utils/textUtils";

describe("cleanDescription", () => {
  it("should remove surrounding single quotes", () => {
    expect(cleanDescription("'This is a test'")).toBe("This is a test");
  });

  it("should remove surrounding double quotes", () => {
    expect(cleanDescription('"This is a test"')).toBe("This is a test");
  });

  it('should remove "Back Cover" variations', () => {
    const variations = [
      "Description text -- Back Cover",
      "Description text --Back Cover",
      "Description text - Back Cover",
      "Description text –Back Cover",
      "Description text—Back Cover",
    ];

    variations.forEach((text) => {
      expect(cleanDescription(text)).toBe("Description text");
    });
  });

  it("should normalize whitespace", () => {
    expect(cleanDescription("Too   many    spaces")).toBe("Too many spaces");
    expect(cleanDescription("  Leading and trailing  spaces  ")).toBe(
      "Leading and trailing spaces"
    );
  });

  it("should handle multiple cleaning operations together", () => {
    const input = '"  Multiple   spaces and quotes  -- Back Cover  "';
    expect(cleanDescription(input)).toBe("Multiple spaces and quotes");
  });

  it("should handle empty strings", () => {
    expect(cleanDescription("")).toBe("");
  });
});

describe("toTitleCase", () => {
  it("should capitalize first letter of each word", () => {
    expect(toTitleCase("hello world")).toBe("Hello World");
  });

  it("should handle strings with underscores", () => {
    expect(toTitleCase("hello_world_test")).toBe("Hello World Test");
  });

  it("should handle strings with hyphens", () => {
    expect(toTitleCase("hello-world-test")).toBe("Hello World Test");
  });

  it("should handle mixed case input", () => {
    expect(toTitleCase("hElLo WoRlD")).toBe("Hello World");
  });

  it("should handle empty strings", () => {
    expect(toTitleCase("")).toBe("");
  });

  it("should handle single word", () => {
    expect(toTitleCase("hello")).toBe("Hello");
  });

  it("should handle mixed separators", () => {
    expect(toTitleCase("hello_world-test case")).toBe("Hello World Test Case");
  });
});
