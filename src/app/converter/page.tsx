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
} from "@mantine/core";
import { JsonInput } from "@/components/converter/JsonInput";
import { TypeScriptOutput } from "@/components/converter/TypeScriptOutput";
import { ConversionOptions } from "@/components/converter/ConversionOptions";
import { useCreateConversion } from "@/data/use-conversions";
import {
  ConversionOptions as ConversionOptionsType,
  OutputLanguage,
  ExportStrategy,
} from "@/types";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";

export default function ConverterPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [conversionTitle, setConversionTitle] = useState<string>(
    "Untitled Conversion"
  );
  const [options, setOptions] = useState<ConversionOptionsType>({
    interfaceName: "RootObject",
    useType: false,
    useInterfaces: true,
    useSemicolons: true,
    exportStrategy: ExportStrategy.ALL,
    indentationSpaces: 2,
    extractNestedTypes: false,
  });

  // Redirect to login page if not authenticated
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  // Use React Query hook for creating conversions
  const createConversionMutation = useCreateConversion();

  const handleJsonSubmit = async (jsonContent: string) => {
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await createConversionMutation.mutateAsync({
        inputJson: jsonContent,
        options,
        language: OutputLanguage.TYPESCRIPT,
        title: conversionTitle,
      });

      // Update the output with the converted code
      setOutput(result.outputCode);

      // Show success message
      if (result.id) {
        setSuccessMessage(
          `Conversion "${conversionTitle}" saved successfully!`
        );
      }
    } catch (err) {
      setError((err as Error).message || "An error occurred");
      console.error("Conversion error:", err);
    }
  };

  const handleOptionsChange = (newOptions: ConversionOptionsType) => {
    setOptions(newOptions);
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
        JSON to TypeScript Converter
      </Title>

      <Grid>
        <Grid.Col span={{ base: 12, lg: 3 }}>
          <Paper p="md" withBorder>
            <ConversionOptions
              options={options}
              onChange={handleOptionsChange}
              conversionTitle={conversionTitle}
              onTitleChange={setConversionTitle}
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
                  isLoading={createConversionMutation.isPending}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <TypeScriptOutput
                  code={output}
                  isLoading={createConversionMutation.isPending}
                />
              </Grid.Col>
            </Grid>

            {error && (
              <Alert
                icon={<IconAlertCircle size="1rem" />}
                color="red"
                title="Error"
                mt="md"
              >
                {error}
              </Alert>
            )}

            {successMessage && (
              <Alert
                icon={<IconCheck size="1rem" />}
                color="green"
                title="Success"
                mt="md"
              >
                <Group align="center" gap="xs">
                  {successMessage}
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
    </Container>
  );
}
