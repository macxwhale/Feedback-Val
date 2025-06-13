
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';

interface QuestionOption {
  text: string;
  value?: string;
}

interface ScaleConfig {
  minValue: number;
  maxValue: number;
  minLabel?: string;
  maxLabel?: string;
  stepSize?: number;
}

interface QuestionTypeFormProps {
  questionType: string;
  supportsOptions?: boolean;
  supportsScale?: boolean;
  options?: QuestionOption[];
  scaleConfig?: ScaleConfig;
  helpText?: string;
  placeholderText?: string;
  onOptionsChange: (options: QuestionOption[]) => void;
  onScaleChange: (config: ScaleConfig) => void;
  onHelpTextChange: (text: string) => void;
  onPlaceholderChange: (text: string) => void;
}

export const QuestionTypeForm: React.FC<QuestionTypeFormProps> = ({
  questionType,
  supportsOptions,
  supportsScale,
  options = [],
  scaleConfig,
  helpText = '',
  placeholderText = '',
  onOptionsChange,
  onScaleChange,
  onHelpTextChange,
  onPlaceholderChange
}) => {
  const [localOptions, setLocalOptions] = useState<QuestionOption[]>(
    options.length > 0 ? options : [{ text: '' }, { text: '' }]
  );

  const addOption = () => {
    const newOptions = [...localOptions, { text: '' }];
    setLocalOptions(newOptions);
    onOptionsChange(newOptions);
  };

  const removeOption = (index: number) => {
    const newOptions = localOptions.filter((_, i) => i !== index);
    setLocalOptions(newOptions);
    onOptionsChange(newOptions);
  };

  const updateOption = (index: number, field: keyof QuestionOption, value: string) => {
    const newOptions = localOptions.map((option, i) => 
      i === index ? { ...option, [field]: value } : option
    );
    setLocalOptions(newOptions);
    onOptionsChange(newOptions);
  };

  return (
    <div className="space-y-4">
      {/* Help Text */}
      <div>
        <Label htmlFor="help-text">Help Text (optional)</Label>
        <Textarea
          id="help-text"
          value={helpText}
          onChange={(e) => onHelpTextChange(e.target.value)}
          placeholder="Additional guidance for users..."
          className="mt-1"
        />
      </div>

      {/* Placeholder Text for text questions */}
      {questionType === 'text' && (
        <div>
          <Label htmlFor="placeholder">Placeholder Text</Label>
          <Input
            id="placeholder"
            value={placeholderText}
            onChange={(e) => onPlaceholderChange(e.target.value)}
            placeholder="Enter placeholder text..."
            className="mt-1"
          />
        </div>
      )}

      {/* Options for choice questions */}
      {supportsOptions && (
        <Card>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <Label>Answer Options</Label>
              {localOptions.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={option.text}
                    onChange={(e) => updateOption(index, 'text', e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1"
                  />
                  <Input
                    value={option.value || ''}
                    onChange={(e) => updateOption(index, 'value', e.target.value)}
                    placeholder="Value"
                    className="w-20"
                  />
                  {localOptions.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeOption(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Option
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scale Configuration */}
      {supportsScale && (
        <Card>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <Label>Scale Configuration</Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="min-value">Min Value</Label>
                  <Input
                    id="min-value"
                    type="number"
                    value={scaleConfig?.minValue || 1}
                    onChange={(e) => onScaleChange({
                      ...scaleConfig,
                      minValue: parseInt(e.target.value) || 1,
                      maxValue: scaleConfig?.maxValue || 5
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="max-value">Max Value</Label>
                  <Input
                    id="max-value"
                    type="number"
                    value={scaleConfig?.maxValue || 5}
                    onChange={(e) => onScaleChange({
                      ...scaleConfig,
                      minValue: scaleConfig?.minValue || 1,
                      maxValue: parseInt(e.target.value) || 5
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="min-label">Min Label</Label>
                  <Input
                    id="min-label"
                    value={scaleConfig?.minLabel || ''}
                    onChange={(e) => onScaleChange({
                      ...scaleConfig,
                      minValue: scaleConfig?.minValue || 1,
                      maxValue: scaleConfig?.maxValue || 5,
                      minLabel: e.target.value
                    })}
                    placeholder="e.g., Poor"
                  />
                </div>
                <div>
                  <Label htmlFor="max-label">Max Label</Label>
                  <Input
                    id="max-label"
                    value={scaleConfig?.maxLabel || ''}
                    onChange={(e) => onScaleChange({
                      ...scaleConfig,
                      minValue: scaleConfig?.minValue || 1,
                      maxValue: scaleConfig?.maxValue || 5,
                      maxLabel: e.target.value
                    })}
                    placeholder="e.g., Excellent"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
