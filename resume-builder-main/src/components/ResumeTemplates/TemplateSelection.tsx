import React from 'react';
import { ResumeData } from './types';

interface TemplateSelectionProps {
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
}

const TemplateSelection: React.FC<TemplateSelectionProps> = ({
  selectedTemplate,
  onTemplateChange,
}) => {
  const templates = [
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Clean and simple design with focus on content',
    },
    {
      id: 'modern',
      name: 'Modern',
      description: 'Contemporary layout with two-column design',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {templates.map((template) => (
        <button
          key={template.id}
          onClick={() => onTemplateChange(template.id)}
          className={`p-4 rounded-lg border transition-all ${
            selectedTemplate === template.id
              ? template.id === 'minimal'
                ? 'border-blue-500 bg-black text-white'
                : 'border-blue-500 bg-black text-blue-700'
              : 'border-black hover:border-blue-300'
          }`}
        >
          <h3 className="text-lg font-medium mb-2">{template.name}</h3>
          <p className={`text-sm ${template.id === 'minimal' && selectedTemplate === template.id ? 'text-gray-300' : 'text-gray-600'}`}>
            {template.description}
          </p>
        </button>
      ))}
    </div>
  );
};

export default TemplateSelection;