const HIMALAYAS_API =
  'https://himalayas.app/jobs/api?limit=20&offset=0';

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/jobs') {
      try {
        const response = await fetch(HIMALAYAS_API, {
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          return Response.json(
            {
              error: 'Himalayas API request failed',
              status: response.status,
            },
            { status: 502 }
          );
        }

        const data = await response.json();

        return Response.json(data, {
          headers: {
            'Cache-Control': 'public, max-age=300',
          },
        });
      } catch (error) {
        console.error('Jobs API error:', error);

        return Response.json(
          {
            error: 'Unable to fetch jobs',
          },
          { status: 500 }
        );
      }
    }

    return new Response('Not Found', {
      status: 404,
    });
  },
};
