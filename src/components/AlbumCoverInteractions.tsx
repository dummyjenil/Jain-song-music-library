
import React, { useState, useRef, useCallback } from 'react';

interface AlbumCoverInteractionsProps {
  songId: string;
  onToggleLike: (songId: string) => void;
  onShare: () => void;
  onDoubleClick: () => void;
  onLongPress: () => void;
  children: React.ReactNode;
}

const AlbumCoverInteractions: React.FC<AlbumCoverInteractionsProps> = ({
  songId,
  onToggleLike,
  onShare,
  onDoubleClick,
  onLongPress,
  children
}) => {
  // Refs for interaction handling
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle double-click to like
  const handleClick = useCallback(() => {
    clickCountRef.current += 1;
    
    if (clickCountRef.current === 1) {
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 300);
    } else if (clickCountRef.current === 2) {
      // Double click detected
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
      clickCountRef.current = 0;
      
      // Trigger like animation and action
      onDoubleClick();
      onToggleLike(songId);
    }
  }, [songId, onToggleLike, onDoubleClick]);

  // Handle long press to share
  const handleMouseDown = useCallback(() => {
    longPressTimerRef.current = setTimeout(() => {
      onLongPress();
      onShare();
    }, 800); // 800ms for long press
  }, [onShare, onLongPress]);

  const handleMouseUp = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
  }, []);

  // Touch event handlers for mobile
  const handleTouchStart = useCallback(() => {
    longPressTimerRef.current = setTimeout(() => {
      onLongPress();
      onShare();
    }, 800);
  }, [onShare, onLongPress]);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
  }, []);

  return (
    <div
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{height:'-webkit-fill-available'}}
    >
      {children}
    </div>
  );
};

export default AlbumCoverInteractions;
