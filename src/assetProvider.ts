/**
 * Copyright © 2014-2019 Tick42 OOD
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import appSchemaJson = require("./assets/applicationSchema.json");
import systemSchemaJSON = require("./assets/system.json");
import themeSchemaJSON = require("./assets/swTheme.json");

class AssetProvider {
    public readonly systemSchemaLocation = "./assets/system.json";
    public readonly appSchemaLocation = "./assets/applicationSchema.json";
    public readonly themesSchemaLocation = "./assets/swTheme.json";

    private appSchema = appSchemaJson;
    private systemSchema = systemSchemaJSON;
    private themeSchema = themeSchemaJSON;

    public getAppSchema(): string {
        if (!this.appSchema) {
            throw new Error("The application schema was not loaded correctly");
        }

        return JSON.stringify(this.appSchema);
    }

    public getSystemSchema(): string {
        if (!this.systemSchema) {
            throw new Error("The system schema was not loaded correctly");
        }

        return JSON.stringify(this.systemSchema);
    }

    public getThemeSchema(): string {
        if (!this.themeSchema) {
            throw new Error("The themes schema was not loaded correctly");
        }

        return JSON.stringify(this.themeSchema);
    }

    public getHighLevelThemeSchema(): string {
        if (!this.themeSchema) {
            throw new Error("The high level themes schema was not loaded correctly");
        }

        return JSON.stringify(this.simplifyThemeSchema(this.themeSchema));
    }

    private simplifyThemeSchema(themeSchema: object) {
        const schemaCopy = JSON.parse(JSON.stringify(themeSchema));

        schemaCopy.items.properties.properties = {
            description: "",
            type: "object",
            additionalProperties: true,
            properties: {}
        }

        return schemaCopy;
    }
}

export default new AssetProvider();