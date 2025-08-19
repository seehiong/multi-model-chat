import React, { useState } from 'react';
import { Settings, Key, Server, Palette, Download, Upload, Trash2, Plus, Edit } from 'lucide-react';
import { AppSettings, LocalModelConfig } from '../types';
import { SettingsService } from '../services/settings';
import { LocalModelForm } from './LocalModelForm';
import { LocalModelTest } from './LocalModelTest';

type SettingsTab = 'general' | 'api' | 'local-models' | 'appearance';

export const SettingsPage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [settings, setSettings] = useState<AppSettings>(SettingsService.getSettings());
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [showLocalModelForm, setShowLocalModelForm] = useState(false);
  const [editingModel, setEditingModel] = useState<LocalModelConfig | null>(null);
  const [importError, setImportError] = useState<string>('');

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'local-models', label: 'Local Models', icon: Server },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ];

  const handleSaveSettings = (updates: Partial<AppSettings>) => {
    const updated = SettingsService.updateSettings(updates);
    setSettings(updated);
  };

  const handleSaveLocalModel = (model: LocalModelConfig) => {
    if (editingModel) {
      SettingsService.updateLocalModel(model.id, model);
    } else {
      SettingsService.addLocalModel(model);
    }
    setSettings(SettingsService.getSettings());
    setShowLocalModelForm(false);
    setEditingModel(null);
  };

  const handleDeleteLocalModel = (modelId: string) => {
    if (confirm('Are you sure you want to delete this local model?')) {
      SettingsService.removeLocalModel(modelId);
      setSettings(SettingsService.getSettings());
    }
  };

  const handleEditLocalModel = (model: LocalModelConfig) => {
    setEditingModel(model);
    setShowLocalModelForm(true);
  };

  const handleExportSettings = () => {
    const dataStr = SettingsService.exportSettings();
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'chat-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        SettingsService.importSettings(content);
        setSettings(SettingsService.getSettings());
        setImportError('');
      } catch (error) {
        setImportError('Invalid settings file format');
      }
    };
    reader.readAsText(file);
  };

  const handleResetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default? This cannot be undone.')) {
      SettingsService.resetSettings();
      setSettings(SettingsService.getSettings());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200">
            <nav className="p-4 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as SettingsTab)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">General Settings</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Max Tokens
                    </label>
                    <input
                      type="number"
                      value={settings.maxTokens}
                      onChange={(e) => handleSaveSettings({ maxTokens: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      min="1"
                      max="32768"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Temperature
                    </label>
                    <input
                      type="number"
                      value={settings.temperature}
                      onChange={(e) => handleSaveSettings({ temperature: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      min="0"
                      max="2"
                      step="0.1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Local Model Timeout (seconds)
                  </label>
                  <input
                    type="number"
                    value={settings.localModelTimeout / 1000}
                    onChange={(e) => handleSaveSettings({ localModelTimeout: parseInt(e.target.value) * 1000 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    min="1"
                    max="300"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoSave"
                    checked={settings.autoSave}
                    onChange={(e) => handleSaveSettings({ autoSave: e.target.checked })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="autoSave" className="ml-2 block text-sm text-gray-900">
                    Auto-save chat history
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">API Configuration</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    OpenRouter API Key
                  </label>
                  <input
                    type="password"
                    value={settings.openRouterApiKey}
                    onChange={(e) => handleSaveSettings({ openRouterApiKey: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="sk-or-v1-..."
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Get your API key from <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">OpenRouter</a>
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'local-models' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Local Models</h3>
                  <button
                    onClick={() => setShowLocalModelForm(true)}
                    className="flex items-center px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Model
                  </button>
                </div>

                {showLocalModelForm && (
                  <LocalModelForm
                    model={editingModel || undefined}
                    onSave={handleSaveLocalModel}
                    onCancel={() => {
                      setShowLocalModelForm(false);
                      setEditingModel(null);
                    }}
                    isEditing={!!editingModel}
                  />
                )}

                {/* Local Model Test Component */}
                <LocalModelTest />

                <div className="space-y-4">
                  {settings.localModels.map((model) => (
                    <div key={model.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-medium text-gray-900">{model.name}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${model.isEnabled
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                              }`}>
                              {model.isEnabled ? 'Enabled' : 'Disabled'}
                            </span>
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              {model.modelType}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{model.description}</p>
                          <p className="text-xs text-gray-500 mt-1">{model.endpoint}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditLocalModel(model)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteLocalModel(model.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Appearance</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <select
                    value={settings.theme}
                    onChange={(e) => handleSaveSettings({ theme: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto (System)</option>
                  </select>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Import/Export Settings</h4>

                  <div className="space-y-4">
                    <div className="flex space-x-3">
                      <button
                        onClick={handleExportSettings}
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export Settings
                      </button>

                      <label className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" />
                        Import Settings
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportSettings}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {importError && (
                      <p className="text-sm text-red-600">{importError}</p>
                    )}

                    <button
                      onClick={handleResetSettings}
                      className="flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Reset to Defaults
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
