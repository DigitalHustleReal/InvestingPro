import { getLiveRates } from '@/lib/rates/get-live-rates';
import RateTicker from './RateTicker';

/**
 * Server component wrapper — fetches rates on the server, passes to
 * client RateTicker for animation. Not rendered on admin routes.
 */
export default async function RateTickerServer() {
    try {
        const { ticker, updatedAt } = await getLiveRates();
        return <RateTicker rates={ticker} updatedAt={updatedAt} />;
    } catch {
        return null;
    }
}
