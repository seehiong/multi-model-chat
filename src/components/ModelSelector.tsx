import React, { useMemo } from 'react';
import { AVAILABLE_MODELS } from '../config/models';
import { SettingsService } from '../services/settings';

interface ModelSelectorProps {
  selectedModels: string[];
  onModelSelectionChange: (modelIds: string[]) => void;
  maxModels?: number;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModels,
  onModelSelectionChange,
  maxModels = 5
}) => {
  const settings = SettingsService.getSettings();
  const allModels = useMemo(() => {
    const enabledLocalModels = settings.localModels.filter(model => model.isEnabled);
    return [...AVAILABLE_MODELS, ...enabledLocalModels];
  }, [settings.localModels]);

  const handleModelToggle = (modelId: string) => {
    const isSelected = selectedModels.includes(modelId);

    if (isSelected) {
      onModelSelectionChange(selectedModels.filter(id => id !== modelId));
    } else {
      if (selectedModels.length < maxModels) {
        onModelSelectionChange([...selectedModels, modelId]);
      }
    }
  };

  const handleQuickSelect = (count: number) => {
    const modelsToSelect = allModels.slice(0, count).map(model => model.id);
    onModelSelectionChange(modelsToSelect);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">
          Select Models ({selectedModels.length}/{maxModels})
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => handleQuickSelect(1)}
            className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
          >
            1 Model
          </button>
          <button
            onClick={() => handleQuickSelect(3)}
            className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
          >
            3 Models
          </button>
          <button
            onClick={() => handleQuickSelect(5)}
            className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
          >
            All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {allModels.map((model) => (
          <div
            key={model.id}
            className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedModels.includes(model.id)
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
            onClick={() => handleModelToggle(model.id)}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${selectedModels.includes(model.id)
                  ? 'border-primary-500 bg-primary-500'
                  : 'border-gray-300 bg-white'
                  }`}>
                  {selectedModels.includes(model.id) && (
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {model.name}
                  </h4>
                  <span className="text-xs text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded">
                    {'provider' in model ? model.provider : 'Local'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {model.description}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <span>Max: {model.maxTokens.toLocaleString()}</span>
                  <span>•</span>
                  <span>{'costPer1kTokens' in model ? `$${model.costPer1kTokens}/1k tokens` : 'Free (Local)'}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedModels.length === 0 && (
        <div className="text-center py-4 text-gray-500 text-sm">
          Select at least one model to start chatting
        </div>
      )}
    </div>
  );
};

