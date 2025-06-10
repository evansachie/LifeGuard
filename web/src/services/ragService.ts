import { RAG_BASE_URL } from '@/utils/api';

export interface UploadPDFResponse {
  message: string;
  file_id?: string;
}

export interface AskResponse {
  answer: string;
}

export interface AskRequest {
  user_id: string;
  question: string;
  top_k?: number;
}

export const ragService = {
  async uploadPDF(userId: string, pdfBlob: Blob, filename: string): Promise<UploadPDFResponse> {
    const formData = new FormData();
    formData.append('file', pdfBlob, filename);

    const response = await fetch(`${RAG_BASE_URL}/api/upload?user_id=${userId}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload PDF: ${response.statusText}`);
    }

    return response.json();
  },

  async askQuestion(request: AskRequest): Promise<AskResponse> {
    const response = await fetch(`${RAG_BASE_URL}/api/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to ask question: ${response.statusText}`);
    }

    return response.json();
  },
};
