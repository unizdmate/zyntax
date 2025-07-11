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
  Stack,
  useMantineTheme,
} from "@mantine/core";
import { IconAlertCircle, IconInfoCircle } from "@tabler/icons-react";
import { RegexMatch } from "@/types";
import {
  getAllMatches,
  isValidRegex,
} from "@/lib/regex-generator/regexService";
import { useColorScheme } from "@/app/providers";

interface RegexTesterProps {
  regex: string;
  flags: string;
}

export function RegexTester({ regex, flags }: RegexTesterProps) {
  const { colorScheme } = useColorScheme();
  const theme = useMantineTheme();
  
  // Determine if we're in dark mode
  const isDarkMode = 
    colorScheme === "dark" ||
    (colorScheme === "auto" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  
  const [testString, setTestString] = useState<string>(
    "Hello, test@example.com is an email address! Visit https://example.com for more info.\n" +
      "Call us at 555-123-4567 or on Jan-15-2025."
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
  }, [regex, flags, testString]); // Highlight matches in the test string
  const renderHighlightedString = () => {
    if (!regex || matches.length === 0) return testString;

    let result = [];
    let lastIndex = 0;

    // Filter out zero-length matches and sort by index to ensure correct order
    const sortedMatches = [...matches]
      .filter((match) => match.value.length > 0)
      .sort((a, b) => a.index - b.index);

    // Handle overlapping matches by keeping only non-overlapping ones
    const nonOverlappingMatches = [];
    for (const match of sortedMatches) {
      const matchEnd = match.index + match.value.length;
      // Only add matches that don't overlap with previously added matches
      if (nonOverlappingMatches.length === 0 || match.index >= lastIndex) {
        nonOverlappingMatches.push(match);
        lastIndex = matchEnd;
      }
    }

    lastIndex = 0;
    for (const match of nonOverlappingMatches) {
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
        <span          key={`match-${match.index}`}          style={{
            backgroundColor: isDarkMode 
              ? `rgba(${parseInt(theme.colors.blue[5].slice(1, 3), 16)}, ${parseInt(theme.colors.blue[5].slice(3, 5), 16)}, ${parseInt(theme.colors.blue[5].slice(5, 7), 16)}, 0.3)`
              : `rgba(${parseInt(theme.colors.blue[3].slice(1, 3), 16)}, ${parseInt(theme.colors.blue[3].slice(3, 5), 16)}, ${parseInt(theme.colors.blue[3].slice(5, 7), 16)}, 0.2)`,
            padding: "2px 4px",
            borderRadius: "3px",
            fontWeight: 600,
            color: isDarkMode ? theme.white : theme.colors.blue[6],
            border: `1px solid ${isDarkMode 
              ? `rgba(${parseInt(theme.colors.blue[5].slice(1, 3), 16)}, ${parseInt(theme.colors.blue[5].slice(3, 5), 16)}, ${parseInt(theme.colors.blue[5].slice(5, 7), 16)}, 0.5)`
              : `rgba(${parseInt(theme.colors.blue[4].slice(1, 3), 16)}, ${parseInt(theme.colors.blue[4].slice(3, 5), 16)}, ${parseInt(theme.colors.blue[4].slice(5, 7), 16)}, 0.3)`}`,
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
  };  return (
    <Paper
      shadow="sm"
      p="xl"
      radius="md"
      withBorder
      style={{
        background: isDarkMode ? theme.colors.dark[7] : theme.white,
        color: isDarkMode ? theme.white : theme.black,
        border: `1px solid ${isDarkMode ? theme.colors.dark[5] : theme.colors.gray[3]}`,
      }}
    >
      <Group justify="center" mb="xl">        <Title order={3} style={{ color: theme.colors.blue[5] }}>
          Regex Tester
        </Title>
        <Badge
          color={matches.length > 0 ? "green" : "blue"}
          variant={matches.length > 0 ? "filled" : "light"}
          size="lg"
        >
          {matches.length > 0
            ? `${matches.length} match${matches.length !== 1 ? "es" : ""}`
            : "No matches yet"}
        </Badge>
      </Group>      <Alert
        icon={<IconInfoCircle size={rem(18)} />}
        color="blue"
        variant="light"
        mb="lg"
        p="md"
        radius="md"
        style={{ 
          backgroundColor: isDarkMode ? theme.colors.dark[9] : theme.colors.blue[0], 
          color: isDarkMode ? theme.colors.gray[3] : theme.colors.gray[7]
        }}
      >
        Enter sample text below to test your regular expression and see
        highlighted matches{" "}
      </Alert>      <Paper
        p="md"
        withBorder
        radius="md"
        mb="xl"
        style={{
          background: isDarkMode ? theme.colors.dark[6] : theme.colors.gray[0],
          borderLeft: `4px solid ${theme.colors.blue[6]}`,
          border: `1px solid ${isDarkMode ? theme.colors.dark[4] : theme.colors.gray[3]}`,
        }}
      >
        <Stack gap="lg" mb="md">
          <Textarea
            label={              <Text fw={500} size="md" c={isDarkMode ? "gray.3" : "gray.7"}>
                Test String
              </Text>
            }
            description="Enter text that you expect your regex to match against"
            placeholder="Enter text to test against your regex"
            minRows={4}
            maxRows={6}
            value={testString}
            onChange={(e) => setTestString(e.currentTarget.value)}
            styles={{
              root: { marginBottom: rem(8) },              input: {
                fontSize: rem(15),
                lineHeight: 1.6,
                backgroundColor: isDarkMode ? theme.colors.dark[5] : theme.colors.gray[1],
                color: isDarkMode ? theme.white : theme.black,
              },
              description: { color: isDarkMode ? theme.colors.gray[5] : theme.colors.gray[6] },
            }}
            size="md"
          />

          <Group gap="sm" mt="sm">            <Text size="sm" fw={500} c={isDarkMode ? "gray.4" : "gray.6"}>
              Example text:
            </Text>
            {[
              {
                label: "Email",
                text: "Contact us at support@example.com or sales@company.co.uk today!",
              },
              {
                label: "Phone",
                text: "Call 555-123-4567 or (800) 555-1212 for more information.",
              },
              {
                label: "Dates",
                text: "Meeting on 2025-07-15 or 12/25/2025 and 01.15.2025",
              },
              {
                label: "URLs",
                text: "Visit https://example.com or http://www.test.org/page.html?q=123",
              },
            ].map((example, i) => (
              <Badge
                key={i}
                variant="outline"
                style={{ cursor: "pointer", borderColor: theme.colors.blue[5] }}
                onClick={() => setTestString(example.text)}
                size="md"
                radius="md"
                p="xs"
                color="blue"
              >
                {example.label}
              </Badge>
            ))}
          </Group>
        </Stack>
      </Paper>{" "}
      {error && (        <Alert
          icon={<IconAlertCircle size={rem(18)} />}
          title="Regex Error"
          color="red"
          mb="lg"
          p="md"
          radius="md"
          style={{ 
            backgroundColor: isDarkMode ? theme.colors.red[9] : theme.colors.red[0], 
            color: isDarkMode ? theme.colors.red[2] : theme.colors.red[7]
          }}
        >
          {error}
        </Alert>
      )}{" "}
      {regex && !error && (        <Paper
          p="lg"
          withBorder
          mb="lg"
          mt="lg"
          radius="md"
          style={{ 
            background: isDarkMode ? theme.colors.dark[6] : theme.colors.gray[0], 
            border: `1px solid ${isDarkMode ? theme.colors.dark[4] : theme.colors.gray[3]}` 
          }}
        >          <Title order={4} mb="lg" style={{ color: theme.colors.blue[5] }}>
            Results
          </Title><Paper
            p="lg"
            withBorder
            radius="md"
            bg={isDarkMode ? theme.colors.dark[8] : theme.colors.gray[1]}
            mb="xl"
            style={{ lineHeight: 1.7, border: `1px solid ${isDarkMode ? theme.colors.dark[4] : theme.colors.gray[4]}` }}
          >            <Text size="md" c={isDarkMode ? "gray.2" : "gray.8"}>
              {renderHighlightedString()}
            </Text>
          </Paper>
          <Divider my="lg" size="sm" color="gray.7" />
          <Group mb="md">            <Text fw={600} size="lg" c={isDarkMode ? "gray.2" : "gray.8"}>
              Found {matches.length} match{matches.length !== 1 ? "es" : ""}
            </Text>
          </Group>{" "}
          {matches.length > 0 ? (
            <Stack>
              <Group justify="space-between">                <Text size="sm" fw={500} c={isDarkMode ? "gray.3" : "gray.7"}>
                  Matched Pattern Information:
                </Text>
                <Badge color="green" size="lg" variant="filled">
                  {matches.length} match{matches.length !== 1 ? "es" : ""}
                </Badge>
              </Group>              <Alert
                icon={<IconInfoCircle size="1rem" />}
                color="blue"
                variant="light"
                style={{ 
                  backgroundColor: isDarkMode ? theme.colors.dark[9] : theme.colors.blue[0], 
                  color: isDarkMode ? theme.colors.gray[3] : theme.colors.gray[7] 
                }}
              >
                <Text size="sm">
                  Your regex pattern successfully matched the highlighted text.
                  {matches.length > 1
                    ? " Each match is shown in detail below."
                    : ""}
                </Text>
              </Alert>{" "}
              <ScrollArea
                h={450}
                type="auto"
                offsetScrollbars
                scrollbarSize={10}                styles={{
                  scrollbar: { backgroundColor: isDarkMode ? theme.colors.dark[5] : theme.colors.gray[1] },
                  thumb: { backgroundColor: isDarkMode ? theme.colors.dark[4] : theme.colors.gray[4], borderRadius: "4px" },
                }}
              >
                {matches.map((match, index) => (                  <Paper
                    key={index}
                    p="sm"
                    withBorder
                    mb="sm"
                    radius="md"
                    style={{
                      borderLeft: `4px solid ${theme.colors.blue[5]}`,
                      backgroundColor: isDarkMode ? theme.colors.dark[5] : theme.colors.gray[1],
                      border: `1px solid ${isDarkMode ? theme.colors.dark[4] : theme.colors.gray[3]}`,
                    }}
                  >
                    <Group mb="xs" justify="space-between">
                      <Group>
                        <Badge size="md" color="blue" variant="filled">
                          Match {index + 1}
                        </Badge>                        <Text size="sm" fw={500} c={isDarkMode ? "gray.3" : "gray.7"}>
                          Position: {match.index}
                        </Text>
                      </Group>
                      <Badge variant="light" color="blue">
                        Length: {match.value.length} char
                        {match.value.length !== 1 ? "s" : ""}
                      </Badge>
                    </Group>                    <Paper
                      p="md"
                      withBorder
                      radius="md"
                      bg={isDarkMode ? theme.colors.dark[6] : theme.colors.gray[0]}
                      style={{ border: `1px solid ${isDarkMode ? theme.colors.dark[4] : theme.colors.gray[3]}` }}
                    >                      <Text fw={500} size="sm" mb="sm" c={isDarkMode ? "gray.3" : "gray.7"}>
                        Matched Text:
                      </Text>{" "}                      <Code
                        block
                        p="xs"                        style={{
                          backgroundColor: isDarkMode ? theme.colors.dark[9] : theme.colors.blue[0],
                          color: theme.colors.blue[5],
                          fontSize: rem(14),
                          border: `1px solid ${isDarkMode ? theme.colors.dark[4] : theme.colors.gray[4]}`,
                        }}
                      >
                        "{match.value}"
                      </Code>
                    </Paper>{" "}
                    {match.groups && Object.keys(match.groups).length > 0 && (                      <Paper
                        p="xs"
                        withBorder
                        mt="xs"
                        bg={isDarkMode ? theme.colors.dark[7] : theme.colors.gray[0]}
                        style={{ border: `1px solid ${isDarkMode ? theme.colors.dark[4] : theme.colors.gray[3]}`, marginBottom: "0" }}
                      >                        <Text size="sm" fw={500} mb="xs" c={isDarkMode ? "gray.3" : "gray.7"}>
                          Capture Groups:
                        </Text>
                        {Object.entries(match.groups).map(([name, value]) => (
                          <Group key={name} mt="xs">
                            <Badge variant="filled" size="sm" color="blue">
                              {name}
                            </Badge>                            <Code                              style={{
                                backgroundColor: isDarkMode ? theme.colors.dark[9] : theme.colors.blue[0],
                                color: isDarkMode ? theme.colors.gray[3] : theme.colors.gray[7],
                              }}
                            >
                              "{value}"
                            </Code>
                          </Group>
                        ))}
                      </Paper>
                    )}{" "}
                    {/* Add context information */}{" "}                    <Paper
                      p="xs"
                      withBorder
                      mt="xs"
                      radius="md"
                      bg={isDarkMode ? theme.colors.dark[7] : theme.colors.gray[0]}
                      style={{ border: `1px solid ${isDarkMode ? theme.colors.dark[4] : theme.colors.gray[3]}` }}
                    >                      <Text fw={500} size="sm" mb="sm" c={isDarkMode ? "gray.3" : "gray.7"}>
                        Context:
                      </Text><Text
                        size="md"                        style={{
                          fontFamily: "monospace",
                          padding: "10px",
                          backgroundColor: isDarkMode ? theme.colors.dark[9] : theme.colors.blue[0],
                          color: isDarkMode ? theme.colors.gray[3] : theme.colors.gray[7],
                          borderRadius: theme.radius.sm,
                          lineHeight: 1.5,
                          border: `1px solid ${isDarkMode ? theme.colors.dark[5] : theme.colors.gray[3]}`,
                        }}
                      >
                        {match.index > 0 ? (
                          <>                            <span style={{ color: isDarkMode ? theme.colors.gray[6] : theme.colors.gray[5] }}>
                              ...
                              {testString.substring(
                                Math.max(0, match.index - 15),
                                match.index
                              )}
                            </span>                            <span                              style={{
                                backgroundColor: isDarkMode 
                                  ? `rgba(${parseInt(theme.colors.blue[5].slice(1, 3), 16)}, ${parseInt(theme.colors.blue[5].slice(3, 5), 16)}, ${parseInt(theme.colors.blue[5].slice(5, 7), 16)}, 0.3)`
                                  : `rgba(${parseInt(theme.colors.blue[3].slice(1, 3), 16)}, ${parseInt(theme.colors.blue[3].slice(3, 5), 16)}, ${parseInt(theme.colors.blue[3].slice(5, 7), 16)}, 0.2)`,
                                fontWeight: 600,
                                padding: "2px 4px",
                                borderRadius: "2px",
                                color: isDarkMode ? theme.white : theme.colors.blue[6],
                              }}
                            >
                              {match.value}
                            </span>                            <span style={{ color: isDarkMode ? theme.colors.gray[5] : theme.colors.gray[6] }}>
                              {testString.substring(
                                match.index + match.value.length,
                                Math.min(
                                  testString.length,
                                  match.index + match.value.length + 15
                                )
                              )}
                              ...
                            </span>
                          </>
                        ) : (
                          <>                            <span                              style={{
                                backgroundColor: isDarkMode 
                                  ? `rgba(${parseInt(theme.colors.blue[5].slice(1, 3), 16)}, ${parseInt(theme.colors.blue[5].slice(3, 5), 16)}, ${parseInt(theme.colors.blue[5].slice(5, 7), 16)}, 0.3)`
                                  : `rgba(${parseInt(theme.colors.blue[3].slice(1, 3), 16)}, ${parseInt(theme.colors.blue[3].slice(3, 5), 16)}, ${parseInt(theme.colors.blue[3].slice(5, 7), 16)}, 0.2)`,
                                fontWeight: 600,
                                padding: "0 2px",
                                color: isDarkMode ? theme.white : theme.colors.blue[6],
                              }}
                            >
                              {match.value}
                            </span>                            <span style={{ color: isDarkMode ? theme.colors.gray[5] : theme.colors.gray[6] }}>
                              {testString.substring(
                                match.index + match.value.length,
                                Math.min(
                                  testString.length,
                                  match.index + match.value.length + 10
                                )
                              )}
                              ...
                            </span>
                          </>
                        )}
                      </Text>
                    </Paper>
                  </Paper>
                ))}
              </ScrollArea>
            </Stack>
          ) : (            <Alert
              icon={<IconInfoCircle size={rem(18)} />}
              color="gray"
              p="md"
              radius="md"
              style={{ 
                backgroundColor: isDarkMode ? theme.colors.dark[9] : theme.colors.gray[1], 
                color: isDarkMode ? theme.colors.gray[3] : theme.colors.gray[7] 
              }}
            >
              No matches found. Try adjusting your regular expression or test
              string.
            </Alert>
          )}
        </Paper>
      )}
      {!regex && (        <Alert
          icon={<IconInfoCircle size={rem(18)} />}
          color="blue"
          p="md"
          radius="md"
          mt="xl"
          style={{ 
            backgroundColor: isDarkMode ? theme.colors.dark[9] : theme.colors.blue[0], 
            color: isDarkMode ? theme.colors.gray[3] : theme.colors.gray[7] 
          }}
        >
          Build your regex pattern using the tools above to see it tested here.
        </Alert>
      )}
    </Paper>
  );
}
