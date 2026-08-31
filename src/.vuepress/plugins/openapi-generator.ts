import type { Plugin } from 'vuepress';
import { createPage } from 'vuepress/core'
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { dereference } from '@scalar/openapi-parser';
import { Liquid } from 'liquidjs';
import { OpenAPIV3_1 } from "openapi-types";

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

type OpenAPIMethods = `${OpenAPIV3_1.HttpMethods}`;

const operationTemplate = `## {{ summary }}

{{ description }}

{% if query.size > 0 %}### Query

{% for parameter in query %}
#### \`{{ parameter.name }}\` <span style="color: #64666f;">{{ parameter.schema.type }}</span>{% if parameter.required != "可选" %} <span style="color: oklch(63.7% 0.237 25.331);">{{ parameter.required }}</span>{% endif %}

{{ parameter.description }}

{% if parameter.default != blank %}- 默认：\`{{ parameter.default }}\`
{% endif %}{% if parameter.example != blank %}- 示例：\`{{ parameter.example }}\`
{% endif %}{% if parameter.enum != blank %}- 枚举：{% for item in parameter.enum %}\`{{ item }}\` {% endfor %}

{% endif %}{% endfor %}{% endif %}---

### Responses
{% for response in responses %}
#### {% if response.status <= 299 %}<span style="color: oklch(72.3% 0.219 149.579);">{{ response.status }}</span>{% elsif response.status <= 399 %}<span style="color: oklch(62.3% 0.214 259.815);">{{ response.status }}</span>{% elsif response.status <= 599 %}<span style="color: oklch(64.5% 0.246 16.439);">{{ response.status }}</span>{% else %}{{ response.status }}{% endif %}

{{ response.description }}

##### Body

{% for body in response.bodies %}

###### {{ body.mediaType }}

{% if body.primitive %}
<span style="color: #64666f;">{{ body.schema.type }}</span>
{% else %}
{% for property in body.properties %}- \`{{ property.name }}\` <span style="color: #64666f;">{{ property.schema.type }}</span> <span style="color: oklch(63.7% 0.237 25.331);">{{ property.required }}</span>
{% endfor %}
{% endif %}
---

\`\`\`{{ body.syntax }}
{{ body.example }}
\`\`\`
{% endfor %}
{% endfor %}`;

