/**
 * JSON to TypeScript converter utility
 */
import { ExportStrategy } from "@/types";

type ConversionOptions = {
  interfaceName?: string;
  useType?: boolean;
  useInterfaces?: boolean;
  useSemicolons?: boolean;
  exportStrategy?: ExportStrategy;
  indentationSpaces?: number;
};

/**
 * Convert JSON to TypeScript type/interface definitions
 */
export function convertJsonToTypeScript(
  json: string, 
  options: ConversionOptions = {}
): { code: string; error?: null } | { code: null; error: string } {
  try {
    // Parse the JSON
    const parsedJson = JSON.parse(json);
    
    // Default options
    const {
      interfaceName = "RootObject",
      useType = false,
      useInterfaces = true,
      useSemicolons = true,
      exportStrategy = ExportStrategy.ALL,
      indentationSpaces = 2,
    } = options;

    // Collection of generated types/interfaces and a set to track used names
    const generatedTypes = new Map<string, string>();
    const usedTypeNames = new Set<string>();
    
    // Generate TypeScript code
    generateTypeScriptFromObject(
      parsedJson, 
      interfaceName, 
      { 
        interfaceName,
        useType, 
        useInterfaces, 
        useSemicolons, 
        exportStrategy, 
        indentationSpaces 
      },
      generatedTypes,
      usedTypeNames,
      true // isRoot flag
    );
    
    // Apply export strategy after all types have been generated
    const finalGeneratedTypes = applyExportStrategy(
      generatedTypes, 
      exportStrategy, 
      interfaceName
    );
    
    // Combine all generated types in the correct order
    const result = Array.from(finalGeneratedTypes.values()).join('\n\n');
    
    return { code: result, error: null };
  } catch (error) {
    return { 
      code: null, 
      error: `Error converting JSON to TypeScript: ${(error as Error).message}` 
    };
  }
}

/**
 * Generate a nested type definition for TOP_LEVEL export strategy
 * This creates a single exported root type with all nested types inside
 */
function generateNestedTypeDefinition(
  obj: any,
  rootName: string,
  useType: boolean,
  useInterfaces: boolean,
  useSemicolons: boolean,
  indentationSpaces: number
): { code: string; error?: null } | { code: null; error: string } {
  try {
    const semicolon = useSemicolons ? ';' : '';
    const declarationType = useType || !useInterfaces ? 'type' : 'interface';
    const indent = ' '.repeat(indentationSpaces);
    
    // Start building the root type
    const lines: string[] = [];
    lines.push(`export ${declarationType} ${rootName} {`);
    
    // Process each top-level property and generate nested interfaces
    for (const [key, value] of Object.entries(obj)) {
      // Generate the property code
      const propType = generateNestedType(
        key,
        value,
        indentationSpaces,
        1,
        useType,
        useInterfaces,
        useSemicolons
      );
      lines.push(propType);
    }
    
    lines.push(`}${semicolon}`);
    return { code: lines.join('\n'), error: null };
  } catch (error) {
    return { 
      code: null, 
      error: `Error generating nested TypeScript definition: ${(error as Error).message}` 
    };
  }
}

/**
 * Generate a type definition for a property with all nested types inline
 */
