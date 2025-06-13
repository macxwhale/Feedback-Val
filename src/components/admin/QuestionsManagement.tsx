
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { questionsService } from '@/services/questionsService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuestionTypeForm } from './QuestionTypeForm';
import { Trash2, Edit, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuestionFormData {
  question_text: string;
  question_type: string;
  category: string;
  order_index: number;
  help_text?: string;
  placeholder_text?: string;
  is_required?: boolean;
  options?: { text: string; value?: string }[];
  scaleConfig?: {
    minValue: number;
    maxValue: number;
    minLabel?: string;
    maxLabel?: string;
    stepSize?: number;
  };
}

export const QuestionsManagement: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<QuestionFormData>({
    question_text: '',
    question_type: 'star',
    category: 'QualityService',
    order_index: 1,
    help_text: '',
    placeholder_text: '',
    is_required: false,
    options: [],
    scaleConfig: { minValue: 1, maxValue: 5 }
  });

  // Fetch questions
  const { data: questions = [], isLoading } = useQuery({
    queryKey: ['questions'],
    queryFn: () => questionsService.getQuestions(),
  });

  // Fetch question types from database
  const { data: questionTypes = [] } = useQuery({
    queryKey: ['question-types'],
    queryFn: () => questionsService.getQuestionTypes(),
  });

  // Fetch categories from database
  const { data: categories = [] } = useQuery({
    queryKey: ['question-categories'],
    queryFn: () => questionsService.getQuestionCategories(),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: questionsService.createQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      toast({ title: 'Question created successfully' });
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: any) => questionsService.updateQuestion(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      toast({ title: 'Question updated successfully' });
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => questionsService.deleteQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      toast({ title: 'Question deleted successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      question_text: '',
      question_type: 'star',
      category: 'QualityService',
      order_index: 1,
      help_text: '',
      placeholder_text: '',
      is_required: false,
      options: [],
      scaleConfig: { minValue: 1, maxValue: 5 }
    });
  };

  const handleSubmit = () => {
    if (!formData.question_text.trim()) {
      toast({ title: 'Validation Error', description: 'Question text is required', variant: 'destructive' });
      return;
    }

    const maxOrder = questions.length > 0 ? Math.max(...questions.map(q => q.order_index)) : 0;
    const orderIndex = editingId ? formData.order_index : maxOrder + 1;

    const submitData = {
      ...formData,
      order_index: orderIndex
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleEdit = (question: any) => {
    setEditingId(question.id);
    setFormData({
      question_text: question.question_text,
      question_type: question.question_type,
      category: question.category,
      order_index: question.order_index,
      help_text: question.help_text || '',
      placeholder_text: question.placeholder_text || '',
      is_required: question.is_required || false,
      options: question.question_options?.map((opt: any) => ({ 
        text: opt.option_text, 
        value: opt.option_value 
      })) || [],
      scaleConfig: question.question_scale_config?.[0] ? {
        minValue: question.question_scale_config[0].min_value,
        maxValue: question.question_scale_config[0].max_value,
        minLabel: question.question_scale_config[0].min_label || '',
        maxLabel: question.question_scale_config[0].max_label || '',
        stepSize: question.question_scale_config[0].step_size
      } : { minValue: 1, maxValue: 5 }
    });
  };

  // Determine question type capabilities
  const getQuestionTypeCapabilities = (questionType: string) => {
    // Define which question types support options and scale
    const typeCapabilities = {
      'single-choice': { supportsOptions: true, supportsScale: false },
      'multi-choice': { supportsOptions: true, supportsScale: false },
      'star': { supportsOptions: false, supportsScale: true },
      'likert': { supportsOptions: false, supportsScale: true },
      'nps': { supportsOptions: false, supportsScale: true },
      'slider': { supportsOptions: false, supportsScale: true },
      'emoji': { supportsOptions: true, supportsScale: false },
      'ranking': { supportsOptions: true, supportsScale: false },
      'matrix': { supportsOptions: true, supportsScale: true },
      'text': { supportsOptions: false, supportsScale: false }
    };

    return typeCapabilities[questionType as keyof typeof typeCapabilities] || { supportsOptions: false, supportsScale: false };
  };

  const capabilities = getQuestionTypeCapabilities(formData.question_type);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Questions Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading questions...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Questions Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Question text"
            value={formData.question_text}
            onChange={(e) => setFormData(prev => ({ ...prev, question_text: e.target.value }))}
          />
          <Select 
            value={formData.question_type} 
            onValueChange={(value) => setFormData(prev => ({ 
              ...prev, 
              question_type: value,
              // Reset options and scale when type changes
              options: [],
              scaleConfig: { minValue: 1, maxValue: 5 }
            }))}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {questionTypes.map(type => 
                <SelectItem key={type.id} value={type.name}>{type.display_name}</SelectItem>
              )}
            </SelectContent>
          </Select>
          <Select 
            value={formData.category} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {categories.map(cat => 
                <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <QuestionTypeForm
          questionType={formData.question_type}
          supportsOptions={capabilities.supportsOptions}
          supportsScale={capabilities.supportsScale}
          options={formData.options}
          scaleConfig={formData.scaleConfig}
          helpText={formData.help_text}
          placeholderText={formData.placeholder_text}
          onOptionsChange={(options) => setFormData(prev => ({ ...prev, options }))}
          onScaleChange={(scaleConfig) => setFormData(prev => ({ ...prev, scaleConfig }))}
          onHelpTextChange={(help_text) => setFormData(prev => ({ ...prev, help_text }))}
          onPlaceholderChange={(placeholder_text) => setFormData(prev => ({ ...prev, placeholder_text }))}
        />

        <div className="flex gap-2">
          <Button
            onClick={handleSubmit}
            disabled={!formData.question_text.trim() || createMutation.isPending || updateMutation.isPending}
          >
            <Plus className="w-4 h-4 mr-1" />
            {editingId ? 'Update' : 'Add'} Question
          </Button>
          {editingId && (
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>

        <div className="space-y-2">
          {questions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No questions found. Create your first question above.</p>
          ) : (
            questions.map(q => (
              <div key={q.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <span className="font-medium">{q.question_text}</span>
                  <div className="text-sm text-gray-500 mt-1">
                    Type: {q.question_type} | Category: {q.category} | Order: {q.order_index}
                    {q.help_text && <span> | Help: {q.help_text}</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(q)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(q.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
