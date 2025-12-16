# Lavlos 2.0 - AI Integration Documentation

## Project Summary

**Lavlos 2.0** is a visual workflow automation platform built with Next.js that enables users to create, manage, and execute automated workflows through an intuitive drag-and-drop interface. The platform functions as a no-code/low-code solution similar to n8n or Zapier, allowing users to connect various services and automate complex business processes.

### Key Features
- **Visual Workflow Editor**: Drag-and-drop interface powered by React Flow
- **Multiple Node Types**: Support for triggers, HTTP requests, AI models, and integrations (Discord, Slack, etc.)
- **Workflow Execution**: Real-time execution with status tracking powered by Inngest
- **AI Integration**: Native support for multiple AI providers (OpenAI, Anthropic, Google Gemini)
- **User Authentication**: Secure authentication using Better Auth
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components

---

## AI Tools Used in the Hackathon Project

The project integrates three major AI providers through the Vercel AI SDK:

### 1. **OpenAI**
- **SDK**: `@ai-sdk/openai` (v2.0.76)
- **Model**: GPT-4
- **Primary Use Case**: Text generation, summarization, content creation
- **Implementation**: `src/features/executions/components/openai/executor.ts`

### 2. **Anthropic (Claude)**
- **SDK**: `@ai-sdk/anthropic` (v2.0.53)
- **Model**: Claude Sonnet 4.5 (`claude-sonnet-4-5`)
- **Primary Use Case**: Advanced reasoning, long-form content, analysis
- **Implementation**: `src/features/executions/components/anthropic/executor.ts`

### 3. **Google Gemini**
- **SDK**: `@ai-sdk/google` (v2.0.44)
- **Model**: Gemini 2.0 Flash (`gemini-2.0-flash`)
- **Primary Use Case**: Fast responses, multimodal capabilities
- **Implementation**: `src/features/executions/components/gemini/executor.ts`

### 4. **Vercel AI SDK**
- **Package**: `ai` (v5.0.106)
- **Purpose**: Unified interface for all AI providers
- **Key Function**: `generateText()` - Standardized text generation across providers

---

## Prompt Structure and Usage

### Prompt Architecture

The platform uses a **two-prompt system** for AI interactions:

1. **System Prompt** (Optional)
   - Defines the AI's behavior and role
   - Default value: `"You are a helpful assistant"`
   - Can be customized per node
   - Compiled with Handlebars templating

2. **User Prompt** (Required)
   - The actual instruction or query sent to the AI
   - Must be provided for every AI node
   - Supports dynamic variable substitution

### Handlebars Templating System

All prompts use **Handlebars** templating for dynamic content injection:

#### Basic Variable Substitution
```handlebars
Summarize this text: {{httpResponse.data}}
```

#### JSON Stringification Helper
The platform includes a custom `json` helper for complex objects:
```handlebars
Analyze this data: {{json httpResponse.data}}
```

This helper converts JavaScript objects to formatted JSON strings, making it easy to pass structured data to AI models.

#### Example Prompt Configurations

**Example 1: Simple Text Processing**
```
System Prompt: You are a helpful assistant that summarizes text concisely.
User Prompt: Summarize the following: {{httpResponse.data.text}}
```

**Example 2: Data Analysis**
```
System Prompt: You are a data analyst. Provide insights in bullet points.
User Prompt: Analyze this JSON data and provide key insights: {{json httpResponse.data}}
```

**Example 3: Content Generation**
```
System Prompt: You are a creative writer specializing in marketing copy.
User Prompt: Write a product description for: {{productName}} with features: {{json productFeatures}}
```

### Prompt Compilation Flow

1. **User Input**: User enters prompts in the node configuration dialog
2. **Storage**: Prompts are stored as strings in the node's data
3. **Compilation**: During execution, Handlebars compiles prompts with workflow context
4. **Execution**: Compiled prompts are sent to the AI provider
5. **Result Storage**: AI response is stored in workflow context for subsequent nodes

### Code Implementation

```typescript
// Prompt compilation example (from executor.ts files)
const systemPrompt = data.systemPrompt
  ? Handlebars.compile(data.systemPrompt)(context)
  : "You are a helpful assistant";
const userPrompt = Handlebars.compile(data.userPrompt)(context);

// AI API call
const { steps } = await step.ai.wrap("openai-generate-text", generateText, {
  model: openai("gpt-4"),
  system: systemPrompt,
  prompt: userPrompt,
  experimental_telemetry: {
    isEnabled: true,
    recordInputs: true,
    recordOutputs: true,
  },
});
```

---

## AI Integration Approach and Methodology

### Architecture Overview

The AI integration follows a **modular executor pattern** where each AI provider has its own executor function, but shares a common interface and execution flow.

### Key Components

#### 1. **Executor Functions**
Each AI provider has a dedicated executor (`executor.ts`) that:
- Validates required inputs (variable name, credential, user prompt)
- Compiles prompts using Handlebars
- Retrieves encrypted credentials from the database
- Calls the AI provider API
- Publishes real-time status updates
- Returns results in workflow context

**Executor Interface**:
```typescript
type NodeExecutor<T> = (params: {
  data: T;
  nodeId: string;
  userId: string;
  context: Record<string, any>;
  step: InngestStep;
  publish: (event: any) => Promise<void>;
}) => Promise<Record<string, any>>;
```

