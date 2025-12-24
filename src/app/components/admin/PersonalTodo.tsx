import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { mockTodoItems, TodoItem } from '../../data/mockData';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

interface PersonalTodoProps {
  userId: string;
}

export const PersonalTodo: React.FC<PersonalTodoProps> = ({ userId }) => {
  const [todos, setTodos] = useState<TodoItem[]>(
    mockTodoItems.filter((t) => t.userId === userId)
  );
  const [newTodoText, setNewTodoText] = useState('');

  const handleAddTodo = () => {
    if (!newTodoText.trim()) return;

    const newTodo: TodoItem = {
      id: `todo-${Date.now()}`,
      userId,
      text: newTodoText,
      completed: false,
      createdDate: new Date().toISOString().split('T')[0],
    };

    setTodos([...todos, newTodo]);
    setNewTodoText('');
    toast.success('Todo added');
  };

  const handleToggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    toast.success('Todo deleted');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal To-Do</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Todo */}
        <div className="flex gap-2">
          <Input
            placeholder="Add new task..."
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
          />
          <Button onClick={handleAddTodo} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Todo List */}
        <div className="space-y-2">
          <AnimatePresence>
            {todos.map((todo) => (
              <motion.div
                key={todo.id}
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-50"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => handleToggleTodo(todo.id)}
                />
                <span
                  className={`flex-1 text-sm ${
                    todo.completed ? 'line-through text-gray-400' : ''
                  }`}
                >
                  {todo.text}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteTodo(todo.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
          {todos.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">No tasks yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};