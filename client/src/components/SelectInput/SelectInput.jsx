import React from 'react';
import Select from 'react-select';
import './SelectInput.css'

class SelectInput extends React.Component {
  state = {
    selectedOption: null,
  };
  
  handleChange = selectedOption => {
    this.setState(
      { selectedOption }
      );
      this.props.selectHandler(selectedOption)
  };

  render() {
    const { selectedOption } = this.state;
    const {options, isMulti, closeMenuOnSelect,defaultValue,placeholder} = this.props
    
    return (
      <Select
        className={`multySelect`}
        value={defaultValue? defaultValue :selectedOption}
        onChange={this.handleChange}
        options={options}
        isMulti={isMulti}
        closeMenuOnSelect={closeMenuOnSelect}
        placeholder={placeholder}
      />
    );
  }
}

export default SelectInput
