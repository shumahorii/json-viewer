import React from 'react';

type Props = {
    onJsonChange: (jsonText: string) => void;
};

const JsonInput: React.FC<Props> = ({ onJsonChange }) => {
    return (
        <textarea
            rows={10}
            cols={60}
            placeholder="ここにJSONを貼り付けてください"
            onChange={(e) => onJsonChange(e.target.value)}
        />
    );
};

export default JsonInput;