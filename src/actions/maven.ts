import { createTemplateAction, executeShellCommand } from '@backstage/plugin-scaffolder-backend';
import path from 'path';

export const mavenAction = () => {
  return createTemplateAction<{ command: string; workingDirectory: string, args: string[] }>({
    id: 'maven',
    schema: {
      input: {
        required: ['command', 'workingDirectory'],
        type: 'object',
        properties: {
          command: {
            type: 'string',
            title: 'Command',
            description: 'The maven command to run',
          },
          workingDirectory: {
            type: 'string',
            title: 'Working Directory',
            description: 'Working directory within the scaffolder workspace to execute the command in'
          },
          args: {
            type: 'array',
            items: {
              type: 'string',
            },
            title: 'Arguments to pass to the command'
          }
        },
      },
    },
    async handler(ctx) {
      let args = [ctx.input.command];
      if (ctx.input.args && ctx.input.args.length) {
        args = [...args, ...ctx.input.args];
      }
      await executeShellCommand({
        command: 'mvn',
        args,
        logStream: ctx.logStream,
        options: {
          cwd: path.resolve(ctx.workspacePath, ctx.input.workingDirectory)
        }
      });

      ctx.logger.info(`Finished executing mvn ${ctx.input.command}`);
    },
  });
};