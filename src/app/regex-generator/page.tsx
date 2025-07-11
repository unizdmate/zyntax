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
  ScrollArea,
  useMantineTheme,
} from "@mantine/core";
import { IconCheck, IconCopy, IconAlertCircle } from "@tabler/icons-react";
// Import components directly using relative paths until Next.js builds them properly
import { RegexBuilder } from "../../components/regex-generator/RegexBuilder";
import { RegexTester } from "../../components/regex-generator/RegexTester";
import { RegexPatternLibrary } from "../../components/regex-generator/RegexPatternLibrary";
import { useColorScheme } from "@/app/providers";

export default function RegexGeneratorPage() {
  const [regex, setRegex] = useState<string>("");
  const [flags, setFlags] = useState<string>("g");
  const { colorScheme } = useColorScheme();
  const theme = useMantineTheme();
  
  // Determine if we're in dark mode
  const isDarkMode = 
    colorScheme === "dark" ||
    (colorScheme === "auto" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);  return (
    <Container size="xl" py="xl" style={{ color: isDarkMode ? theme.white : theme.black }}>
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
      <Text c={isDarkMode ? "gray.4" : "gray.6"} mb="xl" size="lg">
        Build, test, and validate regular expressions with our visual regex
        builder. Choose from common patterns or create your own custom regex.
      </Text>{" "}
      <Grid gutter="md">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="md">
            {" "}
            {/* Getting Started Guide - Always visible and more prominent */}            <Paper
              p="md"
              radius="md"
              withBorder
              style={{ 
                backgroundColor: isDarkMode ? theme.colors.dark[7] : theme.colors.gray[0],
                border: `1px solid ${isDarkMode ? theme.colors.dark[5] : theme.colors.gray[3]}`
              }}
            >
              <Group align="center" mb="xs">
                <Title order={3} style={{ color: theme.colors.blue[5] }}>
                  Getting Started
                </Title>
              </Group>
              <Text size="sm" c={isDarkMode ? "gray.3" : "gray.7"} pl={4}>
                Select patterns from the pattern library or use the visual
                builder below to create your regular expression. You can test
                your expression in the tester section.
              </Text>
            </Paper>
            <RegexBuilder
              regex={regex}
              setRegex={setRegex}
              flags={flags}
              setFlags={setFlags}
            />{" "}
            {/* Your Regular Expression section moved below the builder */}            <Paper
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
                Your Regular Expression
              </Title>
              <Group wrap="nowrap" align="center">
                <Code
                  block
                  style={{
                    flex: 1,
                    fontSize: rem(16),
                    backgroundColor: isDarkMode ? theme.colors.dark[9] : theme.colors.gray[0],
                    color: theme.colors.blue[5],
                    border: `1px solid ${isDarkMode ? theme.colors.dark[4] : theme.colors.gray[3]}`,
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
            withBorder            style={{
              height: "75vh",
              display: "flex",
              flexDirection: "column",
              background: isDarkMode ? theme.colors.dark[7] : theme.white,
              color: isDarkMode ? theme.white : theme.black,
              border: `1px solid ${isDarkMode ? theme.colors.dark[5] : theme.colors.gray[3]}`,
            }}
          >
            {" "}
            <Title order={3} mb="md" style={{ color: theme.colors.blue[5] }}>
              Pattern Library
            </Title>
            <ScrollArea
              h="100%"
              type="auto"
              offsetScrollbars
              scrollbarSize={8}
              styles={{
                scrollbar: { backgroundColor: isDarkMode ? theme.colors.dark[5] : theme.colors.gray[1] },
                thumb: { backgroundColor: isDarkMode ? theme.colors.dark[4] : theme.colors.gray[4], borderRadius: "4px" },
              }}
            >
              <RegexPatternLibrary setRegex={setRegex} />
            </ScrollArea>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
