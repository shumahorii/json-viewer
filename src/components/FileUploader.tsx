// components/FileUploader.tsx
import React from 'react';

type Props = {
    onLoad: (json: any) => void;
};

const FileUploader: React.FC<Props> = ({ onLoad }) => {
    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                onLoad(json);
            } catch {
                alert("JSONファイルの読み込みに失敗しました");
            }
        };
        reader.readAsText(file);
    };

    return <input type="file" accept=".json" onChange={handleFile} />;
};

export default FileUploader;
