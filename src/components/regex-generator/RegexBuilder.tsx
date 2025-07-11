"use client";

import { useState } from "react";
import {
  Paper,
  Title,
  Group,
  SegmentedControl,
  TextInput,
  Switch,
  Stack,
  Button,
  Grid,
  Tooltip,
  Text,
  ActionIcon,
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
    setRegex(regex + pattern);
  };

  // Clear regex
  const clearRegex = () => {
    setRegex("");
  };

  return (
    <Paper shadow="sm" p="md" radius="md" withBorder>
      <Title order={3} mb="md">
        Visual Builder
      </Title>

      {/* Flags */}
      <Paper p="xs" withBorder mb="md">
        <Group mb="xs">
          <Title order={5}>Regex Flags</Title>
        </Group>
        <Group>
          <Switch
            label="Global (g)"
            checked={flags.includes("g")}
            onChange={() => toggleFlag("g")}
          />
          <Switch
            label="Case Insensitive (i)"
            checked={flags.includes("i")}
            onChange={() => toggleFlag("i")}
          />
          <Switch
            label="Multiline (m)"
            checked={flags.includes("m")}
            onChange={() => toggleFlag("m")}
          />
          <Switch
            label="Dot All (s)"
            checked={flags.includes("s")}
            onChange={() => toggleFlag("s")}
          />
        </Group>
      </Paper>

      {/* Quick Pattern Buttons */}
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

      {/* Quantifiers */}
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

      {/* Custom input */}
      <Group mb="md" align="flex-end">
        <TextInput
          label="Custom Pattern"
          value={currentBlock}
          onChange={(e) => setCurrentBlock(e.currentTarget.value)}
          style={{ flex: 1 }}
          placeholder="Type custom regex pattern"
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

      {/* Group buttons */}
      <Group>
        <Tooltip label="Character Class">
          <Button
            leftSection={<IconBrackets size="1rem" />}
            size="sm"
            variant="light"
            onClick={() => addPattern("[]")}
          >
            [...]
          </Button>
        </Tooltip>
        <Tooltip label="Capturing Group">
          <Button
            leftSection={<IconRegex size="1rem" />}
            size="sm"
            variant="light"
            onClick={() => addPattern("()")}
          >
            (...)
          </Button>
        </Tooltip>
        <Tooltip label="Non-Capturing Group">
          <Button
            leftSection={<IconRegex size="1rem" />}
            size="sm"
            variant="light"
            onClick={() => addPattern("(?:)")}
          >
            (?:...)
          </Button>
        </Tooltip>
        <Tooltip label="Alternation (OR)">
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
  );
}
