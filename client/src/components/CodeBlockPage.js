import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Editor } from '@monaco-editor/react';
//import { initSocket } from './socket';
import { io } from 'socket.io-client';
import './styles.css';

const socket = io('http://localhost:3000');

//const originRemote = `https://mycodeblock-backend.onrender.com/code-block/${id}`

const CodeBlockPage = () => {
    const { id } = useParams();
    const [codeBlock, setCodeBlock] = useState(null);
    const [loading, setLoading] = useState(true);
    const [code, setCode] = useState('');
    const hasJoinedRef = useRef(false);
    const [isMentor, setIsMentor] = useState(false);
    const [showSmiley, setShowSmiley] = useState(false);

    

    useEffect(() => {
        console.log('Fetching code block for title:', id);
        fetch(`https://mycodeblock-backend.onrender.com/code-block/${id}`)
            .then(response => response.json())
            .then(data => {
                setCodeBlock(data);
                setCode(data.code);
                setLoading(false);
                if (!hasJoinedRef.current){
                    socket.emit('join-room', id); // Join the room based on the code block title
                    hasJoinedRef.current = true;
                }
            })
            .catch(error => {
                console.error('Error fetching code block:', error);
                setLoading(false);
            });



        // Handle code updates from other clients
        socket.on('code-update', (newCode) => {
            setCode(newCode);
        });

        // this is appended only one time for each entres to the room
        socket.on('set-role', (role) => {
            setIsMentor(role === 'mentor');
        });

        // Cleanup on unmount
        return () => {
            socket.off('code-update');
            socket.off('set-role');
            socket.emit('leave-room', id); // Leave the room when component unmounts
        };
    }, [id]);

    const checkSolution = (newCode) => {
        if (codeBlock && newCode.trim() === codeBlock.solution.trim()) {
            setShowSmiley(true);
        } else {
            setShowSmiley(false);
        }
    };
        const handleCodeChange = (newCode) => {
            setCode(newCode);
            socket.emit('code-change', {room: id, code: newCode});
            checkSolution(newCode)
        };

        if (loading) {
            return <div className='code-block'>Loading...</div>;
        }

        if (!codeBlock) {
            return <div>Code block not found</div>;
        }

        return (
            <div className="code-block">
                <h1>{codeBlock.title}</h1>
                {showSmiley && <div className="smiley">😊</div>}
                <div className="editor">
                    <Editor
                        height="20px"
                        language="javascript"
                        value={code}
                        options={{
                            readOnly: isMentor,
                        }}
                        onChange={(value) => handleCodeChange(value)}
                    />
                </div>
                {isMentor && (
                    <div className="solution">
                        <h2>Solution</h2>
                        <pre>{codeBlock.solution}</pre>
                    </div>)}
            </div>
        );
};

export default CodeBlockPage;