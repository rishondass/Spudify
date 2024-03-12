"use client";
import React, { useState, useRef, MouseEvent, useEffect } from 'react';
import clsx from 'clsx';

type Props = {
  className?: string;
  duration?: number;
  value?: number;
  trackClass?: string;
  progressClass?: string;
  onChange?: (value:number)=>void;
  onUpdate?: (value:number)=>void;
}

const SeekBar= ({className, duration, trackClass,progressClass, onChange,value, onUpdate}:Props) => {
  const [isDragging, setIsDragging] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState<number>(value?value:0);



  useEffect(()=>{
    window.addEventListener('mouseup',()=>{
      handleProgressBarDragEnd();
    });

    return () =>{
      window.removeEventListener('mouseup',()=>{});
    }
  },[]);

  
  

  const handleProgressBarClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) {
      const progressBar = progressBarRef.current;
      const clickX = event.clientX - (progressBar?.getBoundingClientRect().left || 0);
      const progressBarWidth = progressBar?.clientWidth;
      const percentageClicked = (clickX / (progressBarWidth || 0)) * 100 ;

      if(duration){
        const newTime = (percentageClicked / duration) * 100;
        setCurrentTime(percentageClicked);
        onUpdate&&onUpdate(percentageClicked);
      }else{
        setCurrentTime(percentageClicked);
      }
      
    }
  };

  const handleProgressBarDragStart = () => {
    setIsDragging(true);
  };

  const handleProgressBarDragEnd = () => {
    setIsDragging(false);
  };

  const handleProgressBarDrag = (event: MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const progressBar = progressBarRef.current;
      const dragX = event.clientX - (progressBar?.getBoundingClientRect().left || 0);
      const progressBarWidth = progressBar?.clientWidth;
      const percentageDragged = (dragX / (progressBarWidth || 0)) * 100;
      if(duration){
        const newTime = (percentageDragged / duration) * 100;
        setCurrentTime(percentageDragged);
        onUpdate&&onUpdate(percentageDragged);
      }else{
        setCurrentTime(percentageDragged);
      }
      
    }
  };

  useEffect(()=>{
    if(value){
      if(duration){
        const newTime = (value/duration)*100
        setCurrentTime(newTime)
      }
    }
      
  },[value])

  useEffect(()=>{
    onChange&&onChange(currentTime);
  },[currentTime])

  return (
    <div  className={className}
          ref={progressBarRef}
          onClick={handleProgressBarClick}
          onMouseDown={handleProgressBarDragStart}
          onMouseUp={handleProgressBarDragEnd}
          onMouseMove={handleProgressBarDrag}>
      <div className={clsx(`bg-white/20 rounded-md transition-all group`,trackClass)}>
        <div
          className={clsx(`bg-white group-hover:rounded-r-none group-hover:bg-green-500 hover:bg-green-500 h-full relative rounded-md`,progressClass)}
          style={{
            minWidth: "0%",
            maxWidth: "100%",
            width: `${currentTime}%`,
            
          }}
        >
          <div className="group-hover:bg-white absolute w-3 h-3 rounded-full left-[100%] -translate-x-[6px] -bottom-1 cursor-pointer"
          ></div>
        </div>
      </div>
    </div>
    
    
  );
};

export default SeekBar;
