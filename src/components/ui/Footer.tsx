"use client";

import {
  Container,
  Group,
  Text,
  Stack,
  Grid,
  Divider,
  Box,
  Flex,
  ThemeIcon,
  Anchor,
  rem,
  useMantineTheme,
} from "@mantine/core";
import Link from "next/link";
import { useColorScheme } from "@/app/providers";
import {
  IconCode,
  IconBrandGithub,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconMail,
  IconStar,
} from "@tabler/icons-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { colorScheme } = useColorScheme();
  const theme = useMantineTheme();

  const isDark =
    colorScheme === "dark" ||
    (colorScheme === "auto" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  // Footer sections
  const sections = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "/features" },
        { label: "Converter", href: "/" },
        { label: "API Documentation", href: "/docs/api" },
        { label: "Pricing", href: "/pricing" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "/docs" },
        { label: "Examples", href: "/examples" },
        { label: "Blog", href: "/blog" },
        { label: "Changelog", href: "/changelog" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Contact", href: "/contact" },
      ],
    },
  ];

  // Logo component
  const Logo = () => (
    <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
      <Flex align="center" gap="xs">
        <ThemeIcon
          size="lg"
          radius="md"
          variant="gradient"
          gradient={{ from: "blue.7", to: "cyan.5", deg: 45 }}
        >
          <IconCode size={18} />
        </ThemeIcon>
        <Text
          fw={700}
          size="xl"
          variant="gradient"
          gradient={{ from: "blue.7", to: "cyan.5", deg: 45 }}
        >
          Zyntax
        </Text>
      </Flex>
    </Link>
  );

  return (
    <Box
      component="footer"
      py={{ base: "xl", md: 50 }}
      style={{
        borderTop: `${rem(1)} solid ${isDark ? theme.colors.dark[5] : theme.colors.gray[2]}`,
        backgroundColor: isDark ? theme.colors.dark[8] : theme.colors.gray[0],
      }}
    >
      <Container size="xl">
        <Grid>
          {/* Logo and Description */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="md">
              <Logo />
              <Text size="sm" c="dimmed" maw={300}>
                Zyntax is a powerful tool for converting JSON to TypeScript with
                advanced features for developers. Save time and reduce errors in
                your TypeScript projects.
              </Text>

              <Group gap="xs" wrap="nowrap" mt="md">
                <Anchor
                  href="https://github.com"
                  target="_blank"
                  c={isDark ? "gray.5" : "gray.6"}
                >
                  <IconBrandGithub size="1.2rem" stroke={1.5} />
                </Anchor>
                <Anchor
                  href="https://twitter.com"
                  target="_blank"
                  c={isDark ? "gray.5" : "gray.6"}
                >
                  <IconBrandTwitter size="1.2rem" stroke={1.5} />
                </Anchor>
                <Anchor
                  href="https://linkedin.com"
                  target="_blank"
                  c={isDark ? "gray.5" : "gray.6"}
                >
                  <IconBrandLinkedin size="1.2rem" stroke={1.5} />
                </Anchor>
                <Anchor
                  href="mailto:info@zyntax.app"
                  c={isDark ? "gray.5" : "gray.6"}
                >
                  <IconMail size="1.2rem" stroke={1.5} />
                </Anchor>
              </Group>
            </Stack>
          </Grid.Col>

          {/* Navigation Sections */}
          {sections.map((section) => (
            <Grid.Col key={section.title} span={{ base: 6, md: 2 }}>
              <Stack gap="md">
                <Text fw={700} size="sm">
                  {section.title}
                </Text>
                <Stack gap="xs">
                  {section.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      style={{ textDecoration: "none" }}
                    >
                      <Text
                        size="sm"
                        c="dimmed"
                        style={{
                          "&:hover": {
                            color: isDark
                              ? theme.colors.blue[4]
                              : theme.colors.blue[7],
                          },
                          transition: "color 150ms ease",
                        }}
                      >
                        {link.label}
                      </Text>
                    </Link>
                  ))}
                </Stack>
              </Stack>
            </Grid.Col>
          ))}

          {/* Newsletter - can be implemented later */}
          <Grid.Col span={12}>
            <Divider my="xl" />
            <Group justify="space-between" gap="md" wrap="wrap">
              <Text size="sm" c="dimmed">
                © {currentYear} Zyntax. All rights reserved.
              </Text>
              <Group wrap="nowrap" gap="xs">
                <IconStar
                  size="1rem"
                  color={theme.colors.yellow[6]}
                  fill={theme.colors.yellow[6]}
                />
                <Text size="sm">
                  Built with{" "}
                  <Anchor href="https://mantine.dev" target="_blank">
                    Mantine
                  </Anchor>{" "}
                  and{" "}
                  <Anchor href="https://nextjs.org" target="_blank">
                    Next.js
                  </Anchor>
                </Text>
              </Group>
            </Group>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}
