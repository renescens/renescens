import React from 'react';
import { Brain, Target, TrendingUp, Calendar, CheckCircle2 } from 'lucide-react';

interface AIAnalysisDisplayProps {
  analysis: string | null;
}

const AIAnalysisDisplay: React.FC<AIAnalysisDisplayProps> = ({ analysis }) => {
  if (!analysis) return null;

  const sections = analysis.split(/\d+\.\s+/g).filter(Boolean);

  const getSectionIcon = (index: number) => {
    switch (index) {
      case 0: return Brain;
      case 1: return Target;
      case 2: return TrendingUp;
      case 3: return Calendar;
      default: return CheckCircle2;
    }
  };

  return (
    <div className="space-y-8">
      {sections.map((section, index) => {
        const [title, ...content] = section.trim().split('\n');
        const Icon = getSectionIcon(index);

        return (
          <div key={index} className="space-y-4">
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5 text-purple-300" />
              <h3 className="font-semibold">{title}</h3>
            </div>
            <div className="pl-8 space-y-4">
              {content.map((paragraph, i) => {
                // Liste à puces
                if (paragraph.trim().startsWith('*') || paragraph.trim().startsWith('-')) {
                  return (
                    <ul key={i} className="list-disc list-inside space-y-2">
                      <li className="text-purple-200/80">
                        {paragraph.trim().replace(/^[*-]\s*/, '')}
                      </li>
                    </ul>
                  );
                }
                
                // Sous-sections (A, B, C)
                if (paragraph.trim().match(/^[A-C]\./)) {
                  const [subTitle, ...subContent] = paragraph.split('\n');
                  return (
                    <div key={i} className="space-y-2">
                      <h4 className="font-medium">{subTitle.trim()}</h4>
                      <div className="pl-4">
                        {subContent.map((item, j) => (
                          <p key={j} className="text-purple-200/80">
                            {item.trim().replace(/^[*-]\s*/, '')}
                          </p>
                        ))}
                      </div>
                    </div>
                  );
                }

                // Paragraphe normal
                return (
                  <p key={i} className="text-purple-200/80">
                    {paragraph.trim()}
                  </p>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AIAnalysisDisplay;