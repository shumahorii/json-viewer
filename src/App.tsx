import React, { useState } from 'react';
import JsonInput from './components/JsonInput';
import FileUploader from './components/FileUploader';
import ClassDiagram from './components/ClassDiagram';
import { transformUniversalJson, transformUniversalJsonWithEdges } from './utils/transformUniversalJson';

const App: React.FC = () => {
  const [jsonData, setJsonData] = useState<any | null>(null);

  const handleJsonInput = (raw: any) => {
    try {
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
      const transformed = transformUniversalJsonWithEdges(parsed);
      console.log(transformed)
      setJsonData(transformed);
    } catch (err) {
      alert('JSONの解析に失敗しました');
    }
  };

  return (
    <div>
      <h1>クラス図ジェネレーター</h1>
      <h2>📄 JSONを貼り付け</h2>
      <JsonInput onJsonChange={handleJsonInput} />
      <h2>📂 ファイルから読み込む</h2>
      <FileUploader onLoad={handleJsonInput} />
      {jsonData && <ClassDiagram data={jsonData} />}
    </div>
  );
};

export default App;
