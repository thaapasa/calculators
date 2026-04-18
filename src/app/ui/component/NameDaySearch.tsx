import { useTranslation } from 'app/i18n/LanguageContext';
import { findNameDayFor, MonthDay } from 'app/util/namedays';
import { isString } from 'app/util/util';

import { AutoComplete } from './AutoComplete';

export interface NameDayItem {
  text: string;
  name: string;
  value: MonthDay;
}

interface NameDaySearchProps {
  onSelectNameDay: (day: NameDayItem) => void;
}

const findNameDays = (input: string): NameDayItem[] => {
  const res: NameDayItem[] = [];
  if (isString(input) && input.length >= 2) {
    const matches = findNameDayFor(input);
    Object.keys(matches).forEach(name => {
      const date = matches[name];
      res.push({
        text: `${name}: ${date.day}.${date.month}.`,
        name,
        value: date,
      });
    });
  }
  return res;
};

const renderMonthDayItem = (m: NameDayItem) => m.text;
const monthDayToInputValue = (m: NameDayItem) => m.name;

export function NameDaySearch({ onSelectNameDay }: NameDaySearchProps) {
  const { t } = useTranslation();
  return (
    <AutoComplete
      name="findNameDay"
      placeholder={t('component.nameDaySearchPlaceholder')}
      getSuggestions={findNameDays}
      renderSuggestion={renderMonthDayItem}
      getSuggestionValue={monthDayToInputValue}
      onSelectSuggestion={onSelectNameDay}
      fullWidth={true}
    />
  );
}
