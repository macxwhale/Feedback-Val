
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { questionsAdminService } from '@/services/questionsAdminService';
import { enhancedQuestionsService } from '@/services/enhancedQuestionsService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuestionTypeForm } from './QuestionTypeForm';
import { Trash2, Edit, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type QuestionCategory = Database['public']['Enums']['question_category'];

interface QuestionFormData {
  question_text: string;
  question_type: string;
  category: QuestionCategory;
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
    category: 'QualityService' as QuestionCategory,
    order_index: 1,
    help_text: '',
    placeholder_text: '',
    is_required: false,
    options: [],
    scaleConfig: { minValue: 1, maxValue: 5 }
  });

  const { data: questions = [] } = useQuery({
    queryKey: ['questions'],
    queryFn: () => questionsAdminService.getQuestions()
  });

  const { data: types = [] } = useQuery({
    queryKey: ['question-types'],
    queryFn: () => questionsAdminService.getQuestionTypes()
  });

  const createMutation = useMutation({
    mutationFn: enhancedQuestionsService.createQuestionWithRelations,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      toast({ title: 'Question created successfully' });
      resetForm();
    },
    onError: (error: any) => {
      console.error('Create error:', error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: any) => enhancedQuestionsService.updateQuestionWithRelations(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      toast({ title: 'Question updated successfully' });
      resetForm();
    },
    onError: (error: any) => {
      console.error('Update error:', error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => questionsAdminService.deleteQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      toast({ title: 'Question deleted successfully' });
    },
    onError: (error: any) => {
      console.error('Delete error:', error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      question_text: '',
      question_type: 'star',
      category: 'QualityService' as QuestionCategory,
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

    const selectedType = types.find(type => type.name === formData.question_type);
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

  const selectedType = types.find(type => type.name === formData.question_type);
  const supportsOptions = selectedType?.supports_options || false;
  const supportsScale = selectedType?.supports_scale || false;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Questions Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Question Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Question text"
            value={formData.question_text}
            onChange={(e) => setFormData(prev => ({ ...prev, question_text: e.target.value }))}
          />
          <Select 
            value={formData.question_type} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, question_type: value }))}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {types.map(type => 
                <SelectItem key={type.id} value={type.name}>{type.display_name || type.name}</SelectItem>
              )}
            </SelectContent>
          </Select>
          <Select 
            value={formData.category} 
            onValueChange={(value: QuestionCategory) => setFormData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {['QualityService', 'QualityStaff', 'QualityCommunication', 'ValueForMoney', 'LikeliRecommend', 'DidWeMakeEasy', 'Comments'].map(cat => 
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Type-specific configuration */}
        <QuestionTypeForm
          questionType={formData.question_type}
          supportsOptions={supportsOptions}
          supportsScale={supportsScale}
          options={formData.options}
          scaleConfig={formData.scaleConfig}
          helpText={formData.help_text}
          placeholderText={formData.placeholder_text}
          onOptionsChange={(options) => setFormData(prev => ({ ...prev, options }))}
          onScaleChange={(scaleConfig) => setFormData(prev => ({ ...prev, scaleConfig }))}
          onHelpTextChange={(help_text) => setFormData(prev => ({ ...prev, help_text }))}
          onPlaceholderChange={(placeholder_text) => setFormData(prev => ({ ...prev, placeholder_text }))}
        />

        {/* Action Buttons */}
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

        {/* Questions List */}
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
                    onClick={() => {
                      setEditingId(q.id);
                      setFormData({
                        question_text: q.question_text,
                        question_type: q.question_type,
                        category: q.category,
                        order_index: q.order_index,
                        help_text: q.help_text || '',
                        placeholder_text: q.placeholder_text || '',
                        is_required: q.is_required || false,
                        options: [],
                        scaleConfig: { minValue: 1, maxValue: 5 }
                      });
                    }}
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
