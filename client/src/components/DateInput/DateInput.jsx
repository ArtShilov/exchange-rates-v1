import React from 'react'
import './DateInput.css'

export default function DateInput({value,onChange,min,max}) {
  return (
    <input
    className={'dateInput'}
    type="date"
    value={value}
    onChange={onChange}
    min={min}
    max={max}
    required
  />
  )
}
