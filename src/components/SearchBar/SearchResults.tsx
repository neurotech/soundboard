import styled from "styled-components";
import { Color, SoundEntity } from "../../App";
import { palette } from "../../styles/palette";
import { Panel } from "../Panel/Panel";

interface SearchResultsProps {
  searchResults: SoundEntity[];
  selectedItem?: number;
}

const OverlayContainer = styled.div`
  position: relative;
  z-index: 999;
`;

const Overlay = styled.div`
  background-color: ${palette.gray.dark};
  border: 1px solid ${palette.gray.light};
  border-radius: 0 0 4px 4px;
  padding: 0.5rem;
  margin-top: -4px;
  position: absolute;
  width: 100%;

  > div {
    margin-bottom: 0.5rem;
  }

  > div:last-child {
    margin-bottom: 0;
  }
`;

const Result = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ResultName = styled.div<{ color: Color; isActive: boolean }>`
  font-size: 18px;
  font-weight: 500;
  color: ${(props) =>
    props.isActive ? "white" : palette[props.color].default};
  text-shadow: 1px 1px 0 black;
  line-height: 0;
`;
const ResultDescription = styled.div<{ color: Color }>`
  font-size: 18px;
`;

const ResultTabName = styled.div`
  background-color: ${palette.gray.light};
  border: 1px solid ${palette.gray.lighter};
  border-radius: 4px;
  color: ${palette.gray.bright}80;
  font-size: 14px;
  font-style: italic;
  padding: 0.2rem 0.33rem;
`;

export const SearchResults = ({
  searchResults,
  selectedItem,
}: SearchResultsProps) => (
  <OverlayContainer>
    <Overlay>
      {searchResults.map((result, index) => {
        const isActive = selectedItem === index;

        return (
          <Panel isActive={isActive} key={index}>
            <Result>
              <ResultName color={result.color} isActive={isActive}>
                {result.name}
              </ResultName>
              <ResultDescription color={result.color}>
                {result.description || " "}
              </ResultDescription>
              <ResultTabName color={result.color}>
                {result.tabName}
              </ResultTabName>
            </Result>
          </Panel>
        );
      })}
    </Overlay>
  </OverlayContainer>
);
