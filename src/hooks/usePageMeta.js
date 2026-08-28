// Runtime document meta — keeps <title>, meta description and the canonical
// link in sync with the current route for client-side navigation. The same
// values are baked into the prerendered HTML at build time (seo/seo.js is
// the single source of truth for both), so crawlers see them statically and
// users see correct titles while navigating.

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { docs } from '../data/docs';
import { SITE_URL, HOME_META, getDocMeta } from '../seo/seo';

export function usePageMeta() {
    const { pathname } = useLocation();

    useEffect(() => {
        let title = HOME_META.title;
        let description = HOME_META.description;

        if (pathname === '/docs') {
            ({ title, description } = getDocMeta('quickstart'));
        } else if (pathname.startsWith('/docs/')) {
            const key = pathname.slice('/docs/'.length).replace(/\/+$/, '');
            if (docs[key]) ({ title, description } = getDocMeta(key));
        }

        document.title = title;
        document
            .querySelector('meta[name="description"]')
            ?.setAttribute('content', description);
        document
            .querySelector('link[rel="canonical"]')
            ?.setAttribute('href', `${SITE_URL}${pathname}`);
    }, [pathname]);
}
