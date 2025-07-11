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
    <Container size="xl" py="xl">
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

      <Text c="dimmed" mb="xl">
        Build, test, and validate regular expressions with our visual regex
        builder. Choose from common patterns or create your own custom regex.
      </Text>

      <Grid gutter="md">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="md">
            <Paper shadow="sm" p="md" radius="md" withBorder>
              <Title order={3} mb="md">
                Your Regular Expression
              </Title>
              <Group wrap="nowrap" align="center">
                <Code block style={{ flex: 1, fontSize: rem(16) }}>
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
                        color={copied ? "teal" : "gray"}
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
              {regex.length === 0 && (
                <Alert
                  mt="md"
                  icon={<IconAlertCircle size="1rem" />}
                  title="Getting Started"
                  color="blue"
                >
                  Select patterns from the library or build your regex using the
                  visual builder below.
                </Alert>
              )}
            </Paper>

            <RegexBuilder
              regex={regex}
              setRegex={setRegex}
              flags={flags}
              setFlags={setFlags}
            />

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
            }}
          >
            <Title order={3} mb="md">
              Pattern Library
            </Title>
            <div style={{ overflow: "auto", flex: 1 }}>
              <RegexPatternLibrary setRegex={setRegex} />
            </div>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