function generateNestedType(
  key: string,
  value: any,
  indentationSpaces: number,
  depth: number,
  useType: boolean,
  useInterfaces: boolean,
  useSemicolons: boolean
): string {
  const indent = ' '.repeat(indentationSpaces * depth);
  const semicolon = useSemicolons ? ';' : '';
  const validKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) 
    ? key 
    : `"${key}"`;
  
  // Handle different value types
  if (value === null) {
    return `${indent}${validKey}: null${semicolon}`;
  } 
  
  if (typeof value !== 'object') {
    return `${indent}${validKey}: ${typeof value}${semicolon}`;
  }
  
  // Handle arrays
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return `${indent}${validKey}: any[]${semicolon}`;
    }
    
    const firstItem = value[0];
    if (typeof firstItem !== 'object' || firstItem === null) {
      return `${indent}${validKey}: ${typeof firstItem}[]${semicolon}`;
    }
    
    // Handle array of objects by defining the type inline
    const lines = [`${indent}${validKey}: Array<{`];
    
    // Process each property of the first object in the array
    for (const [propKey, propValue] of Object.entries(firstItem)) {
      const nestedTypeStr = generateNestedType(
        propKey,
        propValue,
        indentationSpaces,
        depth + 1,
        useType,
        useInterfaces,
        useSemicolons
      );
      lines.push(nestedTypeStr);
    }
    
    lines.push(`${indent}}>${semicolon}`);
    return lines.join('\n');
  }
  
  // Handle regular objects by defining interface inline
  const lines = [`${indent}${validKey}: {`];
  
  // Process each property of the object
  for (const [propKey, propValue] of Object.entries(value)) {
    const nestedTypeStr = generateNestedType(
      propKey,
      propValue,
      indentationSpaces,
      depth + 1,
      useType,
      useInterfaces,
      useSemicolons
    );
    lines.push(nestedTypeStr);
  }
  
  lines.push(`${indent}}${semicolon}`);
  return lines.join('\n');
}

/**
 * Apply the selected export strategy to the generated types
 */
function applyExportStrategy(
  generatedTypes: Map<string, string>,
  exportStrategy: ExportStrategy,
  rootName: string
): Map<string, string> {
  // If all types should be exported, return as is
  if (exportStrategy === ExportStrategy.ALL) {
    return new Map(generatedTypes);
  }

  const result = new Map<string, string>();
  
  for (const [name, typeDef] of generatedTypes.entries()) {
    // For TOP_LEVEL strategy, keep export only for the root type
    // For NONE strategy, remove all exports
    const shouldKeepExport = 
      exportStrategy === ExportStrategy.TOP_LEVEL && name === rootName;
    
    if (shouldKeepExport) {
      // Keep as is
      result.set(name, typeDef);
    } else {
      // Remove the export keyword
      const withoutExport = typeDef.replace(/^export\s+/, '');
      result.set(name, withoutExport);
    }
  }
  
  return result;
}

/**
 * Generate TypeScript type definitions from a JavaScript object
 */
