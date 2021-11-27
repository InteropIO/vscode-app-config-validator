/**
 * Copyright © 2014-2020 Tick42 OOD
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as vscode from 'vscode';
import * as json5 from "json5";
import * as ajv from "ajv";
import errorTextComposer from "../errorTextComposer";
import { ValidationSummary, ValidationError, Validator } from './types';
import assetProvider from '../assetProvider';

export class ApplicationConfigValidator implements Validator {
    private readonly ajvVal: ajv.Ajv;
    private readonly AppSchemaEmptyKey = "application-empty.json";
    private readonly AppSchemaKey = "appSchema";
    private readonly SystemSchemaKey = "systemSchema";
    private readonly AuthControllerSchemaKey = "authControllerSchema";

    constructor(ajvVal?: ajv.Ajv) {
        const withOutsideInstance = ajvVal !== undefined && ajvVal !== null;
        this.ajvVal = ajvVal || new ajv({ useDefaults: true, meta: true, jsonPointers: true });

        if (!withOutsideInstance) {
            this.ajvVal.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
            require("ajv-keywords")(this.ajvVal, ["transform"]);
        }
    }

    public get priorityIndex() {
        return 1;
    }

    public init() {
        const glueAppSchema = assetProvider.getAppSchema();
        const glueSystemSchema = assetProvider.getSystemSchema();
        const glueAuthControllerSchema = assetProvider.getAuthControllerSchema();

        this.ajvVal.addSchema(JSON.parse(glueAppSchema), this.AppSchemaKey);
        this.ajvVal.addSchema(JSON.parse(glueSystemSchema), this.SystemSchemaKey);
        this.ajvVal.addSchema(JSON.parse(glueAuthControllerSchema), this.AuthControllerSchemaKey);


        const appSchemaClone: any = JSON.parse(glueAppSchema);
        appSchemaClone.definitions.application.properties.details = { type: "object" };
        appSchemaClone.$id = `http://glue42.com/gd/${this.AppSchemaEmptyKey}`;
        this.ajvVal.addSchema(appSchemaClone, this.AppSchemaEmptyKey);

        const types: string[] = appSchemaClone.definitions.application.properties.type.enum;
        appSchemaClone.definitions.application.properties.type.transform = ["toEnumCase"];
        appSchemaClone.definitions.application.properties.configMode.transform = ["toEnumCase"];
        types.forEach((appType) => {
            const typedSchema = JSON.parse(glueAppSchema) as { [key: string]: any };
            const details = typedSchema.definitions[appType];
            if (appType === "exe") {
                details.properties.mode.transform = ["toEnumCase"];
                details.properties.windowStyle.transform = ["toEnumCase"];
                details.properties.trackingType.transform = ["toEnumCase"];
                details.properties.startingContextMode.transform = ["toEnumCase"];
            } else if (appType === "window") {
                details.properties.mode.transform = ["toEnumCase"];
                details.properties.startLocation.oneOf[0].transform = ["toEnumCase"];
                details.properties.startLocation.oneOf[1].properties.location.transform = ["toEnumCase"];
            } else if (appType === "clickonce") {
                details.properties.mode.transform = ["toEnumCase"];
                details.properties.windowStyle.transform = ["toEnumCase"];
                details.properties.trackingType.transform = ["toEnumCase"];
            }
            typedSchema.definitions.application.properties.details = details;
            typedSchema.$id = `http://glue42.com/gd/application-${appType}.json`;
            this.ajvVal.addSchema(typedSchema, `application-${appType}.json`);
        });
    }

    public validate(document: vscode.TextDocument): ValidationSummary {
        const validationResult = this.validateTextInEditor(document.getText());

        return validationResult;
    }

    public isThemeConfig(text: string): boolean {
        return false;
    }

    private validateTextInEditor(text: string): ValidationSummary {
        try {
            let parsedText = json5.parse(text);
            if (!Array.isArray(parsedText)) {
                parsedText = [parsedText];
            }

            const isValid: boolean = this.ajvVal.validate(this.AppSchemaEmptyKey, parsedText) as boolean;
            const errors = this.ajvVal.errors ? this.ajvVal.errors.map((a) => a) : [];

            if (!isValid) {
                const error: ValidationError = errors && errors[0] ? errorTextComposer.compose(errors[0]) : { message: "Unknown error" };
                error.dataPath = undefined;
                return {
                    isValid,
                    error,
                    isApplicationResult: true,
                    isThemeResult: false
                };
            }

            const validationSummary: Array<ValidationSummary> = (parsedText as any[]).map((appDef: { type: string }) => {

                const appType = appDef.type;

                const appIsValid = this.ajvVal.validate(`application-${appType}.json`, [appDef]) as boolean;
                const appErrors = this.ajvVal.errors ? this.ajvVal.errors.map((a) => a) : [];

                return {
                    isValid: appIsValid,
                    error: appErrors[0] ? errorTextComposer.compose(appErrors[0]) : { message: "Unknown error" },
                    isApplicationResult: true,
                    isThemeResult: false
                };
            });

            const invalidApplications = validationSummary.filter(a => !a.isValid);

            if (invalidApplications.length === 0) {
                return validationSummary[0] || { isValid: true, error: { message: "" } };
            }

            this.modifyDataPathPosition(invalidApplications[0], validationSummary);
            return invalidApplications[0] || { isValid: true, error: { message: "" } };

        } catch (error) {
            return {
                isValid: false,
                error: { message: "Invalid JSON" },
                isApplicationResult: true,
                isThemeResult: false
            };
        }
    }

    private modifyDataPathPosition(error: ValidationSummary, allValidationResults: Array<ValidationSummary>) {
        const realIndex = allValidationResults.indexOf(error);
        if (error.error.dataPath) {
            error.error.dataPath = "/" + realIndex + error.error.dataPath.substring(2);
        }
    }
}