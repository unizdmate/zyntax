"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Container,
  Title,
  Text,
  Card,
  Group,
  Stack,
  Badge,
  Button,
  Grid,
  Skeleton,
} from "@mantine/core";
import { Conversion } from "@/types";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect if not authenticated
    if (status === "unauthenticated") {
      router.push("/login");
    }

    // Fetch user's conversion history
    if (status === "authenticated") {
      fetchConversions();
    }
  }, [status, router]);

  const fetchConversions = async () => {
    try {
      const response = await fetch("/api/conversions");
      const data = await response.json();

      if (data.success && data.data) {
        setConversions(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch conversions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <Container size="lg" py="xl">
        <Title mb="xl">Your Conversions</Title>
        <Grid>
          {[1, 2, 3].map((i) => (
            <Grid.Col key={i} span={{ base: 12, sm: 6, md: 4 }}>
              <Skeleton height={160} radius="md" mb="md" />
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Title mb="md">Your Conversions</Title>
      {conversions.length === 0 ? (
        <Card withBorder p="xl" radius="md">
          <Stack align="center" gap="md">
            <Text ta="center" fw={500} size="lg">
              You haven't created any conversions yet
            </Text>
            <Text c="dimmed" ta="center">
              Try converting some JSON to TypeScript to get started!
            </Text>
            <Button onClick={() => router.push("/")}>
              Create your first conversion
            </Button>
          </Stack>
        </Card>
      ) : (
        <Grid>
          {conversions.map((conversion) => (
            <Grid.Col key={conversion.id} span={{ base: 12, sm: 6, md: 4 }}>
              <Card withBorder radius="md" padding="md">
                <Stack>
                  <Group justify="space-between">
                    <Text lineClamp={1} fw={500}>
                      {conversion.title || "Untitled Conversion"}
                    </Text>
                    <Badge>{conversion.language}</Badge>
                  </Group>
                  <Text size="sm" c="dimmed">
                    Created{" "}
                    {new Date(conversion.createdAt).toLocaleDateString()}
                  </Text>
                  <Button
                    variant="light"
                    fullWidth
                    onClick={() => router.push(`/conversion/${conversion.id}`)}
                  >
                    View Conversion
                  </Button>
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      )}
    </Container>
  );
}
