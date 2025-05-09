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
} from "@mantine/core";
import { JsonInput } from "@/components/converter/JsonInput";
import { TypeScriptOutput } from "@/components/converter/TypeScriptOutput";
import { ConversionOptions } from "@/components/converter/ConversionOptions";
import {
  ConversionOptions as ConversionOptionsType,
  OutputLanguage,
  ExportStrategy,
} from "@/types";

export default function Home() {
  const router = useRouter();
  const { status } = useSession();
  const [output, setOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<ConversionOptionsType>({
    interfaceName: "RootObject",
    useType: false,
    useInterfaces: true,
    useSemicolons: true,
    exportStrategy: ExportStrategy.ALL,
    indentationSpaces: 2,
  });

  const handleJsonSubmit = async (jsonContent: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputJson: jsonContent,
          language: OutputLanguage.TYPESCRIPT,
          options,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to convert JSON");
      }

      if (data.success && data.data?.outputCode) {
        setOutput(data.data.outputCode);

        // If user is logged in and conversion was saved, redirect to the conversion page
        if (status === "authenticated" && data.data.id) {
          router.push(`/conversion/${data.data.id}`);
        }
      } else {
        setError(
          "Failed to convert JSON. Please check your input and try again."
        );
      }
    } catch (err) {
      setError((err as Error).message || "An error occurred");
      console.error("Conversion error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionsChange = (newOptions: ConversionOptionsType) => {
    setOptions(newOptions);
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <Box ta="center" mb="xl">
          <Title>Zyntax</Title>
          <Text c="dimmed" size="lg">
            Convert JSON to TypeScript with ease
          </Text>
        </Box>

        {error && (
          <Alert color="red" title="Error" mb="md">
            {error}
          </Alert>
        )}

        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <JsonInput onSubmit={handleJsonSubmit} isLoading={isLoading} />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <TypeScriptOutput code={output} isLoading={isLoading} />
          </Grid.Col>
        </Grid>

        <Divider my="md" />

        <Box>
          <ConversionOptions options={options} onChange={handleOptionsChange} />
        </Box>
      </Stack>
    </Container>
  );
}
