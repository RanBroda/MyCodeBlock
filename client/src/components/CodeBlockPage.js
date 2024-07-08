import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { io } from 'socket.io-client';
import constants from '../constants';
import './styles.css';

const socket = io(constants.remoteBackURL);

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
    fetch(`/code-block/${id}`)
      .then(response => response.json())
      .then(data => {
        setCodeBlock(data);
        setCode(data.code);
        setLoading(false);
        if (!hasJoinedRef.current) {
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

    // this is appended only one time for each entry to the room
    socket.on('set-role', (role) => {
      setIsMentor(role === 'mentor');
    });

    // Cleanup on unmount
    return () => {
      socket.off('code-update');
      socket.off('set-role');
      socket.emit('leave-room', id); // Leave the room when component unmounts
    };
  }, [id]); // Only re-reder this effect if the ID is changed.

  const checkSolution = (newCode) => {
    if (codeBlock && newCode.trim() === codeBlock.solution.trim()) {
      setShowSmiley(true);
    } else {
      setShowSmiley(false);
    }
  };

  const handleCodeChange = (value) => {
    setCode(value);
    socket.emit('code-change', { room: id, code: value });
    checkSolution(value);
  };

  if (loading) {
    return <div className='code-block'>Loading...</div>;
  }

  if (!codeBlock) {
    return <div>Code block not found</div>;
  }

  return (
    <div className="code-block">
      {isMentor ? (
        <>
          <h1>{codeBlock.title}</h1>
          {showSmiley && <div className="smiley">😊</div>}
          <div className="editor">
            <pre>{code}</pre>
          </div>
          <div className="solution">
            <h2>Solution</h2>
            <pre>{codeBlock.solution}</pre>
          </div>
        </>
      ) : (
        <>
          <h1>{codeBlock.title}</h1>
          {showSmiley && <div className="smiley">😊</div>}
          <div className="editor">
            <CodeMirror
              value={code}
              height="400px"
              extensions={[javascript()]}
              onChange={(value) => handleCodeChange(value)}
              options={{
                lineNumbers: true,
                mode: 'javascript',
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CodeBlockPage;
