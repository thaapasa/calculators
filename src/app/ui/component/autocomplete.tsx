import { Paper, styled, TextField } from '@mui/material';
import React from 'react';
import Autosuggest, {
  ChangeEvent,
  RenderInputComponentProps,
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

  private renderContainer = (params: RenderSuggestionsContainerParams) => {
    return (
      <FloatingPaper {...params.containerProps} square={true}>
        {params.children}
      </FloatingPaper>
    );
  };

  // Destructure and discard incompatible props
  private renderInput = ({ size, color, ...props }: RenderInputComponentProps) => {
    const { onChange, defaultValue, ref, ...other } = props;

    return (
      <StandardTextField
        {...other}
        name={this.props.name}
        fullWidth={this.props.fullWidth}
        placeholder={this.props.placeholder}
        type="text"
        ref={ref}
        onChange={this.setInputValueFromInput}
      />
    );
  };
}

const StandardTextField = TextField;

const FloatingPaper = styled(Paper)`
  position: absolute;
  padding-right: 32px;
  z-index: 1;
`;
