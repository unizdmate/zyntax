"use client";

import { useState } from "react";
import { Box, Button, Group, Text, Title } from "@mantine/core";
import Editor from "@monaco-editor/react";
import { useColorScheme } from "@/app/providers";

interface TypeScriptInputProps {
  onSubmit: (tsContent: string) => void;
  isLoading?: boolean;
  readOnly?: boolean;
  initialValue?: string;
}

export function TypeScriptInput({
  onSubmit,
  isLoading = false,
  readOnly = false,
  initialValue,
}: TypeScriptInputProps) {
  const defaultValue =
    'interface User {\n  id: number;\n  name: string;\n  email: string;\n  isActive: boolean;\n  roles: string[];\n  metadata: {\n    lastLogin: string;\n    preferences: {\n      theme: "light" | "dark";\n      notifications: boolean;\n    };\n  };\n}';

  const [tsContent, setTsContent] = useState<string>(
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
    const newContent = value || "";
    setTsContent(newContent);
    // Clear previous error
    setError(null);
  };

  const validateAndSubmit = () => {
    if (tsContent.trim().length === 0) {
      setError("TypeScript content is required");
      return;
    }

    // Basic validation - check if it has at least one "interface" or "type" keyword
    if (!tsContent.includes("interface") && !tsContent.includes("type ")) {
      setError(
        "Input should contain at least one interface or type definition"
      );
      return;
    }

    setError(null);
    onSubmit(tsContent);
  };

  return (
    <Box>
      <Title order={3} mb="sm">
        TypeScript Input
      </Title>
      <Box
        style={{ border: `1px solid ${borderColor}`, borderRadius: "4px" }}
        mb="sm"
      >
        <Editor
          height="400px"
          defaultLanguage="typescript"
          value={tsContent}
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
