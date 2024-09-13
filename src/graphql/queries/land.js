import { gql } from "@apollo/client";

export const GET_LAND = gql`
  query GetLand($walletAddress: String!) {
    getLand(walletAddress: $walletAddress) {
      walletAddress
      gridState
      resources
      lastResourceClaimTime
    }
  }
`;

export const CREATE_LAND = gql`
  mutation CreateLand($input: LandInput!) {
    createLand(input: $input) {
      id
      walletAddress
      gridState
      resources
      lastResourceClaimTime
    }
  }
`;
