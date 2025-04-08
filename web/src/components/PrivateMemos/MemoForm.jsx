import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import Spinner from '../Spinner/Spinner';

const MemoForm = ({ 
  memo, 
  setMemo,
  isDarkMode,
  handleSave, 
  handleCancel, 
  isEditing = false, 
  saving = false,
}) => {

  const handleEditorChange = (content, editor) => {
    setMemo(content);
  };

  return (
    <div className="memo-input-container">
      <Editor
        apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
        value={memo}
        onEditorChange={handleEditorChange}
        init={{
          height: isEditing ? 250 : 200,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount', 'codesample', 'quickbars'
          ],
          toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | codesample | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          skin: isDarkMode ? 'oxide-dark' : 'oxide',
          content_css: isDarkMode ? 'dark' : 'default',
          quickbars_selection_toolbar: 'bold italic | quicklink blockquote | codesample',
          quickbars_insert_toolbar: false,
          branding: false,
          promotion: false,
          statusbar: false,

          auto_focus: !isEditing,
        }}
      />
      <div className="memo-input-actions py-4">
        <button
          className="action-button cancel-button"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button 
          className="action-button save-memo-button" 
          onClick={handleSave}
          disabled={saving || !memo.trim()}
        >
          {saving ? <Spinner size="small" color="white" /> : isEditing ? 'Update Note' : 'Save Note'}
        </button>
      </div>
    </div>
  );
};

export default MemoForm;
