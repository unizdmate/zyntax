"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Container,
  Grid,
  Title,
  Text,
  Box,
  Stack,
  Divider,
  Alert,
  Button,
  List,
  ThemeIcon,
  Image,
  rem,
  Group,
  Paper,
  Card,
  useMantineTheme,
  Badge,
  SimpleGrid,
  Flex,
  Tabs,
} from "@mantine/core";
import { JsonInput } from "@/components/converter/JsonInput";
import { TypeScriptOutput } from "@/components/converter/TypeScriptOutput";
import { TypeScriptInput } from "@/components/converter/TypeScriptInput";
import { ConversionOptions } from "@/components/converter/ConversionOptions";
import { useCreateConversion } from "@/data/use-conversions";
import {
  ConversionOptions as ConversionOptionsType,
  OutputLanguage,
  ExportStrategy,
} from "@/types";
import {
  IconAlertCircle,
  IconCheck,
  IconArrowRight,
  IconBrandTypescript,
  IconDatabase,
  IconFileCode,
  IconHourglassHigh,
  IconSettings,
  IconUsers,
  IconJson,
  IconBrackets,
} from "@tabler/icons-react";
import { useColorScheme } from "@/app/providers";

export default function Home() {
  const router = useRouter();
  const { status } = useSession();
  const theme = useMantineTheme();
  const { colorScheme } = useColorScheme();
  const [activeTab, setActiveTab] = useState<string>("jsonToTs");

  // JSON to TypeScript state
  const [jsonToTsOutput, setJsonToTsOutput] = useState<string>("");
  const [jsonToTsError, setJsonToTsError] = useState<string | null>(null);
  const [jsonToTsSuccessMessage, setJsonToTsSuccessMessage] = useState<
    string | null
  >(null);
  const [jsonToTsTitle, setJsonToTsTitle] = useState<string>(
    "Untitled JSON to TS Conversion"
  );
  const [jsonToTsOptions, setJsonToTsOptions] = useState<ConversionOptionsType>(
    {
      interfaceName: "RootObject",
      useType: false,
      useInterfaces: true,
      useSemicolons: true,
      exportStrategy: ExportStrategy.ALL,
      indentationSpaces: 2,
    }
  );

  // Check if using dark mode
  const isDarkMode =
    colorScheme === "dark" ||
    (typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  // Use React Query hooks for creating conversions
  const createJsonToTsConversion = useCreateConversion();

  const handleJsonSubmit = async (jsonContent: string) => {
    setJsonToTsError(null);
    setJsonToTsSuccessMessage(null);

    try {
      const result = await createJsonToTsConversion.mutateAsync({
        inputJson: jsonContent,
        options: jsonToTsOptions,
        language: OutputLanguage.TYPESCRIPT,
        title: jsonToTsTitle,
      });

      // Update the output with the converted code
      setJsonToTsOutput(result.outputCode);

      // Show success message instead of redirecting
      if (status === "authenticated" && result.id) {
        setJsonToTsSuccessMessage(
          `Conversion "${jsonToTsTitle}" saved successfully!`
        );
      }
    } catch (err) {
      setJsonToTsError((err as Error).message || "An error occurred");
      console.error("JSON to TS conversion error:", err);
    }
  };

  const handleJsonToTsOptionsChange = (newOptions: ConversionOptionsType) => {
    setJsonToTsOptions(newOptions);
  };

  // Handler for tab change that ensures we never get null as a value
  const handleTabChange = (value: string | null) => {
    if (value) {
      setActiveTab(value);
    }
  };

  // Features section data
  const features = [
    {
      icon: IconBrandTypescript,
      title: "TypeScript First",
      description:
        "Generate accurate TypeScript interfaces and types with advanced options for customization.",
    },
    {
      icon: IconBrackets,
      title: "Flexible Output",
      description:
        "Customize your TypeScript output with various formatting options and styles.",
    },
    {
      icon: IconHourglassHigh,
      title: "Save Time",
      description:
        "Convert complex structures in seconds, eliminating tedious manual work.",
    },
    {
      icon: IconFileCode,
      title: "Code Quality",
      description:
        "Improve code quality with properly typed data structures and reduce errors.",
    },
    {
      icon: IconSettings,
      title: "Flexible Options",
      description:
        "Customize your output with powerful options tailored for each conversion type.",
    },
    {
      icon: IconUsers,
      title: "User Accounts",
      description:
        "Create an account to save your conversions and access them anytime, anywhere.",
    },
  ];

  const pricingPlans = [
    {
      title: "Free",
      price: "$0",
      description: "Perfect for occasional use and individual developers",
      features: [
        "Basic JSON to TypeScript conversion",
        "Limited conversions per month",
        "Basic customization options",
        "Public conversions only",
      ],
      cta: "Get Started",
      ctaLink: "/login",
      highlighted: false,
    },
    {
      title: "Pro",
      price: "$9",
      period: "/month",
      description: "Enhanced features for professional developers",
      features: [
        "Unlimited conversions",
        "Advanced customization options",
        "Private conversions",
        "Conversion history",
        "Team sharing",
        "API access",
      ],
      cta: "Upgrade to Pro",
      ctaLink: "/pricing",
      highlighted: true,
    },
    {
      title: "Enterprise",
      price: "Custom",
      description: "For organizations with specific needs",
      features: [
        "All Pro features",
        "Team management",
        "Custom branding",
        "Priority support",
        "Dedicated server options",
        "Custom integrations",
      ],
      cta: "Contact Sales",
      ctaLink: "/contact",
      highlighted: false,
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <Box
        py={{ base: 60, sm: 80 }}
        style={{
          background: isDarkMode
            ? `linear-gradient(45deg, ${theme.colors.dark[7]} 0%, rgba(0, 51, 102, 0.8) 100%)`
            : `linear-gradient(45deg, ${theme.colors.blue[0]} 0%, ${theme.colors.cyan[1]} 100%)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container size="xl">
          <Grid gutter={50} align="center">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="md">
                <Title
                  order={1}
                  size={rem(48)}
                  lh={1.1}
                  fw={800}
                  style={{
                    background:
                      "linear-gradient(45deg, #1c7ed6 0%, #0dcaf0 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Powerful Code Conversion Tools for Developers
                </Title>

                <Text size="lg" mt="md">
                  Zyntax transforms your code between different formats with
                  perfect accuracy. Convert JSON to TypeScript or TypeScript to
                  JSON Schema in seconds. Save time, improve code quality, and
                  eliminate errors in your projects.
                </Text>

                <List
                  spacing="sm"
                  mt="md"
                  icon={
                    <ThemeIcon size={24} radius="xl" color="blue">
                      <IconCheck style={{ width: rem(16), height: rem(16) }} />
                    </ThemeIcon>
                  }
                >
                  {" "}
                  <List.Item>
                    <Text fw={500}>Accurate TypeScript types from JSON</Text>
                  </List.Item>
                  <List.Item>
                    <Text fw={500}>Customizable output formats</Text>
                  </List.Item>
                  <List.Item>
                    <Text fw={500}>Save and share your conversions</Text>
                  </List.Item>
                </List>

                <Group mt="xl">
                  <Button
                    component="a"
                    href="#try-converter"
                    size="lg"
                    variant="gradient"
                    gradient={{ from: "blue", to: "cyan" }}
                    rightSection={<IconArrowRight size={18} />}
                  >
                    Try It Now
                  </Button>

                  <Button component="a" href="/login" variant="light" size="lg">
                    Create Free Account
                  </Button>
                </Group>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Paper withBorder shadow="md" p="md" radius="md">
                {/* Preview image or code sample */}
                <Box
                  style={{
                    fontFamily: "monospace",
                    borderRadius: theme.radius.sm,
                    backgroundColor: isDarkMode
                      ? theme.colors.dark[9]
                      : theme.colors.gray[0],
                    padding: theme.spacing.xs,
                    color: isDarkMode
                      ? theme.colors.blue[2]
                      : theme.colors.blue[8],
                    border: `1px solid ${
                      isDarkMode ? theme.colors.dark[5] : theme.colors.gray[3]
                    }`,
                  }}
                >
                  <Tabs defaultValue="ts" mb="xs">
                    <Tabs.List>
                      <Tabs.Tab
                        value="ts"
                        leftSection={<IconBrandTypescript size={12} />}
                      >
                        TypeScript
                      </Tabs.Tab>
                      <Tabs.Tab
                        value="schema"
                        leftSection={<IconBrackets size={12} />}
                      >
                        JSON Schema
                      </Tabs.Tab>
                    </Tabs.List>
                    <Tabs.Panel value="ts">
                      <pre style={{ margin: 0, overflow: "auto" }}>
                        {`// Generated with Zyntax
export interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  roles: string[];
  metadata: {
    lastLogin: string;
    preferences: {
      theme: "light" | "dark";
      notifications: boolean;
    };
  };
}`}
                      </pre>
                    </Tabs.Panel>
                    <Tabs.Panel value="schema">
                      <pre style={{ margin: 0, overflow: "auto" }}>
                        {`{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "id": { "type": "number" },
    "name": { "type": "string" },
    "email": { "type": "string" },
    "isActive": { "type": "boolean" },
    "roles": {
      "type": "array",
      "items": { "type": "string" }
    }
  },
  "required": ["id", "name", "email", "isActive", "roles"]
}`}
                      </pre>
                    </Tabs.Panel>
                  </Tabs>
                </Box>
              </Paper>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container size="xl" py={80}>
        <Box ta="center" mb={50}>
          <Badge variant="light" color="blue" size="lg" mb="xs">
            Features
          </Badge>
          <Title order={2} size={36} mb="md">
            Why Choose Zyntax?
          </Title>
          <Text size="lg" maw={600} mx="auto" c="dimmed">
            Zyntax helps developers convert code between formats quickly and
            accurately, with powerful customization options and a seamless user
            experience.
          </Text>
        </Box>

        <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} spacing={40} mt={50}>
          {features.map((feature) => (
            <Card key={feature.title} padding="xl" radius="md" withBorder>
              <ThemeIcon size={50} radius="md" variant="light" color="blue">
                <feature.icon size={26} stroke={1.5} />
              </ThemeIcon>
              <Text fw={700} size="lg" mt="md">
                {feature.title}
              </Text>
              <Text size="sm" c="dimmed" mt="xs">
                {feature.description}
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      </Container>

      {/* Converter Section - With Tabs */}
      <Box
        py={60}
        id="try-converter"
        style={{
          backgroundColor: isDarkMode
            ? theme.colors.dark[8]
            : theme.colors.gray[0],
        }}
      >
        <Container size="xl">
          <Title order={2} size={36} ta="center" mb="md">
            Try Our Converters
          </Title>
          <Text size="lg" c="dimmed" ta="center" mb="xl" maw={700} mx="auto">
            {" "}
            Convert your JSON to TypeScript with our powerful converter
          </Text>{" "}
          <Tabs value={activeTab} onChange={handleTabChange} mb="xl">
            <Tabs.List justify="center">
              <Tabs.Tab
                value="jsonToTs"
                leftSection={<IconJson size={16} />}
                rightSection={<IconBrandTypescript size={16} />}
              >
                JSON to TypeScript
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>
          {/* JSON to TypeScript Converter */}
          {activeTab === "jsonToTs" && (
            <Stack gap="xl">
              {/* Options Panel */}
              <Paper p="md" withBorder radius="md">
                <Title order={4} mb="md">
                  Customize JSON to TS Options
                </Title>
                <ConversionOptions
                  options={jsonToTsOptions}
                  onChange={handleJsonToTsOptionsChange}
                  conversionTitle={jsonToTsTitle}
                  onTitleChange={setJsonToTsTitle}
                  isAuthenticated={status === "authenticated"}
                />
              </Paper>

              {/* Editors */}
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <JsonInput
                    onSubmit={handleJsonSubmit}
                    isLoading={createJsonToTsConversion.isPending}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TypeScriptOutput
                    code={jsonToTsOutput}
                    isLoading={createJsonToTsConversion.isPending}
                  />
                </Grid.Col>
              </Grid>

              {jsonToTsError && (
                <Alert
                  icon={<IconAlertCircle size="1rem" />}
                  color="red"
                  title="Error"
                  mt="md"
                >
                  {jsonToTsError}
                </Alert>
              )}

              {jsonToTsSuccessMessage && (
                <Alert
                  icon={<IconCheck size="1rem" />}
                  color="green"
                  title="Success"
                  mt="md"
                >
                  <Group align="center" gap="xs">
                    <Text>{jsonToTsSuccessMessage}</Text>
                    {status === "authenticated" && (
                      <Button
                        variant="light"
                        size="xs"
                        onClick={() => router.push("/dashboard")}
                      >
                        View in Dashboard
                      </Button>
                    )}
                  </Group>
                </Alert>
              )}
            </Stack>
          )}
        </Container>
      </Box>

      {/* Pricing Section */}
      <Container size="xl" py={80}>
        <Box ta="center" mb={50}>
          <Badge variant="light" color="blue" size="lg" mb="xs">
            Pricing
          </Badge>
          <Title order={2} size={36} mb="md">
            Choose the Right Plan
          </Title>
          <Text size="lg" maw={600} mx="auto" c="dimmed">
            From developers working solo to enterprise teams, we have a plan
            that fits your needs
          </Text>
        </Box>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.title}
              withBorder
              padding="xl"
              radius="md"
              style={(theme) => ({
                borderColor: plan.highlighted
                  ? theme.colors.blue[5]
                  : undefined,
                transform: plan.highlighted ? "translateY(-10px)" : undefined,
                boxShadow: plan.highlighted ? theme.shadows.md : undefined,
                transition: "transform 200ms ease, box-shadow 200ms ease",
                position: "relative",
              })}
            >
              {plan.highlighted && (
                <Badge
                  color="blue"
                  variant="filled"
                  style={{
                    position: "absolute",
                    top: -10,
                    right: 20,
                  }}
                >
                  Popular
                </Badge>
              )}

              <Text fw={700} size="xl">
                {plan.title}
              </Text>

              <Group align="baseline" mt="md">
                <Text size="42px" fw={900}>
                  {plan.price}
                </Text>
                {plan.period && (
                  <Text c="dimmed" size="sm">
                    {plan.period}
                  </Text>
                )}
              </Group>

              <Text c="dimmed" size="sm" mt="md">
                {plan.description}
              </Text>

              <List
                mt="md"
                spacing="sm"
                size="sm"
                icon={
                  <ThemeIcon color="blue" size={20} radius="xl">
                    <IconCheck size={rem(12)} />
                  </ThemeIcon>
                }
              >
                {plan.features.map((feature) => (
                  <List.Item key={feature}>{feature}</List.Item>
                ))}
              </List>

              <Button
                fullWidth
                variant={plan.highlighted ? "gradient" : "outline"}
                gradient={
                  plan.highlighted
                    ? { from: "blue", to: "cyan", deg: 45 }
                    : undefined
                }
                color="blue"
                mt="xl"
                component="a"
                href={plan.ctaLink}
              >
                {plan.cta}
              </Button>
            </Card>
          ))}
        </SimpleGrid>
      </Container>

      {/* CTA Section */}
      <Box
        py={60}
        style={{
          backgroundColor: isDarkMode
            ? theme.colors.dark[8]
              ? theme.colors.dark[9]
              : "#1A1B1E"
            : theme.colors.blue[0]
              ? "#e7f5ff" // Hardcoded light blue color instead of using theme.fn
              : "#e7f5ff",
          position: "relative",
        }}
      >
        <Container size="md">
          <Stack gap="lg" ta="center">
            <Title order={2}>
              Ready to Streamline Your Development Workflow?
            </Title>{" "}
            <Text size="lg" maw={700} mx="auto">
              Join thousands of developers who use Zyntax for code conversion
              with perfect accuracy. Convert JSON to TypeScript effortlessly.
              Create a free account today to get started.
            </Text>
            <Group justify="center" mt="xl">
              <Button
                component="a"
                href="/register"
                size="xl"
                variant="gradient"
                gradient={{ from: "blue", to: "cyan" }}
              >
                Start For Free
              </Button>

              <Button component="a" href="/converter" variant="light" size="xl">
                All Converters
              </Button>
            </Group>
          </Stack>
        </Container>
      </Box>
    </>
  );
}
