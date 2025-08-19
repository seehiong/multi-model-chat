import { AppSettings, LocalModelConfig } from '../types';
import { DEFAULT_LOCAL_MODELS } from '../config/models';

const SETTINGS_STORAGE_KEY = 'multi-model-chat-settings';

export const DEFAULT_SETTINGS: AppSettings = {
  openRouterApiKey: '',
  localModels: DEFAULT_LOCAL_MODELS,
  defaultModels: ['openai/gpt-4o-mini', 'google/gemini-2.0-flash-001', 'mistralai/codestral-2508'],
  maxTokens: 1000,
  temperature: 0.7,
  theme: 'light',
  autoSave: true,
  localModelTimeout: 30000,
  remoteModelTimeout: 30000,
};

export class SettingsService {
  private static getStoredSettings(): Partial<AppSettings> {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error loading settings:', error);
      return {};
    }
  }

  private static saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  static getSettings(): AppSettings {
    const stored = this.getStoredSettings();
    return {
      ...DEFAULT_SETTINGS,
      ...stored,
      localModels: stored.localModels || DEFAULT_LOCAL_MODELS
    };
  }

  static updateSettings(updates: Partial<AppSettings>): AppSettings {
    const current = this.getSettings();
    const updated = { ...current, ...updates };
    this.saveSettings(updated);
    return updated;
  }

  static updateLocalModel(modelId: string, updates: Partial<LocalModelConfig>): AppSettings {
    const settings = this.getSettings();
    const updatedLocalModels = settings.localModels.map(model =>
      model.id === modelId ? { ...model, ...updates } : model
    );
    return this.updateSettings({ localModels: updatedLocalModels });
  }

  static addLocalModel(model: LocalModelConfig): AppSettings {
    const settings = this.getSettings();
    const updatedLocalModels = [...settings.localModels, model];
    return this.updateSettings({ localModels: updatedLocalModels });
  }

  static removeLocalModel(modelId: string): AppSettings {
    const settings = this.getSettings();
    const updatedLocalModels = settings.localModels.filter(model => model.id !== modelId);
    return this.updateSettings({ localModels: updatedLocalModels });
  }

  static resetSettings(): AppSettings {
    this.saveSettings(DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  }

  static exportSettings(): string {
    const settings = this.getSettings();
    return JSON.stringify(settings, null, 2);
  }

  static importSettings(jsonString: string): AppSettings {
    try {
      const imported = JSON.parse(jsonString);
      const validated = {
        ...DEFAULT_SETTINGS,
        ...imported,
        localModels: imported.localModels || DEFAULT_LOCAL_MODELS
      };
      this.saveSettings(validated);
      return validated;
    } catch (error) {
      console.error('Error importing settings:', error);
      throw new Error('Invalid settings format');
    }
  }
}
