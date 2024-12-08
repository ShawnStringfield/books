import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/app/components/ui/form';
import { useDashboardStore } from '../stores/useDashboardStore';
import { v4 as uuidv4 } from 'uuid';

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
