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
  SegmentedControl,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { useColorScheme } from "@/app/providers";
import { IconSun, IconMoon, IconDeviceDesktop } from "@tabler/icons-react";

export function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [opened, { toggle, close }] = useDisclosure(false);
  const [scrolled, setScrolled] = useState(false);
  const { colorScheme, setColorScheme } = useColorScheme();

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

  // Handle color scheme change with proper typing
  const handleColorSchemeChange = (value: string) => {
    // Type guard to ensure value is one of the allowed color schemes
    if (value === "light" || value === "dark" || value === "auto") {
      setColorScheme(value);
    }
  };

  // Determine active links
  const isActive = (path: string) => pathname === path;

  const headerStyle = {
    position: "sticky" as const,
    top: 0,
    zIndex: 100,
    backgroundColor: colorScheme === "dark" ? "#1A1B1E" : "white",
    borderBottom: scrolled
      ? `1px solid ${colorScheme === "dark" ? "#2C2E33" : "#e0e0e0"}`
      : "none",
    boxShadow: scrolled
      ? `0 2px 10px rgba(0, 0, 0, ${colorScheme === "dark" ? "0.3" : "0.05"})`
      : "none",
    transition: "box-shadow 200ms ease, border-bottom 200ms ease",
    padding: "12px 0",
  };

  // Navigation items - different for authenticated/unauthenticated users
  const navItems = (
    <>
      <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
        <UnstyledButton
          fw={500}
          style={{
            color: isActive("/") ? "#1e84ff" : undefined,
            position: "relative",
            padding: "8px 12px",
          }}
        >
          Converter
        </UnstyledButton>
      </Link>

      {status === "authenticated" && (
        <Link
          href="/dashboard"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <UnstyledButton
            fw={500}
            style={{
              color: isActive("/dashboard") ? "#1e84ff" : undefined,
              position: "relative",
              padding: "8px 12px",
            }}
          >
            Dashboard
          </UnstyledButton>
        </Link>
      )}
    </>
  );

  // Color scheme control
  const themeSegmentControl = (
    <SegmentedControl
      value={colorScheme}
      onChange={handleColorSchemeChange}
      data={[
        {
          value: "light",
          label: (
            <Group gap={4}>
              <IconSun size={16} />
              <Text size="sm">Light</Text>
            </Group>
          ),
        },
        {
          value: "dark",
          label: (
            <Group gap={4}>
              <IconMoon size={16} />
              <Text size="sm">Dark</Text>
            </Group>
          ),
        },
        {
          value: "auto",
          label: (
            <Group gap={4}>
              <IconDeviceDesktop size={16} />
              <Text size="sm">Auto</Text>
            </Group>
          ),
        },
      ]}
    />
  );

  return (
    <header style={headerStyle}>
      <Container size="xl">
        <Group justify="space-between">
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Text fw={700} size="xl" c="blue">
              Zyntax
            </Text>
          </Link>

          {/* Desktop navigation */}
          <Group gap="sm" visibleFrom="sm">
            {navItems}
          </Group>

          {/* Theme toggle and Authentication controls */}
          <Group gap="md" visibleFrom="sm">
            {themeSegmentControl}

            {status === "authenticated" ? (
              <Menu position="bottom-end" withArrow>
                <Menu.Target>
                  <UnstyledButton>
                    <Text fw={500}>{session.user?.email}</Text>
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item onClick={handleSignOut}>Sign out</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Button onClick={() => router.push("/login")}>Sign in</Button>
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
      >
        <Stack>
          {navItems}

          <div style={{ margin: "20px 0" }}>{themeSegmentControl}</div>

          {status === "authenticated" ? (
            <>
              <Text fw={500}>{session.user?.email}</Text>
              <Button onClick={handleSignOut} variant="subtle">
                Sign out
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                close();
                router.push("/login");
              }}
            >
              Sign in
            </Button>
          )}
        </Stack>
      </Drawer>
    </header>
  );
}
