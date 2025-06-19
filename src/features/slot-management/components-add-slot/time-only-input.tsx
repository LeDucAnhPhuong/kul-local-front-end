'use client';

import React from 'react';
import { parseDate } from 'chrono-node';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * Utility function that parses time strings.
 */
export const parseTime = (str: string) => {
  return parseDate(str);
};

/**
 * Converts a time string to minutes since midnight for comparison
 */
const timeToMinutes = (timeStr: string): number => {
  const [time, period] = timeStr.split(' ');
  const [hours, minutes] = time.split(':').map(Number);

  let hour24 = hours;

  if (period === 'AM') {
    if (hours === 12) {
      hour24 = 0; // 12 AM = 0 giờ
    } else {
      hour24 = hours; // 1-11 AM = 1-11 giờ
    }
  } else if (period === 'PM') {
    if (hours === 12) {
      hour24 = 12; // 12 PM = 12 giờ
    } else {
      hour24 = hours + 12; // 1-11 PM = 13-23 giờ
    }
  }

  return hour24 * 60 + minutes;
};

/**
 * Formats time for display - ensures consistent format
 */
export const formatTime = (date: Date) => {
  // Sử dụng UTC time để format
  const hours24 = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  let hour12: number;
  let period: string;

  if (hours24 === 0) {
    hour12 = 12;
    period = 'AM';
  } else if (hours24 < 12) {
    hour12 = hours24;
    period = 'AM';
  } else if (hours24 === 12) {
    hour12 = 12;
    period = 'PM';
  } else {
    hour12 = hours24 - 12;
    period = 'PM';
  }

  const minuteStr = minutes.toString().padStart(2, '0');
  return `${hour12}:${minuteStr} ${period}`;
};

/**
 * Creates a Date object with UTC time (không bị ảnh hưởng timezone)
 */
const createDateFromTimeString = (timeStr: string): Date => {
  console.log('🔧 Creating UTC date from:', timeStr);

  const [time, period] = timeStr.split(' ');
  const [hours, minutes] = time.split(':').map(Number);

  let hour24: number;

  if (period === 'AM') {
    if (hours === 12) {
      hour24 = 0; // 12 AM = 0 giờ
    } else {
      hour24 = hours; // 1-11 AM = 1-11 giờ
    }
  } else if (period === 'PM') {
    if (hours === 12) {
      hour24 = 12; // 12 PM = 12 giờ
    } else {
      hour24 = hours + 12; // 1-11 PM = 13-23 giờ
    }
  } else {
    hour24 = hours;
  }

  console.log(`🔧 Converted ${hours}:${minutes} ${period} → ${hour24}:${minutes} (24h UTC)`);

  // Tạo Date object với UTC time - sử dụng Date.UTC()
  const today = new Date();
  const result = new Date(
    Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
      hour24,
      minutes,
      0,
      0,
    ),
  );

  console.log('🔧 Created UTC date:', result.toString());
  console.log('🔧 UTC hours:', result.getUTCHours(), 'minutes:', result.getUTCMinutes());
  console.log('🔧 ISO (UTC):', result.toISOString());

  return result;
};

/**
 * Extracts time string from Date object using UTC time
 */
const getTimeStringFromDate = (date: Date): string => {
  const hours24 = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  let hour12: number;
  let period: string;

  if (hours24 === 0) {
    hour12 = 12; // 0 giờ = 12 AM
    period = 'AM';
  } else if (hours24 < 12) {
    hour12 = hours24; // 1-11 giờ = 1-11 AM
    period = 'AM';
  } else if (hours24 === 12) {
    hour12 = 12; // 12 giờ = 12 PM
    period = 'PM';
  } else {
    hour12 = hours24 - 12; // 13-23 giờ = 1-11 PM
    period = 'PM';
  }

  const minuteStr = minutes.toString().padStart(2, '0');
  return `${hour12}:${minuteStr} ${period}`;
};

const inputBase =
  'bg-transparent focus:outline-none focus:ring-0 focus-within:outline-none focus-within:ring-0 sm:text-sm disabled:cursor-not-allowed disabled:opacity-50';

