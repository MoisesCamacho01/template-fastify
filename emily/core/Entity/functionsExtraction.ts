export default class FunctionsExtraction{
    public extractRequiredArray = (fileContent: string): string | null => {
        const bodyFunctionRegex = /public required\s*=\s*async\s*\([^)]*\)\s*:\s*Promise<string\[\]>\s*=>\s*\{\s*return\s*(\[[\s\S]*?\]);/s;
        const match = fileContent.match(bodyFunctionRegex);
        if (match && match[1]) {
          return match[1];
        }
        return null;
    }

    public extractBodyObject = (fileContent: string): string | null => {
      const bodyFunctionRegex = /body\s*=\s*async\s*\([^)]*\)\s*:\s*Promise<Record<string,\s*unknown>>\s*=>\s*\{\s*return\s*(\{[\s\S]*?\});/s;
        const match = fileContent.match(bodyFunctionRegex);
        if (match && match[1]) {
          return match[1];
        }
        return null;
    }
}