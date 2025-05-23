import styled from "styled-components";
import { BlockWrapStyles } from "../../../../style/global/default"

export const VisitorsBlockWrap = styled.div`
  ${BlockWrapStyles}

  .line-chart {
    width: 100%;
    height: 300px;

    // recharts custom
    .recharts-legend-item {
      align-items: center !important;
      margin-right: 8px;
      margin-left: 8px;
    }

    .recharts-surface {
      border-radius: 2px;
    }
  }
`;