const DEFAULT_SIZE = 96;
const TIMESTAMP = 15; // 15-minute intervals

interface TimeOnlyInputProps {
  value?: Date;
  onValueChange: (date: Date) => void;
  thresholdTime?: string;
  disabled?: boolean;
  placeholder?: string;
}

interface TimeOnlyInputContextProps extends TimeOnlyInputProps {
  selectedTime: string;
  onTimeChange: (time: string) => void;
}

const TimeOnlyInputContext = React.createContext<TimeOnlyInputContextProps | null>(null);

const useTimeOnlyInput = () => {
  const context = React.useContext(TimeOnlyInputContext);
  if (!context) {
    throw new Error('useTimeOnlyInput must be used within TimeOnlyInputProvider');
  }
  return context;
};

export const TimeOnlyInput = React.forwardRef<
  HTMLInputElement,
  Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'disabled' | 'type' | 'ref' | 'value' | 'defaultValue' | 'onBlur'
  > &
    TimeOnlyInputProps
>(({ className, value, onValueChange, thresholdTime, placeholder, disabled }, ref) => {
  // Convert Date to time string for internal state
  const [selectedTime, setSelectedTime] = React.useState<string>(
    value ? getTimeStringFromDate(value) : '',
  );

  const onTimeChange = React.useCallback(
    (time: string) => {
      console.log('⏰ Time changed to:', time);
      setSelectedTime(time);
      const dateWithTime = createDateFromTimeString(time);
      onValueChange(dateWithTime);
    },
    [onValueChange],
  );

  // Update internal state when external value changes
  React.useEffect(() => {
    if (value) {
      const timeStr = getTimeStringFromDate(value);
      setSelectedTime(timeStr);
    } else {
      setSelectedTime('');
    }
  }, [value]);

  return (
    <TimeOnlyInputContext.Provider
      value={{
        value,
        onValueChange,
        thresholdTime,
        disabled,
        placeholder,
        selectedTime,
        onTimeChange,
      }}
    >
      <div className="flex items-center justify-center">
        <div
          className={cn(
            'flex gap-1 w-full p-1 items-center justify-between rounded-md border transition-all',
            'focus-within:outline-0 focus:outline-0 focus:ring-0',
            'placeholder:text-muted-foreground focus-visible:outline-0',
            className,
          )}
        >
          <TimePickerButton disabled={disabled} />
          <NaturalLanguageTimeInput placeholder={placeholder} disabled={disabled} ref={ref} />
        </div>
      </div>
    </TimeOnlyInputContext.Provider>
  );
});

TimeOnlyInput.displayName = 'TimeOnlyInput';

