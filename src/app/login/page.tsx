"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  Paper,
  Text,
  TextInput,
  Title,
} from "@mantine/core";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn("email", {
        email,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        setError("Failed to send login email. Please try again.");
      } else {
        // Redirect to verification page
        router.push("/login/verify");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container size="xs" py="xl">
      <Paper radius="md" p="xl" withBorder>
        <Title order={2} ta="center" mt="md" mb="md">
          Welcome to Zyntax
        </Title>
        <Text ta="center" size="sm" mb="xl" c="dimmed">
          Enter your email to sign in or create an account
        </Text>

        <form onSubmit={handleSubmit}>
          <TextInput
            label="Email address"
            placeholder="your@email.com"
            size="md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            mb="md"
            required
          />

          <Button fullWidth mt="xl" size="md" type="submit" loading={isLoading}>
            {isLoading ? "Sending link..." : "Send magic link"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
