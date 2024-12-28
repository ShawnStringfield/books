"use client";

import { useState, useEffect } from "react";
import { Book, ReadingStatus } from "@/app/stores/types";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Search, Highlighter, Trash2 } from "lucide-react";
import { DemoBookCard } from "./DemoBookCard";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface SearchResult {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail: string;
    };
    publishedDate?: string;
    pageCount?: number;
    categories?: string[];
    subtitle?: string;
    previewLink?: string;
    infoLink?: string;
    publisher?: string;
    language?: string;
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
  };
}

interface DemoHighlight {
  id: string;
  text: string;
  page: number;
  createdAt: string;
}

export function LiveBookDemo() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<DemoHighlight[]>([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError(null);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
      if (!apiKey) {
        throw new Error("Google Books API key is not configured");
      }

      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        searchQuery
      )}&maxResults=5&key=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          `Failed to fetch book data: ${response.status} ${response.statusText}`
        );
      }

      if (!data.items?.length) {
        setError("No books found. Try searching with different keywords");
        setSearchResults([]);
        return;
      }

      setSearchResults(data.items);
    } catch (error) {
      console.error("Error searching for books:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Please try again later";
      setError(errorMessage);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectBook = (result: SearchResult) => {
    const timestamp = new Date().toISOString();
    const totalPages = result.volumeInfo.pageCount || 100;
    // Generate random progress between 25-75%
    const randomProgress = Math.floor(Math.random() * (75 - 25 + 1) + 25);
    const currentPage = Math.floor((randomProgress / 100) * totalPages);

    const book: Book = {
      id: result.id,
      title: result.volumeInfo.title,
      subtitle: result.volumeInfo.subtitle || undefined,
      author: result.volumeInfo.authors
        ? result.volumeInfo.authors.join(", ")
        : "Unknown Author",
      description: result.volumeInfo.description || "",
      totalPages,
      currentPage,
      status: ReadingStatus.IN_PROGRESS,
      categories: result.volumeInfo.categories || [],
      previewLink: result.volumeInfo.previewLink,
      infoLink: result.volumeInfo.infoLink,
      publisher: result.volumeInfo.publisher,
      language: result.volumeInfo.language,
      publishDate: result.volumeInfo.publishedDate,
      coverUrl:
        result.volumeInfo.imageLinks?.thumbnail?.replace("http:", "https:") ||
        "",
      isbn: result.volumeInfo.industryIdentifiers?.[0]?.identifier || "",
      genre: result.volumeInfo.categories?.[0] || "",
      fromGoogle: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    setSelectedBook(book);
    setSearchResults([]);
    setSearchQuery("");
    localStorage.setItem("demo_book", JSON.stringify(book));
  };

  const handleAddSampleHighlight = () => {
    if (!selectedBook) return;

    const sampleHighlight: DemoHighlight = {
      id: Date.now().toString(),
      text: "This is a sample highlight to demonstrate the feature. In the full app, you'll be able to add your own highlights!",
      page: selectedBook.currentPage || Math.floor(selectedBook.totalPages / 2),
      createdAt: new Date().toISOString(),
    };

    const updatedHighlights = [...highlights, sampleHighlight];
    setHighlights(updatedHighlights);
    localStorage.setItem("demo_highlights", JSON.stringify(updatedHighlights));
  };

  const handleDeleteHighlight = (highlightId: string) => {
    const updatedHighlights = highlights.filter((h) => h.id !== highlightId);
    setHighlights(updatedHighlights);
    localStorage.setItem("demo_highlights", JSON.stringify(updatedHighlights));
  };

  useEffect(() => {
    const savedBook = localStorage.getItem("demo_book");
    const savedHighlights = localStorage.getItem("demo_highlights");

    if (savedBook) {
      try {
        const parsedBook = JSON.parse(savedBook);
        setSelectedBook(parsedBook);
      } catch (error) {
        console.error("Error parsing saved book:", error);
        localStorage.removeItem("demo_book");
      }
    }

    if (savedHighlights) {
      try {
        const parsedHighlights = JSON.parse(savedHighlights);
        setHighlights(parsedHighlights);
      } catch (error) {
        console.error("Error parsing saved highlights:", error);
        localStorage.removeItem("demo_highlights");
      }
    }
  }, []);

  const handleStatusChange = (bookId: string, status: Book["status"]) => {
    if (selectedBook && selectedBook.id === bookId) {
      const updatedBook = {
        ...selectedBook,
        status,
        currentPage:
          status === ReadingStatus.COMPLETED
            ? selectedBook.totalPages
            : selectedBook.currentPage,
        updatedAt: new Date().toISOString(),
      };
      setSelectedBook(updatedBook);
      localStorage.setItem("demo_book", JSON.stringify(updatedBook));
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold text-center mb-2">Try It Out</h2>
      <p className="text-center text-gray-600 mb-8">
        Search for a book and see how it works
      </p>

      <div className="max-w-xl mx-auto">
        <div className="relative">
          <div className="flex gap-2 mb-2">
            <Input
              type="text"
              placeholder="Search for a book..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button
              onClick={handleSearch}
              disabled={isSearching}
              className="min-w-[100px]"
            >
              {isSearching ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-4 space-y-4 border rounded-lg overflow-hidden divide-y">
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelectBook(result)}
                  className="w-full text-left p-4 hover:bg-gray-50 flex gap-4 items-start"
                >
                  {result.volumeInfo.imageLinks?.thumbnail && (
                    <Image
                      src={result.volumeInfo.imageLinks.thumbnail.replace(
                        "http:",
                        "https:"
                      )}
                      alt={result.volumeInfo.title}
                      width={64}
                      height={96}
                      className="object-cover rounded-sm"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {result.volumeInfo.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {result.volumeInfo.authors?.join(", ") ||
                        "Unknown Author"}
                    </p>
                    {result.volumeInfo.description && (
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                        {result.volumeInfo.description}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
        )}

        {selectedBook && (
          <div className="mt-4 space-y-6" key={selectedBook.id}>
            <DemoBookCard
              book={selectedBook}
              onStatusChange={handleStatusChange}
              onDelete={() => {
                setSelectedBook(null);
                setHighlights([]);
                localStorage.removeItem("demo_book");
                localStorage.removeItem("demo_highlights");
              }}
              onAddHighlight={handleAddSampleHighlight}
            />

            {highlights.length > 0 && (
              <div className="space-y-3 bg-white rounded-lg border border-gray-100 shadow-sm p-4">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500">{selectedBook.title}</p>
                  <h5 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <Highlighter className="w-4 h-4 text-yellow-500" />
                    Highlights ({highlights.length})
                  </h5>
                </div>
                <div className="space-y-2">
                  <AnimatePresence initial={false}>
                    {highlights.map((highlight) => (
                      <motion.div
                        key={highlight.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="text-sm p-3 relative">
                          <p className="text-gray-800">{highlight.text}</p>
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-xs text-gray-500">
                              Page {highlight.page}
                            </p>
                            <button
                              onClick={() =>
                                handleDeleteHighlight(highlight.id)
                              }
                              className="text-red-500 hover:text-red-600 transition-colors rounded-full p-1 bg-red-50 hover:bg-red-100"
                              aria-label="Delete highlight"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
