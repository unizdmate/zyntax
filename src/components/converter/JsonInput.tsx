"use client";

import { useState } from "react";
import { Box, Button, Group, Text, Title } from "@mantine/core";
import Editor from "@monaco-editor/react";
import { useColorScheme } from "@/app/providers";
import { stripJsonComments, validateJson } from "@/lib/converter/jsonUtils";

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
    const newContent = value || "";
    setJsonContent(newContent);
    
    // Clear previous error
    setError(null);
    
    // Only validate when there's actual content
    if (newContent.trim().length > 0) {
      try {
        // Try to strip comments - this won't throw even if JSON is invalid
        stripJsonComments(newContent);
      } catch (err) {
        setError(`Error processing JSON: ${(err as Error).message}`);
      }
    }
  };

  // Handle pasting into the editor
  const handleEditorDidMount = (editor: any) => {
    editor.onDidPaste(() => {
      const content = editor.getValue();
      try {
        // When content is pasted, strip comments immediately
        const strippedContent = stripJsonComments(content);
        
        // Only update the editor content if it actually changed
        if (strippedContent !== content) {
          editor.setValue(strippedContent);
        }
      } catch (err) {
        // Don't set error here as the handleEditorChange will be triggered with the new value
      }
    });
  };

  const validateAndSubmit = () => {
    const result = validateJson(jsonContent);
    
    if (result.isValid) {
      setError(null);
      // If the JSON had comments, use the cleaned version for the conversion
      const cleanedJson = stripJsonComments(jsonContent);
      onSubmit(cleanedJson);
    } else {
      setError(`Invalid JSON: ${result.error}`);
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
          onMount={handleEditorDidMount}
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
