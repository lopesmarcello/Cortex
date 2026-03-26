export interface ProjectProfile {
  language: 'typescript' | 'javascript' | 'python' | 'go' | 'rust' | 'other';
  framework: string;
  packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun' | 'python' | 'other';
  monorepo: boolean;
  cicd: string[];
  existingAi: {
    copilot: boolean;
    claude: boolean;
    cursor: boolean;
  };
}

export interface Config {
  version: number;
  project: {
    name: string;
    language: ProjectProfile['language'];
    framework: string;
    packageManager: ProjectProfile['packageManager'];
    monorepo: boolean;
  };
  adapters: {
    copilot: {
      enabled: boolean;
      instructionsMode: 'concatenated' | 'referenced';
    };
    claude: {
      enabled: boolean;
      instructionsMode: 'concatenated' | 'referenced';
    };
    cursor: {
      enabled: boolean;
      instructionsMode: 'concatenated' | 'individual';
    };
  };
  sync: {
    autoSync: boolean;
    warnManualEdits: boolean;
  };
  tasks: {
    idPrefix: string;
    activeDir: string;
    doneDir: string;
  };
  language: string;
}

export interface TaskFile {
  id: string;
  description: string;
  instructions: string[];
  agent: string;
  steps: string[];
  acceptanceCriteria: string[];
  status: 'in-progress' | 'human-review' | 'done';
}

export interface InstructionFile {
  name: string;
  title: string;
  content: string;
}

export interface AgentFile {
  name: string;
  title: string;
  description: string;
  content: string;
  instructionReferences: string[];
}
