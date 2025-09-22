import axios from 'axios';
import { API_ENDPOINTS } from '../utils/api';

// Type for askQuestion request parameters
interface AskQuestionParams {
  user_id: string;
  question: string;
}

// Type for askQuestion response
interface AskQuestionResponse {
  answer: string;
}

// LifeGuard RAG service
class RagService {
  /**
   * Upload a PDF file to the RAG system
   */
  async uploadPDF(
    userId: string,
    pdfBlob: Blob,
    filename: string
  ): Promise<{ message: string; user_id: string; chunks: number }> {
    try {
      // Create form data for the PDF upload
      const formData = new FormData();
      formData.append('file', pdfBlob, filename);
      formData.append('user_id', userId);

      // Make the upload request using the defined endpoint
      const response = await axios.post(API_ENDPOINTS.RAG_UPLOAD_PDF, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to upload PDF to RAG system:', error);

      // Handle 404 errors (likely the service is still starting up)
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error('RAG service is currently unavailable. Please try again in a few moments.');
      }

      // Handle 422 errors (validation errors)
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        throw new Error(
          'Invalid file format or missing data. Please ensure you upload a valid PDF file.'
        );
      }

      // Handle timeout errors (free tier can be slow to start)
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        throw new Error(
          'Upload timed out. The RAG service may be starting up on the free tier. Please try again.'
        );
      }

      throw error;
    }
  }

  /**
   * Ask a question to the RAG system
   */
  async askQuestion(params: AskQuestionParams): Promise<AskQuestionResponse> {
    try {
      // Make the ask request using the defined endpoint
      const response = await axios.post(
        API_ENDPOINTS.RAG_ASK_QUESTION,
        {
          user_id: params.user_id,
          question: params.question,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 second timeout for questions (free tier can be slow)
        }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to ask question to RAG system:', error);

      // Handle 404 errors from API (no context found)
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return {
          answer: 'No relevant document chunks found for this user. Upload a PDF first.',
        };
      }

      // Handle timeout errors (free tier can be slow to start)
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        throw new Error(
          'Request timed out. The RAG service may be starting up on the free tier. Please try again.'
        );
      }

      throw error;
    }
  }
}

export const ragService = new RagService();
export default ragService;
