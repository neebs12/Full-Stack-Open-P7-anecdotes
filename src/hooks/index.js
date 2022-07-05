import { useState } from 'react'

// Create custom hooks here
export const useField = (name) => {
  const [value, setValue] = useState('')
  
  const onChange = (e) => {
    const value = e.target.value
    setValue(value)
  }

  return {
    type: 'text',
    name, value, onChange,
  }
}