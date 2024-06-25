// LobbyPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const codeBlocks = [
    { title: 'Async case' },
    { title: 'Promises', id: '667ad166f837c0e4cd411181' },
    { title: 'Callbacks' },
    { title: 'Event Loop' },
];

const LobbyPage = () => (
    <div>
        <h1>Choose code block</h1>
        <ul>
            {codeBlocks.map((block) => (
                <li key={block.title}>
                    <Link to={`/code-block/${block.id}`}>{block.title}</Link>
                </li>
            ))}
        </ul>
    </div>
);

export default LobbyPage;
