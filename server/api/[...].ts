import { joinURL} from 'ufo';

export default defineEventHandler(async (event) => {
    const proxyUrl = useRuntimeConfig().public.apiBase;
    const path = event.path.replace(/^\/api\//, '');
    const target = joinURL(proxyUrl, path);
    // [proxyRequest] is a composable helper from h3.
    return proxyRequest(event, target);
})