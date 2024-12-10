import React from 'react';
import { motion } from 'framer-motion';
import { X, Loader, Brain, Target, TrendingUp, Calendar, CheckCircle2 } from 'lucide-react';

interface AIAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: string | null;
  loading: boolean;
}

const AIAnalysisModal: React.FC<AIAnalysisModalProps> = ({
  isOpen,
  onClose,
  analysis,
  loading
}) => {
  if (!isOpen) return null;

  const sections = analysis?.split(/\d+\.\s+/g).filter(Boolean) || [];

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white/10 backdrop-blur-lg rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white/10 backdrop-blur-lg p-6 border-b border-purple-200/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-6 h-6 text-purple-300" />
              <h2 className="text-xl font-semibold">Analyse Énergétique</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center gap-4 py-12">
              <Loader className="w-8 h-8 animate-spin text-purple-300" />
              <p className="text-purple-200/60">Analyse en cours...</p>
            </div>
          ) : analysis ? (
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
          ) : (
            <div className="text-center py-12 text-purple-200/60">
              Aucune analyse disponible
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AIAnalysisModal;