import { Upload } from 'lucide-react';
import { useState, useEffect } from 'react';
import mammoth from 'mammoth';

export default function StatementOfPurpose({ formData, handleInputChange, errors = {} }) {
  const [uploadStatus, setUploadStatus] = useState("");
  const [fileName, setFileName] = useState("");
  const [hasUploadedContent, setHasUploadedContent] = useState(false);

  // Clear upload status when text is deleted
  useEffect(() => {
    if (hasUploadedContent && !formData.sopText) {
      setUploadStatus("");
      setFileName("");
      setHasUploadedContent(false);
    }
  }, [formData.sopText, hasUploadedContent]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ['text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!allowedTypes.includes(file.type)) {
      setUploadStatus("Please upload a valid document (TXT, DOC, or DOCX)");
      setFileName("");
      setHasUploadedContent(false);
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus("File size should be less than 5MB");
      setFileName("");
      setHasUploadedContent(false);
      return;
    }

    setFileName(file.name);
    setUploadStatus("Processing...");

    try {
      let extractedText = "";

      if (file.type === 'text/plain') {
        // Handle TXT files
        const text = await file.text();
        extractedText = text;
      } else if (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // Handle DOC/DOCX files
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        extractedText = result.value;
      }

      if (extractedText.trim()) {
        handleInputChange({
          target: {
            name: 'sopText',
            value: extractedText.trim()
          }
        });
        setUploadStatus("✓ Text extracted");
        setHasUploadedContent(true);
      } else {
        setUploadStatus("No text found in the document");
        setFileName("");
        setHasUploadedContent(false);
      }
    } catch (error) {
      console.error('File processing error:', error);
      setUploadStatus("Error processing file");
      setFileName("");
      setHasUploadedContent(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Statement of Purpose (SOP)</h2>
      <p className="text-gray-600 mb-8">Write a compelling statement about why you want to study abroad and your future goals.</p>

      <div>
        {/* Label with Upload Button */}
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">Your Statement of Purpose</label>
          
          <label 
            htmlFor="sopFileUpload" 
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 cursor-pointer transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>{fileName || "Upload Document"}</span>
            <input
              id="sopFileUpload"
              type="file"
              accept=".txt,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* File type info */}
        <p className="text-xs text-gray-500 text-right mb-2">TXT, DOC, or DOCX (Max 5MB)</p>

        {/* Upload Status */}
        {uploadStatus && (
          <p className={`text-sm mb-2 ${
            uploadStatus.includes('✓') ? 'text-green-600' : uploadStatus.includes('Error') || uploadStatus.includes('No text') ? 'text-red-500' : 'text-gray-600'
          }`}>
            {uploadStatus}
          </p>
        )}
        
        {errors.sopText && (
          <p className="text-red-500 text-sm font-medium mb-2">* {errors.sopText}</p>
        )}
        
        <textarea
          name="sopText"
          value={formData.sopText}
          onChange={handleInputChange}
          placeholder="Write your statement of purpose here..."
          rows={12}
          className={`w-full px-4 py-3 border ${
            errors.sopText ? "border-red-500" : "border-black"
          } bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none`}
        />
        <p className="text-sm text-gray-500 mt-2">Minimum 250 words recommended</p>
      </div>
    </div>
  );
}