#### 2. **Credential Management**
- Credentials are encrypted at rest using the `cryptr` library
- Each user can store multiple credentials per provider
- Credentials are fetched securely during execution
- API keys are decrypted only when needed

#### 3. **Workflow Context**
- Each node receives a context object containing outputs from previous nodes
- AI results are stored in context using the specified variable name
- Context flows through the workflow execution chain
- Results can be accessed in subsequent nodes using `{{variableName.text}}`

#### 4. **Real-time Status Updates**
- Uses Inngest channels for real-time status broadcasting
- Status types: `loading`, `success`, `error`
- Enables UI updates during workflow execution
- Provides visibility into AI node execution progress

#### 5. **Error Handling**
- Non-retriable errors for missing required fields
- Retriable errors for API failures
- Error messages published to status channels
- Execution status tracked in database

### Execution Flow

```
1. Workflow Triggered
   ↓
2. Topological Sort (determine execution order)
   ↓
3. For each node:
   a. Get executor from registry
   b. Validate inputs
   c. Compile prompts with context
   d. Fetch credentials
   e. Publish "loading" status
   f. Execute AI call
   g. Publish "success" or "error" status
   h. Store result in context
   ↓
4. Update execution status
   ↓
5. Return final context
```

### Telemetry and Monitoring

All AI calls include telemetry configuration:
```typescript
experimental_telemetry: {
  isEnabled: true,
  recordInputs: true,
  recordOutputs: true,
}
```

This enables:
- Input/output logging for debugging
- Performance monitoring
- Cost tracking
- Usage analytics

### Security Considerations

1. **Credential Encryption**: All API keys encrypted using AES-256
2. **User Isolation**: Credentials scoped to user ID
3. **Secure Storage**: Database-level encryption for sensitive data
4. **No Hardcoded Keys**: All credentials stored in database
5. **Environment Variables**: Provider API keys optional (users provide their own)

### Integration Points

#### Node Configuration UI
- Dialog components (`dialog.tsx`) for each AI provider
- Form validation using Zod schemas
- Credential selection dropdown
- Prompt input fields with helpful descriptions

#### Workflow Execution Engine
- Inngest functions handle async execution
- Topological sorting ensures correct execution order
- Context passing between nodes
- Status updates via channels

#### Database Schema
- Nodes store prompt data as JSON
- Credentials stored encrypted
- Executions tracked with status and outputs

---

## Prompt Examples

### Example 1: Text Summarization Workflow
```
System Prompt: You are a helpful assistant that creates concise summaries.
User Prompt: Summarize the following article in 3 bullet points: {{httpResponse.data.content}}
```

### Example 2: Data Analysis Workflow
```
System Prompt: You are a data analyst. Provide insights in a structured format.
User Prompt: Analyze this JSON data and identify trends: {{json apiResponse.data}}
```

### Example 3: Content Generation Workflow
```
System Prompt: You are a marketing copywriter specializing in product descriptions.
User Prompt: Write a compelling product description for {{productName}} based on these features: {{json productFeatures}}
```

### Example 4: Multi-step AI Workflow
```
Node 1 (OpenAI):
  System: You are a content analyzer
  User: Extract key topics from: {{json inputData}}

Node 2 (Anthropic):
  System: You are a content strategist
  User: Create a content strategy based on these topics: {{json openaiResult.text}}
```

---

## Technical Stack for AI Integration

- **AI SDKs**: Vercel AI SDK (`ai`), Provider-specific SDKs
- **Templating**: Handlebars (`handlebars`)
- **Execution Engine**: Inngest (`inngest`)
- **Real-time Updates**: Inngest Realtime (`@inngest/realtime`)
- **Encryption**: Cryptr (`cryptr`)
- **Validation**: Zod (`zod`)
- **Database**: PostgreSQL with Prisma ORM

---

## Best Practices

1. **Prompt Design**
   - Always provide clear, specific instructions
   - Use system prompts to set context and behavior
   - Leverage the `json` helper for complex data structures

2. **Variable Naming**
   - Use descriptive variable names for AI outputs
   - Follow JavaScript naming conventions (camelCase)
   - Reference outputs in subsequent nodes using `{{variableName.text}}`

3. **Error Handling**
   - Always provide required fields (variable name, credential, user prompt)
   - Test workflows with sample data before production use
   - Monitor execution status for failures

4. **Security**
   - Never hardcode API keys
   - Use encrypted credential storage
   - Rotate credentials regularly

5. **Performance**
   - Consider AI response times in workflow design
   - Use appropriate models for the task (faster models for simple tasks)
   - Monitor telemetry for optimization opportunities

---

## Future Enhancements

Potential improvements for AI integration:
- Support for streaming responses
- Multi-turn conversations
- Function calling / tool use
- Custom model fine-tuning integration
- Prompt templates library
- AI response caching
- Cost optimization features
- Advanced prompt versioning

---

## Conclusion

Lavlos 2.0 provides a robust, flexible platform for integrating AI capabilities into automated workflows. The modular architecture allows for easy addition of new AI providers while maintaining a consistent user experience. The Handlebars templating system enables powerful dynamic prompt generation, and the real-time status updates provide excellent visibility into workflow execution.
