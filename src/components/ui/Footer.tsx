"use client";

import { Container, Group, Text, Stack } from "@mantine/core";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        marginTop: "4rem",
        padding: "2rem 0",
        borderTop: "1px solid #eaeaea",
        backgroundColor: "#f9fafb",
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
