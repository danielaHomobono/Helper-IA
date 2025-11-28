import { useState } from 'react';
import ApiClient from '../utils/api';

export const useSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const searchTickets = async (query) => {
    setSearchLoading(true);
    setSearchError(null);
    try {
      const response = await ApiClient.searchTickets(query);
      setSearchResults(response.results || []);
    } catch (err) {
      setSearchError('Error al buscar. Intenta de nuevo.');
    } finally {
      setSearchLoading(false);
    }
  };

  const clearResults = () => {
    setSearchResults([]);
    setSearchError(null);
  };

  return {
    searchResults,
    searchLoading,
    searchError,
    searchTickets,
    clearResults
  };
};
