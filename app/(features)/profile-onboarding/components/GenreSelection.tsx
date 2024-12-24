import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { BookMarked, CheckCircle2 } from 'lucide-react';
import { containerVariants, itemVariants } from './_animations';

interface GenreSelectionProps {
  selectedGenres: string[];
  onGenreSelect: (genre: string) => void;
}

const GENRES = ['Fiction', 'Non-Fiction', 'Mystery', 'Science Fiction', 'Fantasy', 'Romance', 'Thriller', 'Biography', 'Self-Help'];

export const GenreSelection = ({ selectedGenres, onGenreSelect }: GenreSelectionProps) => (
  <motion.div variants={containerVariants} className="space-y-6" data-testid="step-content-genres">
    <motion.h2 variants={itemVariants} className="text-3xl font-bold">
      What do you like to read?
    </motion.h2>
    <motion.p variants={itemVariants} className="text-gray-600">
      Select your favorite genres to help us recommend books you&apos;ll love
    </motion.p>
    <motion.div variants={containerVariants} className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {GENRES.map((genre) => (
        <Button
          key={genre}
          role="button"
          variant={selectedGenres.includes(genre) ? 'default' : 'outline'}
          className="w-full h-auto py-4 px-6 text-left justify-start"
          onClick={() => onGenreSelect(genre)}
          aria-label={`select ${genre}`}
          aria-pressed={selectedGenres.includes(genre)}
          data-testid={`genre-button-${genre.toLowerCase()}`}
        >
          <BookMarked className="w-5 h-5 mr-2" aria-hidden="true" />
          <span>{genre}</span>
          {selectedGenres.includes(genre) && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto" aria-hidden="true">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </motion.div>
          )}
        </Button>
      ))}
    </motion.div>
  </motion.div>
);
