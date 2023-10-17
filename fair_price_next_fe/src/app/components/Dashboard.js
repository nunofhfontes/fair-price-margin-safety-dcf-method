"use client";

import React, { useState, useEffect } from 'react';
import { eventBus } from './EventBus'; 


function Dashboard() {

    const [tickerData, setTickerData] = useState('');

    useEffect(() => {
        
        const dataHandler = (data) => {
            setTickerData(data);
            console.log('Data received: ', data);
        };
    
        eventBus.on('updateData', dataHandler);
    
        return () => {
          eventBus.off('updateData', dataHandler);
        };
      }, []);

    return (
        <>
            Dashboard
        </>
    );
}

export default Dashboard;