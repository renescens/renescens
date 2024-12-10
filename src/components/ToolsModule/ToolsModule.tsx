import React from 'react';
import { Book, Download, Wrench, BookOpen, Brain, Music2, Mic2 } from 'lucide-react';
import { motion } from 'framer-motion';
import EbookCard from './EbookCard';

const ToolsModule = () => {
  const ebooks = [
    {
      category: "Technique Vocale",
      icon: <Mic2 className="w-5 h-5" />,
      books: [
        {
          title: "transformer votre destin",
          description: "Découvrez le pouvoir caché de votre voix pour transformer votre destin.",
          downloadUrl: "/ebooks/guide-respiration.pdf",
          pages: 45,
          level: "Débutant"
        },
        {
          title: "Mettre en place ses actions",
          description: "Mettre en place efficacement ses actions pour modifier son destin.",
          downloadUrl: "/ebooks/anatomie-voix.pdf",
          pages: 72,
          level: "Intermédiaire"
        }
      ]
    },
    
  ];

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="bg-white/10 rounded-xl p-6 backdrop-blur-lg">
        <div className="flex items-center gap-3 mb-6">
          <Wrench className="w-6 h-6 text-purple-300" />
          <h3 className="text-xl font-semibold">Bibliothèque d'Outils</h3>
        </div>
        
        <p className="text-purple-200/80">
          Explorez notre collection d'e-books soigneusement sélectionnés pour vous accompagner dans votre parcours de rééquilibrage énergétique. Chaque ressource est conçue pour vous offrir des connaissances pratiques et théoriques essentielles afin de soutenir votre bien-être global.
        </p>

        <div className="mt-6 flex items-center gap-2 p-4 bg-purple-500/10 rounded-lg">
          <BookOpen className="w-5 h-5 text-purple-300" />
          <p className="text-sm text-purple-200/80">
            Tous nos e-books sont disponibles au format PDF et peuvent être consultés hors ligne.
          </p>
        </div>
      </div>

      {/* Liste des E-books par catégorie */}
      {ebooks.map((category) => (
        <div key={category.category} className="space-y-4">
          <div className="flex items-center gap-3">
            {category.icon}
            <h4 className="text-lg font-semibold">{category.category}</h4>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {category.books.map((book) => (
              <EbookCard key={book.title} book={book} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToolsModule;