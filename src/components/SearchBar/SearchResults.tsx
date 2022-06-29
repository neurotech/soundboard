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
  border-radius: 0 0 4px 4px;
  border: 1px solid ${palette.gray.light};
  margin-top: -4px;
  padding: 0.5rem;
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
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const ResultName = styled.div<{ color: Color; isActive: boolean }>`
  color: ${(props) =>
    props.isActive ? "white" : palette[props.color].default};
  font-size: 18px;
  font-weight: 500;
  line-height: 0;
  text-shadow: 1px 1px 0 black;
  width: 30%;
`;
const ResultDescription = styled.div<{ color: Color }>`
  font-size: 18px;
  text-align: center;
  width: 30%;
`;

const ResultTabName = styled.div`
  color: ${palette.gray.bright}80;
  font-size: 14px;
  font-style: italic;
  text-align: right;
  width: 30%;
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
