
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface QuestionsListProps {
  questions: any[];
  onEdit: (question: any) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export const QuestionsList: React.FC<QuestionsListProps> = ({
  questions,
  onEdit,
  onDelete,
  isDeleting
}) => {
  if (questions.length === 0) {
    return (
      <p className="text-gray-500 text-center py-4">
        No questions found. Create your first question above.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {questions.map(q => (
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
              onClick={() => onEdit(q)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(q.id)}
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
