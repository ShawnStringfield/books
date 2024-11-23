import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { BookMarked, CheckCircle2 } from 'lucide-react';
import { containerVariants, itemVariants } from '../_animations';

interface GenresStepProps {
  selectedGenres: string[];
  onGenreSelect: (genre: string) => void;
}

const GENRES = ['Fiction', 'Non-Fiction', 'Mystery', 'Science Fiction', 'Fantasy', 'Romance', 'Thriller', 'Biography', 'Self-Help'];

export const GenresStep = ({ selectedGenres, onGenreSelect }: GenresStepProps) => (
  <motion.div variants={containerVariants} className="space-y-6">
    <motion.h2 variants={itemVariants} className="text-3xl font-bold">
      What do you like to read?
    </motion.h2>
    <motion.p variants={itemVariants} className="text-gray-600">
      {`Select your favorite genres to help us recommend books you'll love`}
    </motion.p>
    <motion.div variants={containerVariants} className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {GENRES.map((genre) => (
        <motion.div key={genre} variants={itemVariants}>
          <Button
            variant={selectedGenres.includes(genre) ? 'default' : 'outline'}
            className="w-full h-auto py-4 px-6 text-left justify-start"
            onClick={() => onGenreSelect(genre)}
          >
            <BookMarked className="w-5 h-5 mr-2" />
            {genre}
            {selectedGenres.includes(genre) && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </motion.div>
            )}
          </Button>
        </motion.div>
      ))}
    </motion.div>
  </motion.div>
);
