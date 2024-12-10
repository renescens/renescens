// Mock Storage Service
export const uploadFile = async (path: string, file: File): Promise<string> => {
  try {
    // Create a mock URL for the uploaded file
    const mockUrl = URL.createObjectURL(file);
    console.log(`Mock file uploaded to: ${path}`);
    return mockUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Erreur lors du téléchargement du fichier');
  }
};

export const deleteFile = async (path: string): Promise<void> => {
  try {
    console.log(`Mock file deleted from: ${path}`);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error('Erreur lors de la suppression du fichier');
  }
};