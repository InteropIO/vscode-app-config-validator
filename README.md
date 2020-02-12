# Glue42 Configuration Validator

Tool that lints the application configuration files for [Glue42 Desktop](https://glue42.com/).

## Features

### Real Time Validation

All `.json` files will be validated on every save and on every change of the active editor. Configuration errors can be underlined, depending on configuration. An intellisense feature shows which required properties are missing from the configuration.

### Configuration Template Generation

You can generate configuration templates for five types of Glue42 applications - `Window`, `Exe`, `Activity`, `Node` and `Service Window`. This can be done either by clicking on the `Invalid application configuration` label on the status bar or with the command `Generate Config: %Application Type%`. For instance, the command `Generate Config: Window` will create a template configuration for a Glue42 `Window` application.

### Local Configuration Deployment

When you are ready with the application configuration file, you can deploy (copy) it to the specified Glue42 application configuration folder either by the command `Deploy to Glue` or by clicking on the `Valid application configuration` label on the status bar.

## Extension Settings

This extension contributes the following settings:

- `glue-configuration-validator.glueDeploymentPath` - the path which will be used to deploy the application configuration file after you are ready with it;

- `glue-configuration-validator.overwriteContents` - enable/disable overwriting the configuration file when a template is generated;

- `glue42-configuration-validator.underlineErrors` - choose whether to underline configuration errors in the editor;
