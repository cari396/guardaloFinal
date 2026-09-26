import React from 'react'
import { Controller, Control } from 'react-hook-form'
import DayPicker, { Modifier } from 'react-day-picker'
import '../css/react-day-picker.css'
import { useTheme } from '@chakra-ui/system'

type DatePickerProps = {
  control: Control
  disabledDays?: Modifier
  highlightTo?: Date
  disabled: boolean
}

const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]
const WEEKDAYS_LONG = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sabado',
]
const WEEKDAYS_SHORT = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa']

const DatePicker: React.FC<DatePickerProps> = ({
  control,
  disabledDays,
  highlightTo,
  disabled,
}) => {
  const theme = useTheme()
  return (
    <Controller
      defaultValue=""
      rules={{ required: true }}
      name="start"
      control={control}
      render={({ field: { onChange, value } }) => (
        <DayPicker
          locale="es"
          months={MONTHS}
          weekdaysLong={WEEKDAYS_LONG}
          weekdaysShort={WEEKDAYS_SHORT}
          selectedDays={value}
          modifiers={{ highlighted: { from: value, to: highlightTo } }}
          onDayClick={(day, modifiers) => {
            if (modifiers.disabled || disabled) {
              return
            }
            onChange(day)
          }}
          disabledDays={disabled ? { daysOfWeek: [0, 1, 2, 3, 4, 5, 6] } : disabledDays}
          modifiersStyles={{
            highlighted: {
              borderRadius: 0,
              color: theme.colors.white,
              backgroundColor: theme.colors.primary,
            },
          }}
        />
      )}
    />
  )
}

export default DatePicker
