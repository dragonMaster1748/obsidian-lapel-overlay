import { App, PluginSettingTab, Setting } from "obsidian";
import LapelPlugin from "./index";

export interface LapelSettings {
  showInSourceMode: boolean;
  horizontalOffset: number;
  verticalOffset: number;
  markerSize: number;
}

export const DEFAULT_SETTINGS: LapelSettings = {
  showInSourceMode: false,
  horizontalOffset: 0,
  verticalOffset: 0,
  markerSize: 100,
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
            await this.plugin.updateSettings(() => ({ showInSourceMode: value }));
          })
      );

    new Setting(containerEl)
      .setName("Horizontal position")
      .setDesc("Move heading markers left or right.")
      .addSlider((slider) =>
        slider
          .setLimits(-60, 60, 1)
          .setDynamicTooltip()
          .setValue(this.plugin.settings.horizontalOffset)
          .onChange(async (value) => {
            await this.plugin.updateSettings(() => ({ horizontalOffset: value }));
          })
      );

    new Setting(containerEl)
      .setName("Vertical position")
      .setDesc("Move heading markers up or down.")
      .addSlider((slider) =>
        slider
          .setLimits(-30, 30, 1)
          .setDynamicTooltip()
          .setValue(this.plugin.settings.verticalOffset)
          .onChange(async (value) => {
            await this.plugin.updateSettings(() => ({ verticalOffset: value }));
          })
      );

    new Setting(containerEl)
      .setName("Marker size")
      .setDesc("Change the size of the H1–H6 marker.")
      .addSlider((slider) =>
        slider
          .setLimits(50, 200, 5)
          .setDynamicTooltip()
          .setValue(this.plugin.settings.markerSize)
          .onChange(async (value) => {
            await this.plugin.updateSettings(() => ({ markerSize: value }));
          })
      );

    new Setting(containerEl)
      .setName("Reset overlay appearance")
      .setDesc("Restore the default marker position and size.")
      .addButton((button) =>
        button.setButtonText("Reset").onClick(async () => {
          await this.plugin.updateSettings(() => ({
            horizontalOffset: DEFAULT_SETTINGS.horizontalOffset,
            verticalOffset: DEFAULT_SETTINGS.verticalOffset,
            markerSize: DEFAULT_SETTINGS.markerSize,
          }));
          this.display();
        })
      );
  }
}
