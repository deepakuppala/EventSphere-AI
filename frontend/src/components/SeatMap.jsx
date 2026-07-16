import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

function SeatMap({ eventId, initialTaken, onSeatsSelected }) {
  const rows = 10;
  const cols = 20;
  
  // Local state for all seats. 0 = available, 1 = selected by me, 2 = taken by someone else
  const [seats, setSeats] = useState(() => {
    let initial = Array(rows).fill().map(() => Array(cols).fill(0));
    if (initialTaken) {
      try {
        const taken = JSON.parse(initialTaken);
        taken.forEach(seat => {
          if (seat.r < rows && seat.c < cols) {
            initial[seat.r][seat.c] = 2; // Taken
          }
        });
      } catch (e) {
        console.error("Failed to parse initialTaken seats", e);
      }
    }
    return initial;
  });
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    // Connect to WebSocket
    const socket = new SockJS('http://localhost:8080/ws');
    const client = Stomp.over(socket);
    client.debug = () => {}; // Disable debug logging
    
    client.connect({}, () => {
      setStompClient(client);
      
      // Subscribe to seat updates for this event
      client.subscribe(`/topic/seatmap/${eventId}`, (message) => {
        const data = JSON.parse(message.body);
        // data: { r, c, status }
        
        setSeats(prevSeats => {
          const newSeats = prevSeats.map(row => [...row]);
          // If someone else selected it, mark it taken (2). If they unselected, mark available (0)
          // We ignore status 1 (selected) if it came from us (we already updated local state)
          if (data.status === 2) {
             newSeats[data.r][data.c] = 2;
          } else if (data.status === 0) {
             newSeats[data.r][data.c] = 0;
          }
          return newSeats;
        });
      });
    });

    return () => {
      if (client) client.disconnect();
    };
  }, [eventId]);

  const handleSeatClick = (r, c) => {
    if (seats[r][c] === 2) return; // Taken
    
    const newStatus = seats[r][c] === 1 ? 0 : 1;
    
    // Update Local
    const newSeats = seats.map(row => [...row]);
    newSeats[r][c] = newStatus;
    setSeats(newSeats);
    
    // Notify Parent
    let count = 0;
    let selectedArr = [];
    newSeats.forEach((row, r) => row.forEach((s, c) => { 
      if (s === 1) { count++; selectedArr.push({r, c}); } 
    }));
    onSeatsSelected(count, selectedArr);

    // Broadcast via WS
    if (stompClient && stompClient.connected) {
      stompClient.send(`/app/seatmap.update/${eventId}`, {}, JSON.stringify({ r, c, status: newStatus === 1 ? 2 : 0 }));
    }
  };

  return (
    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', overflowX: 'auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px', color: '#9298ab', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '12px' }}>
        <div style={{ width: '80%', height: '4px', background: 'linear-gradient(90deg, transparent, #c9a876, transparent)', margin: '0 auto 10px auto', borderRadius: '2px' }}></div>
        Stage
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', minWidth: 'max-content' }}>
        {seats.map((row, r) => (
          <div key={r} style={{ display: 'flex', gap: '8px' }}>
            {row.map((seatStatus, c) => {
              let bgColor = '#1e212c';
              let borderColor = 'rgba(255,255,255,0.05)';
              let cursor = 'pointer';
              
              if (seatStatus === 1) {
                bgColor = '#c9a876';
                borderColor = '#e8cd94';
              } else if (seatStatus === 2) {
                bgColor = '#0a0b0f';
                borderColor = '#1e212c';
                cursor = 'not-allowed';
              }

              return (
                <div 
                  key={`${r}-${c}`}
                  onClick={() => handleSeatClick(r, c)}
                  style={{ 
                    width: '25px', height: '25px', 
                    background: bgColor, border: `1px solid ${borderColor}`,
                    borderRadius: '5px 5px 2px 2px',
                    cursor: cursor,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { if(seatStatus === 0) e.target.style.background = 'rgba(201,168,118,0.2)' }}
                  onMouseLeave={e => { if(seatStatus === 0) e.target.style.background = '#1e212c' }}
                ></div>
              );
            })}
          </div>
        ))}
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px', fontSize: '12px', color: '#9298ab' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '15px', height: '15px', background: '#1e212c', borderRadius: '3px' }}></div> Available</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '15px', height: '15px', background: '#c9a876', borderRadius: '3px' }}></div> Selected</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '15px', height: '15px', background: '#0a0b0f', border: '1px solid #1e212c', borderRadius: '3px' }}></div> Taken</div>
      </div>
    </div>
  );
}

export default SeatMap;
