import { useEffect, useRef, type ReactNode, type RefObject } from 'react'
import {
  DatePicker as ArkDatePicker,
  type DatePickerRootProps,
} from '@ark-ui/react/date-picker'
import { CalendarDate, type DateValue } from '@internationalized/date'
import { CalendarIcon } from '../icons/CalendarIcon'
import { ChevronLeftIcon } from '../icons/ChevronLeftIcon'
import { ChevronRightIcon } from '../icons/ChevronRightIcon'
import './DatePicker.css'

/**
 * The gap Figma draws between the input and the calendar in the "Date
 * Picker / Open" example. Not on the space scale and bound to nothing,
 * so it is carried here and flagged; Ark's own default would be 8.
 *
 * The frame also lines the calendar's left edge up with the input's,
 * rather than centring the wider card under it the way Ark's default
 * `bottom` placement would.
 */
const DATE_PICKER_POSITIONING = { gutter: 6, placement: 'bottom-start' } as const

/**
 * Monday. The drawn calendar heads its columns MO TU WE TH FR SA SU and
 * puts 27 July in the first cell of an August grid, which only lines up
 * on a Monday start. Ark would otherwise take the start of week from
 * the locale.
 */
const START_OF_WEEK_MONDAY = 1

/** Two characters, which is the width the weekday headers are drawn at. */
const WEEKDAY_LENGTH = 2

/**
 * The mask the empty input draws. Ark would otherwise derive one from
 * the locale — "mm/dd/yyyy" in US English — which would contradict the
 * day-first order the filled variant shows.
 */
const DATE_MASK = 'DD / MM / YYYY'

const PAD = (n: number, width: number) => String(n).padStart(width, '0')

function formatDate(date: DateValue) {
  return `${PAD(date.day, 2)} / ${PAD(date.month, 2)} / ${PAD(date.year, 4)}`
}

function parseDate(value: string): DateValue | undefined {
  // Ark blocks everything but digits and the locale separator while
  // typing, so what arrives here is "21/08/2026" mid-edit and
  // "21 / 08 / 2026" when a formatted value is re-parsed. Both reduce
  // to the same three numbers.
  const parts = value.split('/').map((part) => part.trim())
  if (parts.length !== 3) return undefined
  const [day, month, year] = parts.map(Number)
  if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) return undefined
  if (month < 1 || month > 12 || day < 1 || day > 31) return undefined
  return new CalendarDate(year, month, day)
}

/**
 * Keeps the input showing the date the calendar says is selected.
 *
 * Picking a day with the pointer is the one path where `@zag-js/date-picker`
 * (1.43.1) leaves the two out of step: its `CELL.CLICK` transition runs
 * `setSelectedDate`, which writes the machine's `value` but not its
 * `inputValue`, so the only thing that reaches the field is a bare DOM
 * write that React then reverts from the stale `defaultValue` it still
 * holds. The field ends up showing the previously selected date. Typing
 * and pressing Enter in the grid both go through actions that do set
 * `inputValue`, so neither is affected.
 *
 * This re-applies the machine's own string after React has committed,
 * and only while the field is not focused — which is where a pointer
 * pick leaves it, and never where typing does, so the caret is never
 * disturbed. Delete it once the upstream transition sets `inputValue`.
 */
function InputValueSync({
  inputRef,
  text,
}: {
  inputRef: RefObject<HTMLInputElement | null>
  text: string
}) {
  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    if (el.ownerDocument.activeElement === el) return
    if (el.value !== text) el.value = text
  }, [inputRef, text])

  return null
}

export type DatePickerProps = Omit<DatePickerRootProps, 'children'> & {
  /**
   * The label above the input. Required — every variant of the Figma
   * component draws it, and it is what names the input.
   */
  label: ReactNode
  /** Appended after the control's own class, on the drawn column. */
  className?: string
}

/**
 * A date field with a calendar: a labelled mono input that takes a
 * typed date, and a trigger that drops a month grid below it. Ark
 * drives parsing, selection, month navigation, keyboard, focus and the
 * ARIA; the visual design stays as drawn.
 *
 * All four Figma nodes live here, because the annotations say so in as
 * many words: Calendar Day is "a sub-part of DatePicker… build as
 * DatePicker.TableCellTrigger", Calendar is "the calendar grid of the
 * DatePicker… not a standalone component", Date Input is "the segmented
 * input trigger of the DatePicker… not a standalone component", and
 * Date Picker / Open is the whole control with its calendar open. None
 * of the four is separately mountable.
 *
 * The two `State` axes are not props. On Date Input, Focus is `:focus`
 * on the input (Field answers its own Focus state the same way, since a
 * caret means editing however focus arrived) and Disabled is the native
 * attribute. On Calendar Day, all six states are machine-derived:
 *
 * | Figma    | Code                   |
 * | -------- | ---------------------- |
 * | Default  | the base skin          |
 * | Hover    | `:hover`               |
 * | Selected | `[data-selected]`      |
 * | Today    | `[data-today]`         |
 * | Outside  | `[data-outside-range]` |
 * | Disabled | `[data-disabled]`      |
 *
 * Four decisions the design did not make:
 *
 * - **The control fills its container.** Figma fixes the input at
 *   240px, but so does Field's at 320px, and Field ships filling its
 *   container. A form control's width is the form's business. The
 *   calendar keeps its own drawn 282, since a 7 x 34 grid is what sets
 *   it.
 * - **The input reads `DD / MM / YYYY`**, day first, because that is
 *   the mask the placeholder spells out and the order the filled
 *   example uses. It is fixed rather than locale-derived; `format` and
 *   `parse` pass through for callers who need otherwise. Flagged in
 *   Figma, since a day-first mask sits oddly with a US-English default
 *   locale.
 * - **The month reads "AUG 2026" and is not a button.** The design
 *   draws it as plain centred text with no frame, no hover and no
 *   month- or year-view to switch to, so it is plain text here. Ark's
 *   `ViewTrigger` would make it a button into views the design does not
 *   draw. Flagged in Figma.
 * - **Weekday headers are the short name cut to two characters.**
 *   `Intl` offers "Mon" or "M" and nothing between, and the design
 *   draws "MO". The cut is locale-fragile; the full day name rides
 *   along as the header's accessible name. Flagged in Figma.
 *
 * The calendar always shows six week rows (`fixedWeeks`) and starts on
 * Monday (`startOfWeek`), both as drawn — the frame fills its last row
 * with the first six days of September rather than ending the grid
 * early.
 *
 * Not portalled: the Positioner is placed where the picker is written,
 * so an `overflow: hidden` ancestor will clip the calendar. Wrap it in
 * Ark's `<Portal>` where that matters.
 *
 * Dates in and out are `@internationalized/date` values — `value`,
 * `defaultValue`, `min`, `max` and `onValueChange` all deal in them,
 * because that is the type Ark's machine works in. Callers who set a
 * date rather than only reading one will want that package too.
 *
 * @example
 * ```tsx
 * import { CalendarDate } from '@internationalized/date'
 *
 * <DatePicker
 *   label="Ship date"
 *   name="ship-date"
 *   defaultValue={[new CalendarDate(2026, 8, 21)]}
 *   onValueChange={({ value }) => setShipDate(value[0])}
 * />
 * ```
 *
 * Figma: Steelbook Design System › Calendar Day (node `38:299`),
 * Calendar (node `39:2`), Date Input (node `39:128`) and Date Picker /
 * Open (node `39:129`).
 * Built on [Ark UI DatePicker](https://ark-ui.com/docs/components/date-picker).
 */
