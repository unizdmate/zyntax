"use client";

import {
  Container,
  Group,
  Text,
  Stack,
  useMantineColorScheme,
} from "@mantine/core";
import Link from "next/link";
import { useColorScheme } from "@/app/providers";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { colorScheme } = useColorScheme();
  const isDark =
    colorScheme === "dark" ||
    (colorScheme === "auto" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <footer
      style={{
        marginTop: "4rem",
        padding: "2rem 0",
        borderTop: `1px solid ${isDark ? "#2C2E33" : "#eaeaea"}`,
        backgroundColor: isDark ? "#1A1B1E" : "#f9fafb",
      }}
    >
      <Container size="xl">
        <Stack gap="md" align="center">
          <Text fw={700} size="lg" c="blue">
            Zyntax
          </Text>

          <Group gap="lg">
            <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
              <Text size="sm" c="dimmed">
                Home
              </Text>
            </Link>
            <Link
              href="/dashboard"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Text size="sm" c="dimmed">
                Dashboard
              </Text>
            </Link>
          </Group>

          <Text size="sm" c="dimmed">
            © {currentYear} Zyntax. All rights reserved.
          </Text>
        </Stack>
      </Container>
    </footer>
  );
}
