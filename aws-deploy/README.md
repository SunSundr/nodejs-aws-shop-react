# AWS Deployment App

Application for AWS deployment using AWS CDK in TypeScript.

*The project is being developed as part of the [RS School](https://rs.school/) [AWS Cloud Developer Course](https://rs.school/courses/aws-cloud-developer), Feb. 2025*

## Prerequisites

*   AWS CLI configured with appropriate credentials.
*   Node.js and npm installed.

## Installation

1.  Navigate to the `aws-deploy` directory:
    ```bash
    cd aws-deploy
    ```
2.  Install dependencies:
    ```bash
    npm ci
    ```

## Building the Frontend

Before deploying with CDK, you need to build the frontend application. The built frontend files should be located in the `../frontend/dist` directory. Refer to the frontend project's README for detailed build instructions.

## Useful Commands

*   `build`: Cleans the distribution directory and compiles the TypeScript code.
    ```bash
    npm run build
    ```
*   `clean`: Deletes the `dist` directory.
    ```bash
    npm run clean
    ```
*   `watch`: Compiles TypeScript code in watch mode.
    ```bash
    npm run watch
    ```
*   `test`: Runs Jest tests.
    ```bash
    npm run test
    ```
*   `cdk`: Executes CDK commands.
    ```bash
    npm run cdk <command>
    ```
*   `cdk:bootstrap`: Bootstraps the CDK environment.
    ```bash
    npm run cdk:bootstrap
    ```
*   `cdk:deploy`: Deploys the CDK stack. **Make sure the frontend is built before running this command!**
    ```bash
    npm run cdk:deploy
    ```
*   `cdk:destroy`: Destroys the CDK stack.
    ```bash
    npm run cdk:destroy
    ```
*   `cdk:diff`: Shows the difference between the current stack and the deployed stack.
    ```bash
    npm run cdk:diff
    ```
*   `cdk:synth`: Synthesizes the CloudFormation template.
    ```bash
    npm run cdk:synth
    ```
*   `lint`: Runs ESLint to lint and fix code style issues.
    ```bash
    npm run lint
    ```
*   `prettier`: Formats code using Prettier.
    ```bash
    npm run prettier
    ```