export function DatePicker({
  label,
  className,
  positioning = DATE_PICKER_POSITIONING,
  startOfWeek = START_OF_WEEK_MONDAY,
  fixedWeeks = true,
  format = formatDate,
  parse = parseDate,
  placeholder = DATE_MASK,
  ...props
}: DatePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <ArkDatePicker.Root
      {...props}
      positioning={positioning}
      startOfWeek={startOfWeek}
      fixedWeeks={fixedWeeks}
      format={format}
      parse={parse}
      placeholder={placeholder}
      className={className ? `sb-date-picker ${className}` : 'sb-date-picker'}
    >
      <ArkDatePicker.Label className="sb-date-picker__label">{label}</ArkDatePicker.Label>
      <ArkDatePicker.Control className="sb-date-picker__control">
        <ArkDatePicker.Input ref={inputRef} className="sb-date-picker__input" />
        <ArkDatePicker.Context>
          {(api) => <InputValueSync inputRef={inputRef} text={api.valueAsString[0] ?? ''} />}
        </ArkDatePicker.Context>
        {/* Ark names this one "Choose date" / "Close calendar" — override
            through the root's `translations` prop. */}
        <ArkDatePicker.Trigger className="sb-date-picker__trigger">
          <CalendarIcon />
        </ArkDatePicker.Trigger>
      </ArkDatePicker.Control>
      <ArkDatePicker.Positioner>
        <ArkDatePicker.Content className="sb-date-picker__calendar">
          <ArkDatePicker.View view="day" className="sb-date-picker__view">
            <ArkDatePicker.Context>
              {(api) => (
                <>
                  <ArkDatePicker.ViewControl className="sb-date-picker__header">
                    <ArkDatePicker.PrevTrigger className="sb-date-picker__nav">
                      <ChevronLeftIcon />
                    </ArkDatePicker.PrevTrigger>
                    {/* The focused month, not the visible range's first
                        day — with six fixed weeks that day belongs to the
                        month before, and the frame heads an August grid
                        starting 27 July "AUG 2026". */}
                    <span className="sb-date-picker__month">
                      {api.format(api.focusedValue, { month: 'short', year: 'numeric' })}
                    </span>
                    <ArkDatePicker.NextTrigger className="sb-date-picker__nav">
                      <ChevronRightIcon />
                    </ArkDatePicker.NextTrigger>
                  </ArkDatePicker.ViewControl>
                  <ArkDatePicker.Table className="sb-date-picker__table">
                    <ArkDatePicker.TableHead>
                      <ArkDatePicker.TableRow>
                        {api.weekDays.map((day) => (
                          <ArkDatePicker.TableHeader
                            key={day.long}
                            className="sb-date-picker__weekday"
                            aria-label={day.long}
                          >
                            {day.short.slice(0, WEEKDAY_LENGTH)}
                          </ArkDatePicker.TableHeader>
                        ))}
                      </ArkDatePicker.TableRow>
                    </ArkDatePicker.TableHead>
                    <ArkDatePicker.TableBody>
                      {api.weeks.map((week) => (
                        <ArkDatePicker.TableRow key={week[0].toString()}>
                          {week.map((date) => (
                            <ArkDatePicker.TableCell
                              key={date.toString()}
                              value={date}
                              className="sb-date-picker__cell"
                            >
                              <ArkDatePicker.TableCellTrigger className="sb-date-picker__day">
                                {date.day}
                              </ArkDatePicker.TableCellTrigger>
                            </ArkDatePicker.TableCell>
                          ))}
                        </ArkDatePicker.TableRow>
                      ))}
                    </ArkDatePicker.TableBody>
                  </ArkDatePicker.Table>
                </>
              )}
            </ArkDatePicker.Context>
          </ArkDatePicker.View>
        </ArkDatePicker.Content>
      </ArkDatePicker.Positioner>
    </ArkDatePicker.Root>
  )
}
