import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Type definitions
interface SearchResult {
  folder: string;
  file: string;
  filePath: string;
  lineNumber: number;
  content: string;
}

interface SearchConfig {
  targetStrings: string[];
  includeExtensions: string[];
  excludeDirs: string[];
  excludeFiles: string[];
}

interface Results {
  [key: string]: SearchResult[];
}

/**
 * Search for target strings in a specific file and save the results
 */
const searchInFile = (
  filePath: string,
  config: SearchConfig,
  results: Results
): void => {
  const content: string = fs.readFileSync(filePath, 'utf-8');
  const lines: string[] = content.split('\n');

  // Extract top-level folder name based on relative path
  const relativePath: string = path.relative(process.cwd(), filePath);
  const parts: string[] = relativePath.split(path.sep);
  const folderName: string = parts.length > 1 ? parts[0] : 'root';
  const fileName: string = path.basename(filePath);

  lines.forEach((line: string, index: number) => {
    config.targetStrings.forEach((targetString, i) => {
      if (line.includes(targetString)) {
        const key = `target${i + 1}`;
        if (!results[key]) {
          results[key] = [];
        }
        results[key].push({
          folder: folderName,
          file: fileName,
          filePath: relativePath,
          lineNumber: index + 1,
          content: line.trim(),
        });
      }
    });
  });
};

/**
 * Recursively traverse the specified directory
 */
const walk = (
  dir: string,
  config: SearchConfig,
  results: Results
): void => {
  const entries: fs.Dirent[] = fs.readdirSync(dir, { withFileTypes: true });

  entries.forEach((entry: fs.Dirent) => {
    const fullPath: string = path.join(dir, entry.name);

    if (entry.isDirectory() && !config.excludeDirs.includes(entry.name)) {
      walk(fullPath, config, results);
    } else if (
      entry.isFile() &&
      !config.excludeFiles.includes(entry.name) &&
      !entry.name.startsWith('.')
    ) {
      const ext: string = path.extname(entry.name);
      if (config.includeExtensions.includes(ext)) {
        searchInFile(fullPath, config, results);
      }
    }
  });
};

/**
 * Convert results to Markdown format
 */
const generateMarkdown = (results: Results, config: SearchConfig): string => {
  let md: string = `## ${path.basename(process.cwd())} 검색 결과\n\n`;

  Object.entries(results).forEach(([key, entries]) => {
    const targetString = config.targetStrings[parseInt(key.replace('target', '')) - 1];
    md += `### 🔗 ${targetString} (${entries.length}건)\n\n`;
    
    const groupedResults: Record<string, SearchResult[]> = entries.reduce((acc, cur) => {
      if (!acc[cur.folder]) acc[cur.folder] = [];
      acc[cur.folder].push(cur);
      return acc;
    }, {} as Record<string, SearchResult[]>);

    for (const folder in groupedResults) {
      md += `#### 📁 ${folder}\n\n`;
      groupedResults[folder].forEach((entry, i) => {
        md += `##### ${i + 1}. \`${entry.file}\` (line ${entry.lineNumber})\n`;
        md += `경로: \`${entry.filePath}\`\n\n`;
        md += '```js\n';
        md += `${entry.content}\n`;
        md += '```\n\n';
      });
    }
  });

  return md;
};

/**
 * Main search function
 */
export const search = (
  config: SearchConfig,
  outputFile: string = 'search_results.md'
): void => {
  const results: Results = {};
  const rootDir: string = process.cwd();

  console.log('🔍 Searching in:', rootDir);
  console.log('🔎 Target strings:', config.targetStrings);
  console.log('📝 Output file:', outputFile);
  
  walk(rootDir, config, results);

  const markdown: string = generateMarkdown(results, config);
  fs.writeFileSync(outputFile, markdown, 'utf-8');
  console.log(`✅ 결과가 '${outputFile}'에 저장되었습니다.`);
};