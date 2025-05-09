/**
 * JSON to TypeScript converter utility
 */

type ConversionOptions = {
  interfaceName?: string;
  useType?: boolean;
  useInterfaces?: boolean;
  useSemicolons?: boolean;
  useExport?: boolean;
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
      useExport = true,
      indentationSpaces = 2,
    } = options;
    
    // Generate TypeScript code
    const result = generateTypeScriptFromObject(
      parsedJson, 
      interfaceName, 
      { 
        interfaceName,  // Include interfaceName in the options
        useType, 
        useInterfaces, 
        useSemicolons, 
        useExport, 
        indentationSpaces 
      }
    );
    
    return { code: result, error: null };
  } catch (error) {
    return { 
      code: null, 
      error: `Error converting JSON to TypeScript: ${(error as Error).message}` 
    };
  }
}

/**
 * Generate TypeScript type definitions from a JavaScript object
 */
function generateTypeScriptFromObject(
  obj: unknown, 
  name: string, 
  options: Required<ConversionOptions>,
  indent = 0
): string {
  const { useType, useInterfaces, useSemicolons, useExport, indentationSpaces } = options;
  
  // Create indentation strings
  const indentStr = ' '.repeat(indentationSpaces * indent);
  const indentStrInner = ' '.repeat(indentationSpaces * (indent + 1));
  
  // Choose type or interface
  const declarationType = useType || !useInterfaces ? 'type' : 'interface';
  
  // Generate the export keyword if needed
  const exportKeyword = useExport ? 'export ' : '';
  
  // Add semicolons if needed
  const semicolon = useSemicolons ? ';' : '';
  
  if (obj === null) {
    return `${exportKeyword}${declarationType} ${name} = null${semicolon}`;
  }
  
  if (typeof obj !== 'object') {
    return `${exportKeyword}${declarationType} ${name} = ${typeof obj}${semicolon}`;
  }
  
  // Handle arrays
  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      return `${exportKeyword}${declarationType} ${name} = any[]${semicolon}`;
    }
    
    // Find the common type of array elements
    const sample = obj[0];
    const arrayType = typeof sample === 'object' && sample !== null
      ? `${name}Item`
      : typeof sample;
      
    const result = typeof sample === 'object' && sample !== null
      ? `${generateTypeScriptFromObject(sample, `${name}Item`, options, indent)}\n\n${indentStr}${exportKeyword}${declarationType} ${name} = ${name}Item[]${semicolon}`
      : `${exportKeyword}${declarationType} ${name} = ${arrayType}[]${semicolon}`;
      
    return result;
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
        const elementType = typeof value[0] === 'object' && value[0] !== null
          ? `${name}${capitalizeFirstLetter(key)}`
          : typeof value[0];
        
        if (typeof value[0] === 'object' && value[0] !== null) {
          const nestedType = generateTypeScriptFromObject(
            value[0], 
            `${name}${capitalizeFirstLetter(key)}`, 
            options, 
            indent + 1
          );
          lines.push(nestedType);
          lines.push(`${indentStrInner}${validKey}: ${name}${capitalizeFirstLetter(key)}[]${semicolon}`);
        } else {
          lines.push(`${indentStrInner}${validKey}: ${elementType}[]${semicolon}`);
        }
      }
    } else {
      const nestedType = generateTypeScriptFromObject(
        value, 
        `${name}${capitalizeFirstLetter(key)}`, 
        options, 
        indent + 1
      );
      lines.push(nestedType);
      lines.push(`${indentStrInner}${validKey}: ${name}${capitalizeFirstLetter(key)}${semicolon}`);
    }
  }
  
  lines.push(`${indentStr}}${semicolon}`);
  return lines.join('\n');
}

/**
 * Utility function to capitalize the first letter of a string
 */
function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}