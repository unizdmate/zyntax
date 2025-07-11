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
        background: "#242424",
        color: "white",
        border: "1px solid #333",
      }}
    >
      <Title order={3} mb="md" style={{ color: "#4dadff" }}>
        Visual Builder
      </Title>
      {/* Flags with explanations */}
      <Paper
        p="xs"
        withBorder
        mb="md"
        style={{ background: "#2c2c2c", border: "1px solid #333" }}
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
              Regex Flags
            </Badge>
            <Text size="sm" c="gray.4">
              Select flags to modify how your regex behaves
            </Text>
          </Group>
          <Popover width={500} position="bottom" withArrow shadow="md">
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
                background: "#242424",
                color: "white",
                border: "1px solid #333",
              }}
            >
              <Title order={4} mb="md" style={{ color: "#4dadff" }}>
                Understanding Regex Flags
              </Title>
              <Text size="sm" mb="md" c="gray.4">
                Flags modify how your regular expression behaves when matching
                text. The right combination of flags can make your regex more
                powerful and precise.
              </Text>

              {/* Global Flag */}
              <Paper
                p="md"
                withBorder
                mb="md"
                radius="md"
                bg="#2c2c2c"
                style={{
                  borderLeft: "4px solid #228be6",
                  border: "1px solid #333",
                }}
              >
                <Group mb="sm" align="center">
                  <Badge size="lg" color="blue" variant="filled">
                    g (global)
                  </Badge>
                  <Text fw={600} size="md" c="gray.3">
                    Match All Occurrences
                  </Text>
                </Group>
                <Text size="sm" mb="xs" c="gray.4">
                  Without this flag, regex stops after the first match. With it,
                  all matches in the text are found.
                </Text>
                <Paper p="md" withBorder radius="sm" bg="#333">
                  <Text fw={500} size="sm" mb={8} c="#4dadff">
                    Example:
                  </Text>
                  <Text size="sm" mb={8} c="gray.3">
                    Text:{" "}
                    <Code style={{ backgroundColor: "#1c1c1c" }}>
                      "apple apple apple"
                    </Code>
                  </Text>
                  <Text size="sm" mb={8} c="gray.3">
                    Pattern:{" "}
                    <Code style={{ backgroundColor: "#1c1c1c" }}>/apple/</Code>
                  </Text>
                  <Group align="center">
                    <Badge color="gray" size="sm" variant="filled">
                      WITHOUT G:
                    </Badge>
                    <Text
                      size="sm"
                      span
                      style={{ fontFamily: "monospace", color: "#ddd" }}
                    >
                      <span
                        style={{
                          backgroundColor: "rgba(77, 171, 247, 0.2)",
                          padding: "0 3px",
                          borderRadius: "3px",
                        }}
                      >
                        apple
                      </span>
                      <span> apple apple</span>
                    </Text>
                  </Group>
                  <Group align="center" mt={5}>
                    <Badge color="blue" size="sm" variant="filled">
                      WITH G:
                    </Badge>
                    <Text
                      size="sm"
                      span
                      style={{ fontFamily: "monospace", color: "#ddd" }}
                    >
                      <span
                        style={{
                          backgroundColor: "rgba(77, 171, 247, 0.3)",
                          padding: "0 3px",
                          borderRadius: "3px",
                        }}
                      >
                        apple
                      </span>
                      <span> </span>
                      <span
                        style={{
                          backgroundColor: "rgba(77, 171, 247, 0.3)",
                          padding: "0 3px",
                          borderRadius: "3px",
                        }}
                      >
                        apple
                      </span>
                      <span> </span>
                      <span
                        style={{
                          backgroundColor: "rgba(77, 171, 247, 0.3)",
                          padding: "0 3px",
                          borderRadius: "3px",
                        }}
                      >
                        apple
                      </span>
                    </Text>
                  </Group>
                </Paper>
              </Paper>

              {/* Case Insensitive Flag */}
              <Paper
                p="md"
                withBorder
                mb="md"
                radius="md"
                bg="#2c2c2c"
                style={{
                  borderLeft: "4px solid #228be6",
                  border: "1px solid #333",
                }}
              >
                <Group mb="sm" align="center">
                  <Badge size="lg" color="blue" variant="filled">
                    i (case insensitive)
                  </Badge>
                  <Text fw={600} size="md" c="gray.3">
                    Ignore Case
                  </Text>
                </Group>
                <Text size="sm" mb="xs" c="gray.4">
                  Makes the pattern match regardless of uppercase or lowercase
                  letters.
                </Text>
                <Paper p="md" withBorder radius="sm" bg="#333">
                  <Text fw={500} size="sm" mb={8} c="#4dadff">
                    Example:
                  </Text>
                  <Text size="sm" mb={8} c="gray.3">
                    Text:{" "}
                    <Code style={{ backgroundColor: "#1c1c1c" }}>
                      "Apple APPLE apple"
                    </Code>
                  </Text>
                  <Text size="sm" mb={8} c="gray.3">
                    Pattern:{" "}
                    <Code style={{ backgroundColor: "#1c1c1c" }}>/apple/</Code>
                  </Text>
                  <Group align="center">
                    <Badge color="gray" size="sm" variant="filled">
                      WITHOUT I:
                    </Badge>
                    <Text
                      size="sm"
                      span
                      style={{ fontFamily: "monospace", color: "#ddd" }}
                    >
                      <span>Apple APPLE </span>
                      <span
                        style={{
                          backgroundColor: "rgba(77, 171, 247, 0.2)",
                          padding: "0 3px",
                          borderRadius: "3px",
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
                      style={{ fontFamily: "monospace", color: "#ddd" }}
                    >
                      <span
                        style={{
                          backgroundColor: "rgba(77, 171, 247, 0.3)",
                          padding: "0 3px",
                          borderRadius: "3px",
                        }}
                      >
                        Apple
                      </span>
                      <span> </span>
                      <span
                        style={{
                          backgroundColor: "rgba(77, 171, 247, 0.3)",
                          padding: "0 3px",
                          borderRadius: "3px",
                        }}
                      >
                        APPLE
                      </span>
                      <span> </span>
                      <span
                        style={{
                          backgroundColor: "rgba(77, 171, 247, 0.3)",
                          padding: "0 3px",
                          borderRadius: "3px",
                        }}
                      >
                        apple
                      </span>
                    </Text>
                  </Group>
                </Paper>
              </Paper>

              {/* Multiline Flag */}
              <Paper
                p="md"
                withBorder
                mb="md"
                radius="md"
                bg="#2c2c2c"
                style={{
                  borderLeft: "4px solid #228be6",
                  border: "1px solid #333",
                }}
              >
                <Group mb="sm" align="center">
                  <Badge size="lg" color="blue" variant="filled">
                    m (multiline)
                  </Badge>
                  <Text fw={600} size="md" c="gray.3">
                    Line-By-Line Processing
                  </Text>
                </Group>
                <Group gap={5} mb="xs" c="gray.4">
                  <Text size="sm">Changes how</Text>
                  <Badge size="xs" bg="#1c1c1c" c="#fff">
                    ^
                  </Badge>
                  <Text size="sm">and</Text>
                  <Badge size="xs" bg="#1c1c1c" c="#fff">
                    $
                  </Badge>
                  <Text size="sm">
                    work to match the start/end of each line, not just the
                    entire string.
                  </Text>
                </Group>
                <Paper p="md" withBorder radius="sm" bg="#333">
                  <Text fw={500} size="sm" mb={8} c="#4dadff">
                    Example:
                  </Text>
                  <Code
                    block
                    mb={8}
                    style={{ backgroundColor: "#1c1c1c", color: "#ddd" }}
                  >
                    Line1 Line2 Line3
                  </Code>
                  <Text size="sm" mb={8} c="gray.3">
                    Pattern:{" "}
                    <Code style={{ backgroundColor: "#1c1c1c" }}>/^Line/</Code>
                  </Text>
                  <Group align="center">
                    <Badge color="gray" size="sm" variant="filled">
                      WITHOUT M:
                    </Badge>
                    <Text size="sm" c="gray.3">
                      Only matches "Line1" (start of string)
                    </Text>
                  </Group>
                  <Group align="center" mt={5}>
                    <Badge color="blue" size="sm" variant="filled">
                      WITH M:
                    </Badge>
                    <Text size="sm" c="gray.3">
                      Matches "Line1", "Line2", "Line3" (start of each line)
                    </Text>
                  </Group>
                  <Divider my="sm" variant="dashed" color="gray.7" />
                  <Text size="xs" c="gray.5">
                    The ^ anchor matches the beginning of the string by default.
                    With the m flag, it matches the beginning of each line
                    within the string.
                  </Text>
                </Paper>
              </Paper>

              {/* Dotall Flag */}
              <Paper
                p="md"
                withBorder
                mb="md"
                radius="md"
                bg="#2c2c2c"
                style={{
                  borderLeft: "4px solid #228be6",
                  border: "1px solid #333",
                }}
              >
                <Group mb="sm" align="center">
                  <Badge size="lg" color="blue" variant="filled">
                    s (dotall)
                  </Badge>
                  <Text fw={600} size="md" c="gray.3">
                    Dot Matches Everything
                  </Text>
                </Group>
                <Group gap={5} mb="xs" c="gray.4">
                  <Text size="sm">By default, the dot</Text>
                  <Badge size="xs" bg="#1c1c1c" c="#fff">
                    .
                  </Badge>
                  <Text size="sm">
                    matches any character except newlines. This flag makes it
                    match newlines too.
                  </Text>
                </Group>
                <Paper p="md" withBorder radius="sm" bg="#333">
                  <Text fw={500} size="sm" mb={8} c="#4dadff">
                    Example:
                  </Text>
                  <Text size="sm" mb={8} c="gray.3">
                    Text:{" "}
                    <Code style={{ backgroundColor: "#1c1c1c" }}>
                      "Line1\nLine2"
                    </Code>{" "}
                    (contains newline)
                  </Text>
                  <Text size="sm" mb={8} c="gray.3">
                    Pattern:{" "}
                    <Code style={{ backgroundColor: "#1c1c1c" }}>
                      /Line1.Line2/
                    </Code>
                  </Text>
                  <Group align="center">
                    <Badge color="gray" size="sm" variant="filled">
                      WITHOUT S:
                    </Badge>
                    <Text size="sm" c="gray.3">
                      No match (dot doesn't match newline)
                    </Text>
                  </Group>
                  <Group align="center" mt={5}>
                    <Badge color="blue" size="sm" variant="filled">
                      WITH S:
                    </Badge>
                    <Text size="sm" c="gray.3">
                      Matches "Line1\nLine2" (dot includes newline)
                    </Text>
                  </Group>
                  <Divider my="sm" variant="dashed" color="gray.7" />
                  <Paper p="xs" radius="xs" bg="#1c1c1c">
                    <Text size="xs" fw={500} c="gray.3">
                      Pro Tip:
                    </Text>
                    <Text size="xs" c="gray.5">
                      The s flag is particularly useful when parsing multi-line
                      data like HTML or log files where content might span
                      multiple lines.
                    </Text>
                  </Paper>
                </Paper>
              </Paper>

              {/* Advanced Flag Usage */}
              <Paper
                p="md"
                withBorder
                radius="md"
                bg="#2c2c2c"
                style={{ border: "1px solid #333" }}
              >
                <Title order={6} mb="xs" style={{ color: "#4dadff" }}>
                  Combining Flags
                </Title>
                <Text size="xs" c="gray.4">
                  Flags can be combined for powerful matching. For example,{" "}
                  <Code style={{ backgroundColor: "#1c1c1c" }}>
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
              style={{ border: "1px solid #333", backgroundColor: "#2c2c2c" }}
            >
              <Group justify="space-between">
                <Switch
                  size="md"
                  label={
                    <Group gap={5}>
                      <Text component="span" fw={500} c="gray.3">
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
                    description: { color: "#aaa" },
                  }}
                />
              </Group>
            </Paper>
          </Grid.Col>
          <Grid.Col span={6}>
            <Paper
              p="xs"
              radius="md"
              style={{ border: "1px solid #333", backgroundColor: "#2c2c2c" }}
            >
              <Group justify="space-between">
                <Switch
                  size="md"
                  label={
                    <Group gap={5}>
                      <Text component="span" fw={500} c="gray.3">
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
                    description: { color: "#aaa" },
                  }}
                />
              </Group>
            </Paper>
          </Grid.Col>
          <Grid.Col span={6}>
            <Paper
              p="xs"
              radius="md"
              style={{ border: "1px solid #333", backgroundColor: "#2c2c2c" }}
            >
              <Group justify="space-between">
                <Switch
                  size="md"
                  label={
                    <Group gap={5}>
                      <Text component="span" fw={500} c="gray.3">
                        Multiline
                      </Text>
                      <Badge size="sm" variant="filled" color="blue">
                        m
                      </Badge>
                    </Group>
                  }
                  description="^ $ match line starts/ends"
                  checked={flags.includes("m")}
                  onChange={() => toggleFlag("m")}
                  color="blue"
                  styles={{
                    description: { color: "#aaa" },
                  }}
                />
              </Group>
            </Paper>
          </Grid.Col>
          <Grid.Col span={6}>
            <Paper
              p="xs"
              radius="md"
              style={{ border: "1px solid #333", backgroundColor: "#2c2c2c" }}
            >
              <Group justify="space-between">
                <Switch
                  size="md"
                  label={
                    <Group gap={5}>
                      <Text component="span" fw={500} c="gray.3">
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
                    description: { color: "#aaa" },
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
        style={{ background: "#2c2c2c", border: "1px solid #333" }}
      >
        <Title order={5} mb="xs" style={{ color: "#4dadff" }}>
          Common Patterns
        </Title>
        <Group mb="md">
          <Tooltip label="Email: username@domain.com">
            <Button
              size="sm"
              variant="light"
              color="blue"
              onClick={() =>
                addPattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}")
              }
            >
              Email
            </Button>
          </Tooltip>
          <Tooltip label="URL: http://example.com">
            <Button
              size="sm"
              variant="light"
              color="blue"
              onClick={() =>
                addPattern(
                  "https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)"
                )
              }
            >
              URL
            </Button>
          </Tooltip>
          <Tooltip label="US Phone: 555-555-5555">
            <Button
              size="sm"
              variant="light"
              color="blue"
              onClick={() => addPattern("(?:\\d{3}[-.\\s]?){2}\\d{4}")}
            >
              Phone
            </Button>
          </Tooltip>
          <Tooltip label="Date: YYYY-MM-DD">
            <Button
              size="sm"
              variant="light"
              color="blue"
              onClick={() =>
                addPattern("\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])")
              }
            >
              Date (ISO)
            </Button>
          </Tooltip>
        </Group>{" "}
        {/* Basic Pattern Buttons */}
        <Group mb="md">
          <Tooltip label="Any digit [0-9]">
            <Button
              leftSection={<IconNumbers size="1rem" />}
              size="sm"
              variant="light"
              onClick={() => addPattern("\\d")}
            >
              Digit
            </Button>
          </Tooltip>
          <Tooltip label="Any non-digit [^0-9]">
            <Button
              leftSection={<IconNumbers size="1rem" />}
              size="sm"
              variant="light"
              onClick={() => addPattern("\\D")}
            >
              Non-Digit
            </Button>
          </Tooltip>
          <Tooltip label="Any word character [a-zA-Z0-9_]">
            <Button
              leftSection={<IconLetterA size="1rem" />}
              size="sm"
              variant="light"
              onClick={() => addPattern("\\w")}
            >
              Word
            </Button>
          </Tooltip>
          <Tooltip label="Any non-word character [^a-zA-Z0-9_]">
            <Button
              leftSection={<IconLetterA size="1rem" />}
              size="sm"
              variant="light"
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
        style={{ background: "#2c2c2c", border: "1px solid #333" }}
      >
        <Title order={5} mb="xs" style={{ color: "#4dadff" }}>
          Quantifiers
        </Title>
        <Group mb="md">
          <Tooltip label="Zero or more">
            <Button size="sm" variant="light" onClick={() => addPattern("*")}>
              * (0+)
            </Button>
          </Tooltip>
          <Tooltip label="One or more">
            <Button size="sm" variant="light" onClick={() => addPattern("+")}>
              + (1+)
            </Button>
          </Tooltip>
          <Tooltip label="Zero or one">
            <Button size="sm" variant="light" onClick={() => addPattern("?")}>
              ? (0-1)
            </Button>
          </Tooltip>
          <Tooltip label="Start of string">
            <Button size="sm" variant="light" onClick={() => addPattern("^")}>
              ^ (Start)
            </Button>
          </Tooltip>
          <Tooltip label="End of string">
            <Button size="sm" variant="light" onClick={() => addPattern("$")}>
              $ (End)
            </Button>
          </Tooltip>
          <Tooltip label="Any character">
            <Button size="sm" variant="light" onClick={() => addPattern(".")}>
              . (Any)
            </Button>
          </Tooltip>
        </Group>
      </Paper>
      {/* Custom input */}
      <Paper
        p="md"
        withBorder
        mb="md"
        style={{ background: "#2c2c2c", border: "1px solid #333" }}
      >
        <Title order={5} mb="xs" style={{ color: "#4dadff" }}>
          Custom Pattern
        </Title>
        <Group mb="md" align="flex-end">
          <TextInput
            value={currentBlock}
            onChange={(e) => setCurrentBlock(e.currentTarget.value)}
            style={{ flex: 1 }}
            placeholder="Type custom regex pattern"
            styles={{
              input: {
                backgroundColor: "#333",
                color: "white",
                borderColor: "#444",
              },
            }}
            rightSection={
              <Tooltip label="Insert custom regex elements">
                <ActionIcon variant="subtle" color="blue">
                  <IconInfoCircle size="1rem" />
                </ActionIcon>
              </Tooltip>
            }
          />
          <Button
            leftSection={<IconPlus size="1rem" />}
            onClick={addBlock}
            disabled={!currentBlock.trim()}
          >
            Add
          </Button>
          <Button
            color="red"
            variant="light"
            leftSection={<IconTrash size="1rem" />}
            onClick={clearRegex}
          >
            Clear
          </Button>
        </Group>
      </Paper>
      {/* Group buttons */}
      <Paper
        p="xs"
        withBorder
        mb="md"
        style={{ background: "#2c2c2c", border: "1px solid #333" }}
      >
        <Title order={5} mb="xs" style={{ color: "#4dadff" }}>
          Special Groups & Constructs
        </Title>
        <Group>
          <Tooltip label="Character Class - Define a set of characters to match">
            <Button
              leftSection={<IconBrackets size="1rem" />}
              size="sm"
              variant="light"
              onClick={() => addPattern("[]")}
            >
              [...]
            </Button>
          </Tooltip>
          <Tooltip label="Capturing Group - Group and capture matched content">
            <Button
              leftSection={<IconRegex size="1rem" />}
              size="sm"
              variant="light"
              onClick={() => addPattern("()")}
            >
              (...)
            </Button>
          </Tooltip>
          <Tooltip label="Non-Capturing Group - Group without capturing">
            <Button
              leftSection={<IconRegex size="1rem" />}
              size="sm"
              variant="light"
              onClick={() => addPattern("(?:)")}
            >
              (?:...)
            </Button>
          </Tooltip>
          <Tooltip label="Alternation (OR) - Match either the expression before or after">
            <Button
              leftSection={<IconArrowsShuffle size="1rem" />}
              size="sm"
              variant="light"
              onClick={() => addPattern("|")}
            >
              OR |
            </Button>
          </Tooltip>
        </Group>
      </Paper>
      {/* Help text */}
      <Alert
        icon={<IconInfoCircle size="1.2rem" />}
        color="blue"
        variant="light"
        p="md"
        radius="md"
        style={{ backgroundColor: "#1c1c1c", color: "#ddd" }}
      >
        <Text size="sm" mb={10} fw={600} c="gray.2">
          How to Use the Regex Builder
        </Text>
        <Text size="sm" c="gray.3">
          1. Select flags above to control matching behavior
        </Text>
        <Text size="sm" c="gray.3">
          2. Click pattern buttons to add regex components
        </Text>
        <Text size="sm" c="gray.3">
          3. Use the custom input for specific patterns
        </Text>
        <Text size="sm" mt={10} c="gray.5">
          The flags you choose dramatically affect how your regex matches text.
          Click the info icon next to "Regex Flags" to learn more about each
          flag's purpose and behavior.
        </Text>
      </Alert>
    </Paper>
  );
}