function generateTypeScriptFromObject(
  obj: unknown, 
  name: string, 
  options: Required<ConversionOptions>,
  generatedTypes: Map<string, string>,
  usedTypeNames: Set<string>,
  isRoot = false,
  parentName = ""
): string {
  const { useType, useInterfaces, useSemicolons, exportStrategy, indentationSpaces } = options;
  
  // Create indentation strings
  const indentStr = ' '.repeat(indentationSpaces * 0); // Top-level indentation
  const indentStrInner = ' '.repeat(indentationSpaces * 1);
  
  // Choose type or interface
  const declarationType = useType || !useInterfaces ? 'type' : 'interface';
  
  // Always generate with export keyword initially
  // We'll apply the export strategy later
  const exportKeyword = 'export ';
  
  // Add semicolons if needed
  const semicolon = useSemicolons ? ';' : '';
  
  if (obj === null) {
    const typeDef = `${exportKeyword}${declarationType} ${name} = null${semicolon}`;
    generatedTypes.set(name, typeDef);
    usedTypeNames.add(name);
    return name;
  }
  
  if (typeof obj !== 'object') {
    const typeDef = `${exportKeyword}${declarationType} ${name} = ${typeof obj}${semicolon}`;
    generatedTypes.set(name, typeDef);
    usedTypeNames.add(name);
    return name;
  }
  
  // Handle arrays
  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      const typeDef = `${exportKeyword}${declarationType} ${name} = any[]${semicolon}`;
      generatedTypes.set(name, typeDef);
      usedTypeNames.add(name);
      return name;
    }
    
    // Find the common type of array elements
    const sample = obj[0];
    
    if (typeof sample === 'object' && sample !== null) {
      // For objects in arrays, create a separate type for the items
      // Use a simplified naming approach - just Item suffix
      const itemTypeName = `${name}Item`;
      generateTypeScriptFromObject(
        sample, 
        itemTypeName, 
        options, 
        generatedTypes, 
        usedTypeNames,
        false,
        name
      );
      
      const typeDef = `${exportKeyword}${declarationType} ${name} = ${itemTypeName}[]${semicolon}`;
      generatedTypes.set(name, typeDef);
      usedTypeNames.add(name);
    } else {
      const typeDef = `${exportKeyword}${declarationType} ${name} = ${typeof sample}[]${semicolon}`;
      generatedTypes.set(name, typeDef);
      usedTypeNames.add(name);
    }
    
    return name;
  }
  
  // Handle objects
  const lines: string[] = [];
  const isTypeDefinition = useType || !useInterfaces;
  
  if (isTypeDefinition) {
    lines.push(`${exportKeyword}${declarationType} ${name} = {`);
  } else {
    lines.push(`${exportKeyword}${declarationType} ${name} {`);
  }
  
  // Process each property in the object
  const entries = Object.entries(obj);
  
  for (const [key, value] of entries) {
    const validKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) 
      ? key 
      : `"${key}"`;
    
    if (value === null) {
      lines.push(`${indentStrInner}${validKey}: null${semicolon}`);
    } else if (typeof value !== 'object') {
      lines.push(`${indentStrInner}${validKey}: ${typeof value}${semicolon}`);
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        lines.push(`${indentStrInner}${validKey}: any[]${semicolon}`);
      } else {
        // Create appropriate nested type name based on context
        let nestedTypeName = createNestedTypeName(key, name, parentName, usedTypeNames, isRoot);
        
        if (typeof value[0] === 'object' && value[0] !== null) {
          // Generate the nested type first (will be added to generatedTypes)
          generateTypeScriptFromObject(
            value[0], 
            nestedTypeName, 
            options, 
            generatedTypes, 
            usedTypeNames,
            false,
            name
          );
          lines.push(`${indentStrInner}${validKey}: ${nestedTypeName}[]${semicolon}`);
        } else {
          lines.push(`${indentStrInner}${validKey}: ${typeof value[0]}[]${semicolon}`);
        }
      }
    } else {
      // Create appropriate nested type name based on context
      let nestedTypeName = createNestedTypeName(key, name, parentName, usedTypeNames, isRoot);
      
      // Generate the nested type first (will be added to generatedTypes)
      generateTypeScriptFromObject(
        value, 
        nestedTypeName, 
        options, 
        generatedTypes, 
        usedTypeNames,
        false,
        name
      );
      lines.push(`${indentStrInner}${validKey}: ${nestedTypeName}${semicolon}`);
    }
  }
  
  lines.push(`${indentStr}}${semicolon}`);
  generatedTypes.set(name, lines.join('\n'));
  usedTypeNames.add(name);
  return name;
}

/**
 * Create a nested type name based on context, avoiding name collisions
 * and using more intuitive names for nested structures
 */
function createNestedTypeName(
  key: string, 
  parentName: string, 
  grandparentName: string,
  usedNames: Set<string>,
  isRoot: boolean
): string {
  // Capitalize the property name
  const capitalizedKey = capitalizeFirstLetter(key);
  
  let proposedName: string;
  
  if (isRoot) {
    // For root level, use the parent name as prefix
    proposedName = `${parentName}${capitalizedKey}`;
  } else {
    // For deeply nested properties, just use the property name if possible
    // to avoid overly long type names
    if (!usedNames.has(capitalizedKey)) {
      proposedName = capitalizedKey;
    } else {
      // If there's a name collision, use the parent name as context
      proposedName = `${parentName}${capitalizedKey}`;
    }
  }
  
  // If the name is still in use, make it unique by appending a number
  if (usedNames.has(proposedName) && proposedName !== parentName) {
    let counter = 1;
    let uniqueName = `${proposedName}${counter}`;
    
    while (usedNames.has(uniqueName)) {
      counter++;
      uniqueName = `${proposedName}${counter}`;
    }
    
    return uniqueName;
  }
  
  return proposedName;
}

/**
 * Utility function to capitalize the first letter of a string
 */
function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}