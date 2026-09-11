import { App, PluginSettingTab, Setting } from "obsidian";
import LapelPlugin from "./index";

export interface LapelSettings {
  showInSourceMode: boolean;
}

export const DEFAULT_SETTINGS: LapelSettings = {
  showInSourceMode: false,
};

export class LapelSettingsTab extends PluginSettingTab {
  plugin: LapelPlugin;

  constructor(app: App, plugin: LapelPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName("Show in source mode")
      .setDesc("Toggle whether the overlay heading markers are shown in source mode.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.showInSourceMode)
          .onChange(async (value) => {
            void this.plugin.updateSettings(() => ({ showInSourceMode: value }));
          })
      );
  }
}
