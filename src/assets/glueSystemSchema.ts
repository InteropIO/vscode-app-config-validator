/**
 * Copyright © 2014-2019 Tick42 OOD
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const schema ={
    "$id": "http://glue42.com/gd/system.json",
    "$schema": "http://json-schema.org/draft-06/schema#",
    "description": "Schema describing the system configuration in Glue42 Desktop.",
    "title": "SystemConfig",
    "type": "object",
    "properties": {
        "$schema": {
            "type": "string",
            "title": "Schema",
            "description": "Pointer to the schema against which this document should be validated."
        },
        "region": {
            "type": "string",
            "description": "Glue42 Desktop region",
            "default": "DEMO"
        },
        "env": {
            "type": "string",
            "description": "Glue42 Desktop environment",
            "default": "T42"
        },
        "enableGTF": {
            "type": "boolean",
            "description": "Activates the GTF setup.",
            "default": false
        },
        "glueStoreUrl": {
            "type": "string",
            "description": "Host from where to download the latest Glue42 Desktop."
        },
        "auth": {
            "description": "Whether authentication is enabled or not. It can be `true`(will use the machine username with an empty string as a password), a `string` (will use the string as a username and an empty string as a password) or an object defining `authController`.",
            "oneOf": [
                {
                    "description": "If `false`, login is disabled, uses system username. If `true`, will use the default authentication mechanism.",
                    "type": "boolean",
                    "default": false
                },
                {
                    "description": "If `string`, authentication will be skipped and the specified string will be used as username. May not work in all environments.",
                    "type": "string"
                },
                {
                    "type": "object",
                    "description": "User credentials object.",
                    "required": [
                        "username",
                        "password"
                    ],
                    "properties": {
                        "username": {
                            "type": "string"
                        },
                        "password": {
                            "type": "string"
                        }
                    },
                    "additionalProperties": false
                }
            ]
        },
        "gw": {
            "description": "Gateway configuration.",
            "type": "object",
            "properties": {
                "embedded": {
                    "description": "Whether to embed the Gateway in Glue42 Desktop or not.",
                    "type": "boolean"
                },
                "configuration": {
                    "$ref": "#/definitions/gatewayConfig"
                },
                "url": {
                    "description": "A host to connect to. Will be used only if `embedded` is `false`.",
                    "type": "string"
                }
            },
            "additionalProperties": false
        },
        "windows": {
            "description": "Defines defaults for various window settings like border color, size areas, buttons etc.",
            "default": {},
            "$ref": "#/definitions/windowsConfig"
        },
        "appStores": {
            "description": "Defines one or more sources of application configuration.",
            "type": "array",
            "items": {
                "$ref": "#/definitions/appStoreConfig"
            },
            "additionalProperties": false
        },
        "autoStart": {
            "description": "Defines auto-start batch parameters.",
            "type": "object",
            "default": {
                "priorityEnabled": true,
                "highPriorityBatchSize": 3,
                "highPriorityApplicationTimeout": 1000,
                "lowPriorityBatchSize": 5,
                "lowPriorityBatchDelay": 5000
            },
            "properties": {
                "priorityEnabled": {
                    "description": "If `true`, then apps will be started by priority.",
                    "type": "boolean"
                },
                "highPriorityBatchSize": {
                    "description": "The number of high priority applications from the same priority group that will be started together.",
                    "type": "number"
                },
                "highPriorityApplicationTimeout": {
                    "description": "A timeout in milliseconds that the system will use to wait for high priority applications to start.",
                    "type": "number"
                },
                "lowPriorityBatchSize": {
                    "description": "The number of low priority applications that will be started together in regular intervals (specified below).",
                    "type": "number"
                },
                "lowPriorityBatchDelay": {
                    "description": "The delay in milliseconds that the system will wait before running the next low priority applications batch.",
                    "type": "number"
                }
            },
            "additionalProperties": false
        },
        "splash": {
            "default": {},
            "$ref": "#/definitions/splashConfig"
        },
        "showWindowsInTrayMenu": {
            "description": "Shows all windows in the system tray menu.",
            "type": "boolean",
            "default": true,
            "additionalProperties": false
        },
        "showAppsInTrayMenu": {
            "description": "Shows all applications in the system tray menu.",
            "type": "boolean",
            "default": true,
            "additionalProperties": false
        },
        "systemAppStores": {
            "description": "Defines stores that will hold system applications. These will be auto-started initially. Store is not monitored for changes.",
            "type": "array",
            "items": {
                "$ref": "#/definitions/appStoreConfig"
            },
            "additionalProperties": false
        },
        "processAffinity": {
            "description": "Process reuse configuration.",
            "default": true,
            "oneOf": [
                {
                    "description": "Whether process reuse is enabled or not.",
                    "type": "boolean"
                },
                {
                    "$ref": "#/definitions/processReuseConfig"
                }
            ]
        },
        "nodePath": {
            "description": "The path of the node.",
            "type": "string"
        },
        "issueReporting": {
            "type": "object",
            "description": "The issue reporting configuration in Glue42 Desktop.",
            "default": {
                "mail": {
                    "enabled": false
                },
                "jira": {
                    "enabled": false
                },
                "folderAttachments": []
            },
            "properties": {
                "attachScreenshots": {
                    "type": "boolean",
                    "description": "Attaches screenshots of all monitors to the issue report."
                },
                "jira": {
                    "description": "Jira configuration.",
                    "type": "object",
                    "properties": {
                        "enabled": {
                            "type": "boolean",
                            "description": "Enables the option to create a ticket with the issue.",
                            "default": "false"
                        },
                        "url": {
                            "type": "string",
                            "description": "The link to the Jira API."
                        },
                        "user": {
                            "type": "string",
                            "description": "The username of the user which will create the ticket."
                        },
                        "password": {
                            "type": "string",
                            "description": "The password of the user which will create the ticket"
                        },
                        "project": {
                            "type": "string",
                            "description": "The name of the project in which the ticket will be created."
                        },
                        "preferredRole": {
                            "type": "string"
                        },
                        "preferredRoleDescriptor": {
                            "type": "string"
                        },
                        "useProjectLeadAsPreferredAssignee": {
                            "type": "boolean"
                        }
                    },
                    "if": {
                        "properties": {
                            "enabled": {
                                "enum": [
                                    true
                                ]
                            }
                        }
                    },
                    "then": {
                        "required": [
                            "url",
                            "user",
                            "password",
                            "project"
                        ]
                    },
                    "additionalProperties": false
                },
                "mail": {
                    "description": "The email configuration.",
                    "type": "object",
                    "properties": {
                        "enabled": {
                            "type": "boolean",
                            "description": "Enables the option to create a ticket with the issue.",
                            "default": "false"
                        },
                        "zipAttachments": {
                            "type": "boolean",
                            "description": "Archives the attachments."
                        },
                        "bugSubjectPrefix": {
                            "type": "string",
                            "description": "A string which will act as a prefix in the subject of the email when the issue is a bug."
                        },
                        "reportSubjectPrefix": {
                            "type": "string",
                            "description": "A string which will act as a prefix in the subject of the email when the issue is feedback."
                        },
                        "recipients": {
                            "type": "array",
                            "description": "The email addressess which will receive the issue report.",
                            "items": {
                                "type": "string",
                                "description": "Single email address."
                            }
                        },
                        "allowEditRecipients": {
                            "type": "boolean",
                            "description": "Enables the user to manually add more recipients."
                        },
                        "maxAttachmentMB": {
                            "type": "string"
                        }
                    },
                    "additionalProperties": false
                },
                "folderAttachments": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "name": {
                                "type": "string",
                                "description": "Name of the attachment."
                            },
                            "folderPath": {
                                "type": "string",
                                "description": "Path to the folder."
                            },
                            "zipFolderPath": {
                                "type": "string",
                                "description": "Path in the zip folder."
                            },
                            "filter": {
                                "type": "string",
                                "description": "Filter what will be applied to each file in the folder."
                            }
                        },
                        "required": [
                            "name",
                            "folderPath",
                            "zipFolderPath",
                            "filter"
                        ],
                        "additionalProperties": false
                    },
                    "additionalProperties": false
                }
            },
            "required": [
                "jira",
                "mail",
                "folderAttachments"
            ],
            "additionalProperties": false
        },
        "useEmbeddedShell": {
            "description": "Whether to use the embedded shell application.",
            "type": "boolean",
            "default": true
        },
        "registerHtmlContainer": {
            "description": "Whether to inject the `htmlContainer` object. It will be used for legacy application.",
            "type": "boolean",
            "default": false
        },
        "licREST": {
            "description": "",
            "type": "string"
        },
        "activityColors": {
            "description": "Colors that will be used for the borders of activities.",
            "type": "array",
            "items": {
                "type": "string"
            },
            "default": [
                "#4b5d60",
                "#394e78",
                "#31758c",
                "#318c71",
                "#657839"
            ]
        },
        "hotkeys": {
            "description": "Hotkeys configuration.",
            "default": true,
            "oneOf": [
                {
                    "description": "Whether hotkeys are enabled or not.",
                    "type": "boolean"
                },
                {
                    "$ref": "#/definitions/hotkeys"
                }
            ]
        },
        "swimlane": {
            "$ref": "#/definitions/swimlaneConfig"
        },
        "downloads": {
            "defaults": {},
            "$ref": "#/definitions/downloadConfig"
        },
        "extensions": {
            "description": "Array of extensions to be added. Each item is a path to a folder that contains the extension.",
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "devToolsExtensions": {
            "description": "Array of extensions to be added to devTools. Each item is a path to a folder that contains the extension.",
            "type": "array",
            "items": {
                "type": "string"
            }
        }
    },
    "definitions": {
        "appStoreConfig": {
            "oneOf": [
                {
                    "$ref": "#/definitions/appStorePathConfig"
                },
                {
                    "$ref": "#/definitions/appStoreGcsConfig"
                }
            ]
        },
        "appStorePathConfig": {
            "type": "object",
            "required": [
                "type",
                "details"
            ],
            "additionalProperties": false,
            "properties": {
                "type": {
                    "enum": [
                        "path"
                    ]
                },
                "details": {
                    "type": "object",
                    "required": [
                        "path"
                    ],
                    "additionalProperties": false,
                    "properties": {
                        "path": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "appStoreGcsConfig": {
            "type": "object",
            "required": [
                "type"
            ],
            "additionalProperties": false,
            "properties": {
                "type": {
                    "enum": [
                        "cm",
                        "gcs"
                    ]
                },
                "details": {
                    "type": "object",
                    "required": [],
                    "additionalProperties": false,
                    "properties": {
                        "url": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "windowsConfig": {
            "properties": {
                "minWidth": {
                    "description": "Specify default minimum window width.",
                    "type": "number"
                },
                "maxWidth": {
                    "description": "Specify default maximum window width.",
                    "type": "number"
                },
                "minHeight": {
                    "description": "Specify default minimum window height.",
                    "type": "number"
                },
                "maxHeight": {
                    "description": "Specify default maximum window height.",
                    "type": "number"
                },
                "focus": {
                    "description": "If `false`, the window will not take focus when created.",
                    "type": "boolean",
                    "default": true
                },
                "enableEventLogging": {
                    "description": "If `true`, will log each window event received from individual windows.",
                    "type": "boolean",
                    "default": true
                },
                "contextMenu": {
                    "description": "Specify default context menu properties.",
                    "properties": {
                        "enabled": {
                            "description": "If `true`, then the context menu will be enabled, otherwise it will be disabled.",
                            "type": "boolean",
                            "default": false
                        }
                    },
                    "additionalProperties": false
                },
                "security": {
                    "default": {},
                    "$ref": "#/definitions/securityConfig"
                }
            },
            "additionalProperties": false
        },
        "splashConfig": {
            "description": "Splash screen configuration.",
            "properties": {
                "url": {
                    "description": "The URL, where the splash screen is hosted.",
                    "default": "file://%GDDIR%/assets/splash/splash.html",
                    "type": "string"
                },
                "width": {
                    "description": "Specify window width.",
                    "default": 350,
                    "type": "number"
                },
                "height": {
                    "description": "Specify window height.",
                    "default": 233,
                    "type": "number"
                }
            },
            "additionalProperties": false
        },
        "processReuseConfig": {
            "description": "Process reuse configuration.",
            "type": "object",
            "properties": {
                "maxWindowsInProcess": {
                    "description": "Maximum number of windows in a single process.",
                    "type": "number",
                    "default": 1
                },
                "groupByDefault": {
                    "description": "If `true`, any window without a group tag will be treated as having a default tag and therefore be grouped with all other windows with the default tag.",
                    "type": "boolean",
                    "default": false
                },
                "reuseSlots": {
                    "description": "If `false`, a slot freed by a closed window will never be reused. This means that the number of long living processes will eventually be reduced, which is valuable if a proper garbage collection process has not been triggered.",
                    "type": "boolean",
                    "default": false
                }
            },
            "additionalProperties": false
        },
        "hotkeys": {
            "description": "Hotkey settings.",
            "type": "object",
            "properties": {
                "enabled": {
                    "type": "boolean",
                    "default": true
                },
                "blacklist": {
                    "type": "array",
                    "description": "List of applications that cannot register hotkeys. Any app that is not on the list can register hotkeys.",
                    "items": {
                        "type": "string",
                        "description": "Single email."
                    }
                },
                "whitelist": {
                    "type": "array",
                    "description": "List of applications that can register hotkeys. Any app that is not on the list cannot register hotkeys.",
                    "items": {
                        "type": "string",
                        "description": "Single email."
                    }
                },
                "reservedHotkeys": {
                    "type": "array",
                    "description": "List of reserved hotkeys that apps cannot override.",
                    "items": {
                        "type": "string",
                        "description": "Single email."
                    }
                }
            },
            "additionalProperties": false
        },
        "gatewayConfig": {
            "type": "object",
            "properties": {
                "showConsole": {
                    "description": "If `true`, the console will be visible.",
                    "type": "boolean"
                },
                "port": {
                    "description": "The Gateway will start on that port.",
                    "type": "integer",
                    "default": 8080
                },
                "logLevel": {
                    "type": "string"
                },
                "logConfig": {
                    "type": "object",
                    "properties": {
                        "appenders": {},
                        "categories": {}
                    },
                    "additionalProperties": false
                },
                "cluster": {
                    "type": "object",
                    "properties": {
                        "enabled": {
                            "type": "boolean",
                            "default": false
                        },
                        "configuration": {
                            "type": "object",
                            "properties": {
                                "binding": {
                                    "type": "object",
                                    "properties": {
                                        "port": {
                                            "type": "number",
                                            "default": 8085
                                        },
                                        "ip": {
                                            "type": "string",
                                            "default": "0.0.0.0"
                                        }
                                    },
                                    "additionalProperties": false
                                },
                                "directory": {
                                    "type": "object",
                                    "properties": {
                                        "type": {
                                            "type": "string",
                                            "default": "rest"
                                        },
                                        "config": {
                                            "type": "object",
                                            "properties": {
                                                "directory_uri": {
                                                    "type": "string",
                                                    "default": "http://localhost:8888"
                                                },
                                                "announce_interval": {
                                                    "type": "number",
                                                    "default": 10000
                                                }
                                            },
                                            "additionalProperties": false
                                        }
                                    },
                                    "additionalProperties": false
                                }
                            },
                            "additionalProperties": false
                        }
                    },
                    "additionalProperties": false
                }
            },
            "additionalProperties": true
        },
        "securityConfig": {
            "description": "Global security settings.",
            "default": {},
            "properties": {
                "webSecurity": {
                    "description": "When `false`, the same-origin policy will be disabled (usually used when testing web apps) and `allowRunningInsecureContent` will be set to `true`, if not already set to `true` by the user.",
                    "type": "boolean",
                    "default": true
                },
                "popups": {
                    "description": "",
                    "type": "boolean",
                    "default": false
                },
                "stopLoadingOnCertificationErrors": {
                    "description": "",
                    "type": "boolean",
                    "default": true
                },
                "navigateOnDragDrop": {
                    "description": "Whether dragging and dropping a file or link onto the page triggers navigation.",
                    "type": "boolean",
                    "default": false
                },
                "sandbox": {
                    "description": "If set, this will sandbox the renderer associated with the window, making it compatible with the Chromium OS-level sandbox and disabling the Node.js engine.",
                    "type": "boolean",
                    "default": true
                },
                "contextIsolation": {
                    "description": "",
                    "type": "boolean",
                    "default": false
                },
                "nodeIntegration": {
                    "description": "Whether node integration is enabled.",
                    "type": "boolean",
                    "default": false
                }
            },
            "additionalProperties": false
        },
        "swimlaneConfig": {
            "description": "Swimlane configurations",
            "type": "object",
            "properties": {
                "loadControl": {
                    "$ref": "#/definitions/loadControlConfig"
                }
            },
            "additionalProperties": false
        },
        "loadControlConfig": {
            "description": "Configurations around load order of applications when restoring workspaces in Swimlane",
            "type": "object",
            "properties": {
                "restoreStrategy": {
                    "type": "string",
                    "description": "Default restore strategy when restoring Swimlane workspaces",
                    "enum": [
                        "direct",
                        "delayed",
                        "lazy"
                    ]
                },
                "initialOffsetInterval": {
                    "type": "number",
                    "description": "Valid only in delayed mode."
                },
                "interval": {
                    "type": "number",
                    "description": "Valid only in delayed mode."
                },
                "batch": {
                    "type": "number",
                    "description": "Valid only in delayed mode."
                },
                "showDelayedIndicator": {
                    "type": "boolean",
                    "description": "",
                    "default": false
                }
            },
            "additionalProperties": false
        },
        "downloadConfig": {
            "description": "Object that defines file download behavior in the window",
            "type": "object",
            "additionalProperties": false,
            "default": {},
            "properties": {
                "autoSave": {
                    "description": "If true will auto save the file (without asking the user where to save it). If false a system save dialog will appear.",
                    "type": "boolean",
                    "default": true
                },
                "autoOpenPath": {
                    "description": "If true will open the folder that contains the downloaded file after the download is completed",
                    "type": "boolean",
                    "default": false
                },
                "autoOpenDownload": {
                    "description": "If true will open the download file after the download is completed",
                    "type": "boolean",
                    "default": false
                },
                "enable": {
                    "description": "If true enables windows to download files",
                    "type": "boolean",
                    "default": true
                },
                "enableDownloadBar": {
                    "description": "If true a download bar tracking progress will appear on the bottom of the window when downloading. If false the download process will be invisible",
                    "type": "boolean",
                    "default": true
                },
                "path": {
                    "description": "Path where the file will be saved.",
                    "type": "string",
                    "default": "%DownloadsFolder%"
                }
            }
        }
    },
    "additionalProperties": false
};

export default schema;