/**
 * TypeScript to JSON Schema converter utility
 */
import * as TJS from "typescript-json-schema";
import { ExportStrategy } from "@/types";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";

type SchemaConversionOptions = {
  typeName?: string;
  useRefs?: boolean;
  required?: boolean;
  useTitleAsDescription?: boolean;
  exportStrategy?: ExportStrategy;
  additionalProperties?: boolean;
  indentationSpaces?: number;
};

/**
 * Convert TypeScript to JSON Schema
 */
export function convertTypeScriptToJsonSchema(
  typescript: string, 
  options: SchemaConversionOptions = {}
): { code: string; error?: null } | { code: null; error: string } {
  try {
    // Set default options
    const {
      typeName = "RootType", // Default type name to use if not specified
      useRefs = true,
      required = true,
      useTitleAsDescription = false,
      indentationSpaces = 2,
      additionalProperties = false,
    } = options;
    
    // Create a temporary directory to hold the TypeScript file
    const tmpDir = os.tmpdir();
    const tempDirPath = path.join(tmpDir, `ts-schema-${Date.now()}`);
    const tempFilePath = path.join(tempDirPath, `temp.ts`);
    
    try {
      // Create the temp directory if it doesn't exist
      if (!fs.existsSync(tempDirPath)) {
        fs.mkdirSync(tempDirPath, { recursive: true });
      }
      
      // Process the TypeScript code to ensure exports are properly handled
      let processedTypeScript = typescript;
      
      // Check if the code already has export statements
      const hasExports = typescript.includes('export interface') || typescript.includes('export type');
      
      if (!hasExports) {
        // Add export keyword to all interfaces and types that don't have it
        processedTypeScript = typescript.replace(
          /^(\s*)(interface|type)\s+(\w+)/gm,
          '$1export $2 $3'
        );
      }
      
      // Add a special type alias for integer if not present
      if (!processedTypeScript.includes('type integer = number;')) {
        processedTypeScript = 'type integer = number;\n' + processedTypeScript;
      }
      
      // Write processed code to file
      fs.writeFileSync(tempFilePath, processedTypeScript);
      
      // Find the main type to generate schema for
      let mainTypeName = typeName;
      
      // Try to find a suitable root type if the default is used
      if (typeName === "RootType") {
        // Match the first interface or type definition
        const interfaceMatch = processedTypeScript.match(/(?:export\s+)?interface\s+(\w+)/);
        const typeMatch = processedTypeScript.match(/(?:export\s+)?type\s+(\w+)(?:\s*=|\s*<)/);
        
        if (interfaceMatch && interfaceMatch[1]) {
          mainTypeName = interfaceMatch[1];
        } else if (typeMatch && typeMatch[1]) {
          mainTypeName = typeMatch[1];
        }
      }
      
      console.log(`Using main type name: ${mainTypeName}`);
      
      // Set up compiler options
      const compilerOptions: TJS.CompilerOptions = {
        strictNullChecks: true,
        noEmit: true,
        target: 2, // ES2015
        module: 1, // CommonJS
        moduleResolution: 2, // NodeJs
        experimentalDecorators: true,
        esModuleInterop: true,
        skipLibCheck: true,
      };
      
      // Create program from the file with options
      const program = TJS.getProgramFromFiles(
        [tempFilePath],
        compilerOptions,
        tempDirPath
      );
      
      // Get schema generator settings from documentation
      const tjsSettings: TJS.PartialArgs = {
        required: required, // Create required array for non-optional properties
        ref: useRefs, // Create shared ref definitions
        aliasRef: false, // Don't create shared ref definitions for type aliases
        topRef: false, // Don't create a top-level ref definition
        titles: useTitleAsDescription, // Create titles in the output schema
        defaultProps: true, // Create default properties definitions
        noExtraProps: !additionalProperties, // Control additional properties in objects
        propOrder: false, // Don't create property order definitions
        typeOfKeyword: false, // Don't use `typeOf` keyword for functions
        defaultNumberType: "number", // Default number type
        strictNullChecks: true, // Make values non-nullable by default
        ignoreErrors: true, // Generate even if the program has errors
        excludePrivate: true, // Exclude private members from the schema
      };
      
      // Try different approaches to generate the schema
      // 1. First attempt: Use the buildGenerator approach
      const generator = TJS.buildGenerator(program, tjsSettings);
      
      if (!generator) {
        throw new Error("Failed to create schema generator");
      }
      
      // Log all available types for debugging
      const allSymbols = generator.getUserSymbols();
      console.log(`Available types (${allSymbols.length}):`, allSymbols);
      
      if (allSymbols.length === 0) {
        throw new Error("No type definitions found. Make sure your TypeScript code has properly exported types or interfaces.");
      }
      
      // Try to find our target type
      let finalTypeName = mainTypeName;
      if (!allSymbols.includes(mainTypeName)) {
        // If exact name not found, try case-insensitive match
        const matchingSymbol = allSymbols.find(s => 
          s.toLowerCase() === mainTypeName.toLowerCase()
        );
        
        if (matchingSymbol) {
          finalTypeName = matchingSymbol;
          console.log(`Exact type '${mainTypeName}' not found, using closest match '${finalTypeName}'`);
        } else {
          // If still not found, use the first symbol as fallback
          finalTypeName = allSymbols[0];
          console.log(`Type '${mainTypeName}' not found, falling back to first available type '${finalTypeName}'`);
        }
      }
      
      // Generate the schema for the identified symbol
      const schema = generator.getSchemaForSymbol(finalTypeName);
      
      // Add $schema field if missing
      if (!schema.$schema) {
        schema.$schema = "http://json-schema.org/draft-07/schema#";
      }
      
      // Format the output with proper indentation
      const formattedCode = JSON.stringify(schema, null, indentationSpaces);
      return { code: formattedCode, error: null };
      
    } catch (error: unknown) {
      console.error("Schema generation error:", error);
      
      // Try a fallback approach using generateSchema directly
      try {
        console.log("Attempting fallback method for schema generation...");
        
        // Load the program again
        const program = TJS.getProgramFromFiles(
          [tempFilePath],
          {
            strictNullChecks: true,
            esModuleInterop: true,
            skipLibCheck: true,
          },
          tempDirPath
        );
        
        // Generate schema directly (alternative approach from docs)
        const schema = TJS.generateSchema(program, typeName, {
          required: true,
          ref: useRefs,
          noExtraProps: !additionalProperties,
          titles: useTitleAsDescription,
        });
        
        if (!schema) {
          throw new Error("Could not generate schema using fallback method");
        }
        
        // Add $schema field if missing
        if (!schema.$schema) {
          schema.$schema = "http://json-schema.org/draft-07/schema#";
        }
        
        // Format and return the result
        const formattedCode = JSON.stringify(schema, null, indentationSpaces);
        return { code: formattedCode, error: null };
        
      } catch (fallbackError) {
        // Both approaches failed, return detailed error
        const mainError = error instanceof Error ? error.message : String(error);
        const fallbackErrorMsg = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
        
        return { 
          code: null, 
          error: `Schema generation failed. Primary error: ${mainError}. Fallback error: ${fallbackErrorMsg}` 
        };
      }
    } finally {
      // Clean up the temporary files
      try {
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
        if (fs.existsSync(tempDirPath)) {
          fs.rmdirSync(tempDirPath, { recursive: true });
        }
      } catch (cleanupError) {
        console.error('Error cleaning up temporary files:', cleanupError);
      }
    }
  } catch (error: unknown) {
    console.error('TypeScript to JSON Schema conversion error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { 
      code: null, 
      error: `Error converting TypeScript to JSON Schema: ${errorMessage}` 
    };
  }
}