import { KeyboardEvent } from "react";
import styled from "styled-components";
import { palette } from "../styles/palette";

interface InputProps {
  autoFocus?: boolean;
  id?: string;
  label?: string;
  onBlur?: () => void;
  onFocus?: () => void;
  onChange: (value: string) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  value: string;
}

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const StyledInput = styled.input`
  border-radius: 4px;
  padding: 0.66rem;
  background-color: ${palette.gray.lighter};
  border: 1px solid ${palette.gray.dark};
  color: ${palette.gray.bright};
  display: flex;

  :focus-visible {
    outline: none;
    border: 1px solid ${palette.yellow.default};
    box-shadow: 0 0 0 4px ${palette.yellow.dark}ad;
  }

  transition: border-color 0.12s, background-color 0.12s, box-shadow 0.12s,
    color 0.12s;
`;

const Label = styled.label`
  font-size: 14px;
  margin-bottom: 0.35rem;
`;

export const Input = ({
  autoFocus,
  id,
  label,
  onBlur,
  onChange,
  onFocus,
  onKeyDown,
  placeholder,
  value,
}: InputProps) => (
  <InputContainer>
    {label && <Label>{label}</Label>}
    <StyledInput
      autoFocus={autoFocus}
      id={id}
      onBlur={onBlur}
      onChange={(event) => onChange(event.target.value)}
      onFocus={onFocus}
      onKeyDown={(event) => onKeyDown && onKeyDown(event)}
      placeholder={placeholder}
      type={"text"}
      value={value}
    />
  </InputContainer>
);
