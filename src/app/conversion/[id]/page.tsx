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
  TextInput,
  Modal,
  LoadingOverlay,
  Alert,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useSession } from "next-auth/react";
import { JsonInput } from "@/components/converter/JsonInput";
import { TypeScriptOutput } from "@/components/converter/TypeScriptOutput";
import {
  useConversion,
  useDeleteConversion,
  useUpdateConversion,
} from "@/data/use-conversions";
import { IconAlertCircle } from "@tabler/icons-react";

export default function ConversionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: session } = useSession();
  const [title, setTitle] = useState("");

  // React Query hooks
  const { data: conversion, isLoading, error } = useConversion(id);

  const updateMutation = useUpdateConversion();
  const deleteMutation = useDeleteConversion();

  // Modal states
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);

  // Check if current user owns the conversion
  const isOwner = session?.user?.id && conversion?.userId === session.user.id;

  // Set initial title when conversion data loads
  useEffect(() => {
    if (conversion) {
      setTitle(conversion.title || "Untitled Conversion");
    }
  }, [conversion]);

  const handleSaveTitle = async () => {
    updateMutation.mutate(
      { id, title },
      {
        onSuccess: () => {
          closeEditModal();
        },
      }
    );
  };

  const handleDeleteConversion = async () => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        router.push("/dashboard");
      },
    });
  };

  // Loading state
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
      </Container>
    );
  }

  // Error state
  if (error || !conversion) {
    return (
      <Container size="md" py="xl">
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Error"
          color="red"
          mb="lg"
        >
          {error instanceof Error ? error.message : "Conversion not found"}
        </Alert>
        <Button onClick={() => router.push("/dashboard")}>
          Return to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      {/* Edit Title Modal */}
      <Modal
        opened={editModalOpened}
        onClose={closeEditModal}
        title="Edit Conversion Title"
        centered
      >
        <LoadingOverlay visible={updateMutation.isPending} />
        <TextInput
          label="Title"
          placeholder="Enter a title for your conversion"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          mb="md"
        />
        <Group justify="flex-end">
          <Button variant="outline" onClick={closeEditModal}>
            Cancel
          </Button>
          <Button onClick={handleSaveTitle} disabled={updateMutation.isPending}>
            Save
          </Button>
        </Group>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title="Delete Conversion"
        centered
      >
        <LoadingOverlay visible={deleteMutation.isPending} />
        <Text mb="lg">
          Are you sure you want to delete this conversion? This action cannot be
          undone.
        </Text>
        <Group justify="flex-end">
          <Button variant="outline" onClick={closeDeleteModal}>
            Cancel
          </Button>
          <Button
            color="red"
            onClick={handleDeleteConversion}
            disabled={deleteMutation.isPending}
          >
            Delete
          </Button>
        </Group>
      </Modal>

      <Group justify="space-between" mb="xl">
        <div>
          <Title>{conversion.title || "Untitled Conversion"}</Title>
          <Text c="dimmed">
            Created {new Date(conversion.createdAt).toLocaleDateString()}
          </Text>
        </div>
        <Group>
          <Badge size="lg">{conversion.language}</Badge>

          {isOwner && (
            <>
              <Button variant="outline" onClick={openEditModal}>
                Edit Title
              </Button>
              <Button variant="outline" color="red" onClick={openDeleteModal}>
                Delete
              </Button>
            </>
          )}

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
