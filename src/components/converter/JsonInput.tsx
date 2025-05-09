"use client";

import { useState } from "react";
import { Box, Button, Group, Text, Title } from "@mantine/core";
import Editor from "@monaco-editor/react";
import { useColorScheme } from "@/app/providers";

interface JsonInputProps {
  onSubmit: (jsonContent: string) => void;
  isLoading?: boolean;
  readOnly?: boolean;
  initialValue?: string;
}

export function JsonInput({
  onSubmit,
  isLoading = false,
  readOnly = false,
  initialValue,
}: JsonInputProps) {
  const defaultValue =
    '{\n  "name": "Example",\n  "description": "An example JSON object",\n  "properties": {\n    "id": 1,\n    "isActive": true,\n    "tags": ["typescript", "converter"]\n  }\n}';

  const [jsonContent, setJsonContent] = useState<string>(
    initialValue || defaultValue
  );
  const [error, setError] = useState<string | null>(null);
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

  const handleEditorChange = (value: string | undefined) => {
    setJsonContent(value || "");
    setError(null);
  };

  const validateAndSubmit = () => {
    try {
      JSON.parse(jsonContent);
      setError(null);
      onSubmit(jsonContent);
    } catch (err) {
      setError(`Invalid JSON: ${(err as Error).message}`);
    }
  };

  return (
    <Box>
      <Title order={3} mb="sm">
        JSON Input
      </Title>
      <Box
        style={{ border: `1px solid ${borderColor}`, borderRadius: "4px" }}
        mb="sm"
      >
        <Editor
          height="400px"
          defaultLanguage="json"
          value={jsonContent}
          onChange={handleEditorChange}
          theme={editorTheme}
          options={{
            minimap: { enabled: false },
            formatOnPaste: true,
            formatOnType: true,
            readOnly,
          }}
        />
      </Box>
      {error && (
        <Text color="red" size="sm" mb="sm">
          {error}
        </Text>
      )}
      {!readOnly && (
        <Group justify="flex-end">
          <Button
            variant="filled"
            onClick={validateAndSubmit}
            loading={isLoading}
          >
            Convert
          </Button>
        </Group>
      )}
    </Box>
  );
}
