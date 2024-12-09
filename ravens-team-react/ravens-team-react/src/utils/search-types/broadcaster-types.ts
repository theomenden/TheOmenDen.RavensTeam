export type BroadcasterType = "partner"| "affiliate" | "";
export type TwitchUserType = "staff" | "admin" | "global_mod" | "mod" | "subscriber" | "" ;
export type UserFilters = {
    broadcasterType: BroadcasterType;
    userType: TwitchUserType;
    isBroadcasterLive?: boolean;
}