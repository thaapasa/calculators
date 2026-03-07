import { cn } from 'lib/utils';
import React from 'react';
import Autosuggest, {
  ChangeEvent,
  RenderSuggestionsContainerParams,
  SuggestionSelectedEventData,
  SuggestionsFetchRequestedParams,
} from 'react-autosuggest';

export interface AutoCompleteProps<T> {
  name?: string;
  fullWidth?: boolean;
  placeholder?: string;
  getSuggestions: (input: string) => T[];
  getSuggestionValue: (item: T) => string;
  renderSuggestion: (item: T) => string;
  onSelectSuggestion: (item: T) => void;
}

interface AutoCompleteState<T> {
  inputValue: string;
  suggestions: T[];
}

export class AutoComplete<T> extends React.Component<AutoCompleteProps<T>, AutoCompleteState<T>> {
  public state: AutoCompleteState<T> = { inputValue: '', suggestions: [] };
  public render() {
    return (
      <Autosuggest
        inputProps={{
          value: this.state.inputValue,
          onChange: this.setInputValueFromSelection,
        }}
        getSuggestionValue={this.renderSuggestion}
        onSuggestionsFetchRequested={this.fetchSuggestions}
        onSuggestionsClearRequested={this.clearSuggestions}
        suggestions={this.state.suggestions}
        renderSuggestionsContainer={this.renderContainer}
        renderSuggestion={this.renderSuggestion}
        renderInputComponent={this.renderInput}
        onSuggestionSelected={this.onSelectSuggestion}
      />
    );
  }

  private onSelectSuggestion = (
    _: React.FormEvent<HTMLElement>,
    data: SuggestionSelectedEventData<T>,
  ) => {
    this.props.onSelectSuggestion(data.suggestion);
  };

  private fetchSuggestions = (params: SuggestionsFetchRequestedParams) => {
    this.setState({
      suggestions: this.props.getSuggestions(params.value),
    });
  };
  private clearSuggestions = () => this.setState({ suggestions: [] });

  private setInputValueFromSelection = (_: React.FormEvent<HTMLElement>, event: ChangeEvent) => {
    const value = event.newValue;
    if (typeof value !== 'string') {
      return;
    }
    this.setState({
      inputValue: value,
      suggestions: this.props.getSuggestions(value),
    });
  };

  private setInputValueFromInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (typeof value !== 'string') {
      return;
    }
    this.setState({
      inputValue: value,
      suggestions: this.props.getSuggestions(value),
    });
  };

  private renderSuggestion = (item: T) => {
    return this.props.renderSuggestion(item);
  };

  private renderContainer = ({ containerProps, children }: RenderSuggestionsContainerParams) => {
    const { key, ...rest } = containerProps as any;
    return (
      <div
        key={key}
        {...rest}
        className={cn(
          'absolute z-10 pr-8 rounded-md border border-border bg-surface shadow-md',
          (rest as any).className,
        )}
      >
        {children}
      </div>
    );
  };

  private renderInput = ({ size, color, ...props }: any) => {
    const { onChange, defaultValue, ref, key, ...other } = props;

    return (
      <input
        key={key}
        {...other}
        name={this.props.name}
        className={cn(
          'border-b border-border bg-transparent outline-none py-1',
          this.props.fullWidth && 'w-full',
        )}
        placeholder={this.props.placeholder}
        type="text"
        ref={ref}
        onChange={this.setInputValueFromInput}
      />
    );
  };
}
