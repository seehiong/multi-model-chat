import React, { useState, useEffect } from 'react';
import { LocalModelConfig } from '../types';
import { X, Plus, Save } from 'lucide-react';

interface LocalModelFormProps {
  model?: LocalModelConfig;
  onSave: (model: LocalModelConfig) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export const LocalModelForm: React.FC<LocalModelFormProps> = ({
  model,
  onSave,
  onCancel,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<LocalModelConfig>({
    id: '',
    name: '',
    description: '',
    endpoint: '',
    apiKey: '',
    maxTokens: 4096,
    temperature: 0.7,
    isEnabled: false,
    modelType: 'ollama'
  });

  useEffect(() => {
    if (model) {
      setFormData(model);
    }
  }, [model]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.endpoint) {
      alert('Name and endpoint are required');
      return;
    }

    // Generate a unique ID for new models
    if (!isEditing) {
      setFormData(prev => ({ ...prev, id: Math.random().toString(36).substring(2, 15) }));
    }
    onSave(formData);
  };

  const handleInputChange = (field: keyof LocalModelConfig, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          {isEditing ? 'Edit Local Model' : 'Add Local Model'}
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Model Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., Local LLaMA 2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Model Type
            </label>
            <select
              value={formData.modelType}
              onChange={(e) => handleInputChange('modelType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="ollama">Ollama</option>
              <option value="openai-compatible">OpenAI Compatible</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            rows={2}
            placeholder="Brief description of the model"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            API Endpoint *
          </label>
          <input
            type="url"
            value={formData.endpoint}
            onChange={(e) => handleInputChange('endpoint', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="http://localhost:11434/api/generate"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            API Key (Optional)
          </label>
          <input
            type="password"
            value={formData.apiKey}
            onChange={(e) => handleInputChange('apiKey', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Leave empty if no authentication required"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Tokens
            </label>
            <input
              type="number"
              value={formData.maxTokens}
              onChange={(e) => handleInputChange('maxTokens', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              min="1"
              max="32768"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Temperature
            </label>
            <input
              type="number"
              value={formData.temperature}
              onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              min="0"
              max="2"
              step="0.1"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isEnabled"
            checked={formData.isEnabled}
            onChange={(e) => handleInputChange('isEnabled', e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="isEnabled" className="ml-2 block text-sm text-gray-900">
            Enable this model
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4 inline mr-2" />
                Save Changes
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 inline mr-2" />
                Add Model
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