const liquid = new Liquid({ strictVariables: false });

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

        const openapiSpec: OpenAPIV3_1.Document = result.schema as OpenAPIV3_1.Document;

        if (!openapiSpec.paths) {
          console.warn('[openapi-generator] No paths found in OpenAPI spec');
          return;
        }

        // 为每个路径的每个方法创建页面
        const paths = Object.keys(openapiSpec.paths);
        console.log(`[openapi-generator] Creating pages for ${paths.length} API paths...`);

        let pageCount = 0;
        for (const apiPath of paths) {
          const pathItem = openapiSpec.paths[apiPath];
          const methods: OpenAPIMethods[] = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'];

          for (const method of methods) {
            if (!pathItem?.[method]) continue;

            const markdown = await renderOperationMarkdown(pathItem[method]);

            // 生成文件名
            const fileName = pathToFileName(apiPath, method);
            const pagePath = `/${outputDir}/${fileName}.html`;

            // 使用 createPage API 创建页面
            const apiPage = await createPage(app, {
              path: pagePath,
              content: markdown,
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

async function renderOperationMarkdown(operation: OpenAPIV3_1.OperationObject): Promise<string> {
  const query = (operation.parameters ?? [])
    .filter((parameter: OpenAPIV3_1.ParameterObject | OpenAPIV3_1.ReferenceObject) => 'in' in parameter)
    .map((parameter) => {
      const schema = parameter.schema as OpenAPIV3_1.NonArraySchemaObject;
      const oneOf = schema.oneOf as OpenAPIV3_1.NonArraySchemaObject[];
      return {
        name: parameter.name ?? "",
        schema: normalizeSchema(parameter.schema as OpenAPIV3_1.ArraySchemaObject | OpenAPIV3_1.NonArraySchemaObject),
        required: parameter.required ? "必填" : "可选",
        description: parameter.description ?? "",
        default: schema?.default,
        example: parameter.example ?? schema?.example,
        enum: oneOf?.[0]?.enum ?? schema?.enum
      };
    });


  const responses = Object.entries(operation.responses ?? {}).map(([status, response]) => ({
    status,
    description: response?.description ?? '',
    bodies: Object.entries((response as OpenAPIV3_1.ResponseObject)?.content ?? {}).map(([mediaType, media]) =>
      createResponseBody(mediaType, media?.schema as OpenAPIV3_1.ArraySchemaObject | OpenAPIV3_1.NonArraySchemaObject)
    ),
  }));

  return liquid.parseAndRender(operationTemplate, {
    summary: operation.summary ?? operation.operationId ?? '',
    description: operation.description ?? '',
    query,
    responses,
  });
}

function createResponseBody(mediaType: string, schema: OpenAPIV3_1.ArraySchemaObject | OpenAPIV3_1.NonArraySchemaObject) {
  const normalizedSchema = normalizeSchema(schema);
  const primitive = normalizedSchema.type !== 'object' || !normalizedSchema.properties;
  const properties = Object.entries(normalizedSchema.properties ?? {}).map(([name, property]) => ({
    name,
    schema: normalizeSchema(property as OpenAPIV3_1.ArraySchemaObject | OpenAPIV3_1.NonArraySchemaObject),
    required: normalizedSchema.required?.includes(name) ? '必填' : '可选',
  }));

  return {
    mediaType,
    schema: normalizedSchema,
    primitive,
    properties,
    syntax: mediaType === 'application/xml' ? 'xml' : mediaType === 'text/html' ? 'html' : 'json',
    example: primitive
      ? normalizedSchema.type ?? 'string'
      : createExample(normalizedSchema, mediaType),
  };
}

function normalizeSchema(schema: OpenAPIV3_1.ArraySchemaObject | OpenAPIV3_1.NonArraySchemaObject): OpenAPIV3_1.ArraySchemaObject | OpenAPIV3_1.NonArraySchemaObject {
  if (!schema) return { type: 'string' };
  if (schema.type === "array") return { ...schema, type: "array" };
  if (schema.type) return schema;
  if (schema.properties) return { ...schema, type: 'object' };
  if (schema.oneOf) return { ...schema, type: (schema?.oneOf?.[0] as OpenAPIV3_1.NonArraySchemaObject)?.type ?? 'object' };
  return { ...schema, type: 'object' };
}

function createExample(schema: OpenAPIV3_1.ArraySchemaObject | OpenAPIV3_1.NonArraySchemaObject, mediaType: string): string {
  const value = Object.fromEntries(
    Object.entries(schema.properties ?? {}).map(([name, property]) => [
      name,
      exampleValue(normalizeSchema(property as OpenAPIV3_1.ArraySchemaObject | OpenAPIV3_1.NonArraySchemaObject)),
    ])
  );

  if (mediaType === 'application/xml') {
    const name = schema?.xml?.name ?? "root";
    return `<${name}>\n${Object.entries(value).map(([name, item]) => `  <${name}>${item}</${name}>`).join('\n')}\n</${name}>`;
  }

  return JSON.stringify(value, null, 2);
}

function exampleValue(schema: OpenAPIV3_1.ArraySchemaObject | OpenAPIV3_1.NonArraySchemaObject): unknown {
  if (schema.example !== undefined) return schema.example;
  if (schema.default !== undefined) return schema.default;
  if (schema.type === 'object') return createExampleValue(schema);
  if (schema.type === 'array') return [exampleValue(normalizeSchema(schema.items as OpenAPIV3_1.NonArraySchemaObject | OpenAPIV3_1.ArraySchemaObject))];
  if (schema.type === 'integer' || schema.type === 'number') return 0;
  if (schema.type === 'boolean') return true;
  return 'string';
}

function createExampleValue(schema: OpenAPIV3_1.ArraySchemaObject | OpenAPIV3_1.NonArraySchemaObject): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(schema.properties ?? {}).map(([name, property]) => [
      name,
      exampleValue(normalizeSchema(property as OpenAPIV3_1.ArraySchemaObject | OpenAPIV3_1.NonArraySchemaObject)),
    ])
  );
}

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
  spec: OpenAPIV3_1.Document,
  paths: string[]
): string {
  let markdown = `---\nicon: plug\ntitle: ${spec?.info?.title}\ndescription: TASA-Ed 工作室提供的 RUST-API\nisOriginal: true\n---\n\n`;

  if (spec.info) {
    if (spec.info.description) {
      markdown += `${spec.info.description}\n\n`;
    }
    if (spec.info.version) {
      markdown += `版本: ${spec.info.version}\n\n`;
    }
    if (spec.info?.license?.name) {
      markdown += `许可证: ${spec.info?.license?.name}\n\n`;
    }
  }

  if (spec.servers) {
    markdown += `## 服务器列表\n\n`;
    for (const server of spec.servers) {
      markdown += `${server.description}\n\n`;
      markdown += `\`\`\`text :no-line-numbers\n${server.url}\n\`\`\`\n\n`;
    }
  }

  markdown += `## 端点列表\n\n`;

  // 按路径排序
  const sortedPaths = [...paths].sort();

  const taggedPaths: Record<string, string> = {};

  for (const apiPath of sortedPaths) {
    const pathItem = spec.paths![apiPath] as OpenAPIV3_1.PathItemObject;

    // 获取该路径的所有方法
    const methods = Object.keys(pathItem)
      .filter(key => ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'].includes(key));

    // 为每个方法创建链接
    for (const method of methods) {
      const operation = pathItem[method as OpenAPIMethods];
      const fileName = pathToFileName(apiPath, method);
      const summary = operation?.summary || '';
      const methodUpper = method.toUpperCase();

      if (operation?.tags) for (const tagName of operation?.tags) {
        if(!taggedPaths[tagName]) taggedPaths[tagName] = "";
        taggedPaths[tagName] += `- [\`${methodUpper} ${apiPath}\`](${fileName}.html)`;
        if (summary) {
          taggedPaths[tagName] += ` - ${summary}`;
        }
        taggedPaths[tagName] += `\n`;
      } else {
        if(!taggedPaths.__untagged) taggedPaths.__untagged = "";
        taggedPaths.__untagged += `- [\`${methodUpper} ${apiPath}\`](${fileName}.html)`;
        if (summary) {
          taggedPaths.__untagged += ` - ${summary}`;
        }
        taggedPaths.__untagged += `\n`;
      }
    }
  }

  if (spec.tags) for (const tag of spec.tags) {
    markdown += `### ${tag.description ?? tag.name}\n\n`;
    markdown += taggedPaths[tag.name] ?? "无";
    markdown += "\n\n";
  }

  if (taggedPaths.__untagged) {
    markdown += `### 无标签\n\n`;
    markdown += taggedPaths.__untagged;
  }

  return markdown;
}
