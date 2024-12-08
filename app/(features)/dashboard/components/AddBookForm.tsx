import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/app/components/ui/form';
import { useDashboardStore } from '../stores/useDashboardStore';
import { v4 as uuidv4 } from 'uuid';
import { ReadingStatus } from '../types/books';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useDebounce } from '@/app/hooks/useDebounce';
import { GoogleBook, GoogleBooksResponse } from '../types/books';
import Image from 'next/image';

// Validation schema remains the same
const bookFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  totalPages: z.number().min(1, 'Pages must be greater than 0'),
  coverUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  currentPage: z.number().min(0).optional(),
});

type BookFormValues = z.infer<typeof bookFormSchema>;

export function AddBookForm() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GoogleBook[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 500);

  const { addBook, setAddBookDrawerOpen, setLoading, setError, isLoading } = useDashboardStore();

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: '',
      author: '',
      totalPages: undefined,
      coverUrl: '',
      currentPage: 0,
    },
  });

  // Add search functionality
  useEffect(() => {
    const searchBooks = async () => {
      if (!debouncedSearch) {
        setSearchResults([]);
        return;
      }

      try {
        setIsSearching(true);
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(debouncedSearch)}&maxResults=5`);
        const data: GoogleBooksResponse = await response.json();
        setSearchResults(data.items || []);
      } catch (error) {
        console.error('Failed to search books:', error);
      } finally {
        setIsSearching(false);
      }
    };

    searchBooks();
  }, [debouncedSearch]);

  const handleBookSelect = (book: GoogleBook) => {
    form.setValue('title', book.volumeInfo.title);
    form.setValue('author', book.volumeInfo.authors?.[0] || '');
    form.setValue('totalPages', book.volumeInfo.pageCount || 0);
    form.setValue('coverUrl', book.volumeInfo.imageLinks?.thumbnail || '');
    setSearchQuery('');
    setSearchResults([]);
  };

  const onSubmit = async (data: BookFormValues) => {
    try {
      setLoading(true);
      setError(null);

      const newBook = {
        id: uuidv4(),
        ...data,
        coverUrl: data.coverUrl || undefined,
        createdAt: new Date().toISOString(),
        completedDate: undefined,
        currentPage: data.currentPage ?? 0,
        status: ReadingStatus.NOT_STARTED,
      };

      addBook(newBook);
      setAddBookDrawerOpen(false);
      form.reset();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add book');
      console.error('Failed to add book:', error);
    } finally {
      setLoading(false);
    }
  };

  // Rest of the component remains the same, just update the submit button to use isLoading from store
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="relative">
          <Input placeholder="Search for a book..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pr-10" />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

          {searchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
              {searchResults.map((book) => (
                <button
                  key={book.id}
                  type="button"
                  onClick={() => handleBookSelect(book)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3"
                >
                  {book.volumeInfo.imageLinks?.thumbnail && (
                    <Image src={book.volumeInfo.imageLinks.thumbnail} alt="" width={40} height={56} className="object-cover" />
                  )}
                  <div>
                    <p className="font-medium">{book.volumeInfo.title}</p>
                    <p className="text-sm text-gray-600">{book.volumeInfo.authors?.[0]}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {isSearching && (
            <div className="absolute z-10 w-full mt-1 p-4 bg-white rounded-md shadow-lg border border-gray-200 text-center">Searching...</div>
          )}
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Book Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter book title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author</FormLabel>
              <FormControl>
                <Input placeholder="Enter author name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="totalPages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Pages</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter total pages" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="coverUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image URL (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter cover image URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => setAddBookDrawerOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Book'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
