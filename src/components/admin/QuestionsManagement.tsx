
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { questionsAdminService } from '@/services/questionsAdminService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Edit, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type QuestionCategory = Database['public']['Enums']['question_category'];

export const QuestionsManagement: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    question_text: '', 
    question_type: 'star', 
    category: 'QualityService' as QuestionCategory, 
    order_index: 1
  });

  const { data: questions = [] } = useQuery({
    queryKey: ['questions'],
    queryFn: () => questionsAdminService.getQuestions()
  });

  // Fetch question categories and types for proper references
  const { data: categories = [] } = useQuery({
    queryKey: ['question-categories'],
    queryFn: () => questionsAdminService.getQuestionCategories()
  });

  const { data: types = [] } = useQuery({
    queryKey: ['question-types'],
    queryFn: () => questionsAdminService.getQuestionTypes()
  });

  const createMutation = useMutation({
    mutationFn: questionsAdminService.createQuestion,
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['questions'] }); 
      toast({ title: 'Question created successfully' }); 
      resetForm(); 
    },
    onError: (error: any) => {
      console.error('Create error:', error);
      const errorMessage = error?.details?.validationErrors 
        ? error.details.validationErrors.map((e: any) => e.message).join(', ')
        : error?.message || 'Failed to create question';
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: any) => questionsAdminService.updateQuestion(id, data),
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['questions'] }); 
      toast({ title: 'Question updated successfully' }); 
      resetForm(); 
    },
    onError: (error: any) => {
      console.error('Update error:', error);
      const errorMessage = error?.details?.validationErrors 
        ? error.details.validationErrors.map((e: any) => e.message).join(', ')
        : error?.message || 'Failed to update question';
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
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
      const errorMessage = error?.message || 'Failed to delete question';
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    }
  });

  const resetForm = () => { 
    setEditingId(null); 
    setFormData({ 
      question_text: '', 
      question_type: 'star', 
      category: 'QualityService' as QuestionCategory, 
      order_index: 1
    }); 
  };
  
  const handleSubmit = () => {
    if (!formData.question_text.trim()) {
      toast({ title: 'Validation Error', description: 'Question text is required', variant: 'destructive' });
      return;
    }

    // Get the highest order_index and increment by 1 for new questions
    const maxOrder = questions.length > 0 ? Math.max(...questions.map(q => q.order_index)) : 0;
    const orderIndex = editingId ? formData.order_index : maxOrder + 1;

    // Find corresponding category and type IDs
    const selectedCategory = categories.find(cat => cat.name === formData.category);
    const selectedType = types.find(type => type.name === formData.question_type);

    const questionData = {
      ...formData,
      order_index: orderIndex,
      category_id: selectedCategory?.id || categories[0]?.id,
      type_id: selectedType?.id || types[0]?.id
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...questionData });
    } else {
      createMutation.mutate(questionData);
    }
  };

  const getNextOrderIndex = () => {
    return questions.length > 0 ? Math.max(...questions.map(q => q.order_index)) + 1 : 1;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Questions Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <Input 
            placeholder="Question text" 
            value={formData.question_text} 
            onChange={(e) => setFormData(prev => ({ ...prev, question_text: e.target.value }))} 
          />
          <Select value={formData.question_type} onValueChange={(value) => setFormData(prev => ({ ...prev, question_type: value }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {types.map(type => 
                <SelectItem key={type.id} value={type.name}>{type.display_name || type.name}</SelectItem>
              )}
            </SelectContent>
          </Select>
          <Select value={formData.category} onValueChange={(value: QuestionCategory) => setFormData(prev => ({ ...prev, category: value }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {['QualityService', 'QualityStaff', 'QualityCommunication', 'ValueForMoney', 'LikeliRecommend', 'DidWeMakeEasy', 'Comments'].map(cat => 
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              )}
            </SelectContent>
          </Select>
          <Button 
            onClick={handleSubmit} 
            disabled={!formData.question_text.trim() || createMutation.isPending || updateMutation.isPending}
          >
            <Plus className="w-4 h-4 mr-1" />
            {editingId ? 'Update' : 'Add'}
          </Button>
        </div>
        
        {editingId && (
          <Button variant="outline" onClick={resetForm}>
            Cancel
          </Button>
        )}

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
                        order_index: q.order_index
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
