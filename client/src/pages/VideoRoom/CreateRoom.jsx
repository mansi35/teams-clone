import React, { useState, useCallback, useRef } from 'react'

import { PackedGrid } from 'react-packed-grid'
import './Room.scss'

function GridItemPlaceholder({ children }) {
  return (
    <div
      style={{
        backgroundColor: 'whitesmoke',
        display: 'grid',
        placeContent: 'center',
        width: '100%',
        height: '100%',
        border: '2px solid black'
      }}
    >
      {children}
    </div>
  )
}

const CreateRoom = () => {
  const updateLayoutRef = useRef()
  const focusRef = useCallback((el) => {
    el.focus()
  }, [])
  const [numBoxes, setNumBoxes] = useState(1)

  return (
    <>
      <div className='controls'>
        <label>
          Boxes
          <input
            ref={focusRef}
            type='number'
            min='1'
            value={numBoxes}
            onChange={(e) => setNumBoxes(parseInt(e.target.value, 10))}
          />
        </label>
        <button
          onClick={() => {
            if (updateLayoutRef.current) {
              updateLayoutRef.current()
            }
          }}
        >
          Force Layout Update
        </button>
      </div>
      <PackedGrid className='fullscreen' updateLayoutRef={updateLayoutRef}>
        {Array.from({ length: numBoxes }).map((_, idx) => (
          <GridItemPlaceholder key={idx}>Box {idx + 1}</GridItemPlaceholder>
        ))}
      </PackedGrid>
    </>
  )
}

export default CreateRoom