import styled from "styled-components";

const Container = styled.div`
  margin-bottom: 0.5rem;
`;

const StyledInput = styled.input`
  width: 100%;
`;

export const SearchBar = () => (
  <Container>
    <StyledInput type={"text"} />
  </Container>
);