const TimePicker = ({ onClose }: { onClose?: () => void }) => {
  const { selectedTime, onTimeChange, thresholdTime, disabled } = useTimeOnlyInput();
  const [activeIndex, setActiveIndex] = React.useState(-1);

  const formatSelectedTime = React.useCallback(
    (time: string) => {
      onTimeChange(time);
      onClose?.();
    },
    [onTimeChange, onClose],
  );

  const handleKeydown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      e.stopPropagation();

      if (!document) return;

      const moveNext = () => {
        const nextIndex = activeIndex + 1 > DEFAULT_SIZE - 1 ? 0 : activeIndex + 1;
        const currentElm = document.getElementById(`time-${nextIndex}`);
        currentElm?.focus();
        setActiveIndex(nextIndex);
      };

      const movePrev = () => {
        const prevIndex = activeIndex - 1 < 0 ? DEFAULT_SIZE - 1 : activeIndex - 1;
        const currentElm = document.getElementById(`time-${prevIndex}`);
        currentElm?.focus();
        setActiveIndex(prevIndex);
      };

      const setElement = () => {
        const currentElm = document.getElementById(`time-${activeIndex}`);
        if (!currentElm) return;

        currentElm.focus();
        const timeValue = currentElm.textContent ?? '';
        formatSelectedTime(timeValue);
      };

      const reset = () => {
        const currentElm = document.getElementById(`time-${activeIndex}`);
        currentElm?.blur();
        setActiveIndex(-1);
      };

      switch (e.key) {
        case 'ArrowUp':
          movePrev();
          break;
        case 'ArrowDown':
          moveNext();
          break;
        case 'Escape':
          reset();
          break;
        case 'Enter':
          setElement();
          break;
      }
    },
    [activeIndex, formatSelectedTime],
  );

  const handleClick = React.useCallback(
    (timeString: string, currentIndex: number) => {
      formatSelectedTime(timeString);
      setActiveIndex(currentIndex);
    },
    [formatSelectedTime],
  );

  // Parse selected time more accurately
  const currentTimeInfo = React.useMemo(() => {
    if (!selectedTime) return { hours24: 0, minutes: 0 };

    const [time, period] = selectedTime.split(' ');
    const [hours, minutes] = time.split(':').map(Number);

    let hours24 = hours;

    if (period === 'AM') {
      if (hours === 12) {
        hours24 = 0; // 12 AM = 0 giờ
      } else {
        hours24 = hours; // 1-11 AM = 1-11 giờ
      }
    } else if (period === 'PM') {
      if (hours === 12) {
        hours24 = 12; // 12 PM = 12 giờ
      } else {
        hours24 = hours + 12; // 1-11 PM = 13-23 giờ
      }
    }

    return { hours24, minutes };
  }, [selectedTime]);

  const thresholdMinutes = React.useMemo(() => {
    return thresholdTime ? timeToMinutes(thresholdTime) : 0;
  }, [thresholdTime]);

  // Auto-scroll to selected time
  React.useEffect(() => {
    if (!selectedTime) return;

    const { hours24, minutes } = currentTimeInfo;

    // Find the closest 15-minute interval
    const quarterIndex = Math.round(minutes / TIMESTAMP);
    const trueIndex = hours24 * 4 + quarterIndex;

    setActiveIndex(trueIndex);

    const currentElm = document.getElementById(`time-${trueIndex}`);
    currentElm?.scrollIntoView({
      block: 'center',
      behavior: 'smooth',
    });
  }, [selectedTime, currentTimeInfo]);

  return (
    <div className="space-y-2 pr-3 py-3 relative">
      <h3 className="text-sm font-medium">Time</h3>
      <ScrollArea
        onKeyDown={handleKeydown}
        className="h-[300px] w-full focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0 py-0.5"
      >
        <ul className={cn('flex items-center flex-col gap-1 h-full max-h-56 w-28 px-1 py-0.5')}>
          {Array.from({ length: 24 }).map((_, hour24) => {
            return Array.from({ length: 4 }).map((_, quarterIndex) => {
              const minutes = quarterIndex * TIMESTAMP;

              let displayHour: number;
              let period: string;

              if (hour24 === 0) {
                displayHour = 12; // 0 giờ = 12 AM
                period = 'AM';
              } else if (hour24 < 12) {
                displayHour = hour24; // 1-11 giờ = 1-11 AM
                period = 'AM';
              } else if (hour24 === 12) {
                displayHour = 12; // 12 giờ = 12 PM
                period = 'PM';
              } else {
                displayHour = hour24 - 12; // 13-23 giờ = 1-11 PM
                period = 'PM';
              }

              const minuteStr = minutes.toString().padStart(2, '0');
              const currentValue = `${displayHour}:${minuteStr} ${period}`;
              const trueIndex = hour24 * 4 + quarterIndex;

              // Check if this time should be disabled by threshold
              let isDisabledByThreshold = false;
              if (thresholdTime) {
                const currentMinutes = timeToMinutes(currentValue);
                isDisabledByThreshold = currentMinutes < thresholdMinutes;
              }

              if (isDisabledByThreshold || disabled) return null;

              // Check if this time is currently selected
              const isSelected = selectedTime === currentValue;
              const isActive = activeIndex === trueIndex;

              return (
                <li
                  tabIndex={isSelected ? 0 : -1}
                  id={`time-${trueIndex}`}
                  key={`time-${trueIndex}`}
                  aria-label="currentTime"
                  className={cn(
                    buttonVariants({
                      variant: isSelected ? 'default' : isActive ? 'secondary' : 'outline',
                    }),
                    'h-8 px-3 w-full text-sm focus-visible:outline-0 outline-0 focus-visible:border-0 cursor-default ring-0',
                  )}
                  onClick={() => handleClick(currentValue, trueIndex)}
                  onFocus={() => setActiveIndex(trueIndex)}
                >
                  {currentValue}
                </li>
              );
            });
          })}
        </ul>
      </ScrollArea>
    </div>
  );
};

