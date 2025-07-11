"use client";

import { useState, useEffect } from "react";
import {
  Paper,
  Title,
  Textarea,
  Text,
  Group,
  Badge,
  Code,
  Divider,
  Alert,
  ScrollArea,
  rem,
} from "@mantine/core";
import { IconAlertCircle, IconInfoCircle } from "@tabler/icons-react";
import { RegexMatch } from "@/types";
import {
  getAllMatches,
  isValidRegex,
} from "@/lib/regex-generator/regexService";

interface RegexTesterProps {
  regex: string;
  flags: string;
}

export function RegexTester({ regex, flags }: RegexTesterProps) {
  const [testString, setTestString] = useState<string>(
    "Hello, test@example.com is an email address!"
  );
  const [matches, setMatches] = useState<RegexMatch[]>([]);
  const [error, setError] = useState<string | null>(null);
  // Test the regex against the input string
  useEffect(() => {
    if (!regex) {
      setMatches([]);
      setError(null);
      return;
    }

    if (!isValidRegex(regex)) {
      setError("Invalid regular expression");
      setMatches([]);
      return;
    }

    try {
      const result = getAllMatches(regex, flags, testString);

      if (result.success) {
        setMatches(result.matches);
        setError(null);
      } else {
        setError(result.error || "Unknown error occurred");
        setMatches([]);
      }
    } catch (err) {
      setError((err as Error).message);
      setMatches([]);
    }
  }, [regex, flags, testString]);

  // Highlight matches in the test string
  const renderHighlightedString = () => {
    if (!regex || matches.length === 0) return testString;

    let result = [];
    let lastIndex = 0;

    // Sort matches by index to ensure correct order
    const sortedMatches = [...matches].sort((a, b) => a.index - b.index);

    for (const match of sortedMatches) {
      // Add text before match
      if (match.index > lastIndex) {
        result.push(
          <span key={`text-${lastIndex}`}>
            {testString.substring(lastIndex, match.index)}
          </span>
        );
      }

      // Add highlighted match
      result.push(
        <span
          key={`match-${match.index}`}
          style={{
            backgroundColor: "#4dadff50",
            padding: "0 2px",
            borderRadius: "2px",
            fontWeight: 600,
          }}
        >
          {testString.substring(match.index, match.index + match.value.length)}
        </span>
      );

      lastIndex = match.index + match.value.length;
    }

    // Add remaining text
    if (lastIndex < testString.length) {
      result.push(
        <span key={`text-${lastIndex}`}>{testString.substring(lastIndex)}</span>
      );
    }

    return result;
  };

  return (
    <Paper shadow="sm" p="md" radius="md" withBorder>
      <Title order={3} mb="md">
        Regex Tester
      </Title>

      <Textarea
        label="Test String"
        placeholder="Enter text to test against your regex"
        minRows={3}
        maxRows={5}
        value={testString}
        onChange={(e) => setTestString(e.currentTarget.value)}
        mb="md"
      />

      {error && (
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Regex Error"
          color="red"
          mb="md"
        >
          {error}
        </Alert>
      )}

      {regex && !error && (
        <Paper p="sm" withBorder mb="md">
          <Title order={5} mb="xs">
            Results
          </Title>

          <Text mb="md">{renderHighlightedString()}</Text>

          <Divider my="md" />

          <Group mb="xs">
            <Text fw={500}>
              Found {matches.length} match{matches.length !== 1 ? "es" : ""}
            </Text>
          </Group>

          {matches.length > 0 ? (
            <ScrollArea h={200} type="auto">
              {matches.map((match, index) => (
                <Paper key={index} p="xs" withBorder mb="xs">
                  <Group mb="xs">
                    <Badge>Match {index + 1}</Badge>
                    <Text size="sm">Position: {match.index}</Text>
                  </Group>
                  <Code block>"{match.value}"</Code>

                  {match.groups && Object.keys(match.groups).length > 0 && (
                    <>
                      <Text size="sm" fw={500} mt="xs">
                        Capture Groups:
                      </Text>
                      {Object.entries(match.groups).map(([name, value]) => (
                        <Group key={name} mt="xs">
                          <Badge variant="outline" size="sm">
                            {name}
                          </Badge>
                          <Code>"{value}"</Code>
                        </Group>
                      ))}
                    </>
                  )}
                </Paper>
              ))}
            </ScrollArea>
          ) : (
            <Alert icon={<IconInfoCircle size="1rem" />} color="gray">
              No matches found
            </Alert>
          )}
        </Paper>
      )}

      {!regex && (
        <Alert icon={<IconInfoCircle size="1rem" />} color="blue">
          Build your regex pattern using the tools above to see it tested here.
        </Alert>
      )}
    </Paper>
  );
}
