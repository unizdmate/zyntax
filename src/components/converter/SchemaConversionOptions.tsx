"use client";

import {
  Box,
  Checkbox,
  Group,
  NumberInput,
  Radio,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  SchemaConversionOptions as SchemaConversionOptionsType,
  ExportStrategy,
} from "@/types";
import { useState } from "react";

interface SchemaConversionOptionsProps {
  options: SchemaConversionOptionsType;
  onChange: (options: SchemaConversionOptionsType) => void;
  conversionTitle?: string;
  onTitleChange?: (title: string) => void;
  isAuthenticated?: boolean;
}

export function SchemaConversionOptions({
  options,
  onChange,
  conversionTitle = "Untitled TS to Schema Conversion",
  onTitleChange,
  isAuthenticated = false,
}: SchemaConversionOptionsProps) {
  const [localOptions, setLocalOptions] =
    useState<SchemaConversionOptionsType>(options);

  const handleChange = (
    field: keyof SchemaConversionOptionsType,
    value: any
  ) => {
    const updatedOptions = { ...localOptions, [field]: value };
    setLocalOptions(updatedOptions);
    onChange(updatedOptions);
  };

  return (
    <Box>
      <Title order={3} mb="sm">
        Options
      </Title>
      <Stack gap="xs">
        {/* Only show title field for authenticated users */}
        {isAuthenticated && (
          <TextInput
            label="Conversion Title"
            placeholder="Untitled TS to Schema Conversion"
            value={conversionTitle}
            onChange={(e) => onTitleChange?.(e.target.value)}
          />
        )}

        <TextInput
          label="Type Name"
          placeholder="RootType"
          description="The main type/interface to generate schema for"
          value={localOptions.typeName || ""}
          onChange={(e) => handleChange("typeName", e.target.value)}
        />

        <NumberInput
          label="Indentation Spaces"
          min={1}
          max={8}
          value={localOptions.indentationSpaces || 2}
          onChange={(val) => handleChange("indentationSpaces", val)}
        />

        <Text size="sm" fw={500} mt="xs">
          Schema Options
        </Text>

        <Stack>
          <Checkbox
            label="Use $ref for shared types"
            checked={localOptions.useRefs ?? true}
            onChange={(e) => handleChange("useRefs", e.currentTarget.checked)}
            description="Use JSON Schema $ref for shared types instead of duplicating them"
          />

          <Checkbox
            label="Make properties required"
            checked={localOptions.required ?? true}
            onChange={(e) => handleChange("required", e.currentTarget.checked)}
            description="Add properties to required array in schema"
          />

          <Checkbox
            label="Use title as description"
            checked={localOptions.useTitleAsDescription ?? false}
            onChange={(e) =>
              handleChange("useTitleAsDescription", e.currentTarget.checked)
            }
            description="Use property names as descriptions in the schema"
          />

          <Checkbox
            label="Allow additional properties"
            checked={localOptions.additionalProperties ?? false}
            onChange={(e) =>
              handleChange("additionalProperties", e.currentTarget.checked)
            }
            description="Allow properties not defined in the schema"
          />
        </Stack>

        <Text size="sm" fw={500} mt="xs">
          Export Strategy
        </Text>

        <Radio.Group
          value={localOptions.exportStrategy || ExportStrategy.ALL}
          onChange={(value) => handleChange("exportStrategy", value)}
          name="exportStrategy"
        >
          <Stack>
            <Radio
              value={ExportStrategy.ALL}
              label="Include all type definitions"
              description="Include all referenced types in the schema"
            />
            <Radio
              value={ExportStrategy.TOP_LEVEL}
              label="Main type only"
              description="Only include the main type in the schema"
            />
          </Stack>
        </Radio.Group>
      </Stack>
    </Box>
  );
}
