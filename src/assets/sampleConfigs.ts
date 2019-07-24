/**
 * Copyright © 2014-2019 Tick42 OOD
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const windowSampleConfig = {
    "name": "SampleName",
    "title": "Sample Application",
    "caption": "Sample caption",
    "type": "window",
    "details": {
        "url": "https://glue42.com",
        "mode": "flat",
        "width": 400,
        "height": 400
    }
};

const exeSampleConfig = {
    "name": "SampleName",
    "title": "Sample Application",
    "caption": "Sample caption",
    "type": "exe",
    "details": {
        "path": "%GDDIR%/../SamplePath/",
        "command": "sample.exe",
        "parameters": "param1 param2",
        "width": 400,
        "height": 400
    }
};

const activitySampleConfig = [
    {
        "title": "Sample activity title",
        "type": "activity",
        "name": "sampleActivityName",
        "hidden": false,
        "details": {
            "initialContext": {
                "foo": "bar"
            },
            "layout": {
                "mode": "pixels"
            },
            "owner": {
                "type": "ActivityOwner",
                "name": "ActivityOwner",
                "left": 20,
                "top": 20,
                "width": 400,
                "height": 400
            },
            "windows": [
                {
                    "type": "ActivityWindow",
                    "name": "ActivityWindow",
                    "left": 20,
                    "top": 20,
                    "width": 400,
                    "height": 400
                }
            ]
        }
    },
    {
        "title": "Activity Owner",
        "type": "window",
        "name": "ActivityOwner",
        "details": {
            "url": "http://activityownerurl.com",
            "mode": "html"
        },
        "activityTarget": {
            "enabled": true,
        }
    },
    {
        "title": "Activity Window",
        "type": "window",
        "name": "ActivityWindow",
        "details": {
            "url": "http://activitywindowurl.com",
            "mode": "html"
        },
        "activityTarget": {
            "enabled": true,
        },
    }
]

const nodeSampleConfig = {
    "title": "Sample node title",
    "type": "node",
    "name": "sampleNode",
    "caption": "Sample Caption",
    "service": true,
    "details": {
        "path": "%GDDIR%/PathToMyServer",
        "showConsole": true
    }
};

const serviceWindowSampleConfig = {
    "name": "sampleServiceWindow",
    "type": "window",
    "service": true,
    "hidden": true,
    "autoStart": true,
    "details": {
        "hidden": true,
        "url": "https://glue42.com"
    }
};

export {
    windowSampleConfig,
    serviceWindowSampleConfig,
    activitySampleConfig,
    nodeSampleConfig,
    exeSampleConfig
};