# backstage-plugin-scaffolder-git-actions package

This is a `Maven` actions plugin for the `scaffolder-backend` in Backstage.

This contains a collection of actions for using with git:

- maven

## Prerequisites
- Maven must be installed in the environment your Backstage instance is running in

## Getting started

In the root directory of your Backstage project:

```
yarn add --cwd packages/backend @gcornacchia/backstage-plugin-scaffolder-maven-actions
```

Add the actions you'd like to the scaffolder:

```typescript
// packages/backend/src/plugins/scaffolder.ts

import { mavenAction } from "@gcornacchia/backstage-plugin-scaffolder-maven-actions";
import { ScmIntegrations } from '@backstage/integration';
import { createBuiltinActions, createRouter } from '@backstage/plugin-scaffolder-backend';

...

const integrations = ScmIntegrations.fromConfig(env.config);
const builtInActions = createBuiltinActions({
  catalogClient,
  integrations,
  config: env.config,
  reader: env.reader
});

const actions = [
  mavenAction(),
  ...builtInActions
];

return await createRouter({
  logger: env.logger,
  config: env.config,
  database: env.database,
  reader: env.reader,
  catalogClient,
  actions
});
```

## Example of using the generic git action
```yaml
---
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: maven-demo
  title: My custom maven action
  description: scaffolder action to execute a maven command
spec:
  owner: demo
  type: service

  parameters:
    - title: Generic Maven
      properties:
        repoUrl:
          title: Command
          type: string
          description: Maven command to run
        workingDirectory:
          title: Working Directory
          type: string
          description: The working directory within the scaffolder workspace to run the command
        args:
          title: Args
          type: array
          description: Arguments to pass to the clone command

  steps:
    - id: maven
      name: maven
      action: maven
      input:
        command: ${{ parameters.command }} # ex: 'clean package' 
        workingDirectory: ${{ parameters.workingDirectory }} # ex: './my-working-directory' - will execute the command in the specified directory relative to the scaffolder workspace
        args: ${{ parameters.args }} # ex: ['-P', 'Profile'] - will add '-P Profile' to the arguments passed to the maven command
```