"use client";

import { Box, Container, Paper, Text, Title } from "@mantine/core";
import Image from "next/image";

export default function VerifyRequestPage() {
  return (
    <Container size="xs" py="xl">
      <Paper radius="md" p="xl" withBorder>
        <Box ta="center">
          <Title order={2} mb="md">
            Check your email
          </Title>

          <Box mb="lg">
            <Image
              src="/mail.svg"
              alt="Email verification"
              width={80}
              height={80}
              style={{ margin: "0 auto" }}
            />
          </Box>

          <Text mb="md">
            We sent you a login link. Please check your email inbox and click
            the link to sign in.
          </Text>

          <Text size="sm" c="dimmed">
            If you don&apos;t see the email, check your spam folder.
          </Text>
        </Box>
      </Paper>
    </Container>
  );
}
