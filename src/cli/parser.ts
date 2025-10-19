/**
 * ZenWeb Parser
 * Transforms view and style keywords into runtime calls
 */

export interface ParseResult {
  code: string;
  styles: string;
}

/**
 * Parse ZenWeb component file and transform view/style keywords
 */
export function parseZenWebFile(source: string): ParseResult {
  let transformedCode = source;
  let extractedStyles = '';

  // Extract and transform style blocks using balanced brace matching
  transformedCode = extractStyleBlocks(transformedCode, (styleContent, index) => {
    const componentId = `zw-${generateHash(source)}-${index}`;
    const scopedStyles = scopeStyles(styleContent, componentId);
    extractedStyles += scopedStyles + '\n';
  });

  // Transform view blocks using balanced brace matching
  transformedCode = extractViewBlocks(transformedCode);

  return {
    code: transformedCode,
    styles: extractedStyles
  };
}

/**
 * Extract and remove style blocks
 */
function extractStyleBlocks(code: string, callback: (content: string, index: number) => void): string {
  let result = '';
  let i = 0;
  let styleIndex = 0;

  while (i < code.length) {
    // Look for 'style {'
    const styleMatch = code.substring(i).match(/^\s*style\s*\{/);
    
    if (styleMatch) {
      // Add everything before 'style {'
      result += code.substring(0, i);
      
      // Find the matching closing brace
      const startPos = i + styleMatch[0].length;
      const endPos = findMatchingBrace(code, startPos - 1);
      
      if (endPos !== -1) {
        const content = code.substring(startPos, endPos);
        callback(content, styleIndex++);
        
        // Skip past the style block
        code = code.substring(endPos + 1);
        i = 0;
        continue;
      }
    }
    
    i++;
  }
  
  result += code;
  return result;
}

/**
 * Extract and transform view blocks
 */
function extractViewBlocks(code: string): string {
  let result = '';
  let i = 0;

  while (i < code.length) {
    // Look for 'view {'
    const viewMatch = code.substring(i).match(/^\s*view\s*\{/);
    
    if (viewMatch) {
      // Add everything before 'view {'
      result += code.substring(0, i);
      
      // Find the matching closing brace
      const startPos = i + viewMatch[0].length;
      const endPos = findMatchingBrace(code, startPos - 1);
      
      if (endPos !== -1) {
        const content = code.substring(startPos, endPos).trim();
        
        // Transform to return statement
        result += `return (${content});`;
        
        // Skip past the view block
        code = code.substring(endPos + 1);
        i = 0;
        continue;
      }
    }
    
    i++;
  }
  
  result += code;
  return result;
}

/**
 * Find the matching closing brace for an opening brace
 */
function findMatchingBrace(str: string, openPos: number): number {
  let depth = 1;
  let inString = false;
  let stringChar = '';
  let inTemplate = false;
  let templateDepth = 0;

  for (let i = openPos + 1; i < str.length; i++) {
    const char = str[i];
    const prevChar = i > 0 ? str[i - 1] : '';

    // Handle string literals
    if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
      if (!inString) {
        inString = true;
        stringChar = char;
        if (char === '`') inTemplate = true;
      } else if (char === stringChar) {
        inString = false;
        if (char === '`') inTemplate = false;
      }
    }

    // Handle template literal expressions
    if (inTemplate && char === '{' && prevChar === '$') {
      templateDepth++;
      continue;
    }
    if (inTemplate && char === '}' && templateDepth > 0) {
      templateDepth--;
      continue;
    }

    // Skip if we're in a string
    if (inString) continue;

    // Count braces
    if (char === '{') {
      depth++;
    } else if (char === '}') {
      depth--;
      if (depth === 0) {
        return i;
      }
    }
  }

  return -1; // No matching brace found
}

/**
 * Scope CSS styles to a component
 */
function scopeStyles(css: string, componentId: string): string {
  // Simple scoping: add component ID to each selector
  const lines = css.split('\n');
  let result = '';
  let currentSelector = '';
  let inBlock = false;

  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.includes('{')) {
      // Selector line
      const selector = trimmed.substring(0, trimmed.indexOf('{')).trim();
      currentSelector = selector;
      
      // Scope the selector
      const scopedSelector = scopeSelector(selector, componentId);
      result += `${scopedSelector} {\n`;
      inBlock = true;
      
      // Handle inline properties
      const afterBrace = trimmed.substring(trimmed.indexOf('{') + 1).trim();
      if (afterBrace) {
        result += `  ${afterBrace}\n`;
      }
    } else if (trimmed === '}') {
      result += '}\n';
      inBlock = false;
    } else if (trimmed) {
      result += `  ${trimmed}\n`;
    }
  }

  return result;
}

/**
 * Scope a CSS selector
 */
function scopeSelector(selector: string, componentId: string): string {
  // Handle multiple selectors separated by comma
  const selectors = selector.split(',').map(s => s.trim());
  
  return selectors.map(sel => {
    // Don't scope :root, *, or other global selectors
    if (sel.startsWith(':root') || sel === '*' || sel.startsWith('@')) {
      return sel;
    }
    
    // Add component ID as attribute selector
    return `[data-zw="${componentId}"] ${sel}`;
  }).join(', ');
}

/**
 * Generate a simple hash for component identification
 */
function generateHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Transform imports to use runtime
 */
export function transformImports(code: string): string {
  // Replace zenweb/runtime imports
  code = code.replace(
    /from\s+['"]zenweb\/runtime['"]/g,
    "from 'zenweb/runtime'"
  );

  // Replace zenweb/helpers imports
  code = code.replace(
    /from\s+['"]zenweb\/helpers['"]/g,
    "from 'zenweb/runtime'"
  );

  return code;
}
