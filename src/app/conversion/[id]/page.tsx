"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container,
  Title,
  Grid,
  Skeleton,
  Button,
  Group,
  Text,
  Badge,
} from "@mantine/core";
import { Conversion } from "@/types";
import { JsonInput } from "@/components/converter/JsonInput";
import { TypeScriptOutput } from "@/components/converter/TypeScriptOutput";
import { ConversionOptions } from "@/components/converter/ConversionOptions";

export default function ConversionPage() {
  const params = useParams();
  const router = useRouter();
  const [conversion, setConversion] = useState<Conversion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchConversion(params.id as string);
    }
  }, [params.id]);

  const fetchConversion = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/conversions/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch conversion");
      }

      if (data.success && data.data) {
        setConversion(data.data);
      } else {
        setError("Conversion not found");
      }
    } catch (err) {
      setError((err as Error).message || "An error occurred");
      console.error("Error fetching conversion:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Container size="xl" py="xl">
        <Skeleton height={50} mb="xl" />
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Skeleton height={400} mb="xl" />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Skeleton height={400} mb="xl" />
          </Grid.Col>
        </Grid>
        <Skeleton height={200} />
      </Container>
    );
  }

  if (error || !conversion) {
    return (
      <Container size="md" py="xl">
        <Title order={2} mb="lg">
          Error
        </Title>
        <Text mb="lg">{error || "Conversion not found"}</Text>
        <Button onClick={() => router.push("/dashboard")}>
          Return to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="xl">
        <div>
          <Title>{conversion.title || "Untitled Conversion"}</Title>
          <Text c="dimmed">
            Created {new Date(conversion.createdAt).toLocaleDateString()}
          </Text>
        </div>
        <Group>
          <Badge size="lg">{conversion.language}</Badge>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </Group>
      </Group>

      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <JsonInput
            onSubmit={() => {}}
            initialValue={conversion.inputJson}
            readOnly
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TypeScriptOutput code={conversion.outputCode} />
        </Grid.Col>
      </Grid>
    </Container>
  );
}
