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

export const UPDATE_TWITTER = gql`
  mutation UpdateTwitter($landId: ID!, $twitter: TwitterInput!) {
    updateTwitter(landId: $landId, twitter: $twitter) {
      id
      twitter {
        id
        screen_name
      }
    }
  }
`;

export const UPDATE_DISCORD = gql`
  mutation UpdateDiscord($landId: ID!, $discord: DiscordInput!) {
    updateDiscord(landId: $landId, discord: $discord) {
      id
      discord {
        id
        username
      }
    }
  }
`;
