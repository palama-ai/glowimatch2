import React, { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Icon from '../AppIcon';

// Custom styles for admin theme
const editorStyles = `
  .admin-quill-editor .ql-toolbar {
    background: var(--admin-bg-primary);
    border: 1px solid var(--admin-border);
    border-radius: 10px 10px 0 0;
    padding: 12px;
  }
  
  .admin-quill-editor .ql-toolbar .ql-stroke {
    stroke: var(--admin-text-secondary);
  }
  
  .admin-quill-editor .ql-toolbar .ql-fill {
    fill: var(--admin-text-secondary);
  }
  
  .admin-quill-editor .ql-toolbar .ql-picker {
    color: var(--admin-text-secondary);
  }
  
  .admin-quill-editor .ql-toolbar button:hover .ql-stroke,
  .admin-quill-editor .ql-toolbar .ql-picker-label:hover,
  .admin-quill-editor .ql-toolbar button.ql-active .ql-stroke {
    stroke: var(--admin-accent);
  }
  
  .admin-quill-editor .ql-toolbar button:hover .ql-fill,
  .admin-quill-editor .ql-toolbar button.ql-active .ql-fill {
    fill: var(--admin-accent);
  }
  
  .admin-quill-editor .ql-container {
    background: var(--admin-bg-primary);
    border: 1px solid var(--admin-border);
    border-top: none;
    border-radius: 0 0 10px 10px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    min-height: 300px;
  }
  
  .admin-quill-editor .ql-editor {
    color: var(--admin-text-primary);
    min-height: 300px;
    padding: 16px;
    line-height: 1.7;
  }
  
  .admin-quill-editor .ql-editor.ql-blank::before {
    color: var(--admin-text-muted);
    font-style: normal;
  }
  
  .admin-quill-editor .ql-editor h1,
  .admin-quill-editor .ql-editor h2,
  .admin-quill-editor .ql-editor h3 {
    color: var(--admin-text-primary);
    margin-bottom: 0.5em;
  }
  
  .admin-quill-editor .ql-editor a {
    color: var(--admin-accent);
  }
  
  .admin-quill-editor .ql-editor img {
    max-width: 100%;
    border-radius: 8px;
    margin: 16px 0;
  }
  
  .admin-quill-editor .ql-editor blockquote {
    border-left: 4px solid var(--admin-accent);
    padding-left: 16px;
    margin: 16px 0;
    color: var(--admin-text-secondary);
    font-style: italic;
  }
  
  .admin-quill-editor .ql-snow .ql-picker-options {
    background: var(--admin-bg-card);
    border: 1px solid var(--admin-border);
    border-radius: 8px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  }
  
  .admin-quill-editor .ql-snow .ql-picker-item {
    color: var(--admin-text-primary);
  }
  
  .admin-quill-editor .ql-snow .ql-picker-item:hover {
    color: var(--admin-accent);
  }

  .admin-quill-editor .ql-tooltip {
    background: var(--admin-bg-card);
    border: 1px solid var(--admin-border);
    border-radius: 8px;
    color: var(--admin-text-primary);
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  }

  .admin-quill-editor .ql-tooltip input[type=text] {
    background: var(--admin-bg-primary);
    border: 1px solid var(--admin-border);
    border-radius: 6px;
    color: var(--admin-text-primary);
  }

  .admin-quill-editor .ql-tooltip a.ql-action,
  .admin-quill-editor .ql-tooltip a.ql-remove {
    color: var(--admin-accent);
  }
`;

// Blog layout templates
const LAYOUT_TEMPLATES = [
    {
        id: 'classic',
        name: 'Classic',
        icon: 'AlignLeft',
        description: 'Text-focused layout',
        preview: '📝'
    },
    {
        id: 'image-header',
        name: 'Image Header',
        icon: 'Image',
        description: 'Large image at top',
        preview: '🖼️'
    },
    {
        id: 'side-by-side',
        name: 'Side by Side',
        icon: 'LayoutPanelLeft',
        description: 'Image beside text',
        preview: '📐'
    },
    {
        id: 'gallery',
        name: 'Gallery',
        icon: 'LayoutGrid',
        description: 'Image grid layout',
        preview: '🎨'
    }
];

const RichTextEditor = ({
    value,
    onChange,
    placeholder = 'Write your blog content here...',
    selectedLayout,
    onLayoutChange
}) => {
    // Quill modules configuration
    const modules = useMemo(() => ({
        toolbar: {
            container: [
                // Headers
                [{ 'header': [1, 2, 3, false] }],

                // Font styling
                ['bold', 'italic', 'underline', 'strike'],

                // Font size
                [{ 'size': ['small', false, 'large', 'huge'] }],

                // Colors
                [{ 'color': [] }, { 'background': [] }],

                // Lists & alignment
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'align': [] }],

                // Indent
                [{ 'indent': '-1' }, { 'indent': '+1' }],

                // Media & links
                ['link', 'image', 'video'],

                // Blockquote & code
                ['blockquote', 'code-block'],

                // Clear
                ['clean']
            ],
        },
        clipboard: {
            matchVisual: false
        }
    }), []);

    // Quill formats
    const formats = [
        'header', 'bold', 'italic', 'underline', 'strike',
        'size', 'color', 'background',
        'list', 'bullet', 'align', 'indent',
        'link', 'image', 'video',
        'blockquote', 'code-block'
    ];

    return (
        <div>
            {/* Inject custom styles */}
            <style>{editorStyles}</style>

            {/* Layout Templates Selector */}
            <div style={{ marginBottom: '16px' }}>
                <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: 'var(--admin-text-primary)',
                    marginBottom: '10px'
                }}>
                    Blog Layout Template
                </label>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '10px'
                }}>
                    {LAYOUT_TEMPLATES.map(template => (
                        <button
                            key={template.id}
                            type="button"
                            onClick={() => onLayoutChange?.(template.id)}
                            style={{
                                padding: '14px 12px',
                                borderRadius: '10px',
                                border: selectedLayout === template.id
                                    ? '2px solid var(--admin-accent)'
                                    : '1px solid var(--admin-border)',
                                background: selectedLayout === template.id
                                    ? 'rgba(59, 130, 246, 0.1)'
                                    : 'var(--admin-bg-primary)',
                                cursor: 'pointer',
                                textAlign: 'center',
                                transition: 'all 0.2s',
                            }}
                        >
                            <div style={{ fontSize: '24px', marginBottom: '6px' }}>
                                {template.preview}
                            </div>
                            <div style={{
                                fontSize: '12px',
                                fontWeight: '600',
                                color: selectedLayout === template.id
                                    ? 'var(--admin-accent)'
                                    : 'var(--admin-text-primary)',
                                marginBottom: '2px'
                            }}>
                                {template.name}
                            </div>
                            <div style={{
                                fontSize: '10px',
                                color: 'var(--admin-text-muted)'
                            }}>
                                {template.description}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Rich Text Editor */}
            <div style={{ marginBottom: '8px' }}>
                <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: 'var(--admin-text-primary)',
                    marginBottom: '8px'
                }}>
                    Content
                </label>
            </div>

            <div className="admin-quill-editor">
                <ReactQuill
                    theme="snow"
                    value={value}
                    onChange={onChange}
                    modules={modules}
                    formats={formats}
                    placeholder={placeholder}
                />
            </div>

            {/* Quick Tips */}
            <div style={{
                marginTop: '12px',
                padding: '12px 16px',
                background: 'var(--admin-bg-primary)',
                borderRadius: '8px',
                border: '1px solid var(--admin-border)',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px'
                }}>
                    <Icon name="Lightbulb" size={16} style={{ color: 'var(--admin-warning)' }} />
                    <span style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: 'var(--admin-text-primary)'
                    }}>
                        Quick Tips
                    </span>
                </div>
                <ul style={{
                    margin: 0,
                    paddingLeft: '20px',
                    fontSize: '11px',
                    color: 'var(--admin-text-muted)',
                    lineHeight: '1.8'
                }}>
                    <li>Use <strong>H1, H2, H3</strong> for headings to improve SEO</li>
                    <li>Click the <strong>image icon</strong> to insert images via URL</li>
                    <li>Click the <strong>video icon</strong> to embed YouTube/Vimeo videos</li>
                    <li>Select text and click <strong>link icon</strong> to add hyperlinks</li>
                </ul>
            </div>
        </div>
    );
};

export default RichTextEditor;
