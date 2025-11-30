import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

// A smaller, reliable image analysis page that uploads a single image (base64)
// to the existing backend `/api/analysis` route and displays the structured result.
const ImageUploadAnalysis = () => {
  const navigate = useNavigate();
  const [fileDataUrl, setFileDataUrl] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    // clear stale local state when mounting
    setResult(null);
    setError(null);
  }, []);

  const onFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) {
      setError('File too large (max 10 MB). Please choose a smaller image.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFileDataUrl(reader.result);
      setFileName(f.name || 'upload.jpg');
      setError(null);
      setUploadProgress(0);
    };
    reader.onerror = () => setError('Failed to read file');
    reader.readAsDataURL(f);
  };

  const submitAnalysis = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setUploadProgress(0);
    
    try {
      const b64 = fileDataUrl ? String(fileDataUrl).split(',')[1] : null;
      const quizData = JSON.parse(localStorage.getItem('glowmatch-quiz-data') || '{}');
      const payload = { quizData, images: b64 ? [{ filename: fileName || 'upload.jpg', data: b64 }] : [] };
      
      const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'http://localhost:4000/api';
      
      setUploadProgress(30);
      
      const resp = await fetch(`${API_BASE}/analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      setUploadProgress(70);
      
      if (!resp.ok) {
        const txt = await resp.text().catch(() => null);
        throw new Error(txt || `Server error ${resp.status}`);
      }
      
      const json = await resp.json().catch(() => null);
      const data = (json && (json.data || json)) || null;
      
      // Normalize minimal result object
      const parsed = data && (data.analysis || data.result || data.analysis || data) || {};
      const out = {
        skinType: parsed.skinType || parsed.skin_type || parsed.skin || (parsed.text && parsed.text.skinType) || 'combination',
        confidence: parsed.confidence || 70,
        concerns: parsed.concerns || [],
        recommendations: parsed.recommendations || [],
        explanation: (parsed.explanation || parsed.text) || '',
        raw: data
      };
      
      setResult(out);
      setUploadProgress(100);
      localStorage.setItem('glowmatch-analysis', JSON.stringify(out));
      
      // Auto-navigate to results after 2 seconds
      setTimeout(() => {
        navigate('/results-dashboard', { replace: true });
      }, 2000);
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-3xl mx-auto px-5 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-8">
          <Icon name="Image" size={48} className="mx-auto text-accent mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Upload Your Photo</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Take a clear, well-lit selfie of your face. Our AI will analyze your skin condition combined with your quiz responses.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
          <div className="space-y-6">
            {/* File Input Area */}
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent/50 transition-colors cursor-pointer relative">
              <input 
                type="file" 
                accept="image/*" 
                onChange={onFileChange}
                className="absolute inset-0 cursor-pointer opacity-0"
                disabled={loading}
              />
              {fileDataUrl ? (
                <div className="space-y-4">
                  <Icon name="CheckCircle2" size={48} className="mx-auto text-green-600" />
                  <p className="font-medium text-foreground">Image selected</p>
                  <p className="text-sm text-muted-foreground">{fileName}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Icon name="Upload" size={40} className="mx-auto text-muted-foreground" />
                  <p className="font-medium text-foreground">Click to upload or drag and drop</p>
                  <p className="text-sm text-muted-foreground">PNG, JPG, GIF up to 10 MB</p>
                </div>
              )}
            </div>

            {/* Image Preview */}
            {fileDataUrl && (
              <div className="space-y-3">
                <img src={fileDataUrl} alt="preview" className="w-full h-64 object-cover rounded-lg border border-border" />
                <p className="text-xs text-muted-foreground text-center">Preview of your uploaded image</p>
              </div>
            )}

            {/* Progress Bar */}
            {loading && uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Analyzing your skin...</span>
                  <span className="font-medium">{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-accent h-full rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="AlertTriangle" className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-destructive">Analysis Error</p>
                    <p className="text-sm text-muted-foreground mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Success Message */}
            {result && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="CheckCircle2" className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-green-900">Analysis Complete!</p>
                    <p className="text-sm text-green-700 mt-1">
                      Detected: <strong>{result.skinType}</strong> skin ({result.confidence}% confidence)
                    </p>
                    <p className="text-xs text-green-600 mt-2">Redirecting to results dashboard...</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Button 
                onClick={submitAnalysis} 
                disabled={!fileDataUrl || loading}
                iconName={loading ? "Loader2" : "Zap"}
                className={loading ? "" : ""}
              >
                {loading ? 'Analyzing...' : 'Run Analysis'}
              </Button>
              
              {fileDataUrl && !loading && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    setFileDataUrl(null);
                    setFileName(null);
                    setResult(null);
                    setError(null);
                  }}
                  iconName="Trash2"
                >
                  Clear Image
                </Button>
              )}

              <Button 
                variant="ghost" 
                onClick={() => navigate('/results-dashboard')}
                iconName="ArrowRight"
                className="ml-auto"
              >
                Skip to Results
              </Button>
            </div>

            {/* Tips */}
            <div className="bg-accent/5 border border-accent/10 rounded-lg p-4 mt-6">
              <h3 className="font-medium text-foreground mb-2 flex items-center space-x-2">
                <Icon name="Lightbulb" className="h-4 w-4 text-accent" />
                <span>Tips for best results:</span>
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use good lighting (natural light is best)</li>
                <li>• Remove makeup if possible</li>
                <li>• Take a clear, frontal face photo</li>
                <li>• Include your full face in the frame</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ImageUploadAnalysis;