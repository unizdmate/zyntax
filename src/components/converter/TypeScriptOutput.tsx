"use client";

import { Box, Button, Group, Title, Tooltip } from "@mantine/core";
import Editor from "@monaco-editor/react";
import { useState } from "react";

interface TypeScriptOutputProps {
  code: string;
  isLoading?: boolean;
}

export function TypeScriptOutput({
  code,
  isLoading = false,
}: TypeScriptOutputProps) {
  const [isCopied, setIsCopied] = useState(false);

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
        <Title order={3}>TypeScript Output</Title>
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
      <Box style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
        <Editor
          height="400px"
          defaultLanguage="typescript"
          value={code}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            lineNumbers: "on",
            scrollBeyondLastLine: false,
          }}
          loading={isLoading ? "Generating TypeScript..." : undefined}
        />
      </Box>
    </Box>
  );
}
