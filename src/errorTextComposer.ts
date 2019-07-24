/**
 * Copyright © 2014-2019 Tick42 OOD
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import ajv = require("ajv");

class ErrorTextComposer {
    public compose(errorObject: ajv.ErrorObject): { message: string } {
        const defaultErrorObject = {
            message: errorObject.message ? errorObject.message : "Unable to determine error"
        };

        switch (errorObject.keyword) {
            case "enum":
                return this.handleEnum(errorObject);
            case "required":
                return this.handleRequired(errorObject);
            case "type":
                return this.handleType(errorObject);
            case "additionalProperties":
                return this.handleAdditionalProperties(errorObject);
            default:
                return defaultErrorObject;
        }
    }

    private handleAdditionalProperties(errorObject: ajv.ErrorObject): { message: string } {
        const result = {
            message: "",
        };
        const additionalProperty: string = (errorObject.params as any).additionalProperty;
        result.message = `Should not have the additional property "${additionalProperty}"`;
        return result;
    }

    private handleEnum(errorObject: ajv.ErrorObject): { message: string } {
        const result = {
            message: "",
        };
        const allowedValues: any[] = (errorObject.params as any).allowedValues;
        result.message = `${errorObject.dataPath} should be one of: ${allowedValues.join(", ")}`;
        return result;
    }

    private handleRequired(errorObject: ajv.ErrorObject): { message: string } {

        const result = {
            message: "",
        };

        const missingProperty: string = (errorObject.params as any).missingProperty;
        result.message = `${missingProperty} is missing`;

        return result;
    }

    private handleType(errorObject: ajv.ErrorObject): { message: string } {
        const result = {
            message: "",
        };

        const correctType: string = (errorObject.params as any).type;
        result.message = `${errorObject.dataPath} should be ${correctType}`;

        return result;
    }
}

export default new ErrorTextComposer();