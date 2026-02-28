export type UserHotelResponse = {
    id: number;
    name: string;
    address: string;
    is_default: boolean;
};

export type ActiveSubscriptionResponse = {
    plan: string;
    status: string;
    starts_at: Date | null;
    ends_at: Date | null;
    trial_ends_at: Date | null;
};
