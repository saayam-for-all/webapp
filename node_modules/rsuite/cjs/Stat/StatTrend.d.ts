import { WithAsProps, RsRefForwardingComponent } from '../internals/types';
interface StatTrendProps extends WithAsProps {
    indicator?: 'up' | 'down';
    appearance?: 'default' | 'subtle';
}
declare const StatTrend: RsRefForwardingComponent<'dd', StatTrendProps>;
export default StatTrend;
