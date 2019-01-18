import styled from 'styled-components';

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  box-sizing: border-box;
  &.center {
    align-items: center;
  }
`;

export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
`;

export const Flex = styled.div`
  flex: 1;
`;

export const LeftPad = styled.div`
  padding-left: 16px;
`;
