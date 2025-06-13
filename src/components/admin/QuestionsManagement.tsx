
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
    order_index: 1,
    category_id: '00000000-0000-0000-0000-000000000001', // Default UUID for category
    type_id: '00000000-0000-0000-0000-000000000001' // Default UUID for type
  });

  const { data: questions = [] } = useQuery({
    queryKey: ['questions'],
    queryFn: () => questionsAdminService.getQuestions()
  });

  const createMutation = useMutation({
    mutationFn: questionsAdminService.createQuestion,
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['questions'] }); 
      toast({ title: 'Question created' }); 
      resetForm(); 
    },
    onError: (error) => {
      console.error('Create error:', error);
      toast({ title: 'Failed to create question', variant: 'destructive' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: any) => questionsAdminService.updateQuestion(id, data),
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['questions'] }); 
      toast({ title: 'Question updated' }); 
      resetForm(); 
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast({ title: 'Failed to update question', variant: 'destructive' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => questionsAdminService.deleteQuestion(id),
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['questions'] }); 
      toast({ title: 'Question deleted' }); 
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast({ title: 'Failed to delete question', variant: 'destructive' });
    }
  });

  const resetForm = () => { 
    setEditingId(null); 
    setFormData({ 
      question_text: '', 
      question_type: 'star', 
      category: 'QualityService' as QuestionCategory, 
      order_index: 1,
      category_id: '00000000-0000-0000-0000-000000000001',
      type_id: '00000000-0000-0000-0000-000000000001'
    }); 
  };
  
  const handleSubmit = () => {
    if (!formData.question_text.trim()) {
      toast({ title: 'Question text is required', variant: 'destructive' });
      return;
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <Card>
      <CardHeader><CardTitle>Questions Management</CardTitle></CardHeader>
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
              {['star', 'nps', 'likert', 'text', 'single-choice', 'multi-choice'].map(type => 
                <SelectItem key={type} value={type}>{type}</SelectItem>
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
          {questions.map(q => (
            <div key={q.id} className="flex items-center justify-between p-2 border rounded">
              <div className="flex-1">
                <span className="font-medium">{q.question_text}</span>
                <span className="text-sm text-gray-500 ml-2">({q.question_type})</span>
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
                      category_id: q.category_id,
                      type_id: q.type_id
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
