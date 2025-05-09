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
  ConversionOptions as ConversionOptionsType,
  ExportStrategy,
} from "@/types";
import { useState } from "react";

interface ConversionOptionsProps {
  options: ConversionOptionsType;
  onChange: (options: ConversionOptionsType) => void;
  conversionTitle?: string;
  onTitleChange?: (title: string) => void;
  isAuthenticated?: boolean; // Add authentication state prop
}

export function ConversionOptions({
  options,
  onChange,
  conversionTitle = "Untitled Conversion",
  onTitleChange,
  isAuthenticated = false, // Default to false if not provided
}: ConversionOptionsProps) {
  const [localOptions, setLocalOptions] =
    useState<ConversionOptionsType>(options);

  const handleChange = (field: keyof ConversionOptionsType, value: any) => {
    const updatedOptions = { ...localOptions, [field]: value };
    setLocalOptions(updatedOptions);
    onChange(updatedOptions);
  };

  const handleTypeChange = (value: string) => {
    if (value === "interface") {
      handleChange("useInterfaces", true);
      handleChange("useType", false);
    } else {
      handleChange("useInterfaces", false);
      handleChange("useType", true);
    }
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
            placeholder="Untitled Conversion"
            value={conversionTitle}
            onChange={(e) => onTitleChange?.(e.target.value)}
          />
        )}

        <TextInput
          label="Interface/Type Name"
          placeholder="RootObject"
          value={localOptions.interfaceName || ""}
          onChange={(e) => handleChange("interfaceName", e.target.value)}
        />

        <NumberInput
          label="Indentation Spaces"
          min={1}
          max={8}
          value={localOptions.indentationSpaces || 2}
          onChange={(val) => handleChange("indentationSpaces", val)}
        />

        <Text size="sm" fw={500} mt="xs">
          Output Format
        </Text>

        <Radio.Group
          value={localOptions.useType ? "type" : "interface"}
          onChange={handleTypeChange}
          name="definitionType"
        >
          <Group>
            <Radio value="interface" label="Use interfaces" />
            <Radio value="type" label="Use types" />
          </Group>
        </Radio.Group>

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
              label="Export all types/interfaces"
              description="Every definition will have an export keyword"
            />
            <Radio
              value={ExportStrategy.TOP_LEVEL}
              label="Export top-level only"
              description="Only the root type/interface will have an export keyword"
            />
            <Radio
              value={ExportStrategy.NONE}
              label="No exports"
              description="No export keywords will be added"
            />
          </Stack>
        </Radio.Group>

        <Group>
          <Checkbox
            label="Use semicolons"
            checked={localOptions.useSemicolons ?? true}
            onChange={(e) =>
              handleChange("useSemicolons", e.currentTarget.checked)
            }
          />
        </Group>

        <Group>
          <Checkbox
            label="Extract nested types"
            checked={localOptions.extractNestedTypes ?? false}
            onChange={(e) =>
              handleChange("extractNestedTypes", e.currentTarget.checked)
            }
            description="Create separate interfaces/types for nested objects"
          />
        </Group>
      </Stack>
    </Box>
  );
}
