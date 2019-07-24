# glue42-configuration-validator

## Features

### Template generation
You can generate templates of five types of glue applications: Exe, Window, Service window, Activity, Node. This can be done either by clicking on the `Invalid application configuration` label on the status bar or with the command `Generate Config: %The type of the application%`.

### Real time validation
All json files will be validated on every save and on every change of the active editor.

### Local deployment
When you are done with the config you can deploy(copy) it to the glue application configuration folder either by the command `Deploy to Glue` or by clicking on the `Valid application configuration` label on the status bar.

## Extension Settings

This extension contributes the following settings:

* `glue-configuration-validator.glueDeploymentPath`: the path which will be used to deploy the application configuration after you are done
* `glue-configuration-validator.overwriteContents`: enable/disable the overwriting of the config file when a template is generated