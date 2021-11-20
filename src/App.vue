<template>
  <Start
    v-if="page === 'Start'"
    :extension="ExtensionInfo"
    :isInit="startIsInit"
    :project="project"
    :homePath="homePath"
    :documentsPath="documentsPath"
    :errorThrow="errorThrow"
    :templateRequire="templateRequire"
    @goToProjectPage="page = 'Project'"
  />
  <Project
    v-else-if="page === 'Project'"
    :extension="ExtensionInfo"
    :isInit="projectIsInit"
    :project="project"
    :homePath="homePath"
    :documentsPath="documentsPath"
    :errorThrow="errorThrow"
    :menu="projectMenu"
    @goToStartPage="page = 'Start'"
  />
  <div v-if="!(startIsInit || projectIsInit)" class="console" v-html="consoleText"></div>
</template>

<script>
import { ipcRenderer } from "electron";
import extEvent from "./extension/extension-event";
import Start from '@/views/Start.vue'
import Project from '@/views/Project.vue'
export default {
  data() {
    return {
      ExtensionInfo: new Array(),
      homePath: "",
      project: new Array(),
      startIsInit: false,
      projectIsInit: false,
      consoleText: "<p>loading...</p>",
      documentsPath: "",
      templateRequire: new Object(),
      page: "Start",
      projectMenu: [
        {
          label: "menu.home",
          submenu: [
            {
              rols: "menu.home.startpage",
              click: () => {
                this.page = 'Start'
              }
            },
            {
              rols: "menu.home.exit",
              click: () => {
                ipcRenderer.send('exit')
              }
            }
          ]
        }
      ]
    };
  },
  components: {
    Start,
    Project
  },
  mounted() {
    // event
    extEvent.on("addTemplate", (info) => {
      this.project.push(info);
      let require = new Array();
      info.require.forEach((parameter) => {
        require.push(
          typeof parameter === "object" ? parameter : { name: parameter }
        );
      });
      this.templateRequire[info.extension.id] = require;
    });
    extEvent.on('projectLoaded', () => {
      this.projectIsInit = true
    })

    // scan folder
    const folder = ["extensions", "config", "tmp"];
    ipcRenderer.send("Init", "Start"); //
    ipcRenderer.on("Init", (event, appInfo) => {
      this.homePath = appInfo.path.home;
      this.documentsPath = appInfo.path.documents;
      const editorPath = this.$path.join(this.homePath, ".nexwebeditor");
      this.consoleText += "<p>[INFO]Scan data directory</p>";
      this.$fs.readdir(editorPath, (err, files) => {
        if (err) {
          this.$fs.mkdir(editorPath, (err) => {
            if (err) {
              this.errorThrow("io");
            }
            folder.forEach((name) => {
              this.$fs.mkdir(this.$path.join(editorPath, name), (err) => {
                this.errorThrow("io");
              });
            });
          });
        } else {
          folder.forEach((name) => {
            if (files.indexOf(name) == -1) {
              this.$fs.mkdir(this.$path.join(editorPath, name), (err) => {
                this.errorThrow("io");
              });
            }
          });
          this.consoleText += "<p>[INFO]Load extension...</p>";
          this.ExtensionInfo =
            this.$extension.extensionManager.LoadExtensionFromLocal(editorPath);
          this.ExtensionInfo.forEach((ExtInfo) => {
            this.$extension.extensionManager.runExtension(
              ExtInfo,
              ExtInfo.path
            );
          });
          this.$extension.extensionManager.InitExt();
          this.consoleText += `<p>[INFO]${this.ExtensionInfo.length} extension detected</p>`;
          this.consoleText += `<p>[INFO]Complete</p>`;
          this.startIsInit = true;
        }
      });
    });
  },
  methods: {
    errorThrow: function (type) {
      switch (type) {
        case "io":
          this.errorCode = "1";
          this.warningShow = true;
          this.consoleText +=
            "<p>[ERR]The directory '~/.nexwebeditor' cannot be write. Please ensure that the permissions of the folder are normal, or close the anti-virus software temporarily</p>";
          throw "Read / write permission error";
      }
    },
  },
};
</script>

<style>
* {
  font-family: Helvetica;
  margin: 0;
  padding: 0;
  color: #eee;
  box-sizing: border-box;
}

body {
  background-color: rgb(24, 24, 24);
}

a {
  text-decoration: none;
}

.console {
  transition: 0.3s;
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  opacity: 1;
  overflow: hidden;
  z-index: 2000;
  backdrop-filter: blur(2px);
  background-color: rgba(50, 50, 50, 0.7);
}

*::-webkit-scrollbar {
  width: auto;
  height: 4px;
  border-radius: 50%;
}
*::-webkit-scrollbar-thumb {
  background-color: rgb(196, 196, 196);
}
*::-webkit-scrollbar-track {
  background-color: rgb(68, 67, 67);
  border-radius: 50%;
}
</style>