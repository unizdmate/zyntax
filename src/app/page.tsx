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
import { useCreateConversion } from "@/data/use-conversions";
import {
  ConversionOptions as ConversionOptionsType,
  OutputLanguage,
  ExportStrategy,
} from "@/types";
import { IconAlertCircle } from "@tabler/icons-react";

export default function Home() {
  const router = useRouter();
  const { status } = useSession();
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<ConversionOptionsType>({
    interfaceName: "RootObject",
    useType: false,
    useInterfaces: true,
    useSemicolons: true,
    exportStrategy: ExportStrategy.ALL,
    indentationSpaces: 2,
  });

  // Use React Query hook for creating conversions
  const createConversionMutation = useCreateConversion();

  const handleJsonSubmit = async (jsonContent: string) => {
    setError(null);

    try {
      const result = await createConversionMutation.mutateAsync({
        inputJson: jsonContent,
        options,
        language: OutputLanguage.TYPESCRIPT,
      });

      // Update the output with the converted code
      setOutput(result.outputCode);

      // If user is logged in and conversion was saved, redirect to the conversion page
      if (status === "authenticated" && result.id) {
        router.push(`/conversion/${result.id}`);
      }
    } catch (err) {
      setError((err as Error).message || "An error occurred");
      console.error("Conversion error:", err);
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
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            color="red"
            title="Error"
            mb="md"
          >
            {error}
          </Alert>
        )}

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

        <Divider my="md" />

        <Box>
          <ConversionOptions options={options} onChange={handleOptionsChange} />
        </Box>
      </Stack>
    </Container>
  );
}
