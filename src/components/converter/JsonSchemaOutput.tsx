"use client";

import { Box, Button, Group, Title, Tooltip, Text, Alert } from "@mantine/core";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import { useColorScheme } from "@/app/providers";
import { IconAlertCircle } from "@tabler/icons-react";

interface JsonSchemaOutputProps {
  code: string;
  isLoading?: boolean;
  error?: string | null;
  warnings?: string[] | null;
}

export function JsonSchemaOutput({
  code,
  isLoading = false,
  error = null,
  warnings = null,
}: JsonSchemaOutputProps) {
  const [isCopied, setIsCopied] = useState(false);
  const { colorScheme } = useColorScheme();

  // Determine the appropriate Monaco editor theme
  const editorTheme =
    colorScheme === "dark" ||
    (colorScheme === "auto" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
      ? "vs-dark"
      : "light";

  // Determine border color based on theme
  const borderColor =
    colorScheme === "dark" ||
    (colorScheme === "auto" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
      ? "#2C2E33"
      : "#ced4da";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <Box>
      <Group justify="space-between" mb="sm">
        <Title order={3}>JSON Schema Output</Title>
        <Tooltip
          label={isCopied ? "Copied!" : "Copy to clipboard"}
          withArrow
          position="top"
        >
          <Button
            variant="outline"
            onClick={handleCopy}
            disabled={isLoading || !code}
          >
            {isCopied ? "Copied!" : "Copy"}
          </Button>
        </Tooltip>
      </Group>

      {error && (
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Error"
          color="red"
          variant="outline"
          mb="md"
        >
          {error}
        </Alert>
      )}

      {warnings && warnings.length > 0 && (
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Warnings"
          color="yellow"
          variant="outline"
          mb="md"
        >
          {warnings.map((warning, index) => (
            <Text size="sm" key={index}>
              {warning}
            </Text>
          ))}
        </Alert>
      )}

      <Box style={{ border: `1px solid ${borderColor}`, borderRadius: "4px" }}>
        <Editor
          height="400px"
          defaultLanguage="json"
          value={code}
          theme={editorTheme}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            lineNumbers: "on",
            scrollBeyondLastLine: false,
          }}
          loading={isLoading ? "Generating JSON Schema..." : undefined}
        />
      </Box>
    </Box>
  );
}
