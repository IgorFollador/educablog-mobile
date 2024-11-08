import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface TextEditorProps {
  value: string;
  setValue: (value: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ value, setValue }) => {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={value}
      config={{
        removePlugins: [
          'Image', 
          'ImageToolbar', 
          'ImageUpload', 
          'ImageCaption', 
          'ImageStyle', 
          'MediaEmbed', 
          'EasyImage',
          'CKFinder',
          'Video',
        ],
        toolbar: [
          'heading',              // Títulos (Heading 1, 2, 3, etc.)
          'bold',                 // Negrito
          'italic',               // Itálico
          'blockQuote',           // Citações (Block Quote)
          'link',                 // Links
          'bulletedList',         // Lista com marcadores
          'numberedList',         // Lista numerada
          'undo',                 // Desfazer
          'redo',                 // Refazer
        ]
      }}
      onChange={(event: any, editor: any) => {
        const data = editor.getData();
        setValue(data);
      }}
    />
  );
};

export default TextEditor;
