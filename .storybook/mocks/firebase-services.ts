// Mock book service
export const getBooks = () => Promise.resolve([]);
export const getBook = () => Promise.resolve(null);
export const addBook = () => Promise.resolve({});
export const updateBook = () => Promise.resolve({});
export const deleteBook = () => Promise.resolve({});
export const updateReadingStatus = () => Promise.resolve({});
export const updateReadingProgress = () => Promise.resolve({});
export const subscribeToBooks = () => () => {};

// Mock highlight service
export const getHighlights = () => Promise.resolve([]);
export const getHighlightsByBook = () => Promise.resolve([]);
export const addHighlight = () => Promise.resolve({});
export const updateHighlight = () => Promise.resolve({});
export const deleteHighlight = () => Promise.resolve({});
export const toggleFavorite = () => Promise.resolve({});
export const subscribeToHighlights = () => () => {};
export const subscribeToHighlightsByBook = () => () => {};
export const subscribeToFavoriteHighlights = () => () => {};
export const deleteHighlightsByBook = () => Promise.resolve({});
