"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SmartTimeInputProps {
  value?: string // Nhận string format "HH:MM:SS"
  onValueChange: (value: string) => void // Trả về string format "HH:MM:SS"
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function SmartTimeInput({
  value,
  onValueChange,
  placeholder = "e.g. 9:00 AM",
  className,
  disabled = false,
}: SmartTimeInputProps) {
  const [inputValue, setInputValue] = useState<string>("")

  useEffect(() => {
    if (value) {
      // Chuyển "HH:MM:SS" thành display format
      const [hours, minutes] = value.split(":").map(Number)
      const period = hours >= 12 ? "PM" : "AM"
      const hours12 = hours % 12 || 12
      setInputValue(`${hours12}:${minutes.toString().padStart(2, "0")} ${period}`)
    } else {
      setInputValue("")
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
  }

  const parseTimeToHHMMSS = (timeString: string): string | undefined => {
    try {
      const timeValue = timeString.trim()

      if (!timeValue) {
        return undefined
      }

      let hours = 0
      let minutes = 0

      // Xử lý định dạng AM/PM
      if (timeValue.toLowerCase().includes("am") || timeValue.toLowerCase().includes("pm")) {
        const parts = timeValue.match(/(\d+)(?::(\d+))?\s*(am|pm)/i)
        if (parts) {
          hours = Number.parseInt(parts[1])
          minutes = parts[2] ? Number.parseInt(parts[2]) : 0
          const period = parts[3].toLowerCase()

          if (period === "pm" && hours !== 12) {
            hours += 12
          } else if (period === "am" && hours === 12) {
            hours = 0
          }
        }
      } else if (timeValue.includes(":")) {
        // Xử lý định dạng 24 giờ như "14:30"
        const [h, m] = timeValue.split(":").map(Number)
        if (h >= 0 && h < 24 && m >= 0 && m < 60) {
          hours = h
          minutes = m
        } else {
          return undefined
        }
      } else {
        // Xử lý nhập đơn giản như "9" hoặc "14"
        const hour = Number.parseInt(timeValue)
        if (!isNaN(hour) && hour >= 0 && hour < 24) {
          hours = hour
          minutes = 0
        } else {
          return undefined
        }
      }

      // Validate hours and minutes
      if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        return undefined
      }

      // Format thành "HH:MM:SS"
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`
    } catch (error) {
      console.error("Failed to parse time:", error)
      return undefined
    }
  }

  const handleBlur = () => {
    const parsedTime = parseTimeToHHMMSS(inputValue)

    if (parsedTime) {
      onValueChange(parsedTime)
      // Cập nhật lại input với format chuẩn để hiển thị
      const [hours, minutes] = parsedTime.split(":").map(Number)
      const period = hours >= 12 ? "PM" : "AM"
      const hours12 = hours % 12 || 12
      const formattedTime = `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`
      setInputValue(formattedTime)
    } else if (inputValue.trim() === "") {
      onValueChange("")
    }
  }

  return (
    <Input
      type="text"
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={cn(className)}
      disabled={disabled}
    />
  )
}
