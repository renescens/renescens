import { useState, useCallback } from 'react';
import { QueryConstraint } from 'firebase/firestore';
import * as firestoreService from '../services/firestore.service';

export const useFirestore = <T extends object>(collectionName: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const add = useCallback(async (data: T) => {
    setLoading(true);
    setError(null);
    try {
      const id = await firestoreService.addDocument<T>(collectionName, data);
      return id;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  const update = useCallback(async (id: string, data: Partial<T>) => {
    setLoading(true);
    setError(null);
    try {
      await firestoreService.updateDocument<T>(collectionName, id, data);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  const remove = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await firestoreService.deleteDocument(collectionName, id);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  const get = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      return await firestoreService.getDocument<T>(collectionName, id);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  const list = useCallback(async (constraints: QueryConstraint[] = []) => {
    setLoading(true);
    setError(null);
    try {
      return await firestoreService.getDocuments<T>(collectionName, constraints);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  return {
    add,
    update,
    remove,
    get,
    list,
    loading,
    error
  };
};