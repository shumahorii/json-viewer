// components/ClassDiagram.tsx
import React, { useState } from 'react';
import ReactFlow, { Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';

type Props = {
    data: any;
};

const ClassDiagram: React.FC<Props> = ({ data }) => {
    const [visibleCount, setVisibleCount] = useState(100);
    const classes = Array.isArray(data?.classes) ? data.classes : [];

    const visibleClasses = classes.slice(0, visibleCount);

    const nodes: Node[] = visibleClasses.map((cls: any, i: number) => ({
        id: cls.name,
        position: { x: 200 * (i % 5), y: 150 * Math.floor(i / 5) },
        data: {
            label: (
                <div style={{ padding: 10, border: '1px solid black', background: '#fff' }}>
                    <strong>{cls.name}</strong>
                    <hr />
                    {cls.properties?.map((p: string) => <div key={p}>{p}</div>)}
                    <hr />
                    {cls.methods?.map((m: string) => <div key={m}>{m}</div>)}
                </div>
            ),
        },
        type: 'default',
    }));

    const edges: Edge[] = visibleClasses
        .filter((cls: any) => cls.extends)
        .map((cls: any) => ({
            id: `e-${cls.extends}-${cls.name}`,
            source: cls.extends,
            target: cls.name,
            type: 'smoothstep',
            markerEnd: { type: 'arrowclosed' },
        }));

    return (
        <div>
            <div style={{ height: '600px', border: '1px solid gray', width: '100%' }}>
                <ReactFlow nodes={nodes} edges={edges} fitView />
            </div>
            {visibleCount < classes.length && (
                <button onClick={() => setVisibleCount(c => c + 100)}>もっと表示</button>
            )}
        </div>
    );
};

export default ClassDiagram;
