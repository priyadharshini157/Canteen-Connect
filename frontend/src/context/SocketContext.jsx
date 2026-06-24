import React, { createContext, useEffect, useState } from 'react';
import { socketService } from '../services/socket';

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const [liveTokens, setLiveTokens] = useState({ Preparing: [], Ready: [] });

    useEffect(() => {
        socketService.connect();

        const unsubscribe = socketService.subscribe((update) => {
            setLiveTokens(prev => {
                const newTokens = { ...prev };
                newTokens.Preparing = newTokens.Preparing.filter(t => t !== update.token_number);
                newTokens.Ready = newTokens.Ready.filter(t => t !== update.token_number);
                
                if (update.status !== 'Completed' && newTokens[update.status]) {
                    newTokens[update.status].push(update.token_number);
                }
                return newTokens;
            });
        });

        return () => {
            unsubscribe();
            socketService.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ liveTokens }}>
            {children}
        </SocketContext.Provider>
    );
};