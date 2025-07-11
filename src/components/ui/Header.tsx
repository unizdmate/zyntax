"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import {
  Container,
  Group,
  Button,
  Text,
  Menu,
  UnstyledButton,
  Burger,
  Drawer,
  Stack,
  ActionIcon,
  Tooltip,
  Box,
  Flex,
  ThemeIcon,
  useMantineTheme,
  Divider,
  Avatar,
  rem,
  Paper,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { useColorScheme } from "@/app/providers";
import {
  IconSun,
  IconMoon,
  IconDeviceDesktop,
  IconCode,
  IconBrandGithub,
  IconChevronDown,
  IconLogout,
  IconUser,
} from "@tabler/icons-react";

export function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [opened, { toggle, close }] = useDisclosure(false);
  const [scrolled, setScrolled] = useState(false);
  const { colorScheme, setColorScheme } = useColorScheme();
  const theme = useMantineTheme();

  // Track scroll position for styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle sign-out action
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  // Determine active links
  const isActive = (path: string) => pathname === path;

  // Theme switching logic
  const isDark =
    colorScheme === "dark" ||
    (colorScheme === "auto" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const navItemStyles = {
    display: "block",
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,
    transition: "all 200ms ease",
  };

  const activeNavItemStyles = {
    ...navItemStyles,
    backgroundColor: isDark
      ? theme.colors.blue[9]
        ? `rgba(${theme.colors.blue[9]}, 0.2)`
        : `rgba(0, 0, 0, 0.2)`
      : theme.colors.blue[0]
        ? `rgba(${theme.colors.blue[0]}, 0.7)`
        : `rgba(230, 240, 255, 0.7)`,
    color: isDark ? theme.colors.blue[3] : theme.colors.blue[7],
  };

  // Navigation items
  const navItems = (
    <Group gap="md">
      <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
        <Box style={isActive("/") ? activeNavItemStyles : navItemStyles}>
          Home
        </Box>
      </Link>
      {status === "authenticated" ? (
        <Link
          href="/converter"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Box
            style={isActive("/converter") ? activeNavItemStyles : navItemStyles}
          >
            Converter
          </Box>
        </Link>
      ) : (
        <Link
          href="/#try-converter"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Box style={navItemStyles}>Converter</Box>
        </Link>
      )}{" "}
      <Link
        href="/features"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <Box
          style={isActive("/features") ? activeNavItemStyles : navItemStyles}
        >
          Features
        </Box>
      </Link>
      <Link
        href="/regex-generator"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <Box
          style={
            isActive("/regex-generator") ? activeNavItemStyles : navItemStyles
          }
        >
          Regex Generator
        </Box>
      </Link>
      {status === "authenticated" && (
        <Link
          href="/dashboard"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Box
            style={isActive("/dashboard") ? activeNavItemStyles : navItemStyles}
          >
            Dashboard
          </Box>
        </Link>
      )}
    </Group>
  );

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

  // Theme switcher component
  const ThemeSwitcher = () => (
    <Group>
      <Tooltip label={isDark ? "Light mode" : "Dark mode"}>
        <ActionIcon
          onClick={() => setColorScheme(isDark ? "light" : "dark")}
          variant="light"
          size="lg"
          radius="md"
          aria-label="Toggle color scheme"
        >
          {isDark ? <IconSun size="1.2rem" /> : <IconMoon size="1.2rem" />}
        </ActionIcon>
      </Tooltip>
    </Group>
  );

  return (
    <Box
      component="header"
      pos="sticky"
      top={0}
      style={{
        zIndex: 100,
        backgroundColor: isDark ? theme.colors.dark[8] : "white",
        borderBottom: scrolled
          ? `${rem(1)} solid ${
              isDark ? theme.colors.dark[5] : theme.colors.gray[2]
            }`
          : "none",
        boxShadow: scrolled
          ? `0 ${rem(2)} ${rem(10)} rgba(0, 0, 0, ${isDark ? 0.3 : 0.05})`
          : "none",
        transition: "all 200ms ease",
      }}
    >
      <Container size="xl" py="md">
        <Group justify="space-between">
          <Logo />

          {/* Desktop navigation */}
          <Group gap="xl" visibleFrom="sm">
            {navItems}
          </Group>

          {/* Theme toggle and Authentication controls */}
          <Group gap="md" visibleFrom="sm">
            <ThemeSwitcher />

            {status === "authenticated" ? (
              <Menu position="bottom-end" withArrow shadow="md" width={200}>
                <Menu.Target>
                  <Button
                    variant="subtle"
                    rightSection={<IconChevronDown size="1rem" />}
                  >
                    <Group gap="xs">
                      <Avatar size="sm" radius="xl" color="blue">
                        {session.user?.email?.charAt(0).toUpperCase() || "U"}
                      </Avatar>
                      <Text lineClamp={1} size="sm">
                        {session.user?.email}
                      </Text>
                    </Group>
                  </Button>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<IconUser size="0.9rem" />}
                    onClick={() => router.push("/profile")}
                  >
                    Profile
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    leftSection={<IconLogout size="0.9rem" />}
                    onClick={handleSignOut}
                    color="red"
                  >
                    Sign out
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Button
                onClick={() => router.push("/login")}
                variant="gradient"
                gradient={{ from: "blue", to: "cyan", deg: 45 }}
              >
                Sign in
              </Button>
            )}
          </Group>

          {/* Mobile burger menu */}
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" />
        </Group>
      </Container>

      {/* Mobile drawer */}
      <Drawer
        opened={opened}
        onClose={close}
        size="100%"
        padding="md"
        hiddenFrom="sm"
        zIndex={1000}
        withCloseButton
        title={<Logo />}
      >
        <Stack gap="xl" mt="xl">
          <Box>{navItems}</Box>

          <Divider />

          <Group justify="center">
            <ThemeSwitcher />
          </Group>

          <Divider />

          {status === "authenticated" ? (
            <Stack>
              <Paper withBorder p="md" radius="md">
                <Group mb="xs">
                  <Avatar size="md" radius="xl" color="blue">
                    {session.user?.email?.charAt(0).toUpperCase() || "U"}
                  </Avatar>
                  <Box>
                    <Text fw={500} size="sm" lineClamp={1}>
                      {session.user?.email}
                    </Text>
                    <Text size="xs" c="dimmed">
                      Signed in
                    </Text>
                  </Box>
                </Group>
                <Button
                  onClick={handleSignOut}
                  variant="light"
                  color="red"
                  fullWidth
                  leftSection={<IconLogout size="1rem" />}
                >
                  Sign out
                </Button>
              </Paper>
            </Stack>
          ) : (
            <Button
              onClick={() => {
                close();
                router.push("/login");
              }}
              variant="gradient"
              gradient={{ from: "blue", to: "cyan", deg: 45 }}
              fullWidth
              size="md"
            >
              Sign in
            </Button>
          )}
        </Stack>
      </Drawer>
    </Box>
  );
}
