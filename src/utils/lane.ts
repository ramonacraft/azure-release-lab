import type { ReleaseLane } from '../types/path'

export function detectLane(): ReleaseLane {
  const baked = import.meta.env.VITE_RELEASE_LANE
  if (baked === 'staging' || baked === 'production' || baked === 'local') {
    return baked
  }
  return 'local'
}

export function laneLabel(lane: ReleaseLane): string {
  if (lane === 'staging') return 'Staging'
  if (lane === 'production') return 'Production'
  return 'Local'
}

export function laneHeadline(lane: ReleaseLane): string {
  if (lane === 'staging') return 'On staging'
  if (lane === 'production') return 'On production'
  return 'Local path'
}

export function laneSupport(lane: ReleaseLane): string {
  if (lane === 'staging') {
    return 'This page is the staging site. Production still waits for a person to approve in Azure.'
  }
  if (lane === 'production') {
    return 'This page is production. Azure only deploys here after staging is green and a person approves.'
  }
  return 'This page is running on your machine. Azure is the real path: PR smoke, then staging, then production approval.'
}
