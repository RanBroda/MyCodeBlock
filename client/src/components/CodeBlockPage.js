// CodeBlockPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const CodeBlockPage = () => {
    const { id } = useParams();
    const [codeBlock, setCodeBlock] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/code-block/${id}`)
            .then(response => response.json())
            .then(data => {
                setCodeBlock(data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!codeBlock) {
        return <div>Code block not found</div>;
    }

    return (
        <div>
            <h1>{codeBlock.title}</h1>
            <pre>{codeBlock.code}</pre>
        </div>
    );
};

export default CodeBlockPage;
