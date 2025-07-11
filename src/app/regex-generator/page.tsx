"use client";

import { useState } from "react";
import {
  Container,
  Title,
  Paper,
  Grid,
  Group,
  Text,
  Stack,
  Divider,
  Code,
  CopyButton,
  Tooltip,
  ActionIcon,
  rem,
  Alert,
} from "@mantine/core";
import { IconCheck, IconCopy, IconAlertCircle } from "@tabler/icons-react";
// Import components directly using relative paths until Next.js builds them properly
import { RegexBuilder } from "../../components/regex-generator/RegexBuilder";
import { RegexTester } from "../../components/regex-generator/RegexTester";
import { RegexPatternLibrary } from "../../components/regex-generator/RegexPatternLibrary";

export default function RegexGeneratorPage() {
  const [regex, setRegex] = useState<string>("");
  const [flags, setFlags] = useState<string>("g");
  return (
    <Container size="xl" py="xl" style={{ color: "white" }}>
      <Title order={1} mb="lg">
        <Text
          inherit
          variant="gradient"
          gradient={{ from: "blue.7", to: "cyan.5", deg: 45 }}
          span
        >
          Regex Generator
        </Text>
      </Title>
      <Text c="gray.4" mb="xl" size="lg">
        Build, test, and validate regular expressions with our visual regex
        builder. Choose from common patterns or create your own custom regex.
      </Text>{" "}
      <Grid gutter="md">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="md">
            {" "}
            {/* Getting Started Guide - Always visible and more prominent */}
            <Alert
              icon={<IconAlertCircle size={rem(24)} />}
              title="Getting Started"
              color="blue"
              radius="md"
              p="lg"
              styles={{
                title: { fontSize: rem(18) },
                message: { fontSize: rem(14) },
                root: { backgroundColor: "#1c1c1c", color: "#ddd" },
              }}
            >
              Select patterns from the pattern library or use the visual builder
              below to create your regular expression. You can test your
              expression in the tester section.
            </Alert>
            <RegexBuilder
              regex={regex}
              setRegex={setRegex}
              flags={flags}
              setFlags={setFlags}
            />{" "}
            {/* Your Regular Expression section moved below the builder */}
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
                Your Regular Expression
              </Title>
              <Group wrap="nowrap" align="center">
                <Code
                  block
                  style={{
                    flex: 1,
                    fontSize: rem(16),
                    backgroundColor: "#1c1c1c",
                    color: "#4dadff",
                    border: "1px solid #444",
                  }}
                >
                  /{regex.replace(/\\/g, "\\\\")}/{flags}
                </Code>
                <CopyButton value={`/${regex}/${flags}`} timeout={2000}>
                  {({ copied, copy }) => (
                    <Tooltip
                      label={copied ? "Copied" : "Copy"}
                      withArrow
                      position="right"
                    >
                      <ActionIcon
                        color={copied ? "teal" : "blue"}
                        onClick={copy}
                      >
                        {copied ? (
                          <IconCheck size="1rem" />
                        ) : (
                          <IconCopy size="1rem" />
                        )}
                      </ActionIcon>
                    </Tooltip>
                  )}
                </CopyButton>
              </Group>
            </Paper>
            <RegexTester regex={regex} flags={flags} />
          </Stack>
        </Grid.Col>{" "}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper
            shadow="sm"
            p="md"
            radius="md"
            withBorder
            style={{
              height: "75vh",
              display: "flex",
              flexDirection: "column",
              background: "#242424",
              color: "white",
              border: "1px solid #333",
            }}
          >
            <Title order={3} mb="md" style={{ color: "#4dadff" }}>
              Pattern Library
            </Title>
            <div
              style={{
                overflow: "auto",
                flex: 1,
                "&::-webkit-scrollbar": {
                  width: "8px",
                  backgroundColor: "#333",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#444",
                  borderRadius: "4px",
                },
              }}
            >
              <RegexPatternLibrary setRegex={setRegex} />
            </div>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
