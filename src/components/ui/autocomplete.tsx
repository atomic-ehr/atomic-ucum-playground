"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface AutocompleteOption {
  value: string
  label: string
}

interface AutocompleteProps {
  value: string
  onChange: (value: string) => void
  onSelect?: (value: string) => void
  options: AutocompleteOption[]
  placeholder?: string
  className?: string
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export function Autocomplete({
  value,
  onChange,
  onSelect,
  options,
  placeholder,
  className,
  onKeyDown
}: AutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setHighlightedIndex(0)
  }, [options])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setIsOpen(true)
      setHighlightedIndex(prev => 
        prev < options.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev)
    } else if (e.key === "Enter" && isOpen && options.length > 0) {
      e.preventDefault()
      const selectedOption = options[highlightedIndex]
      if (selectedOption) {
        onChange(selectedOption.value)
        onSelect?.(selectedOption.value)
        setIsOpen(false)
      }
    } else if (e.key === "Escape") {
      setIsOpen(false)
    }
    
    onKeyDown?.(e)
  }

  const handleOptionClick = (option: AutocompleteOption) => {
    onChange(option.value)
    onSelect?.(option.value)
    setIsOpen(false)
    inputRef.current?.focus()
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        listRef.current &&
        !listRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setIsOpen(true)
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className={className}
      />
      
      {isOpen && options.length > 0 && (
        <div
          ref={listRef}
          className="absolute z-50 w-full mt-1 bg-background border border-input rounded-md shadow-md max-h-60 overflow-auto"
        >
          {options.map((option, index) => (
            <div
              key={option.value}
              onClick={() => handleOptionClick(option)}
              className={cn(
                "px-3 py-2 cursor-pointer transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                index === highlightedIndex && "bg-accent text-accent-foreground"
              )}
            >
              <div className="font-mono text-sm">{option.value}</div>
              <div className="text-xs text-muted-foreground">{option.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}