import { Extension } from "@codemirror/state";
import { Plugin } from "obsidian";
import { headingMarkerPlugin } from "./headingWidget";
import { DEFAULT_SETTINGS, LapelSettings, LapelSettingsTab } from "./settings";

export default class LapelPlugin extends Plugin {
  public settings: LapelSettings;
  private extensions: Extension[] = [];

  async onload(): Promise<void> {
    await this.loadSettings();
    this.applyAppearanceSettings();
    this.extensions.push(
      headingMarkerPlugin({
        showInSourceMode: this.settings.showInSourceMode,
      })
    );
    this.registerEditorExtension(this.extensions);
    this.registerSettingsTab();
  }

  onunload(): void {
    document.body.style.removeProperty("--lapel-overlay-x");
    document.body.style.removeProperty("--lapel-overlay-y");
    document.body.style.removeProperty("--lapel-overlay-scale");
  }

  async loadSettings() {
    const data = (await this.loadData()) as Partial<LapelSettings> | null;
    this.settings = { ...DEFAULT_SETTINGS, ...data };
  }

  private registerSettingsTab() {
    this.addSettingTab(new LapelSettingsTab(this.app, this));
  }

  private applyAppearanceSettings() {
    document.body.style.setProperty("--lapel-overlay-x", `${this.settings.horizontalOffset}px`);
    document.body.style.setProperty("--lapel-overlay-y", `${this.settings.verticalOffset}px`);
    document.body.style.setProperty("--lapel-overlay-scale", `${this.settings.markerSize / 100}`);
  }

  public async updateSettings(
    tx: (old: LapelSettings) => Partial<LapelSettings>
  ): Promise<void> {
    const changedSettings = tx(this.settings);
    const newSettings = Object.assign({}, this.settings, changedSettings);
    if (this.settings.showInSourceMode !== newSettings.showInSourceMode) {
      this.extensions[0] = headingMarkerPlugin({
        showInSourceMode: newSettings.showInSourceMode,
      });
      this.app.workspace.updateOptions();
    }

    this.settings = newSettings;
    this.applyAppearanceSettings();
    await this.saveData(this.settings);
  }
}
