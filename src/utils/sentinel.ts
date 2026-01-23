import type { AccessLog } from './supabase';

export interface GeoData {
    ip: string;
    city: string;
    country_name: string;
    region: string;
    org?: string;
}

export const Sentinel = {
    async getGeoLocation(): Promise<GeoData> {
        try {
            // Using ipapi.co (Free tier, generous limits for dev)
            // Alternative: ipwho.is, ip-api.com
            const response = await fetch('https://ipapi.co/json/');
            if (!response.ok) throw new Error('Geo fetch failed');
            return await response.json();
        } catch (error) {
            console.warn('Sentinel: Stealth Mode (Geo failed)', error);
            // Fallback
            return {
                ip: 'Unknown',
                city: 'Unknown',
                country_name: 'Unknown',
                region: 'Unknown'
            };
        }
    },

    getDeviceType(): string {
        const ua = navigator.userAgent;
        if (/mobile/i.test(ua)) return 'Mobile';
        if (/tablet/i.test(ua)) return 'Tablet';
        return 'Desktop';
    },

    async assembleLog(): Promise<AccessLog> {
        const geo = await this.getGeoLocation();

        return {
            ip_address: geo.ip,
            city: geo.city,
            country: geo.country_name,
            user_agent: navigator.userAgent,
            device_type: this.getDeviceType(),
            description: `Visit from ${geo.city}, ${geo.country_name}`
        };
    }
};
