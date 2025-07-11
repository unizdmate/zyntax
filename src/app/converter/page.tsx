"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Container,
  Grid,
  Title,
  Alert,
  Button,
  Stack,
  Paper,
  Group,
  Tabs,
  Box,
} from "@mantine/core";
import { JsonInput } from "@/components/converter/JsonInput";
import { TypeScriptOutput } from "@/components/converter/TypeScriptOutput";
import { ConversionOptions } from "@/components/converter/ConversionOptions";
import { TypeScriptInput } from "@/components/converter/TypeScriptInput";
import { JsonSchemaOutput } from "@/components/converter/JsonSchemaOutput";
import { SchemaConversionOptions } from "@/components/converter/SchemaConversionOptions";
import {
  useCreateConversion,
  useCreateSchemaConversion,
} from "@/data/use-conversions";
import {
  ConversionOptions as ConversionOptionsType,
  OutputLanguage,
  ExportStrategy,
  SchemaConversionOptions as SchemaConversionOptionsType,
} from "@/types";
import {
  IconAlertCircle,
  IconCheck,
  IconBrandTypescript,
  IconJson,
} from "@tabler/icons-react";

export default function ConverterPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<string | null>("jsonToTs");

  const handleTabChange = (tab: string | null) => {
    setActiveTab(tab);
  };

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
      extractNestedTypes: false,
    }
  );

  // TypeScript to JSON Schema state
  const [tsToSchemaOutput, setTsToSchemaOutput] = useState<string>("");
  const [tsToSchemaError, setTsToSchemaError] = useState<string | null>(null);
  const [tsToSchemaSuccessMessage, setTsToSchemaSuccessMessage] = useState<
    string | null
  >(null);
  const [tsToSchemaTitle, setTsToSchemaTitle] = useState<string>(
    "Untitled TS to Schema Conversion"
  );
  const [tsToSchemaOptions, setTsToSchemaOptions] =
    useState<SchemaConversionOptionsType>({
      typeName: "RootType",
      useRefs: true,
      required: true,
      useTitleAsDescription: false,
      additionalProperties: false,
      indentationSpaces: 2,
      exportStrategy: ExportStrategy.ALL,
    });

  // Use React Query hooks for creating conversions
  const createJsonToTsConversion = useCreateConversion();
  const createTsToSchemaConversion = useCreateSchemaConversion();

  // Redirect to login page if not authenticated
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

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

      // Show success message
      if (result.id) {
        setJsonToTsSuccessMessage(
          `Conversion "${jsonToTsTitle}" saved successfully!`
        );
      }
    } catch (err) {
      setJsonToTsError((err as Error).message || "An error occurred");
      console.error("JSON to TS conversion error:", err);
    }
  };

  const handleTypeScriptSubmit = async (tsContent: string) => {
    setTsToSchemaError(null);
    setTsToSchemaSuccessMessage(null);

    try {
      const result = await createTsToSchemaConversion.mutateAsync({
        inputTypeScript: tsContent,
        options: tsToSchemaOptions,
        title: tsToSchemaTitle,
      });

      // Update the output with the converted code
      setTsToSchemaOutput(result.outputCode);

      // Show success message
      if (result.id) {
        setTsToSchemaSuccessMessage(
          `Conversion "${tsToSchemaTitle}" saved successfully!`
        );
      }
    } catch (err) {
      setTsToSchemaError((err as Error).message || "An error occurred");
      console.error("TS to Schema conversion error:", err);
    }
  };

  const handleJsonToTsOptionsChange = (newOptions: ConversionOptionsType) => {
    setJsonToTsOptions(newOptions);
  };

  const handleTsToSchemaOptionsChange = (
    newOptions: SchemaConversionOptionsType
  ) => {
    setTsToSchemaOptions(newOptions);
  };

  // Loading state
  if (status === "loading") {
    return (
      <Container size="xl" py="xl">
        <Title mb="xl">Loading...</Title>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">
        Code Converters
      </Title>

      <Tabs value={activeTab} onChange={handleTabChange} mb="xl">
        <Tabs.List>
          <Tabs.Tab value="jsonToTs" leftSection={<IconJson size={16} />}>
            JSON to TypeScript
          </Tabs.Tab>
          <Tabs.Tab
            value="tsToSchema"
            leftSection={<IconBrandTypescript size={16} />}
          >
            TypeScript to JSON Schema
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>

      {/* JSON to TypeScript Converter */}
      <Box style={{ display: activeTab === "jsonToTs" ? "block" : "none" }}>
        <Grid>
          <Grid.Col span={{ base: 12, lg: 3 }}>
            <Paper p="md" withBorder>
              <ConversionOptions
                options={jsonToTsOptions}
                onChange={handleJsonToTsOptionsChange}
                conversionTitle={jsonToTsTitle}
                onTitleChange={setJsonToTsTitle}
                isAuthenticated={true}
              />
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, lg: 9 }}>
            <Stack gap="md">
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
                    {jsonToTsSuccessMessage}
                    <Button
                      variant="light"
                      size="xs"
                      onClick={() => router.push("/dashboard")}
                    >
                      View in Dashboard
                    </Button>
                  </Group>
                </Alert>
              )}
            </Stack>
          </Grid.Col>
        </Grid>
      </Box>

      {/* TypeScript to JSON Schema Converter */}
      <Box style={{ display: activeTab === "tsToSchema" ? "block" : "none" }}>
        <Grid>
          <Grid.Col span={{ base: 12, lg: 3 }}>
            <Paper p="md" withBorder>
              <SchemaConversionOptions
                options={tsToSchemaOptions}
                onChange={handleTsToSchemaOptionsChange}
                conversionTitle={tsToSchemaTitle}
                onTitleChange={setTsToSchemaTitle}
                isAuthenticated={true}
              />
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, lg: 9 }}>
            <Stack gap="md">
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TypeScriptInput
                    onSubmit={handleTypeScriptSubmit}
                    isLoading={createTsToSchemaConversion.isPending}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <JsonSchemaOutput
                    code={tsToSchemaOutput}
                    isLoading={createTsToSchemaConversion.isPending}
                  />
                </Grid.Col>
              </Grid>

              {tsToSchemaError && (
                <Alert
                  icon={<IconAlertCircle size="1rem" />}
                  color="red"
                  title="Error"
                  mt="md"
                >
                  {tsToSchemaError}
                </Alert>
              )}

              {tsToSchemaSuccessMessage && (
                <Alert
                  icon={<IconCheck size="1rem" />}
                  color="green"
                  title="Success"
                  mt="md"
                >
                  <Group align="center" gap="xs">
                    {tsToSchemaSuccessMessage}
                    <Button
                      variant="light"
                      size="xs"
                      onClick={() => router.push("/dashboard")}
                    >
                      View in Dashboard
                    </Button>
                  </Group>
                </Alert>
              )}
            </Stack>
          </Grid.Col>
        </Grid>
      </Box>
    </Container>
  );
}
