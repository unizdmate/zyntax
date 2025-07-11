"use client";

import { useState } from "react";
import {
  Accordion,
  Stack,
  Button,
  Text,
  Group,
  Badge,
  Tooltip,
  ActionIcon,
  Code,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { IconCopy, IconCheck } from "@tabler/icons-react";
import { RegexPattern, RegexPatternCategory } from "@/types";
import { useColorScheme } from "@/app/providers";

interface RegexPatternLibraryProps {
  setRegex: (regex: string) => void;
}

export function RegexPatternLibrary({ setRegex }: RegexPatternLibraryProps) {
  const [copiedPattern, setCopiedPattern] = useState<string | null>(null);
  const { colorScheme } = useColorScheme();
  const theme = useMantineTheme();

  // Determine if we're in dark mode
  const isDarkMode =
    colorScheme === "dark" ||
    (colorScheme === "auto" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const handleCopy = (pattern: string) => {
    setCopiedPattern(pattern);
    setTimeout(() => setCopiedPattern(null), 2000);
  };

  const handleSelectPattern = (pattern: string) => {
    setRegex(pattern);
  };
  const patternCategories: RegexPatternCategory[] = [
    {
      category: "Email & URLs",
      patterns: [
        {
          name: "Email Address",
          pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
          description: "Matches common email address formats",
          example: "user@example.com",
        },
        {
          name: "URL",
          pattern:
            "https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)",
          description: "Matches URLs including http and https",
          example: "https://www.example.com",
        },
        {
          name: "Domain Name",
          pattern:
            "(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]",
          description: "Matches valid domain names",
          example: "example.com",
        },
      ],
    },
    {
      category: "Dates & Times",
      patterns: [
        {
          name: "Date (YYYY-MM-DD)",
          pattern: "\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])",
          description: "ISO date format YYYY-MM-DD",
          example: "2025-07-11",
        },
        {
          name: "Date (MM/DD/YYYY)",
          pattern: "(?:0[1-9]|1[0-2])\\/(?:0[1-9]|[12]\\d|3[01])\\/\\d{4}",
          description: "US date format MM/DD/YYYY",
          example: "07/11/2025",
        },
        {
          name: "Date (DD/MM/YYYY)",
          pattern: "(?:0[1-9]|[12]\\d|3[01])\\/(?:0[1-9]|1[0-2])\\/\\d{4}",
          description: "European date format DD/MM/YYYY",
          example: "11/07/2025",
        },
        {
          name: "Date (DD-MM-YYYY)",
          pattern: "(?:0[1-9]|[12]\\d|3[01])-(?:0[1-9]|1[0-2])-\\d{4}",
          description: "European date format with hyphens DD-MM-YYYY",
          example: "11-07-2025",
        },
        {
          name: "Date (DD.MM.YYYY)",
          pattern: "(?:0[1-9]|[12]\\d|3[01])\\.(?:0[1-9]|1[0-2])\\.\\d{4}",
          description: "European date format with dots DD.MM.YYYY",
          example: "25.09.2025",
        },
        {
          name: "Date (MM.DD.YYYY)",
          pattern: "(?:0[1-9]|1[0-2])\\.(?:0[1-9]|[12]\\d|3[01])\\.\\d{4}",
          description: "US date format with dots MM.DD.YYYY",
          example: "09.25.2025",
        },
        {
          name: "Date (Flexible)",
          pattern:
            "(?:0[1-9]|[12]\\d|3[01])[\\/\\.-](?:0[1-9]|1[0-2])[\\/\\.-]\\d{4}",
          description:
            "Flexible date format that accepts slash, dot, or hyphen separators",
          example: "11/07/2025, 11-07-2025, 11.07.2025",
        },
        {
          name: "ISO Date (With Time)",
          pattern:
            "\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])T(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:\\.\\d+)?(?:Z|[+-](?:[01]\\d|2[0-3]):[0-5]\\d)",
          description: "ISO 8601 date-time format with timezone",
          example: "2025-07-11T14:30:45Z",
        },
        {
          name: "Date (YYYY/MM/DD)",
          pattern: "\\d{4}\\/(?:0[1-9]|1[0-2])\\/(?:0[1-9]|[12]\\d|3[01])",
          description: "Year first date format with slashes",
          example: "2025/07/11",
        },
        {
          name: "Time (HH:MM:SS)",
          pattern: "(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d",
          description: "24-hour time format HH:MM:SS",
          example: "14:30:45",
        },
        {
          name: "Time (HH:MM AM/PM)",
          pattern: "(?:0?[1-9]|1[0-2]):[0-5]\\d\\s?(?:AM|PM|am|pm)",
          description: "12-hour time format with AM/PM",
          example: "2:30 PM",
        },
        {
          name: "Time (HH:MM)",
          pattern: "(?:[01]\\d|2[0-3]):[0-5]\\d",
          description: "24-hour time format without seconds",
          example: "14:30",
        },
      ],
    },
    {
      category: "Numbers & Currency",
      patterns: [
        {
          name: "Integer",
          pattern: "[-+]?\\d+",
          description: "Matches positive or negative whole numbers",
          example: "42, -17, +99",
        },
        {
          name: "Decimal Number",
          pattern: "[-+]?\\d*\\.\\d+",
          description: "Matches decimal numbers with decimal point",
          example: "3.14159, -0.5, +2.71",
        },
        {
          name: "Currency (USD)",
          pattern: "\\$\\d{1,3}(?:,\\d{3})*(?:\\.\\d{2})?",
          description: "US Dollar format with optional commas and cents",
          example: "$1,250.99",
        },
        {
          name: "Currency (EUR - Before)",
          pattern: "€\\s?[-]?\\d{1,3}(?:[.,]\\d{3})*(?:[.,]\\d{2})?",
          description:
            "Euro format with symbol before the amount, optional negative values",
          example: "€1.250,99, €-1.250,99, € 1.250,99",
        },
        {
          name: "Currency (EUR - After)",
          pattern: "[-]?\\d{1,3}(?:[.,]\\d{3})*(?:[.,]\\d{2})?\\s?€",
          description:
            "Euro format with symbol after the amount, optional negative values",
          example: "1.250,99€, -1.250,99€, 1.250,99 €",
        },
        {
          name: "Percentage",
          pattern: "\\d+(?:\\.\\d+)?%",
          description: "Percentage values with optional decimal places",
          example: "42%, 3.14%",
        },
        {
          name: "Generic Money Amount",
          pattern: "[-]?(?:\\d{1,3}(?:[.,]\\d{3})*|\\d+)(?:[.,]\\d{1,2})?",
          description:
            "Generic monetary amount with optional thousands separator and decimals",
          example: "1,234.56, 1.234,56, -99.99, 1000",
        },
      ],
    },
    {
      category: "Phone Numbers",
      patterns: [
        {
          name: "US Phone Number",
          pattern: "(?:\\d{3}[-.\\s]?){2}\\d{4}",
          description: "US phone format: 555-555-5555",
          example: "555-555-5555",
        },
        {
          name: "International Phone",
          pattern: "\\+\\d{1,3}[-.\\s]?(?:\\d{1,3}[-.\\s]?){1,4}\\d{1,4}",
          description: "International format with country code",
          example: "+44 20 7123 4567",
        },
        {
          name: "E.164 Phone Format",
          pattern: "\\+[1-9]\\d{1,14}",
          description:
            "Standard international phone number format without spaces or dashes",
          example: "+12025551234",
        },
      ],
    },
    {
      category: "Code & Validation",
      patterns: [
        {
          name: "Username",
          pattern: "^[a-zA-Z0-9_-]{3,16}$",
          description: "Alphanumeric username (3-16 chars)",
          example: "user_123",
        },
        {
          name: "Strong Password",
          pattern:
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
          description:
            "At least 8 chars with lowercase, uppercase, number, and special char",
          example: "P@ssw0rd",
        },
        {
          name: "Hex Color",
          pattern: "#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})",
          description: "Matches hex color codes (#FFF or #FFFFFF)",
          example: "#FFF, #00FF00",
        },
        {
          name: "IP Address",
          pattern:
            "(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)",
          description: "Matches IPv4 addresses",
          example: "192.168.0.1",
        },
        {
          name: "UUID/GUID",
          pattern:
            "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}",
          description: "Matches standard UUID/GUID format",
          example: "123e4567-e89b-12d3-a456-426614174000",
        },
      ],
    },
    {
      category: "Document & ID Numbers",
      patterns: [
        {
          name: "IBAN",
          pattern: "[A-Z]{2}\\d{2}[A-Z0-9]{4}\\d{7}([A-Z0-9]?){0,16}",
          description: "International Bank Account Number format",
          example: "DE89370400440532013000",
        },
        {
          name: "Bank Account (US)",
          pattern: "\\d{8,17}",
          description: "US bank account number (8-17 digits)",
          example: "12345678",
        },
        {
          name: "Social Security Number (US)",
          pattern: "\\d{3}-\\d{2}-\\d{4}",
          description: "US Social Security Number format",
          example: "123-45-6789",
        },
        {
          name: "Credit Card Number",
          pattern:
            "(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\\d{3})\\d{11})",
          description:
            "Matches major credit card formats (Visa, Mastercard, Amex, Discover)",
          example: "4111111111111111",
        },
        {
          name: "Postal/Zip Code (US)",
          pattern: "\\d{5}(?:-\\d{4})?",
          description: "US ZIP code with optional +4 extension",
          example: "12345, 12345-6789",
        },
        {
          name: "Postal Code (UK)",
          pattern: "[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}",
          description: "UK postal code format",
          example: "SW1A 1AA",
        },
      ],
    },
    {
      category: "Text Analysis",
      patterns: [
        {
          name: "HTML Tag",
          pattern: "<([a-z]+)([^<]+)*(?:>(.*?)<\\/\\1>|\\s+\\/>)",
          description: "Matches HTML tags with their content",
          example: '<div class="container">Content</div>',
        },
        {
          name: "Sentence",
          pattern: "[A-Z][^.!?]*[.!?]",
          description: "Simple pattern to match full sentences",
          example: "This is a sentence.",
        },
        {
          name: "Hashtag",
          pattern: "#[a-zA-Z0-9_]+",
          description: "Matches hashtags used in social media",
          example: "#regex #programming",
        },
        {
          name: "Word Count",
          pattern: "\\b\\w+\\b",
          description: "Match individual words (use with global flag to count)",
          example: "Count the words in this example.",
        },
      ],
    },
  ];
  return (
    <Stack>
      {" "}
      <Accordion
        styles={{
          item: {
            backgroundColor: isDarkMode
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
            border: `1px solid ${isDarkMode ? theme.colors.dark[5] : theme.colors.gray[3]}`,
            borderRadius: theme.radius.sm,
            marginBottom: "8px",
          },
          control: {
            backgroundColor: isDarkMode
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
            color: theme.colors.blue[5],
            "&:hover": {
              backgroundColor: isDarkMode
                ? theme.colors.dark[5]
                : theme.colors.gray[1],
            },
          },
          content: {
            backgroundColor: isDarkMode
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
            color: isDarkMode ? theme.white : theme.black,
          },
          label: {
            color: isDarkMode ? theme.colors.gray[3] : theme.colors.gray[7],
            fontWeight: 500,
          },
          chevron: { color: theme.colors.blue[5] },
        }}
      >
        {patternCategories.map((category) => (
          <Accordion.Item key={category.category} value={category.category}>
            <Accordion.Control>{category.category}</Accordion.Control>
            <Accordion.Panel>
              <Stack gap="xs">
                {category.patterns.map((pattern) => (
                  <Stack
                    key={pattern.name}
                    gap="xs"
                    p="xs"
                    style={{
                      backgroundColor: isDarkMode
                        ? theme.colors.dark[5]
                        : theme.colors.gray[1],
                      borderRadius: theme.radius.sm,
                      border: `1px solid ${isDarkMode ? theme.colors.dark[4] : theme.colors.gray[3]}`,
                    }}
                  >
                    <Group justify="space-between" wrap="nowrap">
                      {" "}
                      <Text fw={500} c={isDarkMode ? "gray.2" : "gray.7"}>
                        {pattern.name}
                      </Text>
                      <Group gap="xs">
                        <Tooltip
                          label={
                            copiedPattern === pattern.pattern
                              ? "Copied"
                              : "Copy pattern"
                          }
                        >
                          <ActionIcon
                            size="sm"
                            color={
                              copiedPattern === pattern.pattern
                                ? "teal"
                                : "blue"
                            }
                            onClick={() => handleCopy(pattern.pattern)}
                          >
                            {copiedPattern === pattern.pattern ? (
                              <IconCheck size="1rem" />
                            ) : (
                              <IconCopy size="1rem" />
                            )}
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Group>{" "}
                    <Text size="sm" c={isDarkMode ? "gray.4" : "gray.6"}>
                      {pattern.description}
                    </Text>
                    {pattern.example && (
                      <Group>
                        {" "}
                        <Text
                          size="sm"
                          fw={500}
                          c={isDarkMode ? "gray.3" : "gray.6"}
                        >
                          Example:
                        </Text>
                        <Text
                          size="sm"
                          c={isDarkMode ? "cyan.4" : "blue.6"}
                          style={{ fontStyle: "italic" }}
                        >
                          {pattern.example}
                        </Text>
                      </Group>
                    )}{" "}
                    <Code
                      block
                      style={{
                        fontSize: rem(12),
                        backgroundColor: isDarkMode
                          ? theme.colors.dark[9]
                          : theme.colors.blue[0],
                        color: theme.colors.blue[5],
                        border: `1px solid ${isDarkMode ? theme.colors.dark[4] : theme.colors.gray[4]}`,
                      }}
                    >
                      {pattern.pattern}
                    </Code>
                    <Button
                      variant="filled"
                      size="xs"
                      onClick={() => handleSelectPattern(pattern.pattern)}
                      fullWidth
                      color="blue"
                    >
                      Use This Pattern
                    </Button>
                  </Stack>
                ))}
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Stack>
  );
}