const NaturalLanguageTimeInput = React.forwardRef<
  HTMLInputElement,
  {
    placeholder?: string;
    disabled?: boolean;
  }
>(({ placeholder, ...props }, ref) => {
  const { selectedTime, onTimeChange, thresholdTime } = useTimeOnlyInput();

  const _placeholder = placeholder ?? 'e.g. "3:30 PM" or "in 2 hours"';
  const [inputValue, setInputValue] = React.useState<string>('');

  React.useEffect(() => {
    setInputValue(selectedTime || '');
  }, [selectedTime]);

  const parseAndSetTime = React.useCallback(
    (inputValue: string) => {
      if (!inputValue.trim()) return;

      // Enhanced regex for time parsing - supports various formats
      const timeRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i;
      const match = inputValue.match(timeRegex);

      if (match) {
        const [, hoursStr, minutesStr, period] = match;
        const hours = Number.parseInt(hoursStr);
        const minutes = Number.parseInt(minutesStr);

        // Validate time values
        if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) {
          return;
        }

        // If no period specified, assume based on hour
        let finalPeriod = period;
        if (!period) {
          finalPeriod = hours >= 1 && hours <= 11 ? 'AM' : 'PM';
        }

        // Create properly formatted time string
        const timeString = `${hours}:${minutesStr} ${finalPeriod.toUpperCase()}`;

        // Check threshold
        if (thresholdTime) {
          const currentMinutes = timeToMinutes(timeString);
          const thresholdMinutes = timeToMinutes(thresholdTime);

          if (currentMinutes < thresholdMinutes) {
            return;
          }
        }

        onTimeChange(timeString);
        setInputValue(timeString);
      } else {
        // Fallback to chrono-node for natural language parsing
        const parsedDateTime = parseTime(inputValue);
        if (parsedDateTime) {
          const timeString = getTimeStringFromDate(parsedDateTime);

          if (thresholdTime) {
            const currentMinutes = timeToMinutes(timeString);
            const thresholdMinutes = timeToMinutes(thresholdTime);

            if (currentMinutes < thresholdMinutes) {
              return;
            }
          }

          onTimeChange(timeString);
          setInputValue(timeString);
        }
      }
    },
    [onTimeChange, thresholdTime],
  );

  const handleKeydown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        parseAndSetTime(e.currentTarget.value.trim());
      }
    },
    [parseAndSetTime],
  );

  const handleBlur = React.useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      parseAndSetTime(e.currentTarget.value.trim());
    },
    [parseAndSetTime],
  );

  return (
    <Input
      ref={ref}
      type="text"
      placeholder={_placeholder}
      value={inputValue}
      onChange={(e) => setInputValue(e.currentTarget.value)}
      onKeyDown={handleKeydown}
      onBlur={handleBlur}
      className={cn('px-2 mr-0.5 flex-1 border-none h-8 rounded', inputBase)}
      {...props}
    />
  );
});

NaturalLanguageTimeInput.displayName = 'NaturalLanguageTimeInput';

const TimePickerButton = ({ disabled }: { disabled?: boolean }) => {
  const { selectedTime } = useTimeOnlyInput();
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant={'outline'}
          size={'icon'}
          className={cn(
            'size-9 flex items-center justify-center font-normal',
            !selectedTime && 'text-muted-foreground',
          )}
        >
          <Clock className="size-4" />
          <span className="sr-only">time picker</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" sideOffset={8}>
        <TimePicker onClose={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
};

TimePickerButton.displayName = 'TimePickerButton';
