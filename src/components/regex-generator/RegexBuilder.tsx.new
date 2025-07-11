"use client";

import { useState } from "react";
import {
  Paper,
  Title,
  Group,
  SegmentedControl,
  TextInput,
  Switch,
  Button,
  Grid,
  Tooltip,
  Text,
  ActionIcon,
  Popover,
  Badge,
  Alert,
  Textarea,
  Accordion,
  Code,
  Divider,
  useMantineTheme,
} from "@mantine/core";
import {
  IconPlus,
  IconTrash,
  IconArrowsShuffle,
  IconLetterA,
  IconLetterCase,
  IconNumbers,
  IconRegex,
  IconBrackets,
  IconInfoCircle,
  IconBook,
  IconRefresh,
  IconChevronDown,
  IconWand,
} from "@tabler/icons-react";
import { useColorScheme } from "@/app/providers";

interface RegexBuilderProps {
  regex: string;
  setRegex: (value: string) => void;
  flags: string;
  setFlags: (value: string) => void;
}

export function RegexBuilder({
  regex,
  setRegex,
  flags,
  setFlags,
}: RegexBuilderProps) {
  // Component state
  const [currentBlock, setCurrentBlock] = useState<string>("");
  const { colorScheme } = useColorScheme();
  const theme = useMantineTheme();
  
  // Determine if we're in dark mode
  const isDarkMode = 
    colorScheme === "dark" ||
    (colorScheme === "auto" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  // Flag toggles
  const toggleFlag = (flag: string) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ""));
    } else {
      setFlags(flags + flag);
    }
  };

  // Add current block to regex
  const addBlock = () => {
    if (currentBlock.trim()) {
      setRegex(regex + currentBlock);
      setCurrentBlock("");
    }
  };

  // Add predefined patterns
  const addPattern = (pattern: string) => {
    setRegex(pattern);
  };

  // Clear regex
  const clearRegex = () => {
    setRegex("");
  };

  return (
    <Paper
      shadow="sm"
      p="md"
      radius="md"
      withBorder
      style={{
        background: isDarkMode ? theme.colors.dark[7] : theme.white,
        color: isDarkMode ? theme.white : theme.black,
        border: `1px solid ${isDarkMode ? theme.colors.dark[5] : theme.colors.gray[3]}`,
      }}
    >
      <Title order={3} mb="md" style={{ color: theme.colors.blue[5] }}>
        Visual Builder
      </Title>

      {/* Help text - moved to top */}
      <Paper
        p="md"
        withBorder
        mb="md"
        radius="md"
        style={{ 
          backgroundColor: isDarkMode ? theme.colors.dark[9] : theme.colors.blue[0], 
          border: `1px solid ${isDarkMode ? theme.colors.dark[5] : theme.colors.gray[3]}` 
        }}
      >
        <Title order={5} mb="xs" style={{ color: theme.colors.blue[5] }}>
          How to Use the Regex Builder
        </Title>
        <Text size="sm" c={isDarkMode ? "gray.3" : "gray.7"}>
          1. Select flags below to control matching behavior
        </Text>
        <Text size="sm" c={isDarkMode ? "gray.3" : "gray.7"}>
          2. Click pattern buttons to add regex components
        </Text>
        <Text size="sm" c={isDarkMode ? "gray.3" : "gray.7"}>
          3. Use the custom input for specific patterns
        </Text>
        <Text size="sm" mt={10} c={isDarkMode ? "gray.5" : "gray.6"}>
          The flags you choose dramatically affect how your regex matches text.
          Click the info icon next to &quot;Regex Flags&quot; to learn more about each
          flag&apos;s purpose and behavior.
        </Text>
      </Paper>

      {/* Flags with explanations */}
      <Paper
        p="xs"
        withBorder
        mb="md"
        style={{ 
          background: isDarkMode ? theme.colors.dark[7] : theme.colors.gray[0], 
          border: `1px solid ${isDarkMode ? theme.colors.dark[5] : theme.colors.gray[3]}` 
        }}
      >
        <Group mb="md" justify="space-between" align="center">
          <Group gap={10}>
            <Badge
              size="lg"
              color="blue"
              variant="filled"
              radius="sm"
              style={{ fontSize: "0.9rem" }}
            >
              REGEX FLAGS
            </Badge>
            <Text size="xs" c={isDarkMode ? "gray.4" : "gray.6"}>
              Select flags to modify how your regex behaves
            </Text>
          </Group>

          <Popover width={400} position="bottom" withArrow shadow="md">
            <Popover.Target>
              <ActionIcon variant="subtle" color="blue">
                <IconInfoCircle size="1.2rem" />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown
              style={{
                maxHeight: "70vh",
                overflowY: "auto",
                overflowX: "hidden",
                background: isDarkMode ? theme.colors.dark[8] : theme.white,
                color: isDarkMode ? theme.white : theme.black,
                border: `1px solid ${isDarkMode ? theme.colors.dark[5] : theme.colors.gray[3]}`,
              }}
            >
              <Title order={4} mb="md" style={{ color: theme.colors.blue[5] }}>
                Understanding Regex Flags
              </Title>
              <Text size="sm" mb="md" c={isDarkMode ? "gray.4" : "gray.6"}>
                Flags modify how your regular expression behaves when matching
                text. The right combination of flags can make your regex more
                powerful and precise.
              </Text>

              <Accordion>
                <Accordion.Item value="global">
                  <Accordion.Control>
                    <Group gap={10}>
                      <Badge color="blue">g</Badge>
                      <Text fw={500} size="sm">
                        Global Search
                      </Text>
                    </Group>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Text size="sm" mb={10} c={isDarkMode ? "gray.4" : "gray.6"}>
                      Find all matches rather than stopping at the first match.
                    </Text>
                    <Text size="sm" mb={5} c={isDarkMode ? "gray.3" : "gray.7"}>
                      Example:
                    </Text>
                    <Text size="sm" mb={8} c={isDarkMode ? "gray.3" : "gray.7"}>
                      Text:{" "}
                      <Code style={{ backgroundColor: isDarkMode ? theme.colors.dark[9] : theme.colors.gray[0] }}>
                        "Apple APPLE apple"
                      </Code>
                    </Text>
                    <Text size="sm" mb={8} c={isDarkMode ? "gray.3" : "gray.7"}>
                      Pattern:{" "}
                      <Code style={{ backgroundColor: isDarkMode ? theme.colors.dark[9] : theme.colors.gray[0] }}>/apple/</Code>
                    </Text>
                    <Group align="center">
                      <Badge color="gray" size="sm" variant="filled">
                        WITHOUT G:
                      </Badge>
                      <Text
                        size="sm"
                        span
                        style={{ fontFamily: "monospace", color: isDarkMode ? theme.colors.gray[2] : theme.colors.gray[7] }}
                      >
                        <span
                          style={{
                            backgroundColor: "rgba(77, 171, 247, 0.2)",
                            padding: "0 3px",
                          }}
                        >
                          apple
                        </span>
                      </Text>
                    </Group>
                    <Group align="center" mt={5}>
                      <Badge color="blue" size="sm" variant="filled">
                        WITH G:
                      </Badge>
                      <Text
                        size="sm"
                        span
                        style={{ fontFamily: "monospace", color: isDarkMode ? theme.colors.gray[2] : theme.colors.gray[7] }}
                      >
                        <span
                          style={{
                            backgroundColor: "rgba(77, 171, 247, 0.2)",
                            padding: "0 3px",
                          }}
                        >
                          apple
                        </span>
                      </Text>
                    </Group>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="caseInsensitive">
                  <Accordion.Control>
                    <Group gap={10}>
                      <Badge color="blue">i</Badge>
                      <Text fw={500} size="sm">
                        Case Insensitive
                      </Text>
                    </Group>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Text size="sm" mb={10} c={isDarkMode ? "gray.4" : "gray.6"}>
                      Match regardless of letter case (upper/lowercase).
                    </Text>
                    <Text size="sm" mb={5} c={isDarkMode ? "gray.3" : "gray.7"}>
                      Example:
                    </Text>
                    <Text size="sm" mb={8} c={isDarkMode ? "gray.3" : "gray.7"}>
                      Text:{" "}
                      <Code style={{ backgroundColor: isDarkMode ? theme.colors.dark[9] : theme.colors.gray[0] }}>
                        "Apple APPLE apple"
                      </Code>
                    </Text>
                    <Text size="sm" mb={8} c={isDarkMode ? "gray.3" : "gray.7"}>
                      Pattern:{" "}
                      <Code style={{ backgroundColor: isDarkMode ? theme.colors.dark[9] : theme.colors.gray[0] }}>/apple/</Code>
                    </Text>
                    <Group align="center">
                      <Badge color="gray" size="sm" variant="filled">
                        WITHOUT I:
                      </Badge>
                      <Text
                        size="sm"
                        span
                        style={{ fontFamily: "monospace", color: isDarkMode ? theme.colors.gray[2] : theme.colors.gray[7] }}
                      >
                        Apple APPLE{" "}
                        <span
                          style={{
                            backgroundColor: "rgba(77, 171, 247, 0.2)",
                            padding: "0 3px",
                          }}
                        >
                          apple
                        </span>
                      </Text>
                    </Group>
                    <Group align="center" mt={5}>
                      <Badge color="blue" size="sm" variant="filled">
                        WITH I:
                      </Badge>
                      <Text
                        size="sm"
                        span
                        style={{ fontFamily: "monospace", color: isDarkMode ? theme.colors.gray[2] : theme.colors.gray[7] }}
                      >
                        <span
                          style={{
                            backgroundColor: "rgba(77, 171, 247, 0.2)",
                            padding: "0 3px",
                          }}
                        >
                          Apple
                        </span>{" "}
                        <span
                          style={{
                            backgroundColor: "rgba(77, 171, 247, 0.2)",
                            padding: "0 3px",
                          }}
                        >
                          APPLE
                        </span>{" "}
                        <span
                          style={{
                            backgroundColor: "rgba(77, 171, 247, 0.2)",
                            padding: "0 3px",
                          }}
                        >
                          apple
                        </span>
                      </Text>
                    </Group>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="multiline">
                  <Accordion.Control>
                    <Group gap={10}>
                      <Badge color="blue">m</Badge>
                      <Text fw={500} size="sm">
                        Multiline
                      </Text>
                    </Group>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Text size="sm" mb={10} c={isDarkMode ? "gray.4" : "gray.6"}>
                      ^ and $ match start/end of each line, not just the whole
                      string.
                    </Text>
                    <Code
                      block
                      mb={8}
                      style={{ 
                        backgroundColor: isDarkMode ? theme.colors.dark[9] : theme.colors.gray[0], 
                        color: isDarkMode ? theme.colors.gray[2] : theme.colors.gray[7] 
                      }}
                    >
                      Line1 Line2 Line3
                    </Code>
                    <Text size="sm" mb={8} c={isDarkMode ? "gray.3" : "gray.7"}>
                      Pattern:{" "}
                      <Code style={{ backgroundColor: isDarkMode ? theme.colors.dark[9] : theme.colors.gray[0] }}>/^Line/</Code>
                    </Text>
                    <Group align="center">
                      <Badge color="gray" size="sm" variant="filled">
                        WITHOUT M:
                      </Badge>
                      <Text size="sm" c={isDarkMode ? "gray.3" : "gray.7"}>
                        Matches only at the start of the entire text
                      </Text>
                    </Group>
                    <Group align="center" mt={5}>
                      <Badge color="blue" size="sm" variant="filled">
                        WITH M:
                      </Badge>
                      <Text size="sm" c={isDarkMode ? "gray.3" : "gray.7"}>
                        Matches at the start of each line
                      </Text>
                    </Group>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="dotAll">
                  <Accordion.Control>
                    <Group gap={10}>
                      <Badge color="blue">s</Badge>
                      <Text fw={500} size="sm">
                        Dot All
                      </Text>
                    </Group>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Text size="sm" mb={10} c={isDarkMode ? "gray.4" : "gray.6"}>
                      Makes the dot (.) match newlines as well. Normally, the dot
                      matches any character except newlines.
                    </Text>
                    <Paper p="md" withBorder radius="sm" bg={isDarkMode ? theme.colors.dark[8] : theme.colors.gray[0]}>
                      <Text fw={500} size="sm" mb={8} c={isDarkMode ? theme.colors.blue[5] : theme.colors.blue[7]}>
                        Example:
                      </Text>
                      <Text size="sm" mb={8} c={isDarkMode ? "gray.3" : "gray.7"}>
                        Text:{" "}
                        <Code style={{ backgroundColor: isDarkMode ? theme.colors.dark[9] : theme.colors.gray[0] }}>
                          "Line1\nLine2"
                        </Code>{" "}
                        (contains newline)
                      </Text>
                      <Text size="sm" mb={8} c={isDarkMode ? "gray.3" : "gray.7"}>
                        Pattern:{" "}
                        <Code style={{ backgroundColor: isDarkMode ? theme.colors.dark[9] : theme.colors.gray[0] }}>
                          /Line1.Line2/
                        </Code>
                      </Text>
                      <Group align="center">
                        <Badge color="gray" size="sm" variant="filled">
                          WITHOUT S:
                        </Badge>
                        <Text size="sm" c={isDarkMode ? "gray.3" : "gray.7"}>
                          No match (. doesn't match newline)
                        </Text>
                      </Group>
                      <Group align="center" mt={5}>
                        <Badge color="blue" size="sm" variant="filled">
                          WITH S:
                        </Badge>
                        <Text size="sm" c={isDarkMode ? "gray.3" : "gray.7"}>
                          Matches the entire string
                        </Text>
                      </Group>
                    </Paper>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>

              <Paper
                p="md"
                withBorder
                mt="lg"
                radius="md"
                bg={isDarkMode ? theme.colors.dark[7] : theme.colors.gray[0]}
                style={{ border: `1px solid ${isDarkMode ? theme.colors.dark[5] : theme.colors.gray[3]}` }}
              >
                <Title order={6} mb="xs" style={{ color: theme.colors.blue[5] }}>
                  Combining Flags
                </Title>
                <Text size="xs" c={isDarkMode ? "gray.4" : "gray.6"}>
                  Flags can be combined for powerful matching. For example,{" "}
                  <Code style={{ backgroundColor: isDarkMode ? theme.colors.dark[9] : theme.colors.gray[0] }}>
                    /pattern/gim
                  </Code>{" "}
                  will match globally, case-insensitive, and across multiple
                  lines.
                </Text>
              </Paper>
            </Popover.Dropdown>
          </Popover>
        </Group>{" "}
        <Grid>
          <Grid.Col span={6}>
            <Paper
              p="xs"
              radius="md"
              style={{ 
                border: `1px solid ${isDarkMode ? theme.colors.dark[5] : theme.colors.gray[3]}`, 
                backgroundColor: isDarkMode ? theme.colors.dark[7] : theme.colors.gray[0] 
              }}
            >
              <Group justify="space-between">
                <Switch
                  size="md"
                  label={
                    <Group gap={5}>
                      <Text component="span" fw={500} c={isDarkMode ? "gray.3" : "gray.7"}>
                        Global
                      </Text>
                      <Badge size="sm" variant="filled" color="blue">
                        g
                      </Badge>
                    </Group>
                  }
                  description="Find all matches in text"
                  checked={flags.includes("g")}
                  onChange={() => toggleFlag("g")}
                  color="blue"
                  styles={{
                    description: { color: isDarkMode ? theme.colors.gray[5] : theme.colors.gray[6] },
                  }}
                />
              </Group>
            </Paper>
          </Grid.Col>
          <Grid.Col span={6}>
            <Paper
              p="xs"
              radius="md"
              style={{ 
                border: `1px solid ${isDarkMode ? theme.colors.dark[5] : theme.colors.gray[3]}`, 
                backgroundColor: isDarkMode ? theme.colors.dark[7] : theme.colors.gray[0] 
              }}
            >
              <Group justify="space-between">
                <Switch
                  size="md"
                  label={
                    <Group gap={5}>
                      <Text component="span" fw={500} c={isDarkMode ? "gray.3" : "gray.7"}>
                        Case Insensitive
                      </Text>
                      <Badge size="sm" variant="filled" color="blue">
                        i
                      </Badge>
                    </Group>
                  }
                  description="Ignore A/a differences"
                  checked={flags.includes("i")}
                  onChange={() => toggleFlag("i")}
                  color="blue"
                  styles={{
                    description: { color: isDarkMode ? theme.colors.gray[5] : theme.colors.gray[6] },
                  }}
                />
              </Group>
            </Paper>
          </Grid.Col>
          <Grid.Col span={6}>
            <Paper
              p="xs"
              radius="md"
              style={{ 
                border: `1px solid ${isDarkMode ? theme.colors.dark[5] : theme.colors.gray[3]}`, 
                backgroundColor: isDarkMode ? theme.colors.dark[7] : theme.colors.gray[0] 
              }}
            >
              <Group justify="space-between">
                <Switch
                  size="md"
                  label={
                    <Group gap={5}>
                      <Text component="span" fw={500} c={isDarkMode ? "gray.3" : "gray.7"}>
                        Multiline
                      </Text>
                      <Badge size="sm" variant="filled" color="blue">
                        m
                      </Badge>
                    </Group>
                  }
                  description="^ match line starts/ends"
                  checked={flags.includes("m")}
                  onChange={() => toggleFlag("m")}
                  color="blue"
                  styles={{
                    description: { color: isDarkMode ? theme.colors.gray[5] : theme.colors.gray[6] },
                  }}
                />
              </Group>
            </Paper>
          </Grid.Col>
          <Grid.Col span={6}>
            <Paper
              p="xs"
              radius="md"
              style={{ 
                border: `1px solid ${isDarkMode ? theme.colors.dark[5] : theme.colors.gray[3]}`, 
                backgroundColor: isDarkMode ? theme.colors.dark[7] : theme.colors.gray[0] 
              }}
            >
              <Group justify="space-between">
                <Switch
                  size="md"
                  label={
                    <Group gap={5}>
                      <Text component="span" fw={500} c={isDarkMode ? "gray.3" : "gray.7"}>
                        Dot All
                      </Text>
                      <Badge size="sm" variant="filled" color="blue">
                        s
                      </Badge>
                    </Group>
                  }
                  description=". matches newlines too"
                  checked={flags.includes("s")}
                  onChange={() => toggleFlag("s")}
                  color="blue"
                  styles={{
                    description: { color: isDarkMode ? theme.colors.gray[5] : theme.colors.gray[6] },
                  }}
                />
              </Group>
            </Paper>
          </Grid.Col>
        </Grid>
      </Paper>
      {/* Common Patterns */}
      <Paper
        p="xs"
        withBorder
        mb="md"
        style={{ 
          background: isDarkMode ? theme.colors.dark[7] : theme.colors.gray[0], 
          border: `1px solid ${isDarkMode ? theme.colors.dark[5] : theme.colors.gray[3]}` 
        }}
      >
        <Title order={5} mb="xs" style={{ color: theme.colors.blue[5] }}>
          Common Patterns
        </Title>
        <Group mb="md">
          <Tooltip label="Email: username@domain.com">
            <Button
              size="sm"
              variant="light"
              leftSection={<IconRegex size="1rem" />}
              onClick={() => addPattern("[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}")}
            >
              Email
            </Button>
          </Tooltip>
          <Tooltip label="URL: http(s)://example.com">
            <Button
              size="sm"
              variant="light"
              onClick={() =>
                addPattern(
                  "https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)"
                )
              }
            >
              URL
            </Button>
          </Tooltip>
          <Tooltip label="Phone: (123) 456-7890 or 123-456-7890">
            <Button
              size="sm"
              variant="light"
              onClick={() =>
                addPattern(
                  "(?:\\+?\\d{1,3}[- ]?)?(?:\\(\\d{3}\\)|\\d{3})[- ]?\\d{3}[- ]?\\d{4}"
                )
              }
            >
              Phone
            </Button>
          </Tooltip>
          <Tooltip label="Date: YYYY-MM-DD, MM/DD/YYYY, etc.">
            <Button
              size="sm"
              variant="light"
              onClick={() =>
                addPattern(
                  "(?:19|20)\\d\\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])"
                )
              }
            >
              Date (ISO)
            </Button>
          </Tooltip>
        </Group>
        <Group>
          <Tooltip label="Any digit (0-9)">
            <Button
              size="sm"
              variant="light"
              leftSection={<IconNumbers size="1rem" />}
              onClick={() => addPattern("\\d")}
            >
              Digit
            </Button>
          </Tooltip>
          <Tooltip label="Any non-digit">
            <Button
              size="sm"
              variant="light"
              onClick={() => addPattern("\\D")}
            >
              Non-Digit
            </Button>
          </Tooltip>
          <Tooltip label="Any word character (a-z, A-Z, 0-9, _)">
            <Button
              size="sm"
              variant="light"
              leftSection={<IconLetterA size="1rem" />}
              onClick={() => addPattern("\\w")}
            >
              Word
            </Button>
          </Tooltip>
          <Tooltip label="Any non-word character">
            <Button
              size="sm"
              variant="light"
              leftSection={<IconLetterA size="1rem" />}
              onClick={() => addPattern("\\W")}
            >
              Non-Word
            </Button>
          </Tooltip>
          <Tooltip label="Any whitespace">
            <Button size="sm" variant="light" onClick={() => addPattern("\\s")}>
              Space
            </Button>
          </Tooltip>
          <Tooltip label="Any non-whitespace">
            <Button size="sm" variant="light" onClick={() => addPattern("\\S")}>
              Non-Space
            </Button>
          </Tooltip>
        </Group>
      </Paper>
      {/* Quantifiers */}
      <Paper
        p="xs"
        withBorder
        mb="md"
        style={{ 
          background: isDarkMode ? theme.colors.dark[7] : theme.colors.gray[0], 
          border: `1px solid ${isDarkMode ? theme.colors.dark[5] : theme.colors.gray[3]}` 
        }}
      >
        <Title order={5} mb="xs" style={{ color: theme.colors.blue[5] }}>
          Quantifiers
        </Title>
        <Group mb="md">
          <Tooltip label="Zero or one: matches 0-1 times">
            <Button
              size="sm"
              variant="light"
              onClick={() => addPattern("?")}
              color="blue"
            >
              ? (0-1)
            </Button>
          </Tooltip>
          <Tooltip label="Zero or more: matches 0 or more times">
            <Button
              size="sm"
              variant="light"
              onClick={() => addPattern("*")}
              color="blue"
            >
              * (0+)
            </Button>
          </Tooltip>
          <Tooltip label="One or more: matches 1 or more times">
            <Button
              size="sm"
              variant="light"
              onClick={() => addPattern("+")}
              color="blue"
            >
              + (1+)
            </Button>
          </Tooltip>
          <Tooltip label="Exactly n: matches exactly n times">
            <Button
              size="sm"
              variant="light"
              onClick={() => addPattern("{n}")}
              color="blue"
            >
              {"{Start}"}
            </Button>
          </Tooltip>
          <Tooltip label="n to m: matches between n and m times">
            <Button
              size="sm"
              variant="light"
              onClick={() => addPattern("{n,m}")}
              color="blue"
            >
              $ {"{n,m}"}
            </Button>
          </Tooltip>
          <Tooltip label="n or more: matches n or more times">
            <Button
              size="sm"
              variant="light"
              onClick={() => addPattern("{n,}")}
              color="blue"
            >
              {"{Any}"}
            </Button>
          </Tooltip>
        </Group>
      </Paper>
      {/* Custom pattern input */}
      <Paper
        p="md"
        withBorder
        mb="md"
        style={{ 
          background: isDarkMode ? theme.colors.dark[7] : theme.colors.gray[0], 
          border: `1px solid ${isDarkMode ? theme.colors.dark[5] : theme.colors.gray[3]}` 
        }}
      >
        <Title order={5} mb="xs" style={{ color: theme.colors.blue[5] }}>
          Custom Pattern
        </Title>
        <Group mb="md" align="flex-end">
          <TextInput
            placeholder="Type custom regex pattern"
            value={currentBlock}
            onChange={(e) => setCurrentBlock(e.currentTarget.value)}
            style={{ flexGrow: 1 }}
            size="md"
          />
          <Button
            onClick={addBlock}
            size="md"
            disabled={!currentBlock.trim()}
            variant="filled"
            leftSection={<IconPlus size="1rem" />}
          >
            Add
          </Button>
          <Button
            onClick={clearRegex}
            size="md"
            color="red"
            variant="light"
            leftSection={<IconTrash size="1rem" />}
          >
            Clear
          </Button>
        </Group>
      </Paper>
      {/* Special groups */}
      <Paper
        p="xs"
        withBorder
        mb="md"
        style={{ 
          background: isDarkMode ? theme.colors.dark[7] : theme.colors.gray[0], 
          border: `1px solid ${isDarkMode ? theme.colors.dark[5] : theme.colors.gray[3]}` 
        }}
      >
        <Title order={5} mb="xs" style={{ color: theme.colors.blue[5] }}>
          Special Groups & Constructs
        </Title>
        <Group>
          <Tooltip label="Character Class - Define a set of characters to match">
            <Button
              size="sm"
              variant="light"
              leftSection={<IconBrackets size="1rem" />}
              onClick={() => addPattern("[...]")}
              color="blue"
            >
              [...] 
            </Button>
          </Tooltip>
          <Tooltip label="Capture Group - Group and capture">
            <Button
              size="sm"
              variant="light"
              onClick={() => addPattern("(...)")}
              color="blue"
            >
              (...) 
            </Button>
          </Tooltip>
          <Tooltip label="Non-Capturing Group - Group without capturing">
            <Button
              size="sm"
              variant="light"
              onClick={() => addPattern("(?:...)")}
              color="blue"
            >
              (?:...)
            </Button>
          </Tooltip>
          <Tooltip label="OR - Match either pattern">
            <Button
              size="sm"
              variant="light"
              onClick={() => addPattern("|")}
              color="blue"
            >
              OR |
            </Button>
          </Tooltip>
        </Group>
      </Paper>
    </Paper>
  );
}
