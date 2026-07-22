import type { Plugin } from 'vuepress';
import { createPage } from 'vuepress/core'
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { dereference } from '@scalar/openapi-parser';
import { createMarkdownFromOpenApi } from '@scalar/openapi-to-markdown';
import type { HttpMethod } from '@scalar/openapi-to-markdown';

export interface OpenAPIGeneratorOptions {
  /**
   * OpenAPI JSON 文件路径
   */
  openapiPath?: string;
  /**
   * 生成的 markdown 文件输出目录
   */
  outputDir?: string;
  /**
   * URL 路径前缀
   */
  baseRoute?: string;
}

interface OpenAPISpec {
  openapi?: string;
  info?: {
    title?: string;
    version?: string;
    description?: string;
  };
  paths?: Record<string, Record<string, any>>;
}

export const openapiGeneratorPlugin = (
  options: OpenAPIGeneratorOptions = {}
): Plugin => {
  const {
    openapiPath = 'openapi.json',
    outputDir = 'api'
  } = options;

  return {
    name: 'vuepress-plugin-openapi-generator',

    onInitialized: async (app) => {
      const openapiFullPath = resolve(app.dir.source(), openapiPath);

      // 检查 openapi.json 是否存在
      if (!existsSync(openapiFullPath)) {
        app.env.isDebug && console.warn(
          `[openapi-generator] OpenAPI file not found: ${openapiFullPath}`
        );
        return;
      }

      try {
        // 读取并解析 OpenAPI 规范（包括解引用 $ref）
        const openapiContent = await readFile(openapiFullPath, 'utf8');
        const result = dereference(openapiContent);

        if (!result.version) {
          console.error('[openapi-generator] Invalid OpenAPI spec:', result.errors);
          return;
        }

        const openapiSpec: OpenAPISpec = result.schema as OpenAPISpec;

        if (!openapiSpec.paths) {
          console.warn('[openapi-generator] No paths found in OpenAPI spec');
          return;
        }

        // 为每个路径的每个方法创建页面
        const paths = Object.keys(openapiSpec.paths);
        console.log(`[openapi-generator] Creating pages for ${paths.length} API paths...`);

        // 将解引用后的规范转换为字符串，供 @scalar/openapi-to-markdown 使用
        const dereferencedContent = JSON.stringify(openapiSpec);

        let pageCount = 0;
        for (const apiPath of paths) {
          const pathItem = openapiSpec.paths[apiPath];
          const methods = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'];

          for (const method of methods) {
            if (!pathItem[method]) continue;

            // 使用 @scalar/openapi-to-markdown 生成 markdown
            const markdown = await createMarkdownFromOpenApi(dereferencedContent, {
              operation: {
                path: apiPath,
                method: method.toUpperCase() as HttpMethod,
              },
            });

            // 生成文件名
            const fileName = pathToFileName(apiPath, method);
            const pagePath = `/${outputDir}/${fileName}.html`;

            // 使用 createPage API 创建页面
            const apiPage = await createPage(app, {
              path: pagePath,
              content: markdown
                .substring(markdown.indexOf("## Operations"))
                .replace("## Operations", "## 操作")
                .replace("#### Parameters", "#### 参数")
                .replace("#### Responses", "#### 响应")
                .replace("##### Status:", "##### 状态码:")
                .replace(/\*\*Example:\*\*/g, "**示例:**")
                .replace(/possible values:/g, "可用值:")
                .replace(/default:/g, "默认:"),
              frontmatter: {
                title: `${method.toUpperCase()} ${apiPath}`,
              },
            });

            app.pages.push(apiPage);
            pageCount++;
          }
        }

        // 创建索引页面
        const indexMarkdown = generateIndexPage(openapiSpec, paths);
        const indexPage = await createPage(app, {
          path: `/${outputDir}/`,
          content: indexMarkdown,
          frontmatter: {
            title: 'API 文档',
          },
        });

        app.pages.push(indexPage);
        console.log(
          `[openapi-generator] Created ${pageCount} API documentation pages in /${outputDir}/`
        );
      } catch (error) {
        console.error('[openapi-generator] Error generating API docs:', error);
      }
    },
  };
};

/**
 * 将 API 路径转换为文件名
 */
function pathToFileName(apiPath: string, method?: string): string {
  const name = apiPath.length == 1 ? 'i_root' : apiPath;
  const baseName = name
    .replace(/^\//, '')
    .replace(/\//g, '-')
    .replace(/\{/g, '_')
    .replace(/}/g, '_')
    .replace(/_+/g, '_')
    .replace(/-+/g, '-')
    .toLowerCase();

  return method ? `${baseName}-${method.toLowerCase()}` : baseName;
}

/**
 * 生成索引页面
 */
function generateIndexPage(
  spec: OpenAPISpec,
  paths: string[]
): string {
  let markdown = `---\ntitle: ${spec?.info?.title}\n---\n\n`;

  markdown += `# ${spec?.info?.title}\n\n`;

  if (spec.info) {
    if (spec.info.title) {
      markdown += `**${spec.info.title}**\n\n`;
    }
    if (spec.info.version) {
      markdown += `版本: ${spec.info.version}\n\n`;
    }
    if (spec.info.description) {
      markdown += `${spec.info.description}\n\n`;
    }
  }

  markdown += `## 端点列表\n\n`;

  // 按路径排序
  const sortedPaths = [...paths].sort();

  for (const apiPath of sortedPaths) {
    const pathItem = spec.paths![apiPath];

    // 获取该路径的所有方法
    const methods = Object.keys(pathItem)
      .filter(key => ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'].includes(key));

    // 为每个方法创建链接
    for (const method of methods) {
      const operation = pathItem[method];
      const fileName = pathToFileName(apiPath, method);
      const summary = operation?.summary || '';
      const methodUpper = method.toUpperCase();

      markdown += `- [\`${methodUpper} ${apiPath}\`](${fileName}.html)`;
      if (summary) {
        markdown += ` - ${summary}`;
      }
      markdown += `\n`;
    }
  }

  return markdown;
}
