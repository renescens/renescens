import React from 'react';
import { Book, Download, FileText, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

interface EbookProps {
  book: {
    title: string;
    description: string;
    downloadUrl: string;
    pages: number;
    level: string;
  };
}

const EbookCard: React.FC<EbookProps> = ({ book }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white/10 rounded-xl p-6 backdrop-blur-lg space-y-4"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Book className="w-5 h-5 mt-1 text-purple-300" />
          <div>
            <h5 className="font-semibold mb-2">{book.title}</h5>
            <p className="text-sm text-purple-200/80">{book.description}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm text-purple-200/60">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span>{book.pages} pages</span>
        </div>
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4" />
          <span>{book.level}</span>
        </div>
      </div>

      <motion.a
        href={book.downloadUrl}
        download
        className="flex items-center justify-center gap-2 w-full px-4 py-2 
                   bg-purple-500/20 hover:bg-purple-500/30 rounded-lg 
                   transition-colors group"
        whileTap={{ scale: 0.98 }}
      >
        <Download className="w-4 h-4" />
        <span className="text-sm font-medium">Télécharger l'E-book</span>
      </motion.a>
    </motion.div>
  );
};

export default EbookCard